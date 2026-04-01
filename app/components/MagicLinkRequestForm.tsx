"use client";

import { FormEvent, useState } from "react";

export default function MagicLinkRequestForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/request-magic-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "We could not send a magic link.");
        return;
      }

      setMessage(data.message);
    } catch {
      setError("We could not send a magic link.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <label className="block">
        <span className="mb-2 block text-sm text-white/60">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@example.com"
          className="w-full rounded-2xl border border-white/10 bg-white/6 py-3 text-white outline-none transition focus:border-white/25"
          style={{ height: "45px", paddingLeft: "12px", paddingRight: "12px" }}
          required
        />
      </label>
      <button
        type="submit"
        disabled={submitting || !email.trim()}
        className="mt-6 w-full cursor-pointer rounded-full bg-white text-lg font-semibold text-black transition-all duration-200 hover:bg-gray-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30"
        style={{ height: "48px" }}
      >
        {submitting ? "Sending..." : "Send me a magic link"}
      </button>
      {message ? (
        <p className="mt-4 text-sm text-white/60">{message}</p>
      ) : null}
      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
    </form>
  );
}
