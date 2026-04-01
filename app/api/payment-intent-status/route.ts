import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

function isExpandedCustomer(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null
): customer is Stripe.Customer {
  return !!customer && typeof customer !== "string" && !customer.deleted;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const paymentIntentId = searchParams.get("payment_intent_id");

  if (!paymentIntentId) {
    return NextResponse.json(
      { error: "payment_intent_id is required" },
      { status: 400 }
    );
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ["customer", "latest_charge"],
    });
    const customer = isExpandedCustomer(paymentIntent.customer)
      ? paymentIntent.customer
      : null;

    return NextResponse.json({
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      customerId:
        typeof paymentIntent.customer === "string"
          ? paymentIntent.customer
          : customer?.id ?? null,
      customerEmail: customer?.email ?? null,
      customerName: customer?.name ?? null,
      metadata: paymentIntent.metadata,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
