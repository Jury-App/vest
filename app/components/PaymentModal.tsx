"use client";

import { useState, useCallback, FormEvent } from "react";
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
}: {
  amount: number;
  clientSecret: string;
  onSuccess: (amount: number) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formComplete, setFormComplete] = useState(false);

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
    <form onSubmit={handleSubmit}>
      <PaymentElement onChange={(e) => setFormComplete(e.complete)} />
      {error && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}
      <button
        type="submit"
        disabled={!stripe || processing || !formComplete}
        className="disabled:opacity-30 disabled:cursor-not-allowed
          transition-all duration-200 hover:bg-gray-100 active:scale-[0.98] cursor-pointer"
        style={{
          width: "100%",
          height: "48px",
          padding: 0,
          margin: 0,
          marginTop: "24px",
          border: "none",
          borderRadius: "48px",
          backgroundColor: "white",
          color: "black",
          fontSize: "18px",
          fontWeight: 600,
        }}
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
  const inputRef = useCallback((node: HTMLInputElement | null) => {
    if (node) node.focus();
  }, []);

  const rawAmount = parseRawNumber(displayAmount);
  const numAmount = parseFloat(rawAmount);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    // Prevent multiple decimals
    const parts = raw.split(".");
    const sanitized = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : raw;
    // Cap at 999,999
    const intPart = sanitized.split(".")[0].replace(/,/g, "");
    if (intPart.length > 6) return;
    setDisplayAmount(formatWithCommas(sanitized));
  }, []);

  const handleAmountSubmit = useCallback(async () => {
    if (!numAmount || numAmount < 2500 || numAmount > 999999) return;

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

              <div className="flex justify-center" style={{ paddingTop: "32px", paddingBottom: "32px" }}>
                <div className="flex items-baseline">
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
                      placeholder-white/20 leading-none p-0 m-0 text-center"
                    style={{ width: `${Math.max(1, displayAmount.length) * 0.6 + 0.5}em` }}
                  />
                </div>
              </div>

              <button
                onClick={handleAmountSubmit}
                disabled={!numAmount || numAmount < 2500 || numAmount > 999999 || loading}
                className="w-full bg-white text-black font-semibold text-lg
                  disabled:opacity-30 disabled:cursor-not-allowed
                  transition-all duration-200 hover:bg-gray-100 active:scale-[0.98] cursor-pointer"
                style={{
                  height: "48px",
                  borderRadius: "48px",
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
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}
