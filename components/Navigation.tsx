"use client";

/**
 * Navigation
 * ──────────────────────────────────────────────────────────────
 * Sticky top nav.
 * - Fades in after loader
 * - Turns translucent + blurred once user scrolls past hero
 * - Highlights the active section link
 * - Mobile: hamburger → full-screen overlay menu
 */

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Reel", href: "#reel" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  // Reveal after a delay (gives loader time to clear)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((href: string) => {
    const lenis = (window as any).__lenis;
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (lenis && el) {
      lenis.scrollTo(el, { offset: -72, duration: 1.6 });
    } else if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  }, []);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-[800] flex items-center justify-between px-6 md:px-12"
        style={{ height: "var(--nav-height)" }}
        initial={{ opacity: 0, y: -20 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Blurred background — appears after first scroll */}
        <AnimatePresence>
          {scrolled && (
            <motion.div
              className="absolute inset-0 nav-blur"
              style={{
                backgroundColor: "rgba(8, 8, 7, 0.75)",
                borderBottom: "1px solid var(--color-border)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          )}
        </AnimatePresence>

        {/* Logo / wordmark */}
        <button
          onClick={() => scrollTo("#home")}
          className="relative z-10 font-display text-2xl font-light tracking-tight leading-none group"
          style={{ color: "var(--color-text)" }}
        >
          Alex
          <span style={{ color: "var(--color-accent)" }}>.</span>
          <span className="text-sm font-mono ml-1 opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                style={{ color: "var(--color-text)" }}>
            Mercer
          </span>
        </button>

        {/* Desktop links */}
        <nav className="relative z-10 hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.replace("#", "");
            return (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="relative font-body text-sm tracking-wider uppercase transition-colors duration-300"
                style={{
                  color: isActive
                    ? "var(--color-accent)"
                    : "var(--color-text-muted)",
                }}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-0.5 left-0 right-0 h-px"
                    style={{ backgroundColor: "var(--color-accent)" }}
                  />
                )}
              </button>
            );
          })}

          {/* CTA */}
          <button
            onClick={() => scrollTo("#contact")}
            className="ml-4 px-5 py-2 text-sm font-body font-medium tracking-wider uppercase
                       border transition-all duration-300 hover:bg-amber-DEFAULT hover:border-amber-DEFAULT
                       hover:text-ink-900"
            style={{
              borderColor: "var(--color-accent)",
              color: "var(--color-accent)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-accent)";
              (e.currentTarget as HTMLElement).style.color = "var(--color-bg)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLElement).style.color = "var(--color-accent)";
            }}
          >
            Hire Me
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="relative z-10 flex md:hidden flex-col gap-1.5 w-8 h-8 items-center justify-center"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <motion.span
            className="block h-px w-6"
            style={{ backgroundColor: "var(--color-text)" }}
            animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="block h-px w-6"
            style={{ backgroundColor: "var(--color-text)" }}
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block h-px w-6"
            style={{ backgroundColor: "var(--color-text)" }}
            animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          />
        </button>
      </motion.header>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[700] flex flex-col items-center justify-center"
            style={{ backgroundColor: "var(--color-bg)" }}
            initial={{ clipPath: "circle(0% at calc(100% - 48px) 36px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 48px) 36px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 48px) 36px)" }}
            transition={{ duration: 0.6, ease: [0.87, 0, 0.13, 1] }}
          >
            <nav className="flex flex-col items-center gap-10">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="font-display text-4xl font-light"
                  style={{ color: "var(--color-text)" }}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {link.label}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
