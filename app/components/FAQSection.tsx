"use client";

import { ReactNode, useState } from "react";
import Reveal from "./Reveal";

const SAFE_GUIDE_URL =
  "https://bookface-static.ycombinator.com/assets/ycdc/Website%20User%20Guide%20Feb%202023%20-%20final-28acf9a3b938e643cc270b7da514194d5c271359be25b631b025605673fa9f95.pdf";

interface FAQItemProps {
  question: string;
  answer: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function Chevron({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      className="h-5 w-7 flex-shrink-0 transition-transform duration-300"
      style={{ transform: `rotate(${isOpen ? 180 : 0}deg)` }}
      fill="none"
      viewBox="0 0 28 20"
      aria-hidden="true"
    >
      <path
        d="M2 2L14 16L26 2"
        stroke="#3D3D3D"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </svg>
  );
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="relative rounded-2xl bg-white shadow-[0_2px_0_rgba(255,255,255,0.05)]">
      <div className="overflow-hidden rounded-2xl border border-solid border-[#d9d9d9]">
        <button
          onClick={onToggle}
          className="w-full cursor-pointer p-6 text-left transition-colors hover:bg-gray-50"
          type="button"
        >
          <div className="flex items-start justify-between gap-4">
            <p className="flex-1 pr-4 text-[17px] font-extrabold leading-[1.35] text-black sm:text-[19px] md:text-[22px]">
              {question}
            </p>
            <div className="mt-1">
              <Chevron isOpen={isOpen} />
            </div>
          </div>
        </button>

        <div
          className="grid transition-[grid-template-rows,opacity] duration-300 ease-in-out"
          style={{
            gridTemplateRows: isOpen ? "1fr" : "0fr",
            opacity: isOpen ? 1 : 0,
          }}
        >
          <div className="overflow-hidden">
            <div className="px-6 pb-6 pt-0">
              <div className="max-w-[892px] text-[14px] font-medium leading-[1.8] tracking-[-0.02em] text-black/88 sm:text-[15px] md:text-[16px] md:leading-[1.9]">
                {answer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FAQSectionProps {
  onInvest: () => void;
}

export function FAQSection({ onInvest }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
          <p>
            You&apos;re investing in Jury App Inc., a Delaware C Corp. Your
            investment will consolidate into one SPV (Special Purpose Vehicle)
            so it appears as one line item in our cap table managed by a
            singular lead and structured as a{" "}
            <a
              className="underline underline-offset-2"
              href={SAFE_GUIDE_URL}
              rel="noreferrer"
              target="_blank"
            >
              SAFE
            </a>{" "}
            (Simple Agreement for Future Equity), which is the standard
            vehicle and instrument used by most early-stage startups. A SAFE
            converts into equity at a priced round when institutional
            investors join.
          </p>
          <p>
            The minimum investment is $2,500 and the maximum individual
            investment is $999,999.
          </p>
          <p>
            Currently, we are offering a $12M valuation cap post-money. This
            valuation is not determined through institutional investors but our
            own estimate of current value. A future priced round may establish a
            valuation below the cap on your SAFE, in which case you would
            convert at a lower percentage.
          </p>
          <p>
            Future fundraising may dilute your own ownership. Expect a fraction
            of a percentage, which is standard for this approach in market.
          </p>
          <p>
            You will have no voting rights or control over company decisions.
            Use of proceeds is at the Company&apos;s discretion.
          </p>
        </div>
      ),
    },
    {
      question: "What are the risks?",
      answer: (
        <div className="space-y-4">
          <p>
            Only invest money you can afford to lose entirely. We are an
            early-stage company with limited operating history, no meaningful
            revenue, and unprofitable. While we have achieved early promising
            signal, we have not yet proven product-market-fit at scale and the
            world around us is changing rapidly in a highly competitive market
            of new players and incumbents.
          </p>
          <p>
            There is no guaranteed return. No timeline for liquidity. No
            promise that Jury will succeed. Most startups fail. You will not be
            able to sell your stock or transfer them or otherwise liquidate
            early.
          </p>
          <p>
            Keep in mind the company is dependent on a single person; me -
            Founder &amp; CEO. The loss or incapacity of the founder could
            materially harm the company&apos;s ability to operate, raise capital,
            and execute on its business plan - and there is no succession plan
            in place.
          </p>
          <p>
            In the case we succeed, returns from startup investments typically
            come from an acquisition, IPO, or secondary sale.
          </p>
          <p>
            Consult with your tax advisor regarding the consequence of
            purchasing, holding, and converting a SAFE under applicable state
            and local tax implications.
          </p>
          <p>
            This offer has not been reviewed by any regulatory authority so you
            do not have protections that come with a registered offering.
          </p>
        </div>
      ),
    },
    {
      question: "Convincing! How do I invest?",
      answer: (
        <div className="space-y-4">
          <p>
            If you have read and understand these risk factors in their
            entirety; you understand that this is a speculative investment with
            a high probability of total loss. You are investing only funds that
            you can afford to lose entirely without affecting your financial
            stability or standard of living. You have had the opportunity to
            ask questions of the company and have received satisfactory answers.
            You are making this investment based on your own independent
            evaluation and not in reliance on any representations or promises
            not contained in the offering documents. You understand that these
            securities are illiquid and that you may not be able to sell or
            transfer them for an indefinite period. You have been advised to
            consult with your own legal, tax, and financial advisors before
            making this investment.
          </p>
          <p>
            Click{" "}
            <button
              className="cursor-pointer underline"
              onClick={onInvest}
              type="button"
            >
              here
            </button>{" "}
            to submit your payment which is processed through Stripe. We&apos;ll
            follow up and send you a SAFE agreement and necessary paperwork. If
            for whatever reason we cannot proceed due to i) a filled round or
            ii) audit risk, we will refund you within 30 days of written
            acceptance decision.
          </p>
          <p>Reach out to nicole@meetjury.com for questions.</p>
        </div>
      ),
    },
  ];

  return (
    <section className="relative w-full bg-[#232323] px-5 py-28 sm:px-8 md:px-10 md:py-36 lg:py-40">
      <div className="mx-auto max-w-[1040px]">
        <Reveal className="mb-12 md:mb-16">
          <div className="mb-10 flex justify-center md:mb-14">
            <div className="h-px w-24 bg-white/18 md:w-32" />
          </div>
          <h2
            className="text-center text-white"
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: "clamp(3.2rem, 8vw, 7.5rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.045em",
            }}
          >
            FAQ
          </h2>
        </Reveal>

        <div className="mx-auto max-w-[860px] space-y-4 md:space-y-6">
          {faqs.map((faq, index) => (
            <Reveal key={faq.question} delayMs={index * 45}>
              <FAQItem
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 flex justify-center md:mt-20" delayMs={120}>
          <img
            alt="Punctuation mark"
            className="h-auto w-[72px] md:w-[108px]"
            src="/assets/punct.png"
          />
        </Reveal>
      </div>
    </section>
  );
}
