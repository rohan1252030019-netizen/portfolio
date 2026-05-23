"use client";

/**
 * Projects
 * ──────────────────────────────────────────────────────────────
 * Responsive masonry-inspired grid.
 * Each card:
 *  - 3D perspective tilt on hover (mouse tracking)
 *  - Ambient glow that follows cursor
 *  - Staggered entrance on scroll
 *  - Click → full-screen detail modal
 */

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";

// ─── Data ─────────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: 1,
    title: "Velox Design System",
    category: "Design Engineering",
    year: "2024",
    description:
      "A comprehensive component library and design system for a Fortune 500 company — 200+ components, full Figma integration, and zero accessibility failures.",
    longDescription:
      "Led a team of 4 engineers to build Velox, a world-class design system used across 12 product teams. Includes 200+ components, full dark/light mode, WCAG AA compliance, and a custom Figma plugin that auto-generates component code.",
    tags: ["React", "TypeScript", "Storybook", "Figma API", "CSS-in-JS"],
    color: "#e8a44d",
    gradient: "from-[#1a1200] to-[#0a0a07]",
    accentGradient: "linear-gradient(135deg, rgba(232,164,77,0.15), rgba(232,164,77,0.02))",
    metrics: ["200+ components", "12 teams", "0 a11y fails"],
    featured: true,
  },
  {
    id: 2,
    title: "Luminary AI Dashboard",
    category: "Product Design + Dev",
    year: "2024",
    description:
      "Real-time AI analytics platform handling 50M+ events/day. Custom WebGL data visualizations and sub-100ms render times.",
    longDescription:
      "Designed and built the entire frontend of Luminary — an AI observability platform. Includes custom WebGL scatter plots, real-time streaming via SSE, and a query builder with 200k+ rows of live data.",
    tags: ["Next.js", "Three.js", "WebGL", "D3.js", "Postgres"],
    color: "#3d6b8c",
    gradient: "from-[#0a1520] to-[#070d17]",
    accentGradient: "linear-gradient(135deg, rgba(61,107,140,0.15), rgba(61,107,140,0.02))",
    metrics: ["50M events/day", "<100ms render", "99.9% uptime"],
    featured: true,
  },
  {
    id: 3,
    title: "Forma E-commerce",
    category: "Frontend Development",
    year: "2023",
    description:
      "High-conversion luxury e-commerce storefront with scroll-driven product storytelling and 99 Lighthouse score.",
    longDescription:
      "End-to-end frontend for a luxury furniture brand. Implemented scroll-driven animations using GSAP, a 3D product viewer, and a custom CMS integration that lets editors build pages without touching code.",
    tags: ["Next.js", "GSAP", "Three.js", "Sanity CMS", "Stripe"],
    color: "#8f7355",
    gradient: "from-[#150f09] to-[#0a0807]",
    accentGradient: "linear-gradient(135deg, rgba(143,115,85,0.15), rgba(143,115,85,0.02))",
    metrics: ["99 Lighthouse", "+34% conversion", "3D viewer"],
    featured: false,
  },
  {
    id: 4,
    title: "Pulse Social App",
    category: "Full-Stack",
    year: "2023",
    description:
      "Experimental micro-social app with realtime presence, ephemeral content, and fluid gesture-based navigation.",
    longDescription:
      "A passion project that grew to 15k users. Built entirely solo — React Native, Expo, Supabase, and a custom hand-gesture recognition layer using TensorFlow.js.",
    tags: ["React Native", "Expo", "Supabase", "TensorFlow.js"],
    color: "#6b4d8c",
    gradient: "from-[#110a1a] to-[#090710]",
    accentGradient: "linear-gradient(135deg, rgba(107,77,140,0.15), rgba(107,77,140,0.02))",
    metrics: ["15k users", "Solo built", "Gesture nav"],
    featured: false,
  },
  {
    id: 5,
    title: "Chronicle Journalism",
    category: "Editorial + Dev",
    year: "2022",
    description:
      "Award-winning interactive longform journalism platform with immersive scroll-driven data stories.",
    longDescription:
      "Partnered with a newsroom to build their new digital platform. Created a scroll-driven story format featuring custom D3 charts, animated maps, and audio sync — won a Webby Award.",
    tags: ["React", "D3.js", "Mapbox", "Web Audio API"],
    color: "#4a8c5c",
    gradient: "from-[#091409] to-[#070a07]",
    accentGradient: "linear-gradient(135deg, rgba(74,140,92,0.15), rgba(74,140,92,0.02))",
    metrics: ["Webby Award", "D3 + Maps", "Audio sync"],
    featured: false,
  },
  {
    id: 6,
    title: "Helix SaaS Platform",
    category: "Product Engineering",
    year: "2022",
    description:
      "B2B SaaS platform from 0→1, scaling to $2M ARR. Built with performance-first architecture.",
    longDescription:
      "Joined as the first frontend engineer at a B2B startup, built the entire product from scratch. Grew to $2M ARR within 18 months. Highlights include a custom drag-and-drop workflow builder, real-time collaboration, and an analytics module.",
    tags: ["React", "TypeScript", "Zustand", "tRPC", "Prisma"],
    color: "#8c4a4a",
    gradient: "from-[#1a0909] to-[#0a0707]",
    accentGradient: "linear-gradient(135deg, rgba(140,74,74,0.15), rgba(140,74,74,0.02))",
    metrics: ["$2M ARR", "0→1 build", "Real-time collab"],
    featured: false,
  },
];

