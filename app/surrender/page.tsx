import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Surrender",
};

const OPENING = [
  "Feels like an election.",
  "Man’s quest for meaning.",
  "One woman’s final attempt.",
  "The invisible wall.",
];
const OPENING_LAST = "Surrender.";

const FAVORITES_LEAD = "My favorite parts were.";
const FAVORITES = ["Early Caleb, Amy", "Nicole & Grace"];

const BODY = [
  [
    "And seeing stuff come to life. Without red tape. Or permission.",
    "Finding answers to good questions, rooted in your own agency.",
  ],
  [
    "There was also a lot left on the table. Had to be very economical; the worst parts were the Disrespect. An infinity spiral into the narrowing depths of hell.",
  ],
  ["I know what this was."],
  ["Value."],
];

const DATE_ISO = "2026-11-23";
const DATE_LABEL = "November 23, 2026";

export default function SurrenderPage() {
  return (
    <main
      className="flex min-h-screen flex-col bg-black px-6 py-16 text-white"
      style={{ minHeight: "100dvh" }}
    >
      <div className="mx-auto flex w-full max-w-[672px] flex-1 flex-col justify-center">
        <h1
          className="font-semibold"
          style={{
            fontSize: "clamp(28px, 6.4vw, 48px)",
            lineHeight: 1.16,
            letterSpacing: "-0.03em",
          }}
        >
          {OPENING.map((line) => (
            <span key={line} className="block text-white/55">
              {line}
            </span>
          ))}
          <span className="block text-white">{OPENING_LAST}</span>
        </h1>

        <div
          className="mt-12 text-[15px] leading-[1.82] text-white/80 sm:text-[17px] sm:leading-[1.9]"
          style={{ letterSpacing: "-0.015em" }}
        >
          <p>{FAVORITES_LEAD}</p>
          <ul className="list-disc pl-6">
            {FAVORITES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          {BODY.map((lines) => (
            <p key={lines[0]} style={{ marginTop: 24 }}>
              {lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-end">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/signature-exact.png"
            alt="Nicole's signature"
            className="h-auto w-[84px]"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <time
            dateTime={DATE_ISO}
            className="mt-1 text-[11px] tracking-[0.08em] text-white/40"
          >
            {DATE_LABEL}
          </time>
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="text-sm text-white/50 underline underline-offset-4"
          >
            Return to Jury
          </Link>
        </div>
      </div>
    </main>
  );
}
