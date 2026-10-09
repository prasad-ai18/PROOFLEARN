"use client";

import React, { useEffect, useState, useRef } from "react";

export function AntigravityCursor() {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Mouse target and animated position
  const mousePos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const spotlightRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only mount on desktop pointer devices
    if (typeof window === "undefined" || window.matchMedia("(hover: none)").matches) {
      return;
    }

    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Check if hovering over clickable elements
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.closest("button") ||
          target.closest("a") ||
          target.getAttribute("role") === "button")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.body.addEventListener("mouseleave", handleMouseLeave);

    let animationFrameId: number;

    // Smooth physics loop for antigravity glide
    const loop = () => {
      // 0.15 factor gives smooth weightless lag
      const factor = 0.18;
      currentPos.current.x += (mousePos.current.x - currentPos.current.x) * factor;
      currentPos.current.y += (mousePos.current.y - currentPos.current.y) * factor;

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${mousePos.current.x - 300}px, ${mousePos.current.y - 300}px, 0)`;
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${currentPos.current.x - 12}px, ${currentPos.current.y - 12}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!mounted) return null;

  return (
    <>
      {/* 1. Ambient Background Spotlight Gradient */}
      <div
        ref={spotlightRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] rounded-full transition-opacity duration-300 z-0 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, rgba(59, 130, 246, 0.03) 35%, transparent 70%)",
          willChange: "transform",
        }}
      />

      {/* 2. Antigravity Weightless Cursor Ring */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 rounded-full border border-emerald-400/50 transition-all duration-150 z-50 flex items-center justify-center ${
          isVisible ? "opacity-90" : "opacity-0"
        } ${isHovered ? "w-9 h-9 -ml-1 -mt-1 bg-emerald-500/10 border-emerald-400 scale-125" : "w-6 h-6 bg-emerald-400/5"}`}
        style={{
          willChange: "transform",
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
      </div>
    </>
  );
}
