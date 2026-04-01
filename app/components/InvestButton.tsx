"use client";

import { useCallback } from "react";

interface InvestButtonProps {
  onInvest: () => void;
  fullscreen?: boolean;
}

export default function InvestButton({
  onInvest,
  fullscreen = true,
}: InvestButtonProps) {
  const handleClick = useCallback(() => {
    onInvest();
  }, [onInvest]);

  return (
    <div
      className={
        fullscreen
          ? "fixed inset-0 z-20 flex items-center justify-center pointer-events-none"
          : "relative z-20 flex items-center justify-center"
      }
    >
      <button
        onClick={handleClick}
        className="relative cursor-pointer border border-white/20 bg-white/12 px-12 py-6 pointer-events-auto rounded-full transition-colors duration-200 hover:bg-white/18 active:scale-[0.98]"
      >
        <span
          className="relative flex items-center justify-center text-white text-2xl font-semibold tracking-wide"
          style={{
            textShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
          }}
        >
          Invest
        </span>
      </button>
    </div>
  );
}
