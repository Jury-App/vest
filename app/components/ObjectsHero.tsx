"use client";

import type { CSSProperties, PointerEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import FAQAccordion from "./FAQAccordion";
import SignatureDraw from "./SignatureDraw";
import {
  COMMUNITY_FUND_HEADING,
} from "../content/communityFund";

const OBJECTS_EXIT_PROGRESS = 0.145;
const CLIP_START_PROGRESS = 0.08;
const LOGO_FADE_DURATION = 1 - OBJECTS_EXIT_PROGRESS;
const FALLBACK_LOGO_DURATION = 4;
const OBJECTS_FADE_START = 0.055;
const BASE_MAX_HERO_PROGRESS = 1.46;
const TEXT_BLOCK_GAP = 24;
const MOBILE_TEXT_LIFT = 760;
const DESKTOP_TEXT_LIFT = 980;
const MOBILE_SIGNATURE_DRAW_RANGE = 140;
const DESKTOP_SIGNATURE_DRAW_RANGE = 180;
const BASE_CONTENT_BLACKOUT_START = 1.16;
const BASE_CONTENT_BLACKOUT_END = 1.28;
const BASE_FAQ_ENTRY_START = 1.3;
const BASE_FAQ_ENTRY_END = 1.46;
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
const BASE_FIRST_TEXT_SCROLL_END = 1.16;
const BASE_MOBILE_SIGNATURE_START = 0.99;
const BASE_MOBILE_SIGNATURE_END = 1.13;
const BASE_SECOND_HEADING_FADE_IN_START = 1.28;
const BASE_SECOND_HEADING_FADE_IN_END = 1.36;


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
  textScrollEnd: number,
  textLiftDistance: number
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
  const textLift = textLiftDistance * textScrollProgress;
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
  const [canHoverDesktopObjects, setCanHoverDesktopObjects] = useState(false);
  const [hoveredDesktopObject, setHoveredDesktopObject] = useState<ObjectKey | null>(
    null
  );
  const [logoDuration, setLogoDuration] = useState(FALLBACK_LOGO_DURATION);
  const [firstSignatureProgress, setFirstSignatureProgress] = useState(0);
  const [secondHeadingHeight, setSecondHeadingHeight] = useState(0);
  const [flashlightPosition, setFlashlightPosition] = useState({
    x: 50,
    y: 50,
    active: false,
  });
  const progressRef = useRef(0);
  const touchYRef = useRef<number | null>(null);
  const mobilePeekTimeoutRef = useRef<number | null>(null);
  const logoVideoRef = useRef<HTMLVideoElement>(null);
  const firstBodyCopyRef = useRef<HTMLDivElement>(null);
  const firstContentRef = useRef<HTMLDivElement>(null);
  const secondHeadingRef = useRef<HTMLHeadingElement>(null);
  const finalStageScrollRef = useRef<HTMLDivElement>(null);
  const [firstTextLiftDistance, setFirstTextLiftDistance] = useState(
    DESKTOP_TEXT_LIFT
  );

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const hoverMedia = window.matchMedia("(hover: hover) and (pointer: fine)");

    const handleViewportChange = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setIsMobile(media.matches);
      setCanHoverDesktopObjects(hoverMedia.matches);
    };

    handleViewportChange();
    media.addEventListener("change", handleViewportChange);
    hoverMedia.addEventListener("change", handleViewportChange);
    window.addEventListener("resize", handleViewportChange);

    return () => {
      media.removeEventListener("change", handleViewportChange);
      hoverMedia.removeEventListener("change", handleViewportChange);
      window.removeEventListener("resize", handleViewportChange);
    };
  }, []);

  useEffect(() => {
    if (isMobile || !canHoverDesktopObjects) {
      setHoveredDesktopObject(null);
    }
  }, [canHoverDesktopObjects, isMobile]);

  useEffect(() => {
    const content = firstContentRef.current;
    if (!content || viewport.height === 0) return;

    const updateFirstTextLiftDistance = () => {
      const contentHeight = content.scrollHeight;
      const topOffset =
        viewport.height / 2 + (isMobile ? 92 : 126) + TEXT_BLOCK_GAP;
      const bottomPadding = isMobile ? 32 : 48;
      const visibleHeight = Math.max(
        viewport.height - topOffset - bottomPadding,
        0
      );
      const baseLift = isMobile ? MOBILE_TEXT_LIFT : DESKTOP_TEXT_LIFT;
      const requiredLift = Math.max(contentHeight - visibleHeight, 0);

      setFirstTextLiftDistance(Math.max(baseLift, requiredLift));
    };

    updateFirstTextLiftDistance();

    const observer = new ResizeObserver(updateFirstTextLiftDistance);
    observer.observe(content);

    return () => {
      observer.disconnect();
    };
  }, [isMobile, viewport.height, viewport.width]);

  const baseTextLift = isMobile ? MOBILE_TEXT_LIFT : DESKTOP_TEXT_LIFT;
  const textLiftDistance = Math.max(firstTextLiftDistance, baseTextLift);
  const baseTextScrollSpan = BASE_FIRST_TEXT_SCROLL_END - FIRST_TEXT_SCROLL_START;
  const extendedTextScrollEnd =
    FIRST_TEXT_SCROLL_START +
    baseTextScrollSpan * (textLiftDistance / baseTextLift);
  const timelineShift = extendedTextScrollEnd - BASE_FIRST_TEXT_SCROLL_END;
  const contentBlackoutStart = BASE_CONTENT_BLACKOUT_START + timelineShift;
  const contentBlackoutEnd = BASE_CONTENT_BLACKOUT_END + timelineShift;
  const faqEntryStart = BASE_FAQ_ENTRY_START + timelineShift;
  const faqEntryEnd = BASE_FAQ_ENTRY_END + timelineShift;
  const secondHeadingFadeInStart =
    BASE_SECOND_HEADING_FADE_IN_START + timelineShift;
  const secondHeadingFadeInEnd =
    BASE_SECOND_HEADING_FADE_IN_END + timelineShift;
  const mobileSignatureStart = BASE_MOBILE_SIGNATURE_START + timelineShift;
  const mobileSignatureEnd = BASE_MOBILE_SIGNATURE_END + timelineShift;
  const maxHeroProgress = BASE_MAX_HERO_PROGRESS + timelineShift;

  useEffect(() => {
    const updateProgress = (delta: number) => {
      const next = clamp(progressRef.current + delta, 0, maxHeroProgress);
      progressRef.current = next;
      setProgress(next);
    };

    const atTop = () => window.scrollY <= 0;
    const finalStageAtTop = () =>
      (finalStageScrollRef.current?.scrollTop ?? 0) <= 0;
    const shouldReverseHero = (deltaY: number) =>
      progressRef.current > 0 && atTop() && finalStageAtTop() && deltaY < 0;

    const handleWheel = (event: WheelEvent) => {
      if (progressRef.current < maxHeroProgress || shouldReverseHero(event.deltaY)) {
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
        progressRef.current < maxHeroProgress ||
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
  }, [maxHeroProgress]);

  useEffect(() => {
    const shouldLock = progress < maxHeroProgress;
    document.documentElement.style.overflow = shouldLock ? "hidden" : "";
    document.body.style.overflow = shouldLock ? "hidden" : "";
    document.body.style.overscrollBehavior = shouldLock ? "none" : "";

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.overscrollBehavior = "";
    };
  }, [maxHeroProgress, progress]);

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
    extendedTextScrollEnd,
    textLiftDistance
  );
  const desktopScale =
    viewport.width && viewport.height
      ? Math.min(
          viewport.width / DESKTOP_SCENE_WIDTH,
          viewport.height / DESKTOP_SCENE_HEIGHT
        )
      : 1;
  const faqEntryProgress = clamp(
    (progress - faqEntryStart) / (faqEntryEnd - faqEntryStart),
    0,
    1
  );
  const contentBlackoutProgress = clamp(
    (progress - contentBlackoutStart) /
      (contentBlackoutEnd - contentBlackoutStart),
    0,
    1
  );
  const contentOpacity = 1 - contentBlackoutProgress;
  const secondHeadingOpacity =
    clamp(
      (progress - secondHeadingFadeInStart) /
        (secondHeadingFadeInEnd - secondHeadingFadeInStart),
      0,
      1
    );
  const secondHeadingTranslateY =
    (1 -
      clamp(
        (progress - secondHeadingFadeInStart) /
          (secondHeadingFadeInEnd - secondHeadingFadeInStart),
        0,
        1
      )) *
    28;
  const bodyStackTranslateY = firstSequence.textTranslateY;
  const faqTranslateY =
    (1 - faqEntryProgress) *
    (isMobile ? FAQ_INITIAL_OFFSET_MOBILE : FAQ_INITIAL_OFFSET_DESKTOP);

  useEffect(() => {
    if (isMobile) {
      const nextProgress = clamp(
        (progress - mobileSignatureStart) /
          (mobileSignatureEnd - mobileSignatureStart),
        0,
        1
      );
      setFirstSignatureProgress(nextProgress);
      return;
    }

    const bodyCopy = firstBodyCopyRef.current;
    if (!bodyCopy || viewport.height === 0) return;

    const rect = bodyCopy.getBoundingClientRect();
    const triggerY = viewport.height * 0.5;
    const drawRange = isMobile
      ? MOBILE_SIGNATURE_DRAW_RANGE
      : DESKTOP_SIGNATURE_DRAW_RANGE;
    const nextProgress = clamp((triggerY - rect.bottom) / drawRange, 0, 1);
    setFirstSignatureProgress(nextProgress);
  }, [
    firstSequence.textEntryProgress,
    firstSequence.textTranslateY,
    isMobile,
    progress,
    viewport.height,
  ]);

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
    if (progress < faqEntryEnd && finalStageScrollRef.current) {
      finalStageScrollRef.current.scrollTop = 0;
    }
  }, [faqEntryEnd, progress]);

  useEffect(() => {
    return () => {
      if (mobilePeekTimeoutRef.current != null) {
        window.clearTimeout(mobilePeekTimeoutRef.current);
      }
    };
  }, []);

  const handleSecretRevealMove = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (bounds.width === 0 || bounds.height === 0) return;

    setFlashlightPosition({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
      active: true,
    });
  };

  const handleSecretRevealPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!isMobile) return;

    handleSecretRevealMove(event);

    if (mobilePeekTimeoutRef.current != null) {
      window.clearTimeout(mobilePeekTimeoutRef.current);
    }

    mobilePeekTimeoutRef.current = window.setTimeout(() => {
      setFlashlightPosition((current) => ({ ...current, active: false }));
      mobilePeekTimeoutRef.current = null;
    }, 300);
  };

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
                const isHovered =
                  canHoverDesktopObjects && hoveredDesktopObject === object.key;
                const transforms = [
                  isHovered ? "translateY(-10px)" : "translateY(0px)",
                  `rotate(${pose.rotate}deg)`,
                ];

                if (object.flipY) {
                  transforms.push("scaleY(-1)");
                }

                transforms.push(isHovered ? "scale(1.018)" : "scale(1)");

                return (
                  <div
                    key={object.key}
                    className="absolute select-none"
                    onPointerEnter={() => {
                      if (canHoverDesktopObjects) {
                        setHoveredDesktopObject(object.key);
                      }
                    }}
                    onPointerLeave={() => {
                      if (canHoverDesktopObjects) {
                        setHoveredDesktopObject((current) =>
                          current === object.key ? null : current
                        );
                      }
                    }}
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
                      filter: isHovered
                        ? "brightness(1.03) saturate(1.04) drop-shadow(0 24px 54px rgba(0, 0, 0, 0.22))"
                        : "drop-shadow(0 18px 40px rgba(0, 0, 0, 0.16))",
                      pointerEvents: canHoverDesktopObjects ? "auto" : "none",
                      transition:
                        "transform 220ms ease, filter 220ms ease, opacity 220ms ease",
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
              {COMMUNITY_FUND_HEADING.prefix} <em>{COMMUNITY_FUND_HEADING.emphasis}</em>{" "}
              {COMMUNITY_FUND_HEADING.suffix}
            </span>
            <span className="block">{COMMUNITY_FUND_HEADING.title}</span>
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
            ref={firstContentRef}
            className="mx-auto text-left text-white/80"
            style={{
              marginTop: `${TEXT_BLOCK_GAP}px`,
              fontSize: isMobile ? "15px" : "17px",
              lineHeight: isMobile ? 1.82 : 1.9,
              letterSpacing: "-0.015em",
              paddingLeft: isMobile ? "16px" : "0px",
              paddingRight: isMobile ? "16px" : "0px",
            }}
          >
            <div ref={firstBodyCopyRef}>
              <p>
                Maybe you know from a past life, through a mutual, maybe we&apos;re new friends. I&apos;m a South
                Korean country girl at heart with the privilege of growing up in
                cities around the world because my Swiss dad was a chef at fancy
                hotels. When I moved to the US for college, I became the first in
                my line to graduate high school, get a bachelor&apos;s degree - and
                through many mistakes slash happy accidents, work my way into
                Silicon Valley. Long story short, I make apps and websites. Previously at Code &
                Theory, Mayvenn Hair, Credit Karma, and Genies. Recently, by the
                grace of God, luck, and capitalism - for myself.
              </p>
              <p style={{ marginTop: 24 }}>
                Along the way I noticed some paradoxical truths;
              </p>

              <ol className="list-decimal space-y-4 pl-5" style={{ marginTop: 24 }}>
                <li>
                  <p>
                    Good technology is magic. It is literal witchcraft but bad
                    technology drains the soul out of you and wastes your fucking
                    time. See; filing unemployment (why do I have to input the same
                    job I&apos;m emailing every week?), insurance claims, or any
                    other adult activity that&apos;s not sex-related.
                  </p>
                </li>
                <li>
                  <p>
                    A lot of technology businesses make a fuck tonne of money
                    because i) very few people on this planet have the privilege of
                    creating software and ii) it&apos;s not like operating a
                    restaurant which has a fixed amount of seats/limited IRL access.
                    For some reason, the unbridled scaling power of software comes
                    at the cost of a good user experience (what the REAL person on
                    the ground feels when they use it). <em>Do businesses take we the
                    people for granted?</em>
                  </p>
                </li>
                <li>
                  <p>
                    As culture progresses towards a more people-first system that
                    corrects the current overindexing on state and business rights
                    over individual freedom and collective liberation and physical
                    safety (yes, I&apos;m an optimist - even if transitions are
                    difficult and take longer than expected), so must our standards
                    for businesses, business leaders, and generally, vibes (
                    <em>VOIBES</em>).
                  </p>
                </li>
              </ol>

              <p style={{ marginTop: 24 }}>
                In 2020 when the world temporarily shut down, I married new skills
                with old questions. Markets froze and we were all figuring out how
                to stay sane;
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>
                  Why does money anxiety feel <em>SO bad?</em>
                </li>
                <li>
                  What are my richer friends doing that I&apos;m not, other than
                  being born into stability?
                </li>
                <li>How can I do more things with friends?</li>
                <li>
                  And most importantly, <em>why am I still so damn lonely?</em>
                </li>
              </ul>

              <p style={{ marginTop: 24 }}>
                Along the way I had a front row seat to the only tech billionare
                I&apos;d endorse for President; Kenneth J. Lin. I quietly watched
                this humble visionary build a $9B business that protected people
                from predators, empowered them with transparency and optionality,
                prioritized employee health and equity, while co-sponsoring an NBA
                team and PRINTING money for shareholders.
              </p>

              <p style={{ marginTop: 24 }}>
                But something nagged at me. First, despite our best efforts to
                unlock financial progress for 1 out of 3 Americans on our app, the
                American Dream is not within reach for the majority of Americans.
                The best technology in the world can&apos;t fix this. It&apos;s a
                systemic problem that can be summarized in one chart.
              </p>
              <p style={{ marginTop: 24 }}>
                <img src="/images/chart.png" alt="Chart" className="h-auto w-full" />
              </p>

              <p style={{ marginTop: 24 }}>
                The internet, and now AI, has made shareholder value so easy to
                unlock but wages haven&apos;t adjusted. Second, the business model
                was still fundamentally based on ads. I didn&apos;t like that,
                personally.
              </p>

              <p style={{ marginTop: 24 }}>
                I mean, look at today&apos;s largest consumer software non-retail ad
                business; Meta. Don&apos;t get me wrong. I <em>have</em> to leave
                room for diplomacy because I&apos;m trying to be a big girll; and
                there are many solid people earning great livings from Meta&apos;s
                payroll, so I don&apos;t wish harm on the business. And, I celebrate
                Wasian babies and the Chan-Zuckerberg kids are gonna cure cancer so,
                God bless the family. But look at our digital system today. Outside
                of chat, our Social tools revolve around an interaction of posting
                content for external feedback (likes, shares, reposts, follows). The
                product became a content business, which is great for the brilliant
                and baddie creatives pioneering careers in a new world, but awful
                for our attention spans and standards since the machine incentivizes
                volume and organic content punches through the noise using rage and
                scandal to be noticed. All of this is a system that normalizes
                divisiveness & fear & an insiduous depression that hijacks our
                ability to generate dopamine elsewhere.
              </p>

              <p style={{ marginTop: 24 }}>
                It&apos;s not healthy to be exposed to everything, everyone, all at
                once, all the time.
              </p>

              <p style={{ marginTop: 24 }}>I know. I know you know, too.</p>

              <p style={{ marginTop: 24 }}>
                Our other connection tool is dating. Idk man - I think a lot of us
                just outgrew the dating apps but don&apos;t really have another
                choice, especially in a more remote school and work culture.
              </p>

              <p style={{ marginTop: 24 }}>
                In 2023, I began my quest to redesign social. After failing to
                launch a Social x Finance app (a concept warmly dubbed "Karmic
                Vision"), I left the fintech world in SF and launched an app at a
                hot social startup in LA. That didn&apos;t work out other. The scales
                tipped and I focused next on Online x Offline integrations, then on
                Social x Dating; what if your friends were included in your dating
                app experience? People already give each other their phones at
                brunch or send screenshots in the group chat.
              </p>

              <p style={{ marginTop: 24 }}>
                I spent most of 2024 alchemizing our first round of feedback into a
                functional prototype, iterating with women in LA and Pasadena. By
                the end of the year, I sunsetted the app to redesign it from the
                ground up with everything we had learned, rebrand our energy, while
                beginning to learn how to vibe code shittily with super-early AI
                tools until I hit a wall and got professional and specialized help
                to launch our not-so-basic MVP on the App Store in 2025. Post-launch
                was a flurry of "oh shit, gotta fix this" while getting folks to try
                the app. Chaos, but hey, we live!
              </p>

              <p style={{ marginTop: 24 }}>
                The good news; the most important thing that needed to happen (for
                that stage) happened. We saw a 2.5x viral coefficient out the gate
                without using any paid acquisition, which meant we could reliabily
                keep growing without forcing a shit tonne of ads down your throat.
                Personally? Fuck yeah. I don&apos;t ever wanna force someone to
                loving me or loving my art - and I dont enjoy the limelight so I&apos;d
                rather you hear about us through your friends.
              </p>

              <p style={{ marginTop: 24 }}>
                The bad news? Holy shit, there is so much work to do. I need help.
              </p>

              <p style={{ marginTop: 24 }}>
                So here we are. If you&apos;ve been following me for a minute, you
                know some other crazy shit happened. Two obsessed, relentless,
                fanatic stalkers who hacked my shit and shared it with many other
                people while I was building and starting life over post-marriage.
                Then the jealous friend of someone I went on 4 dates with who,
                despite us no longer being active, took it upon themselves to harass
                me, hijack an early-fledgling business, steal unreleased work as
                their own, publicly joke about my hack, threaten to expose intimate
                content, and just straight up bully me to... notice her? Idk.
                It&apos;s weird, and not the good kind.
              </p>

              <p style={{ marginTop: 24 }}>
                So, some drama. A different kind of workplace politics, I guess.
                Some celeb exposure. Some imaginary players, some big business.
                Heavy on existential crisis. But I need to be real with you; all of
                this is a distraction from the main thing that needs to stay the main
                thing. We don&apos;t need it. We have something that works,
                something real, something that people are excited about, that
                culture needs.
              </p>

              <p style={{ marginTop: 24 }}>Something new.</p>

              <p style={{ marginTop: 24 }}>We just have to get it outside.</p>

              <p style={{ marginTop: 24 }}>Meet me outside?</p>

              <p style={{ marginTop: 24 }}>
                There&apos;s a legendary era just around the corner. At minimum,
                good hangs with friends, maybe a cheeky cig, and a crush here
                and/or there 🙃
              </p>
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
          className="absolute inset-0 z-40 flex justify-center overflow-y-auto"
          style={{
            pointerEvents: faqEntryProgress > 0.98 ? "auto" : "none",
            scrollbarGutter: "stable both-edges",
          }}
        >
          <div
            className="relative w-full max-w-[704px] px-0 md:px-4"
            style={{
              minHeight: "100dvh",
              paddingTop: `${Math.max(viewport.height / 2 - secondHeadingHeight / 2, 0)}px`,
              paddingBottom: "80px",
            }}
          >
            <div
              className="flex justify-center text-center"
              style={{
                opacity: secondHeadingOpacity,
                transform: `translateY(${secondHeadingTranslateY}px)`,
              }}
            >
              <div
                className="pointer-events-auto"
                onPointerDown={handleSecretRevealPointerDown}
                onPointerEnter={isMobile ? undefined : handleSecretRevealMove}
                onPointerMove={isMobile ? undefined : handleSecretRevealMove}
                onPointerLeave={
                  isMobile
                    ? undefined
                    : () =>
                        setFlashlightPosition((current) => ({
                          ...current,
                          active: false,
                        }))
                }
              >
                <h2
                  ref={secondHeadingRef}
                  className="flashlight-reveal mx-auto max-w-[12ch] text-white"
                  data-active={flashlightPosition.active ? "true" : "false"}
                  style={
                    {
                      fontSize: isMobile
                        ? "clamp(2.1rem, 10vw, 3.25rem)"
                        : "clamp(3.2rem, 6vw, 5.75rem)",
                      lineHeight: 1,
                      letterSpacing: "-0.045em",
                      fontWeight: 500,
                      textAlign: "center",
                      textWrap: "balance",
                      paddingBottom: "0.08em",
                      ["--flashlight-x" as string]: `${flashlightPosition.x}%`,
                      ["--flashlight-y" as string]: `${flashlightPosition.y}%`,
                      ["--flashlight-size" as string]: isMobile ? "72px" : "132px",
                    } as CSSProperties
                  }
                >
                  <span className="flashlight-reveal__base">
                    Thank you for your service
                  </span>
                  <span
                    aria-hidden="true"
                    className="flashlight-reveal__secret"
                  >
                    <span className="block">Fuck you,</span>
                    <span className="block">Pay me</span>
                  </span>
                </h2>
              </div>
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

            <footer
              className="mx-auto max-w-[672px] px-[16px] text-center text-[10px] leading-4 tracking-[0.01em] text-white/30 sm:text-[11px]"
              style={{
                width: isMobile ? "calc(100% - 32px)" : "100%",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "40px",
                opacity: faqEntryProgress,
                transform: `translateY(${faqTranslateY}px)`,
              }}
            >
              <p>
                This page is for informational purposes only and does not constitute an
                offer to sell or a solicitation of an offer to buy any securities. Any
                offer to sell securities will be made only pursuant to definitive
                offering documents provided directly to prospective investors who have
                a pre-existing relationship with the Company. Securities offered by
                Jury App Inc. have not been registered under the Securities Act of
                1933, as amended, or any state securities laws, and are being offered
                in reliance on exemptions from registration. Such securities may not
                be offered or sold except pursuant to an exemption from, or in a
                transaction not subject to, the registration requirements of the
                Securities Act and applicable state securities laws. Investing in
                early-stage companies involves a high degree of risk, including the
                risk of total loss of investment. Past performance is not indicative
                of future results. Nothing on this page should be construed as legal,
                tax, or investment advice. This opportunity is available only to
                individuals with a pre-existing relationship with Jury App Inc. and
                its founder. If you received this link directly, you&apos;re in the
                right place.
                <br />
                <br />
                © 2026 Jury App Inc. All rights reserved.
              </p>
            </footer>
            <div aria-hidden="true" style={{ height: "24px" }} />
          </div>
        </div>

      </div>
    </section>
  );
}
