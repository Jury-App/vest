"use client";

import { useState, useEffect, useCallback } from "react";
import PaymentModal, { type PaymentCompletion } from "./components/PaymentModal";
import DonorHome from "./components/DonorHome";
import ObjectsHero from "./components/ObjectsHero";

const STORAGE_KEY = "vest_investment_state";

interface StoredInvestment extends PaymentCompletion {}

export default function Home() {
  const [investment, setInvestment] = useState<StoredInvestment | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setInvestment(JSON.parse(saved) as StoredInvestment);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setMounted(true);
  }, []);

  const handleInvest = useCallback(() => {
    setShowPayment(true);
  }, []);

  const handlePaymentSuccess = useCallback((payment: PaymentCompletion) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payment));
    setInvestment(payment);
    setShowPayment(false);
  }, []);

  const handlePaymentClose = useCallback(() => {
    setShowPayment(false);
  }, []);

  const handlePaymentStatusChange = useCallback((payment: StoredInvestment) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payment));
    setInvestment(payment);
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 bg-black" style={{ height: "100dvh" }} />;
  }

  if (investment !== null) {
    return (
      <DonorHome
        investment={investment}
        onStatusChange={handlePaymentStatusChange}
      />
    );
  }

  return (
    <div className="bg-black">
      <ObjectsHero onInvest={handleInvest} />
      {showPayment && (
        <PaymentModal
          onSuccess={handlePaymentSuccess}
          onClose={handlePaymentClose}
        />
      )}
    </div>
  );
}
