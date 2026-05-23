"use client";

/**
 * CustomCursor
 * ──────────────────────────────────────────────────────────────
 * Dual-layer cursor: a small dot that snaps instantly + a larger
 * ring that follows with spring inertia.
 * Changes state on hoverable elements.
 * Hidden on touch devices.
 */

import { useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  // Ring follows with spring lag
  const springConfig = { damping: 28, stiffness: 280, mass: 0.5 };
  const ringX = useSpring(dotX, springConfig);
  const ringY = useSpring(dotY, springConfig);

  const ringRef = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    dotX.set(e.clientX);
    dotY.set(e.clientY);
  }, [dotX, dotY]);

  const handleMouseEnter = useCallback(() => {
    if (ringRef.current) {
      ringRef.current.classList.add("scale-[2.5]", "border-amber-DEFAULT", "bg-transparent");
      ringRef.current.classList.remove("bg-amber-DEFAULT");
      isHovering.current = true;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (ringRef.current) {
      ringRef.current.classList.remove("scale-[2.5]", "border-amber-DEFAULT", "bg-transparent");
      ringRef.current.classList.add("bg-amber-DEFAULT");
      isHovering.current = false;
    }
  }, []);

  useEffect(() => {
    // Only run on non-touch devices
    if (window.matchMedia("(hover: none)").matches) return;

    window.addEventListener("mousemove", handleMouseMove);

    // Add hover listeners to all interactive elements
    const targets = document.querySelectorAll(
      "a, button, [data-cursor='hover'], input, textarea, [role='button']"
    );
    targets.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave]);

  return (
    <div className="custom-cursor pointer-events-none hidden md:block">
      {/* Outer ring — spring-lagged */}
      <motion.div
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 rounded-full border border-amber-DEFAULT
                   -translate-x-1/2 -translate-y-1/2 transition-[transform,background]
                   duration-300 ease-expo-out"
        style={{
          x: ringX,
          y: ringY,
          borderColor: "var(--color-accent)",
        }}
      />

      {/* Inner dot — snaps instantly */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          x: dotX,
          y: dotY,
          backgroundColor: "var(--color-accent)",
        }}
      />
    </div>
  );
}
