"use client";

/**
 * Loader
 * ──────────────────────────────────────────────────────────────
 * Full-screen intro preloader.
 * Counts up from 0 → 100, then reveals site with a split-screen
 * curtain exit animation.
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let current = 0;
    const duration = 2200; // ms total
    const steps = 100;
    const interval = duration / steps;

    // Accelerate near the end for dramatic feel
    const timer = setInterval(() => {
      current += 1;
      // Ease-out: faster at start, slower near 100
      setCount(Math.round(current));
      if (current >= steps) {
        clearInterval(timer);
        setTimeout(() => setDone(true), 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9000] flex"
      initial={{ opacity: 1 }}
      animate={done ? "exit" : "visible"}
      onAnimationComplete={(def) => {
        if (def === "exit") onComplete();
      }}
      variants={{
        visible: {},
        exit: {
          transition: { staggerChildren: 0.06 },
        },
      }}
    >
      {/* Left panel */}
      <motion.div
        className="flex-1 flex items-center justify-end pr-12"
        style={{ backgroundColor: "var(--color-bg)" }}
        variants={{
          exit: {
            y: "-100%",
            transition: { duration: 0.9, ease: [0.87, 0, 0.13, 1] },
          },
        }}
      >
        <div className="flex flex-col items-end">
          {/* Brand mark */}
          <span
            className="font-display text-5xl md:text-7xl font-light tracking-tight leading-none select-none"
            style={{ color: "var(--color-text)" }}
          >
            AM
          </span>
          <span
            className="font-mono text-xs mt-2 tracking-widest uppercase"
            style={{ color: "var(--color-text-muted)" }}
          >
            Portfolio
          </span>
        </div>
      </motion.div>

      {/* Divider line */}
      <motion.div
        className="w-px"
        style={{ backgroundColor: "var(--color-border)" }}
        variants={{
          exit: {
            opacity: 0,
            transition: { duration: 0.3 },
          },
        }}
      />

      {/* Right panel */}
      <motion.div
        className="flex-1 flex items-center pl-12"
        style={{ backgroundColor: "var(--color-surface)" }}
        variants={{
          exit: {
            y: "100%",
            transition: { duration: 0.9, ease: [0.87, 0, 0.13, 1] },
          },
        }}
      >
        <div className="flex flex-col">
          <motion.span
            className="font-mono text-6xl md:text-8xl font-light tabular-nums leading-none"
            style={{ color: "var(--color-accent)" }}
          >
            {String(count).padStart(2, "0")}
          </motion.span>
          <div
            className="mt-4 h-px w-full overflow-hidden"
            style={{ backgroundColor: "var(--color-border)" }}
          >
            <motion.div
              className="h-full"
              style={{
                backgroundColor: "var(--color-accent)",
                width: `${count}%`,
                transition: "width 0.1s linear",
              }}
            />
          </div>
          <span
            className="font-body text-xs mt-3 tracking-widest uppercase"
            style={{ color: "var(--color-text-muted)" }}
          >
            Loading experience
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
