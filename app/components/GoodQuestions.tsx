"use client";

import localFont from "next/font/local";
import { useEffect, useRef, useState } from "react";

const handwriting = localFont({
  src: "../fonts/classic-fairy.otf",
  display: "swap",
});

// Fine paper grain, generated in SVG so there is no image to load.
const PAPER_GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' seed='7'/%3E%3CfeColorMatrix values='0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0 0.08  0 0 0 0.55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
// Larger, softer blotches: uneven ageing and handling marks.
const PAPER_MOTTLE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='m'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.012' numOctaves='2' seed='3'/%3E%3CfeColorMatrix values='0 0 0 0 0.35  0 0 0 0 0.24  0 0 0 0 0.05  0 0 0 0.9 -0.28'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23m)'/%3E%3C/svg%3E\")";

type GoodQuestionsProps = {
  /** Text of the line before and after the phrase. */
  before: string;
  label: string;
  after: string;
  questions: string[];
};

/**
 * A line of text containing a phrase that reveals a note of questions on hover (mouse), tap
 * (touch) or focus (keyboard).
 *
 * - Wide screens (xl and up): the note appears as a post-it beside the
 *   line, in the right margin. It is positioned against the nearest `relative` ancestor,
 *   which should be the full-width line the phrase sits in.
 * - Narrower screens have no margin, so the post-it unfolds beneath the line.
 */
export default function GoodQuestions({
  before,
  label,
  after,
  questions,
}: GoodQuestionsProps) {
  const [open, setOpen] = useState(false);
  const lastPointerType = useRef<string>("mouse");

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const note = questions.map((question, index) => (
    <span
      key={question}
      className="block"
      style={{ marginTop: index === 0 ? 0 : 10 }}
    >
      {question}
    </span>
  ));

  // The post-it itself. `tilt` is its resting angle in degrees.
  const postIt = (tilt: number) => (
    <span
      className="relative block w-[214px]"
      style={{
        isolation: "isolate",
        transformOrigin: "50% 0%",
        transform: open
          ? `rotate(${tilt}deg) scale(1)`
          : `rotate(${tilt - 4}deg) scale(0.96)`,
        transition: "transform 360ms cubic-bezier(0.2, 0.8, 0.3, 1)",
      }}
    >
      {/* Shadow: tight under the stuck top edge, loose where the paper lifts. */}
      <span
        aria-hidden="true"
        className="absolute block"
        style={{
          zIndex: -1,
          left: 10,
          right: 6,
          top: 30,
          bottom: -7,
          background: "rgba(0, 0, 0, 0.85)",
          filter: "blur(11px)",
          transform: "skewX(-2.5deg) rotate(1.2deg)",
          transformOrigin: "50% 0%",
        }}
      />
      {/* Paper */}
      <span
        className={`${handwriting.className} relative block`}
        style={{
          padding: "30px 20px 30px 22px",
          minHeight: 208,
          fontSize: 25,
          lineHeight: 1.2,
          letterSpacing: 0,
          color: "rgba(24, 30, 54, 0.9)",
          backgroundColor: "#e2d283",
          backgroundImage: [
            // adhesive strip: paper sits flatter and slightly darker up top
            "linear-gradient(180deg, rgba(92, 70, 14, 0.2) 0px, rgba(92, 70, 14, 0.05) 26px, rgba(92, 70, 14, 0) 34px)",
            // light falls from the upper left; lower right curls into shade
            "linear-gradient(128deg, rgba(255, 250, 214, 0.42) 0%, rgba(255, 250, 214, 0) 42%, rgba(70, 50, 8, 0.24) 100%)",
            // faint crease left by peeling it off the pad
            "linear-gradient(176deg, rgba(0, 0, 0, 0) 61%, rgba(70, 50, 8, 0.1) 62%, rgba(255, 250, 220, 0.14) 63.2%, rgba(0, 0, 0, 0) 64.5%)",
            PAPER_MOTTLE,
            PAPER_GRAIN,
          ].join(", "),
          boxShadow:
            "inset 0 0 22px rgba(84, 62, 12, 0.22), inset 0 -1px 0 rgba(60, 44, 8, 0.35), inset 1px 0 0 rgba(255, 250, 220, 0.12)",
          // bottom edge bows slightly, as paper does when it lifts off the wall
          clipPath:
            "polygon(0 0, 100% 0.4%, 99.5% 97.2%, 72% 99.3%, 38% 100%, 0.6% 98.6%)",
        }}
      >
        {note}
      </span>
    </span>
  );

  return (
    <>
      {before}
      <button
        type="button"
        aria-expanded={open}
        onPointerDown={(event) => {
          lastPointerType.current = event.pointerType;
        }}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") setOpen(true);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") setOpen(false);
        }}
        onFocus={() => {
          // Touch focus is followed by a click, which does the toggling.
          if (lastPointerType.current === "mouse") setOpen(true);
        }}
        onBlur={() => {
          if (lastPointerType.current === "mouse") setOpen(false);
        }}
        onClick={() =>
          setOpen((current) =>
            lastPointerType.current === "mouse" ? true : !current
          )
        }
        className="cursor-help underline decoration-dotted underline-offset-4 outline-none transition-colors duration-200 focus-visible:decoration-solid"
        style={{
          font: "inherit",
          letterSpacing: "inherit",
          background: "none",
          border: 0,
          color: open ? "#fff" : "inherit",
          textDecorationColor: open
            ? "rgba(255, 255, 255, 0.9)"
            : "rgba(255, 255, 255, 0.45)",
        }}
      >
        {label}
      </button>
      {after}

      {/* Wide screens: post-it stuck in the right margin, beside the line. */}
      <span
        className="pointer-events-none absolute left-full top-1/2 hidden xl:block"
        style={{
          marginLeft: 44,
          translate: "0 -42%",
          opacity: open ? 1 : 0,
          transition: "opacity 220ms ease",
        }}
      >
        {postIt(2.5)}
      </span>

      {/* Narrower screens: post-it unfolds beneath the line. */}
      <span
        className="grid xl:hidden"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          opacity: open ? 1 : 0,
          transition: "grid-template-rows 280ms ease, opacity 220ms ease",
        }}
      >
        <span className="block overflow-hidden">
          <span className="block" style={{ padding: "14px 12px 34px" }}>
            {postIt(-1.5)}
          </span>
        </span>
      </span>
    </>
  );
}
