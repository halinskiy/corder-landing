"use client";

import { motion, useReducedMotion } from "framer-motion";

import { HeroLibraryDemo } from "@/components/hero/HeroLibraryDemo";

import { copy } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/Hero.tsx";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Hero() {
  const reduced = useReducedMotion() ?? false;
  const { hero } = copy;

  const variants = reduced
    ? {
        hidden: { opacity: 1, y: 0, filter: "blur(0)" },
        visible: { opacity: 1, y: 0, filter: "blur(0)" },
      }
    : {
        hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)" },
      };

  return (
    <section
      data-component="Hero"
      data-source={DATA_SOURCE}
      data-tokens="display-lg,font-serif,color-text,ease-out"
      className="relative w-full overflow-x-clip pt-40 pb-8 md:pt-32 md:pb-12"
    >
      {/* Atmospheric dot grid behind the demo, faded edges. */}
      <div
        aria-hidden
        className="dot-grid-surface pointer-events-none absolute inset-x-0 bottom-0 top-32 -z-10"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0, rgba(0,0,0,0.6) 18%, rgba(0,0,0,0.6) 82%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0, rgba(0,0,0,0.6) 18%, rgba(0,0,0,0.6) 82%, transparent 100%)",
        }}
      />

      {/* Two ambient accent-green blobs in the hero background.
       *  Pumble-style atmosphere in our own colour. Pure CSS, static,
       *  low opacity, large filter-blur so the edges feel like coloured
       *  fog rather than shapes. Sit behind every painted element and
       *  never receive pointer events. */}
      <div aria-hidden className="hero-blob hero-blob--tr" />
      <div aria-hidden className="hero-blob hero-blob--bl" />

      <div className="page-container">
        <div className="mx-auto max-w-[1100px] text-center [text-wrap:balance]">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={variants}
            transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
            className="font-serif font-medium"
            style={{
              fontSize: "clamp(36px, 5.2vw, 72px)",
              lineHeight: "var(--lh-display)",
              letterSpacing: "var(--ls-display)",
              color: "var(--color-text)",
            }}
            data-component="HeroHeadline"
            data-source={DATA_SOURCE}
            data-tokens="display-lg,font-serif,lh-display,ls-display,color-text"
          >
            {hero.headline}
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={variants}
            transition={{ duration: 0.6, ease: EASE, delay: 0.16 }}
            className="mx-auto mt-3 max-w-[640px]"
            style={{
              fontSize: "var(--text-body-lg)",
              lineHeight: "var(--lh-body)",
              color: "var(--color-text-muted)",
            }}
            data-component="HeroSubhead"
            data-source={DATA_SOURCE}
            data-tokens="body-lg,lh-body,color-text-muted,font-sans"
          >
            {hero.subhead.split(/\{\{(.+?)\}\}/).join("")}
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={variants}
            transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
            className="mt-[42px] flex flex-col items-center justify-center gap-3"
            data-component="HeroCtas"
            data-source={DATA_SOURCE}
            data-tokens="radius-pill,color-accent,color-bg,ease-out"
          >
            <a
              href="#download"
              className="cta-pill cta-pill--primary inline-flex h-14 min-w-[200px] items-center justify-center gap-2 rounded-[var(--radius-pill)] px-6 text-[17px] font-medium md:min-w-[260px] md:px-9"
              data-track-event="cta_download_click"
              data-track-source="hero"
            >
              {hero.ctaPrimary}
            </a>
            {hero.ctaHint && (
              <p
                className="hero-cta-hint"
                data-component="HeroCtaHint"
                data-source={DATA_SOURCE}
                data-tokens="text-sm,color-text-subtle,font-sans"
              >
                {hero.ctaHint}
              </p>
            )}
          </motion.div>
        </div>

        <div className="hero-demo-wrap mt-14 md:mt-20">
          <HeroLibraryDemo />
        </div>
      </div>
    </section>
  );
}
