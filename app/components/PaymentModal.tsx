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

type PaymentFlowStatus = "succeeded" | "processing";

export interface PaymentCompletion {
  amount: number;
  email: string;
  name: string;
  paymentIntentId: string;
  status: PaymentFlowStatus;
}

interface PaymentModalProps {
  onSuccess: (payment: PaymentCompletion) => void;
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

function formatWithCommas(value: string): string {
  const clean = value.replace(/[^0-9.]/g, "");
  const parts = clean.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.length > 1 ? `${parts[0]}.${parts[1]}` : parts[0];
}

function parseRawNumber(formatted: string): string {
  return formatted.replace(/,/g, "");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function CheckoutForm({
  amount,
  clientSecret,
  email,
  name,
  paymentIntentId,
  onSuccess,
}: {
  amount: number;
  clientSecret: string;
  email: string;
  name: string;
  paymentIntentId: string;
  onSuccess: (payment: PaymentCompletion) => void;
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
            payment_method_data: {
              billing_details: {
                email,
                name,
              },
            },
          },
          redirect: "if_required",
        });

      if (confirmError) {
        setError(confirmError.message || "Payment failed");
        setProcessing(false);
        return;
      }

      if (!paymentIntent) {
        setError("We could not confirm the payment status.");
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        onSuccess({
          amount,
          email,
          name,
          paymentIntentId: paymentIntent.id,
          status: "succeeded",
        });
        return;
      }

      if (paymentIntent.status === "processing" || paymentIntent.status === "requires_capture") {
        onSuccess({
          amount,
          email,
          name,
          paymentIntentId: paymentIntent.id || paymentIntentId,
          status: "processing",
        });
        return;
      }

      setError(`Payment status: ${paymentIntent.status}.`);
      setProcessing(false);
    },
    [amount, clientSecret, elements, email, name, onSuccess, paymentIntentId, stripe]
  );

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="mb-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70"
      >
        <p className="text-white">{name}</p>
        <p>{email}</p>
      </div>

      <PaymentElement onChange={(e) => setFormComplete(e.complete)} />
      {error && <p className="text-red-400 text-sm text-center mt-3">{error}</p>}
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
      <p className="mt-3 text-center text-xs text-white/45">
        Card and wallet payments usually confirm immediately. Bank payments can remain pending while funds settle.
      </p>
    </form>
  );
}

export default function PaymentModal({ onSuccess, onClose }: PaymentModalProps) {
  const [displayAmount, setDisplayAmount] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useCallback((node: HTMLInputElement | null) => {
    if (node) node.focus();
  }, []);

  const rawAmount = parseRawNumber(displayAmount);
  const numAmount = parseFloat(rawAmount);
  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();
  const amountValid = !!numAmount && numAmount >= 2500 && numAmount <= 999999;
  const formValid = amountValid && !!trimmedName && isValidEmail(trimmedEmail);

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    const parts = raw.split(".");
    const sanitized = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : raw;
    const intPart = sanitized.split(".")[0].replace(/,/g, "");
    if (intPart.length > 6) return;
    setDisplayAmount(formatWithCommas(sanitized));
  }, []);

  const handleIdentitySubmit = useCallback(async () => {
    if (!formValid) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(numAmount * 100),
          email: trimmedEmail,
          name: trimmedName,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "We could not start the payment.");
        return;
      }

      if (data.clientSecret && data.paymentIntentId) {
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
      } else {
        setError("Stripe did not return a payment session.");
      }
    } catch {
      setError("We could not start the payment.");
    } finally {
      setLoading(false);
    }
  }, [formValid, numAmount, trimmedEmail, trimmedName]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer" onClick={onClose} />

      <div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden"
        style={{
          margin: "16px",
          background: "linear-gradient(180deg, #1a1a1a 0%, #111 100%)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div style={{ padding: "24px" }}>
          {!clientSecret || !paymentIntentId ? (
            <div>
              <h2 className="text-center text-white/60 text-lg">
                Confirm your investment details
              </h2>

              <div className="flex justify-center" style={{ paddingTop: "28px", paddingBottom: "24px" }}>
                <div className="flex items-baseline">
                  <span className={`text-5xl font-bold leading-none ${displayAmount ? "text-white" : "text-white/20"}`}>$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="decimal"
                    value={displayAmount}
                    onChange={handleAmountChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleIdentitySubmit();
                    }}
                    className="bg-transparent border-0 outline-none text-5xl font-bold text-white
                      placeholder-white/20 leading-none p-0 m-0 text-center"
                    style={{ width: `${Math.max(1, displayAmount.length) * 0.6 + 0.5}em` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block">
                  <span className="mb-2 block text-sm text-white/60">Legal name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none transition focus:border-white/25"
                    placeholder="Jane Investor"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-white/60">Email for paperwork</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none transition focus:border-white/25"
                    placeholder="jane@example.com"
                  />
                </label>
              </div>

              {error && <p className="mt-4 text-center text-sm text-red-400">{error}</p>}

              <button
                onClick={handleIdentitySubmit}
                disabled={!formValid || loading}
                className="mt-6 w-full bg-white text-black font-semibold text-lg
                  disabled:opacity-30 disabled:cursor-not-allowed
                  transition-all duration-200 hover:bg-gray-100 active:scale-[0.98] cursor-pointer"
                style={{
                  height: "48px",
                  borderRadius: "48px",
                }}
              >
                {loading ? "Loading..." : "Continue to payment"}
              </button>

              <p className="mt-3 text-center text-xs text-white/45">
                We use your name and email to identify your investment and send SAFE paperwork.
              </p>
            </div>
          ) : (
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
                email={trimmedEmail}
                name={trimmedName}
                paymentIntentId={paymentIntentId}
                onSuccess={onSuccess}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}
