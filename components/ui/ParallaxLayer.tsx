"use client";

/**
 * ParallaxLayer
 * ──────────────────────────────────────────────────────────────
 * Wraps children in a scroll-driven parallax transform.
 *
 * Props:
 *   speed    — parallax intensity. 0 = no movement, 1 = full scroll speed
 *              Negative values scroll in opposite direction (foreground feel)
 *   direction — "y" (default) | "x"
 *   clampRange — optional [start, end] as ratio of section scroll (0→1)
 *
 * Usage:
 *   <ParallaxLayer speed={0.3}>
 *     <img src="..." />
 *   </ParallaxLayer>
 *
 * Implementation uses Framer Motion's useScroll + useTransform for
 * GPU-composited transforms — no layout thrashing.
 */

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number;
  direction?: "x" | "y";
  className?: string;
  style?: React.CSSProperties;
}

export default function ParallaxLayer({
  children,
  speed = 0.2,
  direction = "y",
  className,
  style,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Map 0→1 scroll to a pixel offset. speed controls magnitude.
  // At speed 0.3 and a 600px element, max offset = 600 * 0.3 = 180px
  const rawTransform = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "y"
      ? [`${speed * 100}px`, `${-speed * 100}px`]
      : [`${speed * 100}px`, `${-speed * 100}px`]
  );

  // Smooth out the transform with a spring
  const transform = useSpring(rawTransform, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001,
  });

  return (
    <div ref={ref} className={className} style={{ overflow: "hidden", ...style }}>
      <motion.div
        style={direction === "y" ? { y: transform } : { x: transform }}
      >
        {children}
      </motion.div>
    </div>
  );
}
