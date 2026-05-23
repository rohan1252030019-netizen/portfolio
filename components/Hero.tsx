"use client";

/**
 * Hero
 * ──────────────────────────────────────────────────────────────
 * Full-viewport landing section.
 *
 * Layout:
 *  - Oversized display name (parallax layer 1 — slower)
 *  - Role / tagline (parallax layer 2 — medium speed)
 *  - CTA button + scroll indicator (layer 3 — base speed)
 *  - Background: diagonal light-leak gradient + grain
 *
 * Animations:
 *  - Staggered character/word reveal on mount
 *  - Parallax scroll using useScroll + useTransform
 */

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  stagger,
  animate,
} from "framer-motion";

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms for layered elements
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const ctaY = useTransform(scrollYProgress, [0, 1], ["0%", "-55%"]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const smoothTitleY = useSpring(titleY, { stiffness: 80, damping: 25 });
  const smoothSubY = useSpring(subtitleY, { stiffness: 80, damping: 25 });

  // Reveal after loader
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 2600);
    return () => clearTimeout(t);
  }, []);

  const scrollToWork = () => {
    const lenis = (window as any).__lenis;
    const el = document.getElementById("reel");
    if (lenis && el) lenis.scrollTo(el, { duration: 1.6 });
    else el?.scrollIntoView({ behavior: "smooth" });
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const lineVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden grain"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* ── Background diagonal gradient ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: bgY }}
      >
        {/* Warm amber glow — top right */}
        <div
          className="absolute -top-40 -right-40 w-[800px] h-[800px] rounded-full opacity-10 blur-[120px]"
          style={{ backgroundColor: "var(--color-accent)" }}
        />
        {/* Cool blue glow — bottom left */}
        <div
          className="absolute -bottom-20 -left-20 w-[600px] h-[600px] rounded-full opacity-8 blur-[100px]"
          style={{ backgroundColor: "var(--color-blue)" }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px),
                              linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
      </motion.div>

      {/* ── Side label: scroll indicator ── */}
      <motion.div
        className="absolute left-6 md:left-10 bottom-10 flex flex-col items-center gap-3 opacity-40"
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 0.4 } : { opacity: 0 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <span
          className="font-mono text-[10px] tracking-superwide uppercase"
          style={{ writingMode: "vertical-rl", color: "var(--color-text-muted)" }}
        >
          Scroll
        </span>
        <motion.div
          className="w-px h-12"
          style={{ backgroundColor: "var(--color-text-muted)" }}
          animate={{ scaleY: [0, 1, 0], originY: [0, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* ── Right side: social links ── */}
      <motion.div
        className="absolute right-6 md:right-10 bottom-10 flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.4, duration: 1 }}
      >
        {["GH", "TW", "LI"].map((short) => (
          <a
            key={short}
            href="#"
            className="font-mono text-[10px] tracking-widest uppercase transition-colors duration-300 hover:text-amber-DEFAULT"
            style={{ color: "var(--color-text-muted)" }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.color = "var(--color-accent)")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.color = "var(--color-text-muted)")
            }
          >
            {short}
          </a>
        ))}
      </motion.div>

      {/* ── Main content ── */}
      <div className="container-wide relative z-10 pt-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={mounted ? "visible" : "hidden"}
        >
          {/* Eyebrow label */}
          <motion.div variants={fadeIn} className="mb-6 flex items-center gap-4">
            <span
              className="font-mono text-xs tracking-superwide uppercase"
              style={{ color: "var(--color-accent)" }}
            >
              Creative Developer
            </span>
            <div className="w-12 h-px" style={{ backgroundColor: "var(--color-accent)" }} />
            <span
              className="font-mono text-xs tracking-widest"
              style={{ color: "var(--color-text-muted)" }}
            >
              Available for freelance
            </span>
          </motion.div>

          {/* Name — massive display type with parallax */}
          <motion.div style={{ y: smoothTitleY }}>
            <h1 className="font-display leading-[0.88] select-none">
              <div className="overflow-hidden">
                <motion.span
                  variants={lineVariants}
                  className="block text-[13vw] md:text-[11vw] lg:text-[10vw] font-light tracking-tighter"
                  style={{ color: "var(--color-text)" }}
                >
                  Alex
                </motion.span>
              </div>
              <div className="overflow-hidden flex items-baseline gap-[0.05em]">
                <motion.span
                  variants={lineVariants}
                  className="block text-[13vw] md:text-[11vw] lg:text-[10vw] font-light tracking-tighter italic"
                  style={{ color: "var(--color-text)" }}
                >
                  Mercer
                </motion.span>
                {/* Decorative period */}
                <motion.span
                  variants={lineVariants}
                  className="text-[13vw] md:text-[11vw] lg:text-[10vw] font-normal"
                  style={{ color: "var(--color-accent)" }}
                >
                  .
                </motion.span>
              </div>
            </h1>
          </motion.div>

          {/* Subtitle row with parallax */}
          <motion.div
            style={{ y: smoothSubY }}
            className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <motion.p
              variants={fadeIn}
              className="max-w-md font-body text-base md:text-lg font-light leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              I craft immersive digital experiences where{" "}
              <em className="not-italic font-normal" style={{ color: "var(--color-text)" }}>
                design precision
              </em>{" "}
              meets{" "}
              <em className="not-italic font-normal" style={{ color: "var(--color-text)" }}>
                technical depth
              </em>
              . 6 years turning complex problems into elegant interfaces.
            </motion.p>

            {/* CTA */}
            <motion.div variants={fadeIn} style={{ y: ctaY }}>
              <button
                onClick={scrollToWork}
                className="group relative overflow-hidden px-8 py-4 font-body text-sm
                           tracking-widest uppercase font-medium"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "var(--color-bg)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.backgroundColor = "var(--color-accent-light)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.backgroundColor = "var(--color-accent)";
                }}
              >
                <span className="relative z-10">View My Work</span>
                {/* Arrow */}
                <span
                  className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                >
                  →
                </span>
              </button>
            </motion.div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={fadeIn}
            className="mt-16 pt-8 border-t flex flex-wrap gap-12"
            style={{ borderColor: "var(--color-border)" }}
          >
            {[
              { value: "6+", label: "Years experience" },
              { value: "40+", label: "Projects shipped" },
              { value: "12", label: "Awards won" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span
                  className="font-display text-4xl font-light"
                  style={{ color: "var(--color-text)" }}
                >
                  {stat.value}
                </span>
                <span
                  className="font-mono text-xs mt-1 tracking-widest uppercase"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── Scroll indicator arrow ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border flex items-start justify-center p-1.5"
          style={{ borderColor: "var(--color-text-muted)" }}
        >
          <motion.div
            className="w-0.5 h-2 rounded-full"
            style={{ backgroundColor: "var(--color-accent)" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
