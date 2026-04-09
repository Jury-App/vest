import type Stripe from "stripe";
import {
  createSupabaseAdminClient,
  type ApprovalStatus,
  type DonorRow,
  type InvestmentRow,
  type PaymentStatus,
} from "@/lib/supabase";
import {
  sendInvestmentApprovedEmail,
  sendNewMagicLinkEmail,
  sendPaymentFailedEmail,
  sendPaymentReceivedEmail,
  sendSafeDraftEmail,
} from "@/lib/email";
import { absoluteUrl } from "@/lib/site";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

async function generateMagicLink(email: string) {
  const admin = createSupabaseAdminClient();
  const redirectTo = absoluteUrl("/auth/callback?next=/donor");
  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: {
      redirectTo,
    },
  });

  if (error || !data.properties.action_link) {
    throw new Error(error?.message || "Unable to generate magic link");
  }

  return data.properties.action_link;
}

export async function upsertDonor({
  email,
  fullLegalName,
  stripeCustomerId,
  authUserId,
}: {
  email: string;
  fullLegalName: string;
  stripeCustomerId?: string | null;
  authUserId?: string | null;
}) {
  const admin = createSupabaseAdminClient();
  const normalizedEmail = email.trim().toLowerCase();

  const { data: existing, error: selectError } = await admin
    .from("donors")
    .select("*")
    .eq("email", normalizedEmail)
    .maybeSingle<DonorRow>();

  if (selectError) {
    throw new Error(selectError.message);
  }

  const payload = {
    email: normalizedEmail,
    full_legal_name: fullLegalName,
    stripe_customer_id: stripeCustomerId ?? existing?.stripe_customer_id ?? null,
    auth_user_id: authUserId ?? existing?.auth_user_id ?? null,
  };

  if (existing) {
    const { data, error } = await admin
      .from("donors")
      .update(payload)
      .eq("id", existing.id)
      .select("*")
      .single<DonorRow>();

    if (error) throw new Error(error.message);
    return data;
  }

  const { data, error } = await admin
    .from("donors")
    .insert(payload)
    .select("*")
    .single<DonorRow>();

  if (error) throw new Error(error.message);
  return data;
}

export async function createInvestment({
  donorId,
  stripePaymentIntentId,
  investorReference,
  amount,
}: {
  donorId: string;
  stripePaymentIntentId: string;
  investorReference: string;
  amount: number;
}) {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("investments")
    .upsert(
      {
        donor_id: donorId,
        stripe_payment_intent_id: stripePaymentIntentId,
        investor_reference: investorReference,
        amount,
        payment_status: "initiated",
        approval_status: "inconversation",
        paperwork_status: "not_sent",
      },
      {
        onConflict: "stripe_payment_intent_id",
      }
    )
    .select("*")
    .single<InvestmentRow>();

  if (error) throw new Error(error.message);
  return data;
}

export async function sendDraftSafeForInvestment({
  investmentId,
  email,
  name,
  amountCents,
  investorReference,
}: {
  investmentId: string;
  email: string;
  name: string;
  amountCents: number;
  investorReference?: string;
}) {
  const admin = createSupabaseAdminClient();
  const { data: investment, error } = await admin
    .from("investments")
    .select("*")
    .eq("id", investmentId)
    .single<InvestmentRow>();

  if (error) throw new Error(error.message);
  if (investment.pending_email_sent_at) return investment;

  await sendSafeDraftEmail({
    email,
    name,
    amountCents,
    investorReference,
  });

  const { data: updatedInvestment, error: updateError } = await admin
    .from("investments")
    .update({
      pending_email_sent_at: new Date().toISOString(),
      paperwork_status: "sent",
    })
    .eq("id", investmentId)
    .select("*")
    .single<InvestmentRow>();

  if (updateError) throw new Error(updateError.message);
  return updatedInvestment;
}

function toInternalPaymentStatus(status: Stripe.PaymentIntent.Status): PaymentStatus {
  if (status === "succeeded") return "succeeded";
  if (status === "processing") return "processing";
  return "payment_failed";
}

