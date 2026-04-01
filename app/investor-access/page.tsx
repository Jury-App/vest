import MagicLinkRequestForm from "@/app/components/MagicLinkRequestForm";

export default function InvestorAccessPage() {
  return (
    <main
      className="min-h-screen bg-black px-6 py-12 text-white"
      style={{ minHeight: "100dvh" }}
    >
      <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-white/40">
          Investor Access
        </p>
        <h1 className="mt-6 text-4xl font-semibold text-white">
          Re-enter your donor experience
        </h1>
        <p className="mt-6 max-w-xl text-base text-white/60">
          Enter the email you used when you invested. If we found an eligible
          account, we&apos;ll send you a fresh magic link.
        </p>
        <div className="mt-10 w-full">
          <MagicLinkRequestForm />
        </div>
      </div>
    </main>
  );
}
