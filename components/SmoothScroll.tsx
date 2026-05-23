"use client";

/**
 * SmoothScroll
 * ──────────────────────────────────────────────────────────────
 * Wraps the app in Lenis for buttery-smooth scrolling.
 * Also provides a RAF loop that syncs Lenis with Framer Motion's
 * useScroll hooks so parallax / scroll-driven animations stay
 * perfectly in sync.
 */

import { useEffect, useRef } from "react";
import Lenis from "lenis";

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialise Lenis with gentle easing
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Expose lenis instance globally so components can call lenis.scrollTo
    (window as any).__lenis = lenis;

    // RAF loop — keep Lenis ticking every frame
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
