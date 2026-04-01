"use client";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ReactNode, useState } from "react";

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
  return (
    <Accordion
      disableGutters
      elevation={0}
      expanded={expanded}
      onChange={onChange}
      square={false}
      sx={{
        backgroundColor: "#232323",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius: isFirst
          ? "120px 120px 0px 0px"
          : isLast
            ? "0px 0px 120px 120px"
            : "0px",
        boxShadow: "0 24px 64px rgba(0, 0, 0, 0.28)",
        color: "#f6f2e8",
        overflow: "hidden",
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
          px: 3,
          py: 3,
          "& .MuiAccordionSummary-content": {
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
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          color: "rgba(246, 242, 232, 0.82)",
          fontFamily: "inherit",
          fontSize: { xs: "14px", sm: "15px", md: "16px" },
          fontWeight: 500,
          letterSpacing: "-0.02em",
          lineHeight: { xs: 1.8, md: 1.9 },
          px: 3,
          py: 3,
        }}
      >
        {answer}
      </AccordionDetails>
    </Accordion>
  );
}

export default function FAQAccordion({ onInvest }: FAQAccordionProps) {
  const [expandedPanel, setExpandedPanel] = useState<string | false>("panel-0");

  const faqs = [
    {
      question: "What is the Jury Community Fund?",
      answer:
        "The Community Fund is a way for non-wealthy and non-institutional friends (and friends of friends) to invest in Jury as we hard-launch, build and grow. We are opening a single cap table line item via Reg D 506(b) which allows up to 35 non-accredited sophisticated investors (financially literate, risk-aware, and below $250,000 annual income) and unlimited checks from accredited investors.",
    },
    {
      question: "What are the terms?",
      answer: (
        <div className="space-y-4">
          <p>You're investing in Jury App Inc., a Delaware C Corp. Your investment will consolidate into one SPV managed by a singular lead and structured as a SAFE. The minimum investment is $2,500 and the maximum individual investment is $999,999. Currently, we are offering a $12M valuation cap post-money. Future fundraising may dilute your ownership. Expect a fraction of a percentage, which is standard. You will have no voting rights or control over company decisions.</p>
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
      question: "Convincing! How do I invest?",
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
            to submit your payment through Stripe. We'll follow up with a SAFE agreement and the necessary paperwork.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[860px] space-y-8">
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
    </div>
  );
}
