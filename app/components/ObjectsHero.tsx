"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import FAQAccordion from "./FAQAccordion";
import SignatureDraw from "./SignatureDraw";

const OBJECTS_EXIT_PROGRESS = 0.145;
const CLIP_START_PROGRESS = 0.08;
const LOGO_FADE_DURATION = 1 - OBJECTS_EXIT_PROGRESS;
const FALLBACK_LOGO_DURATION = 4;
const OBJECTS_FADE_START = 0.055;
const MAX_HERO_PROGRESS = 1.46;
const TEXT_BLOCK_GAP = 24;
const MOBILE_TEXT_LIFT = 760;
const DESKTOP_TEXT_LIFT = 980;
const MOBILE_SIGNATURE_DRAW_RANGE = 140;
const DESKTOP_SIGNATURE_DRAW_RANGE = 180;
const CONTENT_BLACKOUT_START = 1.16;
const CONTENT_BLACKOUT_END = 1.28;
const FAQ_ENTRY_START = 1.3;
const FAQ_ENTRY_END = 1.46;
const FAQ_GAP = 56;
const FAQ_INITIAL_OFFSET_MOBILE = 360;
const FAQ_INITIAL_OFFSET_DESKTOP = 420;
const TEXT_INITIAL_OFFSET_MOBILE = 280;
const TEXT_INITIAL_OFFSET_DESKTOP = 340;

const FIRST_HEADING_START = 0.78;
const FIRST_HEADING_END = 0.9;
const FIRST_TEXT_ENTRY_START = 0.88;
const FIRST_TEXT_ENTRY_END = 0.98;
const FIRST_TEXT_SCROLL_START = 0.98;
const FIRST_TEXT_SCROLL_END = 1.16;
const SECOND_HEADING_FADE_IN_START = 1.28;
const SECOND_HEADING_FADE_IN_END = 1.36;


const COMMUNITY_FUND_COPY = [
  "Social media became a content business and culture outgrew dating apps. Public and legal opinion of today's connection tools are at historic lows. The Jury has like, literally, spoken.",
  "Now imagine everyone on Match, Bumble, Grindr and Her invited 3 of their closest friends to join. Imagine everyone frustrated with social media and big tech had a healthy and fun alternative they could trust. Imagine your wallflower friends had something to do on their phone other than lurk. Imagine a social network without ads.",
  "That's Jury. Your friends build your profile and swipe for you. The outcome of this Social Intelligence gets people outside with our signed event partners. If you're dating, meet your match in person. No in-app chat. If it's awkward IRL, that's fine. You're still outside having a good time with friends.",
  "We validated a 2.5x organic viral coefficient out the gate with $0 paid acquisition. After a year of designing with local partners and another bigger investment in quality UX, brand, and motion design, we've proven immediate velocity on iOS.",
  "My goal was to reach 3 years bootstrapped, but I've encountered unexpected ongoing legal and security costs, sudden changes with aging dependents, and recently a small car accident. So it's now or never for me and Jury. This is it.",
  "I've intentionally limited investor outreach to select and elite partners. This is not spray and pray. This is not accelerator material. This is outside system, kinda-punk, for-the-culture entrepreneurship. The floor is iconic and the ceiling doesn't exist.",
];

type ObjectKey =
  | "Status"
  | "Games"
  | "Lighter"
  | "BigPill"
  | "Edible"
  | "SmallPills"
  | "Narcissism"
  | "Toys"
  | "Love";

type MobilePose = {
  x: number;
  y: number;
  rotate: number;
  scale: number;
};

type MobileObjectConfig = {
  key: ObjectKey;
  src: string;
  alt: string;
  width: string;
  zIndex: number;
  start: MobilePose;
  mid: MobilePose;
  end: MobilePose;
};

type DesktopPose = {
  left: number;
  top: number;
  width: number;
  height: number;
  rotate: number;
};

type DesktopObjectConfig = {
  key: ObjectKey;
  src: string;
  alt: string;
  zIndex: number;
  backgroundSize: "contain" | "cover";
  start: DesktopPose;
  mid: DesktopPose;
  end: DesktopPose;
  flipY?: boolean;
};

const DESKTOP_SCENE_WIDTH = 1728;
const DESKTOP_SCENE_HEIGHT = 982;

