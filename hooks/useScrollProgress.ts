"use client";

/**
 * useScrollProgress
 * ──────────────────────────────────────────────────────────────
 * Returns a normalised scroll progress value (0 → 1) for the
 * entire page, OR scoped to a specific element ref.
 *
 * Usage:
 *   const progress = useScrollProgress();               // page
 *   const progress = useScrollProgress(myRef);          // element
 */

import { useEffect, useState, RefObject } from "react";

export function useScrollProgress(ref?: RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (ref?.current) {
        // Element-scoped: how far through this element we've scrolled
        const el = ref.current;
        const rect = el.getBoundingClientRect();
        const totalScrollable = el.offsetHeight - window.innerHeight;
        const scrolled = Math.max(0, -rect.top);
        setProgress(Math.min(1, Math.max(0, scrolled / totalScrollable)));
      } else {
        // Page-level
        const total = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(Math.min(1, Math.max(0, window.scrollY / total)));
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // Initialise on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref]);

  return progress;
}
