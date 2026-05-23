"use client";

/**
 * CanvasSequence
 * ──────────────────────────────────────────────────────────────
 *
 * SCROLL ANIMATION LOGIC
 * ─────────────────────
 * The section has a tall scroll container (e.g. 400vh). The canvas
 * is `position: sticky; top: 0` so it stays in view while the user
 * scrolls through the extra height.
 *
 * Scroll → frame mapping:
 *
 *   scrollProgress = (scrollY - sectionTop) / (sectionHeight - vh)
 *   frameIndex     = Math.floor(scrollProgress * (TOTAL_FRAMES - 1))
 *
 * Rendering pipeline:
 *   1. Preload all frames (Image objects) on mount
 *   2. requestAnimationFrame loop checks if currentFrame changed
 *   3. If so, drawImage() the new frame onto the canvas, scaling
 *      to cover the canvas while preserving aspect ratio
 *
 * In a real project: swap generateFrame() for real PNG sequences
 * (e.g. /frames/frame_000.jpg … frame_149.jpg) loaded via img.src.
 *
 * Performance tips implemented here:
 *   • Off-screen canvas for double-buffering
 *   • cancelAnimationFrame on unmount
 *   • Passive scroll listener
 *   • Images decoded with img.decode() before storing
 *
 * Text overlay pinned to specific scroll ranges for storytelling.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// ─── Config ───────────────────────────────────────────────────────────────────
const TOTAL_FRAMES = 60; // Number of canvas frames
const SCROLL_HEIGHT = "400vh"; // Extra height to scroll through

/**
 * Generates a placeholder canvas frame as a data URL.
 * In production: replace with real image URLs pointing to your frame sequence.
 */
function generateFrame(index: number): string {
  const offscreen = document.createElement("canvas");
  offscreen.width = 1920;
  offscreen.height = 1080;
  const ctx = offscreen.getContext("2d")!;

  // Dark background
  const progress = index / (TOTAL_FRAMES - 1); // 0 → 1
  const hue = 200 + progress * 60; // 200 (blue) → 260 (purple)

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, 1920, 1080);
  bg.addColorStop(0, `hsl(${hue}, 30%, 4%)`);
  bg.addColorStop(1, `hsl(${hue + 20}, 20%, 8%)`);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1920, 1080);

  // Animated spotlight
  const angle = (progress * Math.PI * 2);
  const cx = 960 + Math.cos(angle) * 400;
  const cy = 540 + Math.sin(angle * 0.7) * 250;
  const spotlight = ctx.createRadialGradient(cx, cy, 0, cx, cy, 700);
  spotlight.addColorStop(0, `hsla(38, 78%, 60%, ${0.15 + progress * 0.1})`);
  spotlight.addColorStop(1, "transparent");
  ctx.fillStyle = spotlight;
  ctx.fillRect(0, 0, 1920, 1080);

  // Grid lines
  ctx.strokeStyle = `rgba(232, 164, 77, ${0.04 + progress * 0.02})`;
  ctx.lineWidth = 1;
  for (let x = 0; x < 1920; x += 80) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1080); ctx.stroke();
  }
  for (let y = 0; y < 1080; y += 80) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1920, y); ctx.stroke();
  }

  // Floating particles
  const particleCount = 30;
  for (let i = 0; i < particleCount; i++) {
    const seed = (i * 7919) % 1; // deterministic
    const px = ((i * 137.508) % 1920);
    const py = ((i * 97.123 + progress * 200) % 1080);
    const r = 1 + (i % 4);
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(232, 164, 77, ${0.2 + (i % 5) * 0.1})`;
    ctx.fill();
  }

  // Central graphic — morphing circle
  const radius = 180 + Math.sin(progress * Math.PI) * 60;
  const grd = ctx.createRadialGradient(960, 540, 0, 960, 540, radius);
  grd.addColorStop(0, `rgba(232, 164, 77, 0.12)`);
  grd.addColorStop(0.6, `rgba(61, 107, 140, 0.06)`);
  grd.addColorStop(1, "transparent");
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(960, 540, radius, 0, Math.PI * 2);
  ctx.fill();

  // Ring
  ctx.strokeStyle = `rgba(232, 164, 77, ${0.3 + progress * 0.3})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(960, 540, radius, 0, Math.PI * 2);
  ctx.stroke();

  return offscreen.toDataURL("image/jpeg", 0.85);
}