const DESKTOP_OBJECTS: DesktopObjectConfig[] = [
  {
    key: "Status",
    src: "/assets/sinners/Status.png",
    alt: "Black card",
    zIndex: 3,
    backgroundSize: "cover",
    start: { left: -188, top: 230, width: 702, height: 788.4, rotate: 327 },
    mid: { left: -795, top: -117, width: 976, height: 882, rotate: 273.862 },
    end: { left: -1500, top: -500, width: 976, height: 882, rotate: 273.862 },
  },
  {
    key: "Love",
    src: "/assets/sinners/Love.png",
    alt: "Burgundy curved vibrator",
    zIndex: 5,
    backgroundSize: "contain",
    start: { left: 980, top: 250, width: 1283.1, height: 1064.7, rotate: 14 },
    mid: { left: 1496, top: 1251, width: 1259.13, height: 1042.85, rotate: 21.121 },
    end: { left: 2500, top: 1800, width: 1259.13, height: 1042.85, rotate: 21.121 },
  },
  {
    key: "Narcissism",
    src: "/assets/sinners/Narcissism.png",
    alt: "Kodak disposable camera",
    zIndex: 2,
    backgroundSize: "contain",
    start: { left: -110, top: 228, width: 1008, height: 1112.4, rotate: 337 },
    mid: { left: -1338, top: -41, width: 1651.51, height: 1822.68, rotate: 226.701 },
    end: { left: -2000, top: 200, width: 1651.51, height: 1822.68, rotate: 226.701 },
  },
  {
    key: "Toys",
    src: "/assets/sinners/Toys.png",
    alt: "Orange device",
    zIndex: 4,
    backgroundSize: "contain",
    start: { left: 760, top: 160, width: 780, height: 774, rotate: 193 },
    mid: { left: 33, top: 1271, width: 582.188, height: 577.939, rotate: 15.76 },
    end: { left: -500, top: 1800, width: 582.188, height: 577.939, rotate: 15.76 },
  },
  {
    key: "Games",
    src: "/assets/sinners/Games.png",
    alt: "Blue yo-yo",
    zIndex: 4,
    backgroundSize: "cover",
    flipY: true,
    start: { left: 248, top: 8, width: 453, height: 453, rotate: 180 },
    mid: { left: -618, top: -649, width: 857, height: 472, rotate: 6.067 },
    end: { left: -1200, top: -1200, width: 857, height: 472, rotate: 6.067 },
  },
  {
    key: "Lighter",
    src: "/assets/sinners/Lighter.png",
    alt: "Red lighter",
    zIndex: 5,
    backgroundSize: "contain",
    start: { left: 1112, top: 90, width: 236, height: 242, rotate: 348 },
    mid: { left: 1066, top: -535, width: 357.276, height: 367.756, rotate: 285.531 },
    end: { left: 1800, top: -1200, width: 357.276, height: 367.756, rotate: 285.531 },
  },
  {
    key: "Edible",
    src: "/assets/sinners/Edible.png",
    alt: "Glittery black sponge",
    zIndex: 4,
    backgroundSize: "contain",
    start: { left: 1458, top: 268, width: 184, height: 136, rotate: 328 },
    mid: { left: 2053, top: 307, width: 276.589, height: 205.943, rotate: 267.318 },
    end: { left: 3000, top: 800, width: 276.589, height: 205.943, rotate: 267.318 },
  },
  {
    key: "BigPill",
    src: "/assets/sinners/BigPill.png",
    alt: "Round white tablet",
    zIndex: 3,
    backgroundSize: "contain",
    start: { left: 1350, top: 92, width: 110, height: 110, rotate: 0 },
    mid: { left: 1853, top: -407, width: 137.338, height: 137.696, rotate: 331.052 },
    end: { left: 2500, top: -1000, width: 137.338, height: 137.696, rotate: 331.052 },
  },
  {
    key: "SmallPills",
    src: "/assets/sinners/SmallPills.png",
    alt: "Two blue pills",
    zIndex: 6,
    backgroundSize: "contain",
    start: { left: 1592, top: 96, width: 190, height: 284, rotate: 0 },
    mid: { left: 3099, top: -1042, width: 94.651, height: 94.651, rotate: 351.586 },
    end: { left: 4000, top: -1500, width: 94.651, height: 94.651, rotate: 351.586 },
  },
];

