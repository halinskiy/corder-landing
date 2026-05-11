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
      className="relative w-full overflow-hidden pt-32 pb-20 md:pt-32 md:pb-24"
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
            className="mx-auto mt-6 max-w-[640px]"
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
              href="#pricing"
              className="cta-pill cta-pill--primary inline-flex h-12 min-w-[220px] items-center justify-center gap-2 rounded-[var(--radius-pill)] px-7 text-[16px] font-medium"
            >
              {hero.ctaPrimary}
            </a>
            <p
              className="hero-qualifier"
              data-component="HeroQualifier"
              data-source={DATA_SOURCE}
              data-tokens="body-sm,color-text-muted,font-sans"
            >
              {hero.qualifier}
            </p>
          </motion.div>
        </div>

        <div className="mt-14 md:mt-20">
          <HeroLibraryDemo />
        </div>
      </div>
    </section>
  );
}
