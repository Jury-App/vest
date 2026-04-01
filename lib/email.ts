import { Resend } from "resend";
import type { InvestmentRow } from "@/lib/supabase";
import { absoluteUrl } from "@/lib/site";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getResendClient() {
  return new Resend(requireEnv("RESEND_API_KEY"));
}

function getFromEmail() {
  return requireEnv("RESEND_FROM_EMAIL");
}

interface EmailParams {
  email: string;
  name: string;
  amountCents?: number;
  magicLink?: string;
}

function formatAmount(amountCents?: number) {
  if (typeof amountCents !== "number") return null;
  return `$${(amountCents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  return getResendClient().emails.send({
    from: getFromEmail(),
    to,
    subject,
    html,
    text,
  });
}

export async function sendPaymentPendingEmail({ email, name, amountCents }: EmailParams) {
  const amount = formatAmount(amountCents);
  await sendEmail({
    to: email,
    subject: "Your Jury investment is pending",
    text: `Hi ${name}, your ${amount ?? "investment"} is pending while Stripe finishes processing it. We'll email you again with next steps once it clears.`,
    html: `<p>Hi ${name},</p><p>Your ${amount ?? "investment"} is pending while Stripe finishes processing it.</p><p>We&apos;ll email you again with next steps once it clears.</p>`,
  });
}

export async function sendPaymentFailedEmail({ email, name, amountCents }: EmailParams) {
  const amount = formatAmount(amountCents);
  await sendEmail({
    to: email,
    subject: "Your Jury payment did not go through",
    text: `Hi ${name}, your ${amount ?? "investment"} did not complete successfully. You can return to Jury and try again, or reply to this email if you need help.`,
    html: `<p>Hi ${name},</p><p>Your ${amount ?? "investment"} did not complete successfully.</p><p>You can return to Jury and try again, or reply to this email if you need help.</p>`,
  });
}

export async function sendPaymentReceivedEmail({ email, name, amountCents }: EmailParams) {
  const amount = formatAmount(amountCents);
  await sendEmail({
    to: email,
    subject: "We received your Jury investment",
    text: `Hi ${name}, we received your ${amount ?? "investment"}. Next up is ops and paperwork review. Watch this inbox for the next steps.`,
    html: `<p>Hi ${name},</p><p>We received your ${amount ?? "investment"}.</p><p>Next up is ops and paperwork review. Watch this inbox for the next steps.</p>`,
  });
}

export async function sendInvestmentApprovedEmail({
  email,
  name,
  magicLink,
}: EmailParams) {
  if (!magicLink) {
    throw new Error("Magic link is required for investment approval emails");
  }

  await sendEmail({
    to: email,
    subject: "Your Jury investment is approved",
    text: `Hi ${name}, your investment has been approved. Use this magic link to access your donor view: ${magicLink}`,
    html: `<p>Hi ${name},</p><p>Your investment has been approved.</p><p><a href="${magicLink}">Use this magic link to access your donor view</a>.</p>`,
  });
}

export async function sendNewMagicLinkEmail({
  email,
  name,
  magicLink,
}: EmailParams) {
  if (!magicLink) {
    throw new Error("Magic link is required for sign-in emails");
  }

  await sendEmail({
    to: email,
    subject: "Your new Jury magic link",
    text: `Hi ${name}, here is your new magic link: ${magicLink}`,
    html: `<p>Hi ${name},</p><p><a href="${magicLink}">Here is your new magic link</a>.</p>`,
  });
}

export function buildAdminApprovalUrl() {
  return absoluteUrl("/api/admin/process-approvals");
}

export function getInvestmentAmount(investment: Pick<InvestmentRow, "amount">) {
  return investment.amount;
}
