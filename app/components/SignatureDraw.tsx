"use client";

import { useId } from "react";

type SignatureDrawProps = {
  className?: string;
  isMobile?: boolean;
  progress: number;
};

export default function SignatureDraw({
  className = "",
  isMobile = false,
  progress,
}: SignatureDrawProps) {
  const maskId = useId();
  const whiteFilterId = useId();
  const mobileGlowFilterId = useId();
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const dashOffset = 1 - clampedProgress;
  const glowOpacity = 0.16 + clampedProgress * 0.42;
  const heartProgress = Math.min(1, Math.max(0, (clampedProgress - 0.86) / 0.14));
  const heartDashOffset = 1 - heartProgress;

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 1040 576"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id={whiteFilterId} colorInterpolationFilters="sRGB">
          <feFlood floodColor="#ffffff" result="whiteFill" />
          <feComposite in="whiteFill" in2="SourceAlpha" operator="in" />
        </filter>
        <filter
          id={mobileGlowFilterId}
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blurredGlow" />
          <feComponentTransfer in="blurredGlow" result="boostedGlow">
            <feFuncA type="linear" slope="1.8" />
          </feComponentTransfer>
        </filter>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <rect width="1040" height="576" fill="black" />
          <polyline
            points="176.5,393.1 184.5,373.1 192.5,339.1 200.5,301.3 208.5,276.3 216.5,257.8 224.5,237.1 232.5,216.0 240.5,238.5 248.5,255.9 256.5,238.2 264.5,316.7 272.5,299.7 280.5,280.9 288.5,261.5 296.5,244.1 304.5,257.8 312.5,280.8 320.5,330.6 328.5,372.5 336.5,355.9 344.5,339.8 352.5,325.4 360.5,315.7 368.5,308.9 376.5,304.1 384.5,299.3 392.5,274.3 400.5,247.6 408.5,250.0 416.5,239.2 424.5,229.6 432.5,243.9 440.5,313.7 448.5,291.7 456.5,258.1 464.5,257.9 472.5,268.4 480.5,290.0 488.5,283.3 496.5,304.4 504.5,295.5 512.5,276.1 520.5,256.2 528.5,263.6 536.5,275.7 544.5,309.1 552.5,308.4 560.5,288.5 568.5,259.6 576.5,247.2 584.5,241.4 592.5,256.7 600.5,258.2 608.5,256.9 616.5,251.8 624.5,234.1 632.5,227.4 640.5,220.4 648.5,213.2 656.5,205.6 664.5,198.0 672.5,190.0 680.5,182.4 688.5,264.8 696.5,272.5 704.5,244.7 712.5,221.9 720.5,201.6 728.5,209.9 736.5,263.2 744.5,285.7 752.5,295.1 760.5,304.5 768.5,325.5 776.5,309.1 784.5,291.9 792.5,278.7 800.5,279.9 808.5,285.2 816.5,288.4 824.5,289.0 832.5,287.7 840.5,283.8 848.5,283.9 856.5,295.5 864.5,313.0 872.5,332.0 880.5,344.8"
            pathLength="1"
            fill="none"
            stroke="white"
            strokeDasharray="1"
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="112"
            style={{
              transition: "stroke-dashoffset 120ms linear",
            }}
          />
        </mask>
      </defs>
      <polyline
        points="176.5,393.1 184.5,373.1 192.5,339.1 200.5,301.3 208.5,276.3 216.5,257.8 224.5,237.1 232.5,216.0 240.5,238.5 248.5,255.9 256.5,238.2 264.5,316.7 272.5,299.7 280.5,280.9 288.5,261.5 296.5,244.1 304.5,257.8 312.5,280.8 320.5,330.6 328.5,372.5 336.5,355.9 344.5,339.8 352.5,325.4 360.5,315.7 368.5,308.9 376.5,304.1 384.5,299.3 392.5,274.3 400.5,247.6 408.5,250.0 416.5,239.2 424.5,229.6 432.5,243.9 440.5,313.7 448.5,291.7 456.5,258.1 464.5,257.9 472.5,268.4 480.5,290.0 488.5,283.3 496.5,304.4 504.5,295.5 512.5,276.1 520.5,256.2 528.5,263.6 536.5,275.7 544.5,309.1 552.5,308.4 560.5,288.5 568.5,259.6 576.5,247.2 584.5,241.4 592.5,256.7 600.5,258.2 608.5,256.9 616.5,251.8 624.5,234.1 632.5,227.4 640.5,220.4 648.5,213.2 656.5,205.6 664.5,198.0 672.5,190.0 680.5,182.4 688.5,264.8 696.5,272.5 704.5,244.7 712.5,221.9 720.5,201.6 728.5,209.9 736.5,263.2 744.5,285.7 752.5,295.1 760.5,304.5 768.5,325.5 776.5,309.1 784.5,291.9 792.5,278.7 800.5,279.9 808.5,285.2 816.5,288.4 824.5,289.0 832.5,287.7 840.5,283.8 848.5,283.9 856.5,295.5 864.5,313.0 872.5,332.0 880.5,344.8"
        pathLength="1"
        fill="none"
        stroke={isMobile ? `rgba(255, 255, 255, ${0.26 + clampedProgress * 0.24})` : `rgba(228, 234, 242, ${glowOpacity})`}
        strokeDasharray="1"
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={isMobile ? 18 : 28}
        style={{
          filter: isMobile ? `url(#${mobileGlowFilterId})` : "blur(14px)",
          transition: "stroke-dashoffset 120ms linear, stroke 120ms linear",
        }}
      />
      {isMobile ? (
        <image
          height="576"
          href="/assets/signature-exact.png"
          mask={`url(#${maskId})`}
          filter={`url(#${whiteFilterId})`}
          width="1040"
        />
      ) : (
        <image
          height="576"
          href="/assets/signature-exact.png"
          mask={`url(#${maskId})`}
          style={{ filter: "brightness(0) invert(1)" }}
          width="1040"
        />
      )}
      <path
        d="M906 316
        C894 293 862 293 862 322
        C862 346 885 362 906 382
        C927 362 950 346 950 322
        C950 293 918 293 906 316"
        pathLength="1"
        fill="none"
        stroke={`rgba(228, 234, 242, ${0.12 + heartProgress * 0.34})`}
        strokeDasharray="1"
        strokeDashoffset={heartDashOffset}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="20"
        style={{
          filter: "blur(10px)",
          transition: "stroke-dashoffset 120ms linear, stroke 120ms linear",
        }}
      />
      <path
        d="M906 316
        C894 293 862 293 862 322
        C862 346 885 362 906 382
        C927 362 950 346 950 322
        C950 293 918 293 906 316"
        pathLength="1"
        fill="none"
        stroke="#ffffff"
        strokeDasharray="1"
        strokeDashoffset={heartDashOffset}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
        style={{
          transition: "stroke-dashoffset 120ms linear",
        }}
      />
    </svg>
  );
}
