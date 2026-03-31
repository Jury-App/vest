"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface InvestButtonProps {
  onInvest: () => void;
}

export default function InvestButton({ onInvest }: InvestButtonProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const animFrameRef = useRef<number>(0);
  const seedRef = useRef(0);
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const speedRef = useRef(1);

  useEffect(() => {
    // Default is 0.25 (400% slower). On press, 150% faster → 0.25 * 2.5 = 0.625
    speedRef.current = isPressed ? 0.625 : 0.25;
  }, [isPressed]);

  useEffect(() => {
    let lastTime = 0;
    const animate = (time: number) => {
      if (!turbulenceRef.current) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const delta = time - lastTime;
      if (delta > 50 / speedRef.current) {
        seedRef.current += 1;
        turbulenceRef.current.setAttribute(
          "seed",
          String(seedRef.current)
        );

        // Slowly oscillate baseFrequency for organic feel
        const freq = 0.015 + Math.sin(time * 0.001 * speedRef.current) * 0.005;
        turbulenceRef.current.setAttribute(
          "baseFrequency",
          `${freq} ${freq * 0.8}`
        );
        lastTime = time;
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const handleClick = useCallback(() => {
    setIsPressed(true);
    setTimeout(() => {
      onInvest();
      // Reset after a delay so animation stays fast during transition
      setTimeout(() => setIsPressed(false), 1000);
    }, 600);
  }, [onInvest]);

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none">
      <button
        onClick={handleClick}
        className="relative cursor-pointer border-0 bg-transparent p-0 pointer-events-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ height: isHovered || isPressed ? "112px" : "80px", paddingLeft: isHovered || isPressed ? "67px" : "48px", paddingRight: isHovered || isPressed ? "67px" : "48px", transition: "all 0.3s ease" }}
      >
        {/* SVG filter for lava lamp distortion */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full"
          style={{ overflow: "visible" }}
        >
          <defs>
            <filter id="lava-filter" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence
                ref={turbulenceRef}
                type="fractalNoise"
                baseFrequency="0.015 0.012"
                numOctaves="3"
                seed="0"
                result="turbulence"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="turbulence"
                scale="12"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>

          {/* The undulating blob shape */}
          <g filter="url(#lava-filter)">
            <rect
              x="0"
              y="5%"
              width="100%"
              height="90%"
              rx="40"
              ry="40"
              fill="rgba(255, 255, 255, 0.12)"
            />
          </g>
        </svg>

        {/* Button text */}
        <span
          className="relative flex items-center justify-center text-white text-2xl font-semibold tracking-wide"
          style={{
            textShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
          }}
        >
          Invest
        </span>

      </button>
    </div>
  );
}
