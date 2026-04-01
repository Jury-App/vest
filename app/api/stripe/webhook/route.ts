import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return new Response("Missing webhook configuration", { status: 400 });
  }

  try {
    const payload = await req.text();
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );

    switch (event.type) {
      case "payment_intent.processing":
      case "payment_intent.succeeded":
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("[stripe-webhook]", {
          eventType: event.type,
          paymentIntentId: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          customerId:
            typeof paymentIntent.customer === "string"
              ? paymentIntent.customer
              : paymentIntent.customer?.id ?? null,
          investorEmail: paymentIntent.metadata?.investor_email ?? null,
          investorName: paymentIntent.metadata?.investor_name ?? null,
          investorReference: paymentIntent.metadata?.investor_reference ?? null,
        });
        break;
      }
      default:
        break;
    }

    return Response.json({ received: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Webhook signature verification failed";
    return new Response(message, { status: 400 });
  }
}
