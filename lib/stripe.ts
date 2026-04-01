import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function findOrCreateCustomer({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  const customers = await stripe.customers.list({
    email,
    limit: 1,
  });

  const existingCustomer = customers.data[0];
  if (existingCustomer) {
    const needsNameUpdate = !existingCustomer.name || existingCustomer.name !== name;
    const needsEmailUpdate = !existingCustomer.email || existingCustomer.email !== email;

    if (needsNameUpdate || needsEmailUpdate) {
      return stripe.customers.update(existingCustomer.id, {
        email,
        name,
      });
    }

    return existingCustomer;
  }

  return stripe.customers.create({
    email,
    name,
  });
}
