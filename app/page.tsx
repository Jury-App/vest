"use client";

import { useState, useEffect, useCallback } from "react";
import VideoPlayer from "./components/VideoPlayer";
import InvestButton from "./components/InvestButton";
import PaymentModal from "./components/PaymentModal";
import DonorHome from "./components/DonorHome";

const STORAGE_KEY = "vest_donation_amount";

export default function Home() {
  const [donationAmount, setDonationAmount] = useState<number | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load donation state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setDonationAmount(parseFloat(saved));
    }
    setMounted(true);
  }, []);

  const handleInvest = useCallback(() => {
    setShowPayment(true);
  }, []);

  const handlePaymentSuccess = useCallback((amount: number) => {
    localStorage.setItem(STORAGE_KEY, String(amount));
    setDonationAmount(amount);
    setShowPayment(false);
  }, []);

  const handlePaymentClose = useCallback(() => {
    setShowPayment(false);
  }, []);

  // Don't render until we've checked localStorage to avoid flash
  if (!mounted) {
    return <div className="fixed inset-0 bg-black" style={{ height: "100dvh" }} />;
  }

  // Donor state
  if (donationAmount !== null) {
    return <DonorHome amount={donationAmount} />;
  }

  // New user state
  return (
    <div className="fixed inset-0" style={{ height: "100dvh" }}>
      <VideoPlayer />
      <InvestButton onInvest={handleInvest} />
      {showPayment && (
        <PaymentModal
          onSuccess={handlePaymentSuccess}
          onClose={handlePaymentClose}
        />
      )}
    </div>
  );
}
