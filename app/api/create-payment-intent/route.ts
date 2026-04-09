import { NextResponse } from "next/server";
import {
  createInvestment,
  sendDraftSafeForInvestment,
  upsertDonor,
} from "@/lib/investor-ops";
import { findOrCreateCustomer, stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { amount, email, name } = await req.json();

    if (!amount || amount < 250000 || amount > 99999900) {
      return NextResponse.json(
        { error: "Amount must be between $2,500 and $999,999" },
        { status: 400 }
      );
    }

    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const normalizedName = typeof name === "string" ? name.trim() : "";

    if (!normalizedName) {
      return NextResponse.json(
        { error: "Legal name is required" },
        { status: 400 }
      );
    }

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }

    const customer = await findOrCreateCustomer({
      email: normalizedEmail,
      name: normalizedName,
    });
    const investorReference = crypto.randomUUID();

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // in cents
      currency: "usd",
      customer: customer.id,
      receipt_email: normalizedEmail,
      automatic_payment_methods: { enabled: true },
      description: `Jury Community Fund investment from ${normalizedName}`,
      metadata: {
        product_key: "communityfund",
        product_id: "prod_UFGjE6oupxaLBX",
        investor_email: normalizedEmail,
        investor_name: normalizedName,
        investor_reference: investorReference,
      },
    });

    const donor = await upsertDonor({
      email: normalizedEmail,
      fullLegalName: normalizedName,
      stripeCustomerId: customer.id,
    });

    const investment = await createInvestment({
      donorId: donor.id,
      stripePaymentIntentId: paymentIntent.id,
      investorReference,
      amount,
    });

    await sendDraftSafeForInvestment({
      investmentId: investment.id,
      email: normalizedEmail,
      name: normalizedName,
      amountCents: amount,
      investorReference,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      customerId: customer.id,
      paymentIntentId: paymentIntent.id,
      investorReference,
      investmentId: investment.id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
