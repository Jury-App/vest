# Go-Live Checklist

Use this checklist before pointing production traffic at Vercel.

## 1. Confirm production URLs

- Production site URL: `https://www.fucktech.ai`
- Vercel project default domain: note the current `*.vercel.app` URL
- Stripe webhook production URL: `https://www.fucktech.ai/api/stripe/webhook`
- Supabase auth callback URL: `https://www.fucktech.ai/auth/callback`
- Admin approvals endpoint: `https://www.fucktech.ai/api/admin/process-approvals`

## 2. Inventory the required environment variables

These are the variables the app currently requires:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `OPS_CRON_SECRET`

Current source-of-truth references in code:

- [.env.example](/Volumes/SSD/juryvest/vest/.env.example)
- [lib/site.ts](/Volumes/SSD/juryvest/vest/lib/site.ts)
- [lib/supabase.ts](/Volumes/SSD/juryvest/vest/lib/supabase.ts)
- [lib/stripe.ts](/Volumes/SSD/juryvest/vest/lib/stripe.ts)
- [lib/email.ts](/Volumes/SSD/juryvest/vest/lib/email.ts)
- [lib/investor-ops.ts](/Volumes/SSD/juryvest/vest/lib/investor-ops.ts)
- [app/api/stripe/webhook/route.ts](/Volumes/SSD/juryvest/vest/app/api/stripe/webhook/route.ts)

## 3. Local environment check

- Review local env file and confirm it is using the intended workspace:
  - `.env.local`
- Confirm local Supabase values point to the correct Supabase project:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Confirm local Stripe values all come from the same Stripe account and mode:
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
- Confirm local email values point to the intended Resend account/domain:
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL`
- Confirm `NEXT_PUBLIC_SITE_URL` is `http://localhost:3000` locally unless you are intentionally testing against a tunnel/custom domain.
- Confirm `OPS_CRON_SECRET` is set locally if you want to test the admin approvals endpoint.

## 4. Vercel environment check

- In Vercel, open the project settings and review Production environment variables.
- Confirm these production values are present and match the production services:
  - `NEXT_PUBLIC_SITE_URL=https://www.fucktech.ai`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL`
  - `OPS_CRON_SECRET`
- Confirm the Stripe keys are both live-mode or both test-mode. Do not mix a live secret with a test publishable key.
- Confirm `NEXT_PUBLIC_SITE_URL` is the final public URL before testing magic links or approval emails.
- Redeploy after updating any environment variable so the deployment picks up the new values.

## 5. Supabase check

- Confirm the production Supabase project is the one referenced by:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Confirm the required schema is present from [supabase/schema.sql](/Volumes/SSD/juryvest/vest/supabase/schema.sql).
- In Supabase Auth settings, make sure the site URL is `https://www.fucktech.ai`.
- In Supabase Auth redirect URLs, add both:
  - `https://www.fucktech.ai/auth/callback`
  - `https://<your-project>.vercel.app/auth/callback`
- Send a test magic link and confirm it lands on `/donor` after the auth callback.
- Confirm the service role key in Vercel belongs to the same Supabase project as the public URL and anon key.

## 6. Resend check

- Confirm `RESEND_API_KEY` belongs to the intended production Resend account.
- Confirm `RESEND_FROM_EMAIL` uses a verified sender/domain in Resend.
- If using `@fucktech.ai`, confirm the sending domain is verified in Resend before launch.
- Send a test email from production:
  - payment received
  - payment failed
  - magic link
- Confirm messages arrive, the sender looks right, and links point to `https://www.fucktech.ai`.

## 7. Stripe check

- Confirm `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY` belong to the same Stripe account and same mode.
- Confirm the app can create PaymentIntents in the intended Stripe account.
- Confirm the production webhook endpoint is configured in Stripe:
  - `https://www.fucktech.ai/api/stripe/webhook`
- Confirm the webhook subscribes to:
  - `payment_intent.processing`
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
- Confirm `STRIPE_WEBHOOK_SECRET` in Vercel matches the signing secret from that exact production webhook endpoint.
- Run a live-mode or test-mode payment end-to-end and verify:
  - PaymentIntent is created
  - webhook is received
  - donor row is upserted
  - investment row is created or updated
  - email is sent

## 8. Admin approvals check

- Confirm `OPS_CRON_SECRET` is set in Vercel.
- Test the approvals endpoint with the bearer token:

```bash
curl -X POST https://www.fucktech.ai/api/admin/process-approvals \
  -H "Authorization: Bearer $OPS_CRON_SECRET"
```

- Confirm unauthorized requests return `401`.
- Confirm authorized requests return `200` and process approved investments safely.

## 9. Domain cutover: Squarespace to Vercel

- In Vercel, add both domains to the project:
  - `fucktech.ai`
  - `www.fucktech.ai`
- Set `www.fucktech.ai` as the primary production domain if that is the canonical URL.
- In Squarespace DNS settings, update records to the values Vercel shows for the project.
- Typical setup is:
  - apex/root domain (`fucktech.ai`) uses the Vercel A record
  - `www` uses the Vercel CNAME target
- Remove conflicting Squarespace default records for the same hostnames if Vercel flags them as invalid.
- Wait for Vercel to show the domain as verified and assigned to production.
- After DNS propagates, confirm:
  - `https://www.fucktech.ai` loads the site
  - `https://fucktech.ai` redirects to `https://www.fucktech.ai`
  - SSL is valid

## 10. Final production smoke test

- Open the live site on desktop and mobile.
- Create a payment and confirm the UI completes successfully.
- Confirm the payment appears in Stripe.
- Confirm donor/investment records appear in Supabase.
- Confirm the payment receipt/update email arrives from Resend.
- Mark a test investment as approved in Supabase and hit the approvals endpoint.
- Confirm the approval email arrives with a working magic link.
- Confirm the magic link signs the user in and lands on `/donor`.

## 11. Launch decision

Only go live after all of the following are true:

- All production secrets point to the same production service accounts
- `NEXT_PUBLIC_SITE_URL` is `https://www.fucktech.ai`
- Supabase auth URLs include the production callback
- Resend sender domain is verified
- Stripe webhook is delivering successfully
- Vercel domain is verified and serving SSL
- End-to-end payment, email, and magic-link flows all pass

## Recommended value map

Use this as the quick cross-check when you review secrets:

| Variable | Should point to |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://www.fucktech.ai` in Vercel Production |
| `NEXT_PUBLIC_SUPABASE_URL` | production Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | production Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | same production Supabase project |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe live publishable key for the correct account |
| `STRIPE_SECRET_KEY` | matching Stripe live secret key |
| `STRIPE_WEBHOOK_SECRET` | signing secret for `https://www.fucktech.ai/api/stripe/webhook` |
| `RESEND_API_KEY` | production Resend account |
| `RESEND_FROM_EMAIL` | verified sender on the Resend domain |
| `OPS_CRON_SECRET` | shared secret used only for the approvals endpoint |
