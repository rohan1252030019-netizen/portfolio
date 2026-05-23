"use client";

/**
 * AnimatedText
 * ──────────────────────────────────────────────────────────────
 * Splits text into words or characters and animates each one
 * with a staggered reveal from below (classic "mask slide up").
 *
 * Props:
 *   text      — the string to animate
 *   className — extra Tailwind / CSS classes on the wrapper
 *   as        — HTML tag to render (h1, h2, p, span…)
 *   split     — "words" | "chars" (default: "words")
 *   delay     — base delay before the animation starts (seconds)
 *   inView    — controls whether animation plays
 *   once      — only trigger once (default: true)
 *
 * Usage:
 *   <AnimatedText text="Hello World" as="h1" inView={inView} />
 */

import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

type Tag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
type SplitMode = "words" | "chars";

interface AnimatedTextProps {
  text: string;
  className?: string;
  as?: Tag;
  split?: SplitMode;
  delay?: number;
  stagger?: number;
  inView?: boolean;
}

const containerVariants = (stagger: number, delay: number): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

const itemVariants: Variants = {
  hidden: { y: "115%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function AnimatedText({
  text,
  className,
  as: Tag = "p",
  split = "words",
  delay = 0,
  stagger = 0.06,
  inView = true,
}: AnimatedTextProps) {
  const tokens =
    split === "chars" ? text.split("") : text.split(/(\s+)/);

  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      variants={containerVariants(stagger, delay)}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      aria-label={text}
    >
      <Tag className="flex flex-wrap" aria-hidden>
        {tokens.map((token, i) => {
          // Preserve whitespace tokens
          if (/^\s+$/.test(token)) {
            return <span key={i} style={{ whiteSpace: "pre" }}>{token}</span>;
          }
          return (
            <span key={i} className="overflow-hidden inline-block">
              <motion.span className="inline-block" variants={itemVariants}>
                {token}
              </motion.span>
            </span>
          );
        })}
      </Tag>
    </motion.div>
  );
}
