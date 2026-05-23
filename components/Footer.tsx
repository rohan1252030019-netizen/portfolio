"use client";

/**
 * Footer
 * ──────────────────────────────────────────────────────────────
 * Full-viewport contact / footer section.
 * - Large CTA headline
 * - Email link with hover animation
 * - Social links row
 * - Copyright strip
 */

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com" },
  { label: "Twitter / X", href: "https://twitter.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Dribbble", href: "https://dribbble.com" },
  { label: "Read.cv", href: "https://read.cv" },
];

export default function Footer() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { ref: inViewRef, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["8%", "0%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["30px", "0px"]);

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-between overflow-hidden"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      {/* ── Decorative glow ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: bgY }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px]
                     rounded-full opacity-[0.06] blur-[150px]"
          style={{ backgroundColor: "var(--color-accent)" }}
        />
      </motion.div>

      <div className="absolute top-0 left-0 right-0 h-px" style={{ backgroundColor: "var(--color-border)" }} />

      {/* ── Main content ── */}
      <div ref={inViewRef} className="container-wide flex flex-col flex-1 justify-center py-32">

        {/* Section marker */}
        <motion.div
          className="flex items-center gap-3 mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="font-mono text-[10px] tracking-superwide uppercase" style={{ color: "var(--color-accent)" }}>
            04 — Contact
          </span>
          <div className="h-px flex-1 max-w-[60px]" style={{ backgroundColor: "var(--color-accent)" }} />
        </motion.div>

        {/* Big CTA */}
        <motion.div style={{ y: textY }}>
          <div className="overflow-hidden mb-2">
            <motion.h2
              className="font-display text-[8vw] md:text-[6vw] lg:text-[5vw] font-light leading-tight"
              style={{ color: "var(--color-text)" }}
              initial={{ y: "110%" }}
              animate={inView ? { y: "0%" } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            >
              Have a project in mind?
            </motion.h2>
          </div>
          <div className="overflow-hidden">
            <motion.h2
              className="font-display text-[8vw] md:text-[6vw] lg:text-[5vw] font-light leading-tight italic"
              style={{ color: "var(--color-accent)" }}
              initial={{ y: "110%" }}
              animate={inView ? { y: "0%" } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.27 }}
            >
              Let's build it.
            </motion.h2>
          </div>
        </motion.div>

        {/* Email link */}
        <motion.a
          href="mailto:hello@alexmercer.dev"
          className="mt-12 inline-flex items-center gap-4 group"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span
            className="font-display text-2xl md:text-4xl font-light underline decoration-1
                       underline-offset-4 transition-colors duration-300 group-hover:no-underline"
            style={{ color: "var(--color-text)" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-accent)")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-text)")}
          >
            hello@alexmercer.dev
          </span>
          <motion.span
            className="font-body text-2xl"
            style={{ color: "var(--color-accent)" }}
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            →
          </motion.span>
        </motion.a>

        {/* Availability note */}
        <motion.div
          className="mt-6 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.65 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="font-mono text-xs tracking-widest uppercase"
                style={{ color: "var(--color-text-muted)" }}>
            Available for freelance — Q2 2025
          </span>
        </motion.div>

        {/* Divider */}
        <motion.div
          className="mt-20 h-px"
          style={{ backgroundColor: "var(--color-border)" }}
          initial={{ scaleX: 0, transformOrigin: "left" }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Social links */}
        <motion.div
          className="mt-10 flex flex-wrap gap-8"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs tracking-widest uppercase transition-colors duration-300"
              style={{ color: "var(--color-text-muted)" }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "var(--color-accent)")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = "var(--color-text-muted)")
              }
            >
              {link.label}
            </a>
          ))}
        </motion.div>
      </div>

      {/* ── Bottom strip ── */}
      <div
        className="border-t flex flex-col md:flex-row items-center justify-between
                   px-6 md:px-12 py-6 gap-4"
        style={{ borderColor: "var(--color-border)" }}
      >
        <span
          className="font-mono text-[10px] tracking-widest"
          style={{ color: "var(--color-text-muted)" }}
        >
          © 2025 Alex Mercer — Designed & developed with obsession.
        </span>

        <div className="flex items-center gap-6">
          <span
            className="font-mono text-[10px] tracking-widest"
            style={{ color: "var(--color-text-muted)" }}
          >
            Built with Next.js · Framer Motion · ❤
          </span>

          {/* Back to top */}
          <button
            onClick={() => {
              const lenis = (window as any).__lenis;
              if (lenis) lenis.scrollTo(0, { duration: 1.8 });
              else window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="w-8 h-8 flex items-center justify-center border text-xs
                       transition-colors duration-300"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-muted)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget).style.borderColor = "var(--color-accent)";
              (e.currentTarget).style.color = "var(--color-accent)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget).style.borderColor = "var(--color-border)";
              (e.currentTarget).style.color = "var(--color-text-muted)";
            }}
            aria-label="Back to top"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
