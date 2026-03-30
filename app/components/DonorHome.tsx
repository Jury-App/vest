"use client";

interface DonorHomeProps {
  amount: number;
}

export default function DonorHome({ amount }: DonorHomeProps) {
  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-black"
      style={{ height: "100dvh" }}
    >
      <p
        className="text-white/50 text-lg tracking-widest mb-2"
        style={{ fontVariant: "small-caps" }}
      >
        your stake:
      </p>
      <p
        className="text-white font-bold leading-none"
        style={{ fontSize: "clamp(4rem, 15vw, 10rem)" }}
      >
        ${formatted}
      </p>
    </div>
  );
}