export async function syncPaymentIntent(paymentIntent: Stripe.PaymentIntent) {
  const admin = createSupabaseAdminClient();
  const paymentStatus = toInternalPaymentStatus(paymentIntent.status);
  const email = paymentIntent.metadata?.investor_email?.trim().toLowerCase();
  const name = paymentIntent.metadata?.investor_name?.trim();

  if (!email || !name) {
    throw new Error("PaymentIntent metadata is missing investor identity");
  }

  const donor = await upsertDonor({
    email,
    fullLegalName: name,
    stripeCustomerId:
      typeof paymentIntent.customer === "string"
        ? paymentIntent.customer
        : paymentIntent.customer?.id ?? null,
  });

  const { data: currentInvestment, error: selectError } = await admin
    .from("investments")
    .select("*")
    .eq("stripe_payment_intent_id", paymentIntent.id)
    .maybeSingle<InvestmentRow>();

  if (selectError) throw new Error(selectError.message);

  const basePayload = {
    donor_id: donor.id,
    stripe_payment_intent_id: paymentIntent.id,
    investor_reference: paymentIntent.metadata?.investor_reference ?? null,
    amount: paymentIntent.amount,
    payment_status: paymentStatus,
    approval_status: currentInvestment?.approval_status ?? ("inconversation" as ApprovalStatus),
    paperwork_status: currentInvestment?.paperwork_status ?? "not_sent",
  };

  const { data: investment, error: upsertError } = await admin
    .from("investments")
    .upsert(basePayload, { onConflict: "stripe_payment_intent_id" })
    .select("*")
    .single<InvestmentRow>();

  if (upsertError) throw new Error(upsertError.message);

  if (paymentStatus === "payment_failed" && !investment.failed_email_sent_at) {
    await sendPaymentFailedEmail({
      email: donor.email,
      name: donor.full_legal_name,
      amountCents: investment.amount,
    });

    await admin
      .from("investments")
      .update({ failed_email_sent_at: new Date().toISOString() })
      .eq("id", investment.id);
  }

  if (paymentStatus === "succeeded" && !investment.received_email_sent_at) {
    await sendPaymentReceivedEmail({
      email: donor.email,
      name: donor.full_legal_name,
      amountCents: investment.amount,
    });

    await admin
      .from("investments")
      .update({ received_email_sent_at: new Date().toISOString() })
      .eq("id", investment.id);
  }

  return { donor, investment };
}

export async function syncApprovedInvestments() {
  const admin = createSupabaseAdminClient();
  const { data: investments, error } = await admin
    .from("investments")
    .select("*, donors(*)")
    .eq("approval_status", "approved")
    .eq("payment_status", "succeeded")
    .is("approved_email_sent_at", null);

  if (error) throw new Error(error.message);

  const sent: string[] = [];

  for (const investment of (investments ?? []) as Array<
    InvestmentRow & { donors: DonorRow | null }
  >) {
    const donor = investment.donors;
    if (!donor) continue;

    const magicLink = await generateMagicLink(donor.email);
    await sendInvestmentApprovedEmail({
      email: donor.email,
      name: donor.full_legal_name,
      magicLink,
    });

    const timestamp = new Date().toISOString();
    await admin
      .from("investments")
      .update({ approved_email_sent_at: timestamp })
      .eq("id", investment.id);

    await admin
      .from("donors")
      .update({ last_magic_link_sent_at: timestamp })
      .eq("id", donor.id);

    sent.push(investment.id);
  }

  return sent;
}

export async function sendRecoveryMagicLink(email: string) {
  const admin = createSupabaseAdminClient();
  const normalizedEmail = email.trim().toLowerCase();
  const { data: donor, error } = await admin
    .from("donors")
    .select("*")
    .eq("email", normalizedEmail)
    .maybeSingle<DonorRow>();

  if (error) throw new Error(error.message);
  if (!donor) return false;

  const { data: approvedInvestment, error: investmentError } = await admin
    .from("investments")
    .select("id")
    .eq("donor_id", donor.id)
    .eq("approval_status", "approved")
    .eq("payment_status", "succeeded")
    .maybeSingle();

  if (investmentError) throw new Error(investmentError.message);
  if (!approvedInvestment) return false;

  const magicLink = await generateMagicLink(normalizedEmail);
  await sendNewMagicLinkEmail({
    email: donor.email,
    name: donor.full_legal_name,
    magicLink,
  });

  await admin
    .from("donors")
    .update({ last_magic_link_sent_at: new Date().toISOString() })
    .eq("id", donor.id);

  return true;
}

export async function linkAuthUserToDonor(email: string, authUserId: string) {
  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("donors")
    .update({ auth_user_id: authUserId })
    .eq("email", email.trim().toLowerCase());

  if (error) {
    throw new Error(error.message);
  }
}

export function getOpsSecret() {
  return requireEnv("OPS_CRON_SECRET");
}
