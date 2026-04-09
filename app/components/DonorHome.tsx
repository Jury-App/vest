"use client";

import { useEffect, useRef } from "react";
import type { PaymentCompletion } from "./PaymentModal";

interface DonorHomeProps {
  investment: PaymentCompletion;
  onStatusChange: (payment: PaymentCompletion) => void;
}

export default function DonorHome({
  investment,
  onStatusChange,
}: DonorHomeProps) {
  const formatted = investment.amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  const pollTimer = useRef<number | null>(null);

  useEffect(() => {
    if (investment.status !== "processing") return;

    let cancelled = false;

    const pollStatus = async () => {
      try {
        const res = await fetch(
          `/api/payment-intent-status?payment_intent_id=${investment.paymentIntentId}`
        );
        const data = await res.json();
        if (!res.ok || cancelled) return;

        if (data.status === "succeeded") {
          onStatusChange({
            ...investment,
            status: "succeeded",
          });
          return;
        }

        if (data.status === "processing") {
          pollTimer.current = window.setTimeout(pollStatus, 5000);
        }
      } catch {
        pollTimer.current = window.setTimeout(pollStatus, 7000);
      }
    };

    pollTimer.current = window.setTimeout(pollStatus, 2500);

    return () => {
      cancelled = true;
      if (pollTimer.current !== null) {
        window.clearTimeout(pollTimer.current);
      }
    };
  }, [investment, onStatusChange]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-black px-4 text-center"
      style={{ height: "100dvh" }}
    >
      <p
        className="text-white/50 text-lg tracking-widest"
        style={{ fontVariant: "small-caps", marginBottom: "32px" }}
      >
        your pending stake:
      </p>
      <p
        className="text-white font-bold leading-none"
        style={{ fontSize: "clamp(4rem, 15vw, 10rem)" }}
      >
        ${formatted}
      </p>
      <p className="max-w-md text-sm text-white/60" style={{ marginTop: "42px" }}>
       <strong> Thank you for your investment reservation! </strong>{" "}Your investment will be confirmed after diligence is all done! Check {investment.email} for next steps! Remember that this is a mutual agreement; and refundable :)
      </p>
    </div>
  );
}
