import localFont from "next/font/local";

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
 * A line of text with a post-it note of questions attached to it.
 *
 * - Wide screens (xl and up): the post-it sits beside the line, in the
 *   right margin. It is positioned against the nearest `relative` ancestor,
 *   which should be the full-width line itself.
 * - Narrower screens have no margin, so the post-it sits beneath the line.
 */
export default function GoodQuestions({
  before,
  label,
  after,
  questions,
}: GoodQuestionsProps) {
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
      className="post-it relative block w-[214px]"
      style={{
        isolation: "isolate",
        transformOrigin: "50% 0%",
        transform: `rotate(${tilt}deg)`,
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
      <span className="squiggle-phrase relative inline-block whitespace-nowrap text-white">
        {label}
        {/* Hand-drawn squiggle under the phrase; it ripples on hover or tap. */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-0 w-full"
          style={{ bottom: "-0.02em", height: "0.42em", overflow: "hidden" }}
          viewBox="0 -1 108 10"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            className="squiggle-wave"
            d="M-54 1.7 C-47.5 1.7 -47.5 7 -41 7 C-33.75 7 -33.75 1.2 -26.5 1.2 C-20.25 1.2 -20.25 7.4 -14 7.4 C-7 7.4 -7 1.7 0 1.7 C6.5 1.7 6.5 7 13 7 C20.25 7 20.25 1.2 27.5 1.2 C33.75 1.2 33.75 7.4 40 7.4 C47 7.4 47 1.7 54 1.7 C60.5 1.7 60.5 7 67 7 C74.25 7 74.25 1.2 81.5 1.2 C87.75 1.2 87.75 7.4 94 7.4 C101 7.4 101 1.7 108 1.7 C114.5 1.7 114.5 7 121 7 C128.25 7 128.25 1.2 135.5 1.2 C141.75 1.2 141.75 7.4 148 7.4 C155 7.4 155 1.7 162 1.7"
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </span>
      {after}

      {/* Wide screens: post-it stuck in the right margin, beside the line. */}
      <span
        className="post-it-slot pointer-events-none absolute left-full top-1/2 hidden xl:block"
        style={{ marginLeft: 44, translate: "0 -42%" }}
      >
        {postIt(2.5)}
      </span>

      {/* Narrower screens: post-it sits beneath the line. */}
      <span className="post-it-slot block xl:hidden" style={{ padding: "28px 12px 4px" }}>
        {postIt(-1.5)}
      </span>
    </>
  );
}