const MOBILE_OBJECTS: MobileObjectConfig[] = [
  {
    key: "Status",
    src: "/assets/sinners/Status.png",
    alt: "Black card",
    width: "clamp(600px, 152vw, 840px)",
    zIndex: 3,
    start: { x: 69, y: 42, rotate: 70, scale: 1 },
    mid: { x: 128, y: 36, rotate: 64, scale: 1 },
    end: { x: 148, y: 28, rotate: 56, scale: 0.97 },
  },
  {
    key: "Games",
    src: "/assets/sinners/Toys.png",
    alt: "Orange device",
    width: "clamp(312px, 78vw, 436px)",
    zIndex: 4,
    start: { x: 20, y: 80, rotate: 45, scale: 1 },
    mid: { x: 10, y: 86, rotate: 45, scale: 1 },
    end: { x: 4, y: 94, rotate: 24, scale: 0.95 },
  },
  {
    key: "Lighter",
    src: "/assets/sinners/Lighter.png",
    alt: "Red lighter",
    width: "clamp(145px, 32vw, 207px)",
    zIndex: 5,
    start: { x: 18, y: 16, rotate: 8, scale: 1 },
    mid: { x: 10, y: 6, rotate: 13, scale: 1 },
    end: { x: 84, y: -8, rotate: 24, scale: 0.95 },
  },
  {
    key: "BigPill",
    src: "/assets/sinners/BigPill.png",
    alt: "Round white tablet",
    width: "clamp(84px, 18vw, 118px)",
    zIndex: 3,
    start: { x: 85.8, y: 62, rotate: -6, scale: 1 },
    mid: { x: 84, y: 60, rotate: -3, scale: 0.99 },
    end: { x: 98, y: -2, rotate: 2, scale: 0.95 },
  },
  {
    key: "Edible",
    src: "/assets/sinners/Edible.png",
    alt: "Glittery black sponge",
    width: "clamp(124px, 27.6vw, 168px)",
    zIndex: 4,
    start: { x: 56, y: 18, rotate: 31, scale: 1 },
    mid: { x: 60, y: 10, rotate: 35, scale: 1 },
    end: { x: 95, y: 16, rotate: 37, scale: 0.96 },
  },
  {
    key: "SmallPills",
    src: "/assets/sinners/SmallPills.png",
    alt: "Two blue pills",
    width: "clamp(138px, 30vw, 204px)",
    zIndex: 6,
    start: { x: 78.5, y: 22, rotate: 10, scale: 1 },
    mid: { x: 98, y: 2, rotate: 10, scale: 0.98 },
    end: { x: 100, y: -1, rotate: 10, scale: 0.95 },
  },
  {
    key: "Narcissism",
    src: "/assets/sinners/Narcissism.png",
    alt: "Kodak disposable camera",
    width: "clamp(780px, 198vw, 1140px)",
    zIndex: 2,
    start: { x: 0, y: 50, rotate: -18, scale: 1 },
    mid: { x: -10, y: 56, rotate: -10, scale: 1 },
    end: { x: -20, y: 88, rotate: -7, scale: 0.96 },
  },
  {
    key: "Toys",
    src: "/assets/sinners/Toys.png",
    alt: "Orange device",
    width: "clamp(180px, 42vw, 240px)",
    zIndex: 4,
    start: { x: -40, y: 122, rotate: 14, scale: 0 },
    mid: { x: -28, y: 108, rotate: 18, scale: 0 },
    end: { x: -18, y: 96, rotate: 22, scale: 0 },
  },
  {
    key: "Love",
    src: "/assets/sinners/Love.png",
    alt: "Burgundy curved vibrator",
    width: "clamp(480px, 124vw, 720px)",
    zIndex: 5,
    start: { x: 82, y: 82, rotate: -60, scale: 1 },
    mid: { x: 96, y: 88, rotate: -60, scale: 1 },
    end: { x: 112, y: 84, rotate: -60, scale: 0.96 },
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function mixMobilePose(from: MobilePose, to: MobilePose, t: number): MobilePose {
  return {
    x: lerp(from.x, to.x, t),
    y: lerp(from.y, to.y, t),
    rotate: lerp(from.rotate, to.rotate, t),
    scale: lerp(from.scale, to.scale, t),
  };
}

function mixDesktopPose(from: DesktopPose, to: DesktopPose, t: number): DesktopPose {
  return {
    left: lerp(from.left, to.left, t),
    top: lerp(from.top, to.top, t),
    width: lerp(from.width, to.width, t),
    height: lerp(from.height, to.height, t),
    rotate: lerp(from.rotate, to.rotate, t),
  };
}

function getMobilePose(config: MobileObjectConfig, progress: number) {
  if (progress <= 0.55) {
    return mixMobilePose(
      config.start,
      config.mid,
      easeInOutCubic(progress / 0.55)
    );
  }

  return mixMobilePose(
    config.mid,
    config.end,
    easeInOutCubic((progress - 0.55) / 0.45)
  );
}

function getDesktopPose(config: DesktopObjectConfig, progress: number) {
  if (progress <= 0.5) {
    return mixDesktopPose(config.start, config.mid, easeInOutCubic(progress / 0.5));
  }

  return mixDesktopPose(
    config.mid,
    config.end,
    easeInOutCubic((progress - 0.5) / 0.5)
  );
}

function getSequenceState(
  progress: number,
  isMobile: boolean,
  headingStart: number,
  headingEnd: number,
  textEntryStart: number,
  textEntryEnd: number,
  textScrollStart: number,
  textScrollEnd: number
) {
  const headingOpacity = clamp(
    (progress - headingStart) / (headingEnd - headingStart),
    0,
    1
  );
  const textEntryProgress = clamp(
    (progress - textEntryStart) / (textEntryEnd - textEntryStart),
    0,
    1
  );
  const textScrollProgress = clamp(
    (progress - textScrollStart) / (textScrollEnd - textScrollStart),
    0,
    1
  );
  const textLift =
    (isMobile ? MOBILE_TEXT_LIFT : DESKTOP_TEXT_LIFT) * textScrollProgress;
  const headingTranslateY = -textLift;
  const textTranslateY =
    (1 - textEntryProgress) *
      (isMobile ? TEXT_INITIAL_OFFSET_MOBILE : TEXT_INITIAL_OFFSET_DESKTOP) -
    textLift;

  return {
    headingOpacity,
    headingTranslateY,
    textEntryProgress,
    textTranslateY,
  };
}

export default function ObjectsHero({ onInvest }: { onInvest: () => void }) {
  const [progress, setProgress] = useState(0);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [logoDuration, setLogoDuration] = useState(FALLBACK_LOGO_DURATION);
  const [firstSignatureProgress, setFirstSignatureProgress] = useState(0);
  const [secondHeadingHeight, setSecondHeadingHeight] = useState(0);
  const progressRef = useRef(0);
  const touchYRef = useRef<number | null>(null);
  const logoVideoRef = useRef<HTMLVideoElement>(null);
  const firstBodyCopyRef = useRef<HTMLDivElement>(null);
  const secondHeadingRef = useRef<HTMLHeadingElement>(null);
  const finalStageScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");

    const handleViewportChange = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setIsMobile(media.matches);
    };

    handleViewportChange();
    media.addEventListener("change", handleViewportChange);
    window.addEventListener("resize", handleViewportChange);

    return () => {
      media.removeEventListener("change", handleViewportChange);
      window.removeEventListener("resize", handleViewportChange);
    };
  }, []);

  useEffect(() => {
    const updateProgress = (delta: number) => {
      const next = clamp(progressRef.current + delta, 0, MAX_HERO_PROGRESS);
      progressRef.current = next;
      setProgress(next);
    };

    const atTop = () => window.scrollY <= 0;
    const finalStageAtTop = () =>
      (finalStageScrollRef.current?.scrollTop ?? 0) <= 0;
    const shouldReverseHero = (deltaY: number) =>
      progressRef.current > 0 && atTop() && finalStageAtTop() && deltaY < 0;

    const handleWheel = (event: WheelEvent) => {
      if (progressRef.current < MAX_HERO_PROGRESS || shouldReverseHero(event.deltaY)) {
        event.preventDefault();
        updateProgress(event.deltaY / 2200);
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY;
      if (currentY == null || touchYRef.current == null) return;

      const delta = touchYRef.current - currentY;
      const shouldControlHero =
        progressRef.current < MAX_HERO_PROGRESS ||
        (progressRef.current > 0 && atTop() && finalStageAtTop() && delta < 0);

      if (!shouldControlHero) {
        touchYRef.current = currentY;
        return;
      }

      event.preventDefault();
      touchYRef.current = currentY;
      updateProgress(delta / 900);
    };

    const handleTouchEnd = () => {
      touchYRef.current = null;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    const shouldLock = progress < MAX_HERO_PROGRESS;
    document.documentElement.style.overflow = shouldLock ? "hidden" : "";
    document.body.style.overflow = shouldLock ? "hidden" : "";
    document.body.style.overscrollBehavior = shouldLock ? "none" : "";

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.overscrollBehavior = "";
    };
  }, [progress]);

  useEffect(() => {
    const video = logoVideoRef.current;
    if (!video) return;
    if (video.readyState === 0) return;
    const targetFadeProgress = clamp(
      (progress - CLIP_START_PROGRESS) / (1 - CLIP_START_PROGRESS),
      0,
      1
    );
    const targetTime = targetFadeProgress * logoDuration;

    if (Math.abs(video.currentTime - targetTime) > 0.033) {
      video.currentTime = targetTime;
    }
  }, [logoDuration, progress]);

  const mobileObjects = useMemo(() => MOBILE_OBJECTS, []);
  const sceneProgress = clamp(progress / OBJECTS_EXIT_PROGRESS, 0, 1);
  const fadeProgress = clamp(
    (progress - CLIP_START_PROGRESS) / (1 - CLIP_START_PROGRESS),
    0,
    1
  );
  const objectOpacity =
    1 -
    clamp(
      (progress - OBJECTS_FADE_START) /
        (OBJECTS_EXIT_PROGRESS - OBJECTS_FADE_START),
      0,
      1
    );
  const whiteOpacity = 1 - clamp(fadeProgress / 0.4, 0, 1);
  const darkOverlayOpacity = clamp(fadeProgress / 0.4, 0, 1);
  const heroOpacity = 1;
  const logoOpacity =
    clamp(fadeProgress / 0.08, 0, 1) *
    (1 - clamp((fadeProgress - 0.72) / 0.14, 0, 1));
  const logoGlowStrength = clamp(fadeProgress * 1.6, 0, 1);
  const firstSequence = getSequenceState(
    progress,
    isMobile,
    FIRST_HEADING_START,
    FIRST_HEADING_END,
    FIRST_TEXT_ENTRY_START,
    FIRST_TEXT_ENTRY_END,
    FIRST_TEXT_SCROLL_START,
    FIRST_TEXT_SCROLL_END
  );
  const desktopScale =
    viewport.width && viewport.height
      ? Math.min(
          viewport.width / DESKTOP_SCENE_WIDTH,
          viewport.height / DESKTOP_SCENE_HEIGHT
        )
      : 1;
  const faqEntryProgress = clamp(
    (progress - FAQ_ENTRY_START) / (FAQ_ENTRY_END - FAQ_ENTRY_START),
    0,
    1
  );
  const contentBlackoutProgress = clamp(
    (progress - CONTENT_BLACKOUT_START) /
      (CONTENT_BLACKOUT_END - CONTENT_BLACKOUT_START),
    0,
    1
  );
  const contentOpacity = 1 - contentBlackoutProgress;
  const secondHeadingOpacity =
    clamp(
      (progress - SECOND_HEADING_FADE_IN_START) /
        (SECOND_HEADING_FADE_IN_END - SECOND_HEADING_FADE_IN_START),
      0,
      1
    );
  const secondHeadingTranslateY =
    (1 -
      clamp(
        (progress - SECOND_HEADING_FADE_IN_START) /
          (SECOND_HEADING_FADE_IN_END - SECOND_HEADING_FADE_IN_START),
        0,
        1
      )) *
    28;
  const bodyStackTranslateY = firstSequence.textTranslateY;
  const faqTranslateY =
    (1 - faqEntryProgress) *
    (isMobile ? FAQ_INITIAL_OFFSET_MOBILE : FAQ_INITIAL_OFFSET_DESKTOP);

  useEffect(() => {
    const bodyCopy = firstBodyCopyRef.current;
    if (!bodyCopy || viewport.height === 0) return;

    const rect = bodyCopy.getBoundingClientRect();
    const triggerY = viewport.height * 0.5;
    const drawRange = isMobile
      ? MOBILE_SIGNATURE_DRAW_RANGE
      : DESKTOP_SIGNATURE_DRAW_RANGE;
    const nextProgress = clamp((triggerY - rect.bottom) / drawRange, 0, 1);
    setFirstSignatureProgress(nextProgress);
  }, [firstSequence.textEntryProgress, firstSequence.textTranslateY, isMobile, viewport.height]);

  useEffect(() => {
    const heading = secondHeadingRef.current;
    if (!heading) return;

    const updateHeight = () => {
      setSecondHeadingHeight(heading.getBoundingClientRect().height);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(heading);

    return () => {
      observer.disconnect();
    };
  }, [isMobile, viewport.width]);

  useEffect(() => {
    if (progress < FAQ_ENTRY_END && finalStageScrollRef.current) {
      finalStageScrollRef.current.scrollTop = 0;
    }
  }, [progress]);

  return (
    <section
      className="fixed inset-0 z-20 overflow-hidden"
      style={{
        opacity: heroOpacity,
        pointerEvents: progress > 0 ? "auto" : "none",
      }}
    >
      <div className="absolute inset-0 overflow-hidden bg-[#232323]">
        <div
          className="absolute inset-0 z-0"
          style={{ background: "#f2e6c9", opacity: whiteOpacity }}
        />
        <div
          className="absolute inset-0 z-0"
          style={{ background: "#232323", opacity: darkOverlayOpacity }}
        />
        <div
          className="absolute inset-0 z-10"
          style={{ background: "#000", opacity: contentBlackoutProgress }}
        />

        <div
          className="absolute inset-0 z-10 overflow-hidden"
          style={{ opacity: objectOpacity }}
        >
          {isMobile ? (
            mobileObjects.map((object) => {
              const pose = getMobilePose(object, sceneProgress);

              return (
                <img
                  key={object.key}
                  src={object.src}
                  alt={object.alt}
                  className="absolute h-auto max-w-none select-none pointer-events-none"
                  draggable={false}
                  style={{
                    left: `${pose.x}%`,
                    top: `${pose.y}%`,
                    width: object.width,
                    zIndex: object.zIndex,
                    transform: `translate(-50%, -50%) rotate(${pose.rotate}deg) scale(${pose.scale})`,
                    filter: "drop-shadow(0 12px 28px rgba(0, 0, 0, 0.15))",
                  }}
                />
              );
            })
          ) : (
            <div
              className="absolute left-1/2 top-1/2"
              style={{
                width: DESKTOP_SCENE_WIDTH,
                height: DESKTOP_SCENE_HEIGHT,
                transform: `translate(-50%, -50%) scale(${desktopScale})`,
                transformOrigin: "center center",
              }}
            >
              {DESKTOP_OBJECTS.map((object) => {
                const pose = getDesktopPose(object, sceneProgress);
                const transforms = [`rotate(${pose.rotate}deg)`];

                if (object.flipY) {
                  transforms.push("scaleY(-1)");
                }

                return (
                  <div
                    key={object.key}
                    className="absolute pointer-events-none select-none"
                    style={{
                      left: pose.left,
                      top: pose.top,
                      width: pose.width,
                      height: pose.height,
                      zIndex: object.zIndex,
                      transform: transforms.join(" "),
                      transformOrigin: "center center",
                      backgroundImage: `url('${object.src}')`,
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: object.backgroundSize,
                      filter: "drop-shadow(0 18px 40px rgba(0, 0, 0, 0.16))",
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div
          className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
          style={{ opacity: logoOpacity }}
        >
          <video
            ref={logoVideoRef}
            className="h-auto w-full max-w-[min(82vw,1200px)]"
            src="/assets/logo-clips/gothic-wordmark-alpha.mov"
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            style={{
              filter:
                `brightness(${1 + logoGlowStrength * 0.42}) contrast(${1 +
                  logoGlowStrength * 0.18}) saturate(${1 +
                  logoGlowStrength * 0.32}) drop-shadow(0 0 ${26 +
                  logoGlowStrength * 54}px rgba(255, 250, 235, ${0.38 +
                  logoGlowStrength * 0.38})) drop-shadow(0 0 ${64 +
                  logoGlowStrength * 76}px rgba(255, 244, 214, ${0.24 +
                  logoGlowStrength * 0.3})) drop-shadow(0 0 ${120 +
                  logoGlowStrength * 110}px rgba(255, 214, 140, ${0.1 +
                  logoGlowStrength * 0.22}))`,
            }}
            onLoadedMetadata={(event) => {
              const duration = event.currentTarget.duration;
              if (Number.isFinite(duration) && duration > 0) {
                setLogoDuration(duration);
              }
            }}
          />
        </div>

        <div
          className="absolute inset-0 z-30 flex items-center justify-center px-4 text-center pointer-events-none"
          style={{
            opacity: firstSequence.headingOpacity * contentOpacity,
            transform: `translateY(${firstSequence.headingTranslateY}px)`,
          }}
        >
          <h1
            className="max-w-[12ch] text-white"
            style={{
              fontSize: isMobile ? "clamp(2rem, 9vw, 3rem)" : "clamp(3rem, 5.4vw, 5.5rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              fontWeight: 500,
              textWrap: "balance",
            }}
          >
            <span className="block">
              You are <em>exclusively</em> invited to our
            </span>
            <span className="block">Community Fund</span>
          </h1>
        </div>

        <div
          className="absolute left-1/2 z-30 w-full max-w-[672px] px-4 pointer-events-none"
          style={{
            top: isMobile ? "calc(50% + 92px)" : "calc(50% + 126px)",
            opacity: firstSequence.textEntryProgress * contentOpacity,
            transform: `translate(-50%, ${bodyStackTranslateY}px)`,
          }}
        >
          <div
            className="mx-auto text-left text-white/80"
            style={{
              marginTop: `${TEXT_BLOCK_GAP}px`,
              fontSize: isMobile ? "15px" : "17px",
              lineHeight: isMobile ? 1.82 : 1.9,
              letterSpacing: "-0.015em",
            }}
          >
            <div ref={firstBodyCopyRef}>
              {COMMUNITY_FUND_COPY.map((paragraph) => (
                <p
                  key={paragraph}
                  style={{ marginTop: paragraph === COMMUNITY_FUND_COPY[0] ? 0 : 24 }}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div
              className="flex justify-end"
              style={{ marginTop: 0 }}
            >
              <SignatureDraw
                className="h-auto w-[105px] md:w-[184px]"
                progress={firstSignatureProgress}
              />
            </div>
          </div>
        </div>

        <div
          ref={finalStageScrollRef}
          className="absolute inset-0 z-40 overflow-y-auto"
          style={{
            pointerEvents: faqEntryProgress > 0.98 ? "auto" : "none",
          }}
        >
          <div
            className="relative left-1/2 w-full max-w-[704px] -translate-x-1/2 px-4"
            style={{
              minHeight: "100dvh",
              paddingTop: `${Math.max(viewport.height / 2 - secondHeadingHeight / 2, 0)}px`,
              paddingBottom: "56px",
            }}
          >
            <div
              className="flex justify-center text-center"
              style={{
                opacity: secondHeadingOpacity,
                transform: `translateY(${secondHeadingTranslateY}px)`,
              }}
            >
              <h2
                ref={secondHeadingRef}
                className="mx-auto max-w-[12ch] text-white"
                style={{
                  fontSize: isMobile
                    ? "clamp(2.1rem, 10vw, 3.25rem)"
                    : "clamp(3.2rem, 6vw, 5.75rem)",
                  lineHeight: 0.96,
                  letterSpacing: "-0.045em",
                  fontWeight: 500,
                  textAlign: "center",
                  textWrap: "balance",
                }}
              >
                Thank you for your service
              </h2>
            </div>

            <div
              className="mx-auto w-full max-w-[672px]"
              style={{
                marginTop: "42px",
                opacity: faqEntryProgress,
                transform: `translateY(${faqTranslateY}px)`,
              }}
            >
              <FAQAccordion onInvest={onInvest} />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