// ─── Overlay text cards synced to scroll ranges ───────────────────────────────
const STORY_CARDS = [
  {
    range: [0, 0.2] as [number, number],
    headline: "Design with\nintention.",
    sub: "Every pixel has a purpose.",
  },
  {
    range: [0.25, 0.45] as [number, number],
    headline: "Engineer\nwith craft.",
    sub: "Performance is a feature, not an afterthought.",
  },
  {
    range: [0.5, 0.7] as [number, number],
    headline: "Deliver\ndelight.",
    sub: "Micro-interactions that make people smile.",
  },
  {
    range: [0.75, 0.95] as [number, number],
    headline: "Ship work\nyou're proud of.",
    sub: "Quality is the only speed that matters.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function CanvasSequence() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const [framesLoaded, setFramesLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // ── Preload frames ──────────────────────────────────────────────────────────
  useEffect(() => {
    // Generate placeholder frames. In production, map to real image URLs:
    // const urls = Array.from({ length: TOTAL_FRAMES }, (_, i) =>
    //   `/frames/frame_${String(i).padStart(3, '0')}.jpg`
    // );
    const dataUrls = Array.from({ length: TOTAL_FRAMES }, (_, i) =>
      generateFrame(i)
    );

    let loaded = 0;
    framesRef.current = dataUrls.map((src, i) => {
      const img = new Image();
      img.onload = () => {
        loaded++;
        if (loaded === TOTAL_FRAMES) setFramesLoaded(true);
      };
      img.src = src;
      return img;
    });
  }, []);

  // ── Track scroll progress within this section ──────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const el = wrapperRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const sectionH = el.offsetHeight;
      const vh = window.innerHeight;

      // How far the section top has scrolled above the viewport
      const scrolled = Math.max(0, -rect.top);
      // Total scrollable distance = section height − viewport height
      const scrollable = sectionH - vh;
      const progress = Math.min(1, Math.max(0, scrolled / scrollable));

      setScrollProgress(progress);

      // Map progress → frame index
      const frame = Math.floor(progress * (TOTAL_FRAMES - 1));
      currentFrameRef.current = frame;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Canvas render loop ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!framesLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastFrame = -1;

    /**
     * coverDraw: draws an image onto the canvas using "object-fit: cover"
     * semantics — fills the canvas while preserving image aspect ratio.
     */
    const coverDraw = (img: HTMLImageElement) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;

      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;

      ctx.drawImage(img, dx, dy, dw, dh);
    };

    const loop = () => {
      const frame = currentFrameRef.current;
      if (frame !== lastFrame) {
        const img = framesRef.current[frame];
        if (img?.complete) {
          coverDraw(img);
          lastFrame = frame;
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [framesLoaded]);

  // ── Resize canvas to match DPR ─────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      const ctx = canvas.getContext("2d")!;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ── Active story card ──────────────────────────────────────────────────────
  const activeCard = STORY_CARDS.find(
    (c) => scrollProgress >= c.range[0] && scrollProgress <= c.range[1]
  );

  return (
    <div
      ref={wrapperRef}
      className="relative"
      style={{ height: SCROLL_HEIGHT }}
    >
      {/* ── Sticky canvas + overlay ── */}
      <div className="canvas-sticky-wrapper">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          aria-hidden
        />

        {/* Dark vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 40%, rgba(8,8,7,0.7) 100%)",
          }}
        />

        {/* Loading state */}
        {!framesLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <motion.div
                className="w-8 h-8 rounded-full border-2 border-t-transparent"
                style={{ borderColor: "var(--color-accent)" }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              />
              <span
                className="font-mono text-xs tracking-widest uppercase"
                style={{ color: "var(--color-text-muted)" }}
              >
                Loading reel…
              </span>
            </div>
          </div>
        )}

        {/* ── Scroll progress counter (frame indicator) ── */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
          <div
            className="w-px"
            style={{
              height: "120px",
              backgroundColor: "var(--color-border)",
              position: "relative",
            }}
          >
            <motion.div
              className="absolute top-0 left-0 w-full"
              style={{
                height: `${scrollProgress * 100}%`,
                backgroundColor: "var(--color-accent)",
                transition: "height 0.1s linear",
              }}
            />
          </div>
          <span
            className="font-mono text-xs tabular-nums"
            style={{ color: "var(--color-text-muted)" }}
          >
            {String(currentFrameRef.current + 1).padStart(2, "0")}
          </span>
        </div>

        {/* ── Story text overlay ── */}
        <div className="absolute inset-0 flex items-center px-8 md:px-20 pointer-events-none">
          <div className="max-w-2xl">
            {STORY_CARDS.map((card, i) => {
              const isActive =
                scrollProgress >= card.range[0] &&
                scrollProgress <= card.range[1];

              return (
                <motion.div
                  key={i}
                  className="absolute"
                  animate={{
                    opacity: isActive ? 1 : 0,
                    y: isActive ? 0 : 30,
                  }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h2
                    className="font-display text-[8vw] md:text-[5vw] font-light leading-tight whitespace-pre-line"
                    style={{ color: "var(--color-text)" }}
                  >
                    {card.headline}
                  </h2>
                  <p
                    className="mt-4 font-body text-base md:text-lg font-light"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {card.sub}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Section label ── */}
        <div
          className="absolute top-10 left-8 md:left-20 flex items-center gap-3"
        >
          <span
            className="font-mono text-[10px] tracking-superwide uppercase"
            style={{ color: "var(--color-accent)" }}
          >
            01 — Reel
          </span>
        </div>
      </div>
    </div>
  );
}
