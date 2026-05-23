"use client";

/**
 * MagneticButton
 * ──────────────────────────────────────────────────────────────
 * A button that magnetically pulls toward the cursor when hovered.
 * Creates that premium "alive" feel seen on high-end agency sites.
 *
 * The magnetic effect works by:
 *  1. Tracking mouse position relative to the button centre
 *  2. Translating the button toward the cursor (scaled down)
 *  3. Spring-animating back on mouse leave
 *
 * Usage:
 *   <MagneticButton>Click me</MagneticButton>
 *   <MagneticButton strength={0.5} className="...">CTA</MagneticButton>
 */

import { useRef, useState, useCallback } from "react";
import { motion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number; // 0 → 1, how strong the magnetic pull is (default 0.35)
  onClick?: () => void;
  href?: string;
  style?: React.CSSProperties;
}

export default function MagneticButton({
  children,
  className,
  strength = 0.35,
  onClick,
  href,
  style,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      x.set((e.clientX - cx) * strength);
      y.set((e.clientY - cy) * strength);
    },
    [x, y, strength]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const Tag = href ? "a" : "button";

  return (
    <div
      ref={ref}
      className="inline-flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div style={{ x, y }}>
        <Tag
          href={href}
          onClick={onClick}
          className={cn("magnetic-btn", className)}
          style={style}
        >
          {children}
        </Tag>
      </motion.div>
    </div>
  );
}
