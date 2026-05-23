"use client";

/**
 * useIntersection
 * ──────────────────────────────────────────────────────────────
 * Returns whether a ref'd element is currently intersecting the
 * viewport. Supports triggerOnce for entrance animations.
 *
 * Usage:
 *   const { ref, inView } = useIntersection({ threshold: 0.2 });
 */

import { useEffect, useRef, useState, RefObject } from "react";

interface Options {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface Result<T extends Element> {
  ref: RefObject<T | null>;
  inView: boolean;
  entry: IntersectionObserverEntry | null;
}

export function useIntersection<T extends Element = HTMLDivElement>(
  options: Options = {}
): Result<T> {
  const { threshold = 0, rootMargin = "0px", triggerOnce = false } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([e]) => {
        setEntry(e);
        if (e.isIntersecting) {
          setInView(true);
          if (triggerOnce) observer.unobserve(el);
        } else {
          if (!triggerOnce) setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, inView, entry };
}
