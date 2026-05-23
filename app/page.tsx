"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";

import Loader from "@/components/Loader";
import CustomCursor from "@/components/Cursor";
import Navigation from "@/components/Navigation";
import ScrollProgress from "@/components/ScrollProgress";
import Hero from "@/components/Hero";
import CanvasSequence from "@/components/CanvasSequence";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* ── Custom cursor (desktop only) ── */}
      <CustomCursor />

      {/* ── Scroll progress bar ── */}
      <ScrollProgress />

      {/* ── Preloader ── */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <Loader key="loader" onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* ── Main content — wrapped in Lenis smooth scroll ── */}
      <SmoothScroll>
        <main>
          {/* Sticky nav */}
          <Navigation />

          {/* 1. Hero */}
          <section id="home">
            <Hero />
          </section>

          {/* 2. Canvas scroll sequence */}
          <section id="reel">
            <CanvasSequence />
          </section>

          {/* 3. About */}
          <section id="about">
            <About />
          </section>

          {/* 4. Projects */}
          <section id="work">
            <Projects />
          </section>

          {/* 5. Footer / Contact */}
          <section id="contact">
            <Footer />
          </section>
        </main>
      </SmoothScroll>
    </>
  );
}
