"use client";

/**
 * About
 * ──────────────────────────────────────────────────────────────
 * Two-column bio section.
 * - Left: large number / label + tech stack chips
 * - Right: long-form bio paragraphs with staggered line reveals
 * - Animated on scroll via IntersectionObserver
 * - Horizontal skills marquee
 */

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";

const SKILLS = [
  "React", "Next.js", "TypeScript", "Framer Motion", "Three.js",
  "GSAP", "Node.js", "Figma", "WebGL", "Canvas API",
  "Tailwind CSS", "PostgreSQL", "GraphQL", "Docker", "AWS",
];

const TOOLS = [
  "VS Code", "Figma", "Arc", "Notion", "Linear",
  "Vercel", "GitHub", "Insomnia", "Raycast", "Zed",
];

interface RevealLineProps {
  children: React.ReactNode;
  delay?: number;
  inView: boolean;
}

function RevealLine({ children, delay = 0, inView }: RevealLineProps) {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "110%" }}
        animate={inView ? { y: "0%" } : { y: "110%" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function About() {
  const { ref: sectionRef, inView } = useInView({
    threshold: 0.15,
    triggerOnce: true,
  });

  const marqueeRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={sectionRef}
      className="relative section-padding overflow-hidden"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      {/* ── Decorative border top ── */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ backgroundColor: "var(--color-border)" }}
      />

      <div className="container-wide">
        {/* ── Section marker ── */}
        <motion.div
          className="flex items-center gap-3 mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span
            className="font-mono text-[10px] tracking-superwide uppercase"
            style={{ color: "var(--color-accent)" }}
          >
            02 — About
          </span>
          <div className="h-px flex-1 max-w-[60px]" style={{ backgroundColor: "var(--color-accent)" }} />
        </motion.div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24">

          {/* Left column */}
          <div>
            <RevealLine inView={inView} delay={0.1}>
              <div
                className="font-display text-[120px] leading-none font-light"
                style={{ color: "var(--color-border)" }}
              >
                AM
              </div>
            </RevealLine>

            {/* Portrait placeholder */}
            <motion.div
              className="mt-8 relative w-full aspect-[3/4] max-w-[280px] overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg,
                    hsl(200, 30%, 10%) 0%,
                    hsl(230, 25%, 14%) 50%,
                    hsl(38, 30%, 12%) 100%)`,
                }}
              />
              {/* Decorative avatar */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="font-display text-8xl font-light"
                  style={{ color: "var(--color-text-muted)", opacity: 0.3 }}
                >
                  A
                </span>
              </div>
              {/* Hover tint */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1/3"
                style={{
                  background:
                    "linear-gradient(to top, rgba(8,8,7,0.8), transparent)",
                }}
              />
              {/* Caption */}
              <div className="absolute bottom-4 left-4">
                <p
                  className="font-mono text-[10px] tracking-widest uppercase"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  San Francisco, CA
                </p>
              </div>

              {/* Amber border accent */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: "var(--color-accent)" }}
              />
            </motion.div>

            {/* Availability badge */}
            <motion.div
              className="mt-6 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span
                className="font-mono text-xs tracking-widest uppercase"
                style={{ color: "var(--color-text-muted)" }}
              >
                Available for projects
              </span>
            </motion.div>
          </div>

          {/* Right column — bio */}
          <div className="flex flex-col justify-center">
            <div className="space-y-8">
              <div>
                <RevealLine inView={inView} delay={0.2}>
                  <h2
                    className="font-display text-4xl md:text-5xl lg:text-6xl font-light leading-tight"
                    style={{ color: "var(--color-text)" }}
                  >
                    I build things that
                  </h2>
                </RevealLine>
                <RevealLine inView={inView} delay={0.32}>
                  <h2
                    className="font-display text-4xl md:text-5xl lg:text-6xl font-light leading-tight italic"
                    style={{ color: "var(--color-accent)" }}
                  >
                    feel alive.
                  </h2>
                </RevealLine>
              </div>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <p
                  className="font-body text-base leading-relaxed"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  I'm a creative developer based in San Francisco with 6 years of
                  experience at the intersection of engineering and design. I've
                  shipped products used by millions at companies like{" "}
                  <span style={{ color: "var(--color-text)" }}>Stripe</span>,{" "}
                  <span style={{ color: "var(--color-text)" }}>Linear</span>, and{" "}
                  <span style={{ color: "var(--color-text)" }}>Vercel</span>.
                </p>
                <p
                  className="font-body text-base leading-relaxed"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  My obsession is the gap between a good product and a{" "}
                  <em className="not-italic" style={{ color: "var(--color-text)" }}>
                    memorable
                  </em>{" "}
                  one — the micro-interactions, the pacing, the moments of
                  delightful surprise that make users feel like the interface
                  understands them.
                </p>
                <p
                  className="font-body text-base leading-relaxed"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  When I'm not pushing pixels, you'll find me contributing to
                  open source, shooting analog film, or deep in a rabbit hole
                  about generative art and WebGL shaders.
                </p>
              </motion.div>

              {/* Tech chips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <p
                  className="font-mono text-[10px] tracking-widest uppercase mb-3"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Core stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {["React", "Next.js", "TypeScript", "Framer Motion", "Three.js", "Node.js", "Figma"].map(
                    (tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs font-mono border transition-colors duration-200
                                   hover:border-amber-DEFAULT hover:text-amber-DEFAULT cursor-default"
                        style={{
                          borderColor: "var(--color-border)",
                          color: "var(--color-text-muted)",
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.borderColor = "var(--color-accent)";
                          (e.target as HTMLElement).style.color = "var(--color-accent)";
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.borderColor = "var(--color-border)";
                          (e.target as HTMLElement).style.color = "var(--color-text-muted)";
                        }}
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              </motion.div>

              {/* Resume CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.75 }}
              >
                <a
                  href="#"
                  className="inline-flex items-center gap-3 font-mono text-sm tracking-wider
                             uppercase transition-colors duration-300 group"
                  style={{ color: "var(--color-text-muted)" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "var(--color-accent)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)")
                  }
                >
                  <span>Download résumé</span>
                  <motion.span
                    className="inline-block"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ↓
                  </motion.span>
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Marquee ── */}
      <div className="mt-24 relative overflow-hidden">
        <div
          className="h-px mb-8"
          style={{ backgroundColor: "var(--color-border)" }}
        />
        <div className="flex">
          <motion.div
            className="flex gap-16 items-center whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          >
            {[...SKILLS, ...SKILLS].map((skill, i) => (
              <span
                key={i}
                className="font-display text-5xl md:text-6xl font-light italic opacity-10"
                style={{ color: "var(--color-text)" }}
              >
                {skill}
                <span style={{ color: "var(--color-accent)", opacity: 1 }}>
                  {" "}·{" "}
                </span>
              </span>
            ))}
          </motion.div>
        </div>
        <div
          className="h-px mt-8"
          style={{ backgroundColor: "var(--color-border)" }}
        />
      </div>
    </div>
  );
}
