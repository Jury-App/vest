"use client";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ReactNode, useEffect, useState } from "react";

const SAFE_GUIDE_URL =
  "https://bookface-static.ycombinator.com/assets/ycdc/Website%20User%20Guide%20Feb%202023%20-%20final-28acf9a3b938e643cc270b7da514194d5c271359be25b631b025605673fa9f95.pdf";

type FAQAccordionProps = {
  onInvest: () => void;
};

type FAQItemProps = {
  answer: ReactNode;
  expanded: boolean;
  id: string;
  isFirst: boolean;
  isLast: boolean;
  onChange: () => void;
  question: string;
};

function FAQItem({
  answer,
  expanded,
  id,
  isFirst,
  isLast,
  onChange,
  question,
}: FAQItemProps) {
  const shapeSx = isFirst
    ? {
        borderTopLeftRadius: "42px",
        borderTopRightRadius: "42px",
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }
    : isLast
      ? {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: "42px",
          borderBottomRightRadius: "42px",
        }
      : {
          borderRadius: 0,
        };

  return (
    <div
      style={{
        backgroundColor: "#232323",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: "0 24px 64px rgba(0, 0, 0, 0.28)",
        color: "#f6f2e8",
        overflow: "hidden",
        ...shapeSx,
      }}
    >
      <Accordion
        disableGutters
        elevation={0}
        expanded={expanded}
        onChange={onChange}
        square={false}
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
          color: "inherit",
          borderRadius: 0,
          "&::before": {
            display: "none",
          },
        }}
      >
        <AccordionSummary
          aria-controls={`${id}-content`}
          expandIcon={<ExpandMoreIcon sx={{ color: "#f6f2e8" }} />}
          id={`${id}-header`}
          sx={{
            minHeight: "unset",
            alignItems: "center",
            px: 3,
            py: 2,
            "& .MuiAccordionSummary-expandIconWrapper": {
              alignSelf: "center",
            },
            "& .MuiAccordionSummary-content": {
              alignItems: "center",
              display: "flex",
              margin: 0,
              pr: 2,
            },
            "& .MuiAccordionSummary-content.Mui-expanded": {
              margin: 0,
            },
            "&.Mui-expanded": {
              minHeight: "unset",
            },
          }}
        >
          <Typography
            component="h3"
            sx={{
              color: "#f6f2e8",
              fontFamily: "inherit",
              fontSize: { xs: "18px", sm: "20px", md: "24px" },
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
            }}
          >
            {question}
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            color: "rgba(246, 242, 232, 0.82)",
            fontFamily: "inherit",
            fontSize: { xs: "14px", sm: "15px", md: "16px" },
            fontWeight: 500,
            letterSpacing: "-0.02em",
            lineHeight: { xs: 1.8, md: 1.9 },
            px: 3,
            pt: 1,
            pb: 3,
          }}
        >
          {answer}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

function Countdown() {
  const [remaining, setRemaining] = useState<{
    d: number;
    h: number;
    m: number;
    s: number;
  } | null>(null);

  useEffect(() => {
    const target = new Date("2026-04-30T23:59:59").getTime();
    const update = () => {
      const diff = Math.max(0, target - Date.now());
      const d = Math.floor(diff / 86_400_000);
      const h = Math.floor((diff % 86_400_000) / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setRemaining({ d, h, m, s });
    };
    update();
    const id = setInterval(update, 1_000);
    return () => clearInterval(id);
  }, []);

  if (remaining === null) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="text-center" style={{ color: "#ffffff" }}>
      <p
        className="font-extrabold tracking-tight"
        style={{ fontSize: "clamp(1.4rem, 4vw, 2.8rem)" }}
      >
        {remaining.d}d:{pad(remaining.h)}h:{pad(remaining.m)}m:{pad(remaining.s)}s
      </p>
      <p
        style={{
          fontSize: "clamp(0.875rem, 2vw, 1.125rem)",
          marginTop: "8px",
        }}
      >
        to bring Jury back!
      </p>
    </div>
  );
}

export default function FAQAccordion({ onInvest }: FAQAccordionProps) {
  const [expandedPanel, setExpandedPanel] = useState<string | false>("panel-0");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  const faqs = [
    {
      question: "What is the Jury Community Pool?",
      answer: (
        <p>
          The Community Pool is a way for non-wealthy and non-institutional
          friends (and friends of friends) to invest in{" "}
          <a
            className="underline underline-offset-2"
            href="https://meetjury.com"
            rel="noreferrer"
            target="_blank"
          >
            Jury
          </a>{" "}
          as we hard-launch, keep building and grow. We are opening a single
          cap table line item via Reg D 506(b) which allows up to 35
          non-accredited sophisticated investors (financially literate,
          risk-aware, and below $250,000 annual income) and unlimited checks
          from accredited investors.
        </p>
      ),
    },
    {
      question: "What are the terms?",
      answer: (
        <div className="space-y-4">
          <p>You're investing in Jury App Inc., a Delaware C Corp. Your investment will consolidate into one SPV managed by a singular lead and structured as a <a className="underline underline-offset-2" href={SAFE_GUIDE_URL} rel="noreferrer" target="_blank">SAFE</a>. The minimum investment is $2,500 and the maximum individual investment is $999,999. Currently, we are offering a $12M valuation cap post-money. Future fundraising may dilute your ownership. Expect a fraction of a percentage, which is standard. You will have no voting rights or control over company decisions.</p>
        </div>
      ),
    },
    {
      question: "What are the risks?",
      answer: (
        <div className="space-y-4">
          <p>Only invest money you can afford to lose entirely. We are an early-stage company with limited operating history and no meaningful revenue. There is no guaranteed return, no liquidity timeline, and no promise that Jury will succeed. The company is dependent on a single person: Founder and CEO. Returns from startup investments typically come from an acquisition, IPO, or secondary sale.</p>
        </div>
      ),
    },
    {
      question: "How do I invest?",
      answer: (
        <div className="space-y-4">
          <p>
            Click{" "}
            <button
              className="cursor-pointer underline"
              onClick={onInvest}
              type="button"
            >
              here
            </button>{" "}
            to submit your deposit through Stripe. We'll follow up to schedule a 20 minute call and if approved (bidrectionally), send you a SAFE agreement and the necessary paperwork.
          </p>
          <p style={{ paddingTop: 24 }}>
            If not mutually approved, we'll refund you immediately.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div
      className="mx-auto w-full max-w-[860px]"
      style={{
        paddingLeft: isMobile ? "16px" : "0px",
        paddingRight: isMobile ? "16px" : "0px",
      }}
    >
      {faqs.map((faq, index) => {
        const panelId = `panel-${index}`;

        return (
          <FAQItem
            key={faq.question}
            answer={faq.answer}
            expanded={expandedPanel === panelId}
            id={panelId}
            isFirst={index === 0}
            isLast={index === faqs.length - 1}
            onChange={() =>
              setExpandedPanel(expandedPanel === panelId ? false : panelId)
            }
            question={faq.question}
          />
        );
      })}

      <div
        className="flex justify-center"
        style={{
          paddingTop: "64px",
          paddingBottom: "64px",
        }}
      >
        <img
          alt="Punctuation mark"
          className="h-auto w-[72px] md:w-[108px]"
          src="/assets/punct.png"
        />
      </div>

      <Countdown />
    </div>
  );
}
