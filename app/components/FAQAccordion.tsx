"use client";

import { ReactNode } from "react";

type FAQAccordionProps = {
  onInvest: () => void;
};

function FAQItem({
  answer,
  question,
}: {
  answer: ReactNode;
  question: string;
}) {
  return (
    <div className="relative rounded-2xl bg-white shadow-[0_2px_0_rgba(255,255,255,0.05)]">
      <div className="overflow-hidden rounded-2xl border border-solid border-[#d9d9d9]">
        <div className="p-4" style={{ fontFamily: "inherit" }}>
          <p className="text-[17px] font-extrabold leading-[1.35] text-black sm:text-[19px] md:text-[22px]">
            {question}
          </p>
          <div className="max-w-[892px] pt-4 text-[14px] font-medium leading-[1.8] tracking-[-0.02em] text-black/88 sm:text-[15px] md:text-[16px] md:leading-[1.9]">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQAccordion({ onInvest }: FAQAccordionProps) {
  const faqs = [
    {
      question: "What is the Jury Community Fund?",
      answer:
        "The Community Fund is a way for non-wealthy and non-institutional friends (and friends of friends) to invest in Jury as we hard-launch, build and grow. We are opening a single cap table line item via Reg D 506(b) which allows up 35 non-accredited sophisticated investors (financially literate, risk-aware, and below $250,000 annual income) and unlimited checks from accredited investors.",
    },
    {
      question: "What are the terms?",
      answer: (
        <div className="space-y-4">
          <p>You're investing in Jury App Inc., a Delaware C Corp. Your investment will consolidate into one SPV managed by a singular lead and structured as a SAFE.</p>
          <p>The minimum investment is $2,500 and the maximum individual investment is $999,999.</p>
          <p>Currently, we are offering a $12M valuation cap post-money.</p>
          <p>Future fundraising may dilute your ownership. Expect a fraction of a percentage, which is standard.</p>
          <p>You will have no voting rights or control over company decisions.</p>
        </div>
      ),
    },
    {
      question: "What are the risks?",
      answer: (
        <div className="space-y-4">
          <p>Only invest money you can afford to lose entirely. We are an early-stage company with limited operating history and no meaningful revenue.</p>
          <p>There is no guaranteed return, no liquidity timeline, and no promise that Jury will succeed.</p>
          <p>The company is dependent on a single person: Founder and CEO Nicole Muther.</p>
          <p>Returns from startup investments typically come from an acquisition, IPO, or secondary sale.</p>
        </div>
      ),
    },
    {
      question: "Convincing! How do I invest?",
      answer: (
        <div className="space-y-4">
          <p>You should only invest if you understand the risks in full and are comfortable with a speculative, illiquid investment.</p>
          <p>
            Click{" "}
            <button
              className="cursor-pointer underline"
              onClick={onInvest}
              type="button"
            >
              here
            </button>{" "}
            to submit your payment through Stripe. We'll follow up with a SAFE agreement and the necessary paperwork.
          </p>
          <p>Reach out to nicole@meetjury.com for questions.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[860px] space-y-8">
      {faqs.map((faq) => (
        <FAQItem
          key={faq.question}
          answer={faq.answer}
          question={faq.question}
        />
      ))}
    </div>
  );
}