// ─── Project Card ─────────────────────────────────────────────────────────────
interface CardProps {
  project: (typeof PROJECTS)[0];
  index: number;
  onOpen: (p: (typeof PROJECTS)[0]) => void;
  inView: boolean;
}

function ProjectCard({ project, index, onOpen, inView }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();

    // Normalise to -1 → 1
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    // Max tilt: ±8deg
    setTilt({ x: ny * -8, y: nx * 8 });

    // Glow position as percentage
    setGlow({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  }, []);

  const isFeatured = project.featured;

  return (
    <motion.div
      ref={cardRef}
      className={`relative cursor-pointer overflow-hidden border ${
        isFeatured ? "col-span-1 md:col-span-2" : ""
      }`}
      style={{
        borderColor: "var(--color-border)",
        background: project.accentGradient,
        transformStyle: "preserve-3d",
        transform: hovered
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.01)`
          : "perspective(1000px) rotateX(0) rotateY(0) scale(1)",
        transition: hovered
          ? "transform 0.05s ease"
          : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: 0.1 + index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpen(project)}
    >
      {/* Mouse-following glow */}
      {hovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 200px at ${glow.x}% ${glow.y}%, ${project.color}20, transparent)`,
            opacity: hovered ? 1 : 0,
          }}
        />
      )}

      <div className={`p-8 md:p-10 ${isFeatured ? "grid grid-cols-1 md:grid-cols-2 gap-8" : ""}`}>
        {/* Left / Main content */}
        <div className="flex flex-col justify-between h-full">
          <div>
            {/* Meta */}
            <div className="flex items-center justify-between mb-6">
              <span
                className="font-mono text-[10px] tracking-superwide uppercase"
                style={{ color: project.color }}
              >
                {project.category}
              </span>
              <span
                className="font-mono text-[10px]"
                style={{ color: "var(--color-text-muted)" }}
              >
                {project.year}
              </span>
            </div>

            {/* Title */}
            <h3
              className={`font-display font-light leading-tight mb-4 ${
                isFeatured ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl"
              }`}
              style={{ color: "var(--color-text)" }}
            >
              {project.title}
            </h3>

            <p
              className="font-body text-sm leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              {project.description}
            </p>
          </div>

          {/* Tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[10px] font-mono border"
                style={{
                  borderColor: `${project.color}40`,
                  color: project.color,
                  backgroundColor: `${project.color}08`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right — metrics (featured only) */}
        {isFeatured && (
          <div className="flex flex-col justify-between">
            {/* Decorative box / image placeholder */}
            <div
              className="flex-1 rounded-sm flex items-center justify-center min-h-[180px] md:min-h-auto"
              style={{
                background: `linear-gradient(135deg, ${project.color}15, ${project.color}05)`,
                border: `1px solid ${project.color}20`,
              }}
            >
              <span
                className="font-display text-[80px] md:text-[100px] font-light opacity-10 select-none"
                style={{ color: project.color }}
              >
                {String(project.id).padStart(2, "0")}
              </span>
            </div>

            {/* Metrics */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              {project.metrics.map((m) => (
                <div key={m} className="text-center">
                  <span
                    className="font-mono text-xs block"
                    style={{ color: project.color }}
                  >
                    {m}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ backgroundColor: project.color }}
        initial={{ scaleX: 0, transformOrigin: "left" }}
        animate={hovered ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Arrow CTA */}
      <motion.div
        className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full border"
        style={{
          borderColor: `${project.color}40`,
          color: project.color,
        }}
        animate={hovered ? { scale: 1.1, borderColor: project.color } : { scale: 1 }}
      >
        <span className="text-xs">↗</span>
      </motion.div>
    </motion.div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
interface ModalProps {
  project: (typeof PROJECTS)[0] | null;
  onClose: () => void;
}

function ProjectModal({ project, onClose }: ModalProps) {
  if (!project) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[900] flex items-end md:items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(8,8,7,0.9)" }} />

      {/* Panel */}
      <motion.div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4"
        style={{
          backgroundColor: "var(--color-surface-2)",
          border: `1px solid ${project.color}30`,
        }}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 border-b" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex items-start justify-between">
            <div>
              <span
                className="font-mono text-[10px] tracking-superwide uppercase"
                style={{ color: project.color }}
              >
                {project.category} · {project.year}
              </span>
              <h2
                className="font-display text-4xl font-light mt-2 leading-tight"
                style={{ color: "var(--color-text)" }}
              >
                {project.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center border text-xl"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text-muted)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget).style.borderColor = project.color;
                (e.currentTarget).style.color = project.color;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget).style.borderColor = "var(--color-border)";
                (e.currentTarget).style.color = "var(--color-text-muted)";
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8">
          <p
            className="font-body text-base leading-relaxed"
            style={{ color: "var(--color-text-muted)" }}
          >
            {project.longDescription}
          </p>

          <div className="grid grid-cols-3 gap-6 py-6 border-y" style={{ borderColor: "var(--color-border)" }}>
            {project.metrics.map((m) => (
              <div key={m} className="text-center">
                <span
                  className="font-display text-2xl font-light block"
                  style={{ color: project.color }}
                >
                  {m}
                </span>
              </div>
            ))}
          </div>

          <div>
            <p className="font-mono text-[10px] tracking-widest uppercase mb-3"
               style={{ color: "var(--color-text-muted)" }}>
              Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-mono"
                  style={{
                    border: `1px solid ${project.color}40`,
                    color: project.color,
                    backgroundColor: `${project.color}08`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <button
            className="w-full py-4 font-mono text-sm tracking-widest uppercase flex items-center justify-center gap-3 transition-colors duration-200"
            style={{
              backgroundColor: project.color,
              color: "var(--color-bg)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget).style.opacity = "0.9")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget).style.opacity = "1")
            }
          >
            View Live Project <span>↗</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<
    (typeof PROJECTS)[0] | null
  >(null);

  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  return (
    <>
      <div
        ref={ref}
        className="relative section-padding"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ backgroundColor: "var(--color-border)" }}
        />

        <div className="container-wide">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <motion.div
                className="flex items-center gap-3 mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                <span
                  className="font-mono text-[10px] tracking-superwide uppercase"
                  style={{ color: "var(--color-accent)" }}
                >
                  03 — Selected work
                </span>
                <div
                  className="h-px flex-1 max-w-[60px]"
                  style={{ backgroundColor: "var(--color-accent)" }}
                />
              </motion.div>

              <div className="overflow-hidden">
                <motion.h2
                  className="font-display text-5xl md:text-6xl lg:text-7xl font-light leading-tight"
                  style={{ color: "var(--color-text)" }}
                  initial={{ y: "110%" }}
                  animate={inView ? { y: "0%" } : {}}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                >
                  Projects that
                  <br />
                  <span style={{ color: "var(--color-accent)" }} className="italic">
                    matter.
                  </span>
                </motion.h2>
              </div>
            </div>

            <motion.a
              href="#"
              className="font-mono text-sm tracking-wider uppercase flex items-center gap-2 self-end"
              style={{ color: "var(--color-text-muted)" }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "var(--color-accent)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)")
              }
            >
              All projects <span>→</span>
            </motion.a>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PROJECTS.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onOpen={setSelectedProject}
                inView={inView}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            key={selectedProject.id}
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
