import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient, createSupabaseServerClient, type DonorRow, type InvestmentRow } from "@/lib/supabase";
import { linkAuthUserToDonor } from "@/lib/investor-ops";

export default async function DonorPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/investor-access");
  }

  const admin = createSupabaseAdminClient();
  const normalizedEmail = user.email.toLowerCase();

  const { data: donor, error: donorError } = await admin
    .from("donors")
    .select("*")
    .eq("email", normalizedEmail)
    .maybeSingle<DonorRow>();

  if (donorError) {
    throw new Error(donorError.message);
  }

  if (!donor) {
    redirect("/investor-access");
  }

  if (donor.auth_user_id !== user.id) {
    await linkAuthUserToDonor(donor.email, user.id);
  }

  const { data: investments, error: investmentsError } = await admin
    .from("investments")
    .select("*")
    .eq("donor_id", donor.id)
    .order("created_at", { ascending: false });

  if (investmentsError) {
    throw new Error(investmentsError.message);
  }

  const rows = (investments ?? []) as InvestmentRow[];
  const approvedSucceeded = rows.filter(
    (investment) =>
      investment.approval_status === "approved" &&
      investment.payment_status === "succeeded"
  );
  const totalApprovedAmount = approvedSucceeded.reduce(
    (sum, investment) => sum + investment.amount,
    0
  );

  return (
    <main
      className="min-h-screen bg-black px-6 py-12 text-white"
      style={{ minHeight: "100dvh" }}
    >
      <div className="mx-auto flex min-h-[80vh] max-w-3xl flex-col justify-center">
        <p className="text-sm uppercase tracking-[0.3em] text-white/40">
          Donor View
        </p>
        <h1 className="mt-6 text-4xl font-semibold">
          {approvedSucceeded.length > 0
            ? "Your donor experience is unlocked."
            : "We’re still reviewing your investment."}
        </h1>
        <p className="mt-6 max-w-2xl text-base text-white/60">
          {approvedSucceeded.length > 0
            ? `You currently have $${(totalApprovedAmount / 100).toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })} approved in Jury. The richer donor experience will expand from here.`
            : `Your payment and paperwork are still in motion. We’ll email ${donor.email} as soon as there’s an update.`}
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-white/40">Investor</p>
          <p className="mt-2 text-xl text-white">{donor.full_legal_name}</p>
          <p className="mt-1 text-sm text-white/60">{donor.email}</p>

          <div className="mt-8 space-y-4">
            {rows.length > 0 ? (
              rows.map((investment) => (
                <div
                  key={investment.id}
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4"
                >
                  <p className="text-sm text-white/40">
                    ${(investment.amount / 100).toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="mt-2 text-sm text-white/70">
                    Payment: {investment.payment_status}
                  </p>
                  <p className="mt-1 text-sm text-white/70">
                    Approval: {investment.approval_status}
                  </p>
                  <p className="mt-1 text-sm text-white/70">
                    Paperwork: {investment.paperwork_status}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-white/60">
                We haven&apos;t matched any investments to this account yet.
              </p>
            )}
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="text-sm text-white/50 underline underline-offset-4"
          >
            Return to Jury
          </Link>
        </div>
      </div>
    </main>
  );
}
