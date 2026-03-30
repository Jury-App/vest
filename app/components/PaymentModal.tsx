"use client";

import { useState, useCallback, useEffect, useRef, FormEvent } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe, type Appearance } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface PaymentModalProps {
  onSuccess: (amount: number) => void;
  onClose: () => void;
}

const stripeAppearance: Appearance = {
  theme: "night",
  variables: {
    colorPrimary: "#ffffff",
    colorBackground: "#1a1a1a",
    colorText: "#ffffff",
    colorDanger: "#ff4444",
    fontFamily: "system-ui, -apple-system, sans-serif",
    borderRadius: "12px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      border: "1px solid rgba(255, 255, 255, 0.15)",
    },
    ".Input:focus": {
      border: "1px solid rgba(255, 255, 255, 0.4)",
      boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.2)",
    },
    ".Label": {
      color: "rgba(255, 255, 255, 0.7)",
    },
  },
};

function CheckoutForm({
  amount,
  clientSecret,
  onSuccess,
  onClose,
}: {
  amount: number;
  clientSecret: string;
  onSuccess: (amount: number) => void;
  onClose: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!stripe || !elements) return;

      setProcessing(true);
      setError(null);

      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || "Payment failed");
        setProcessing(false);
        return;
      }

      const { error: confirmError, paymentIntent } =
        await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: {
            return_url: window.location.href,
          },
          redirect: "if_required",
        });

      if (confirmError) {
        setError(confirmError.message || "Payment failed");
        setProcessing(false);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        onSuccess(amount);
      }
    },
    [stripe, elements, clientSecret, amount, onSuccess]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full py-4 rounded-2xl bg-white text-black font-semibold text-lg
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200 hover:bg-gray-100 active:scale-[0.98] cursor-pointer"
      >
        {processing ? "Processing..." : `Invest $${amount.toLocaleString()}`}
      </button>
    </form>
  );
}

function formatWithCommas(value: string): string {
  // Strip non-numeric except decimal
  const clean = value.replace(/[^0-9.]/g, "");
  const parts = clean.split(".");
  // Add commas to integer part
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.length > 1 ? `${parts[0]}.${parts[1]}` : parts[0];
}

function parseRawNumber(formatted: string): string {
  return formatted.replace(/,/g, "");
}

export default function PaymentModal({ onSuccess, onClose }: PaymentModalProps) {
  const [displayAmount, setDisplayAmount] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const animFrameRef = useRef<number>(0);
  const seedRef = useRef(0);
  const inputRef = useCallback((node: HTMLInputElement | null) => {
    if (node) node.focus();
  }, []);

  const rawAmount = parseRawNumber(displayAmount);
  const numAmount = parseFloat(rawAmount);
  const isActive = !!(numAmount && numAmount >= 1);

  // Lava lamp animation for Continue button — only runs when active
  useEffect(() => {
    if (!isActive) return;
    let lastTime = 0;
    const animate = (time: number) => {
      if (turbulenceRef.current) {
        const delta = time - lastTime;
        if (delta > 200) {
          seedRef.current += 1;
          turbulenceRef.current.setAttribute("seed", String(seedRef.current));
          const freq = 0.015 + Math.sin(time * 0.00025) * 0.005;
          turbulenceRef.current.setAttribute("baseFrequency", `${freq} ${freq * 0.8}`);
          lastTime = time;
        }
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isActive]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    // Prevent multiple decimals
    const parts = raw.split(".");
    const sanitized = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : raw;
    // Cap integer part at 8 digits (99,999,999)
    const intPart = sanitized.split(".")[0].replace(/,/g, "");
    if (intPart.length > 8) return;
    setDisplayAmount(formatWithCommas(sanitized));
  }, []);

  const handleAmountSubmit = useCallback(async () => {
    if (!numAmount || numAmount < 1) return;

    setLoading(true);
    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(numAmount * 100) }),
      });
      const data = await res.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      }
    } catch {
      // Handle error silently
    }
    setLoading(false);
  }, [numAmount]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop — tap to dismiss */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer" onClick={onClose} />

      {/* SVG filter for Continue button lava lamp effect */}
      <svg className="absolute" style={{ width: 0, height: 0 }}>
        <defs>
          <filter id="cta-lava" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="0.015 0.012"
              numOctaves="3"
              seed="0"
              result="turbulence"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="8"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Modal sheet */}
      <div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden"
        style={{
          margin: "16px",
          background: "linear-gradient(180deg, #1a1a1a 0%, #111 100%)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div style={{ padding: "24px" }}>
          {!clientSecret ? (
            /* Amount entry step */
            <div>
              <h2 className="text-center text-white/60 text-lg">
                How much would you like to invest?
              </h2>

              <div className="flex items-baseline justify-center" style={{ paddingTop: "32px", paddingBottom: "32px" }}>
                <span className={`text-5xl font-bold leading-none ${displayAmount ? "text-white" : "text-white/20"}`}>$</span>
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="decimal"
                  placeholder=""
                  value={displayAmount}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAmountSubmit();
                  }}
                  className="bg-transparent border-0 outline-none text-5xl font-bold text-white
                    placeholder-white/20 leading-none p-0 m-0"
                  style={{ width: `${Math.max(1, displayAmount.length) * 0.6 + 0.5}em` }}
                />
              </div>

              <button
                onClick={handleAmountSubmit}
                disabled={!numAmount || numAmount < 1 || loading}
                className="w-full bg-white text-black font-semibold text-lg
                  disabled:opacity-30 disabled:cursor-not-allowed
                  transition-all duration-200 hover:bg-gray-100 active:scale-[0.98] cursor-pointer"
                style={{
                  height: "48px",
                  borderRadius: "48px",
                  filter: isActive ? "url(#cta-lava)" : "none",
                }}
              >
                {loading ? "Loading..." : "Continue"}
              </button>

            </div>
          ) : (
            /* Stripe payment step */
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: stripeAppearance,
              }}
            >
              <CheckoutForm
                amount={numAmount}
                clientSecret={clientSecret}
                onSuccess={onSuccess}
                onClose={onClose}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}
