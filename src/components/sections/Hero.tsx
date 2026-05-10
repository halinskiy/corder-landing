"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { HeroLibraryDemo } from "@/components/hero/HeroLibraryDemo";

import { copy } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/Hero.tsx";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const TYPE_MS = 70;
const HOLD_MS = 1700;
const ERASE_MS = 35;

export function Hero() {
  const reduced = useReducedMotion() ?? false;
  const { hero } = copy;
  const words = hero.rotatingWords;
  const [wordIndex, setWordIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<"typing" | "hold" | "erasing">("typing");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const motionFlag = document.documentElement.dataset.motion === "off";
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (motionFlag || reduceMotion) {
      setTyped(words[0]);
      return;
    }

    const word = words[wordIndex];
    let timeoutId: number;

    if (phase === "typing") {
      if (typed.length < word.length) {
        timeoutId = window.setTimeout(() => {
          setTyped(word.slice(0, typed.length + 1));
        }, TYPE_MS);
      } else {
        timeoutId = window.setTimeout(() => setPhase("hold"), 0);
      }
    } else if (phase === "hold") {
      timeoutId = window.setTimeout(() => setPhase("erasing"), HOLD_MS);
    } else {
      if (typed.length > 0) {
        timeoutId = window.setTimeout(() => {
          setTyped(typed.slice(0, -1));
        }, ERASE_MS);
      } else {
        timeoutId = window.setTimeout(() => {
          setWordIndex((i) => (i + 1) % words.length);
          setPhase("typing");
        }, 200);
      }
    }

    return () => window.clearTimeout(timeoutId);
  }, [phase, typed, wordIndex, words]);

  const maxLen = Math.max(...words.map((w) => w.length));

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
      data-tokens="display-lg,radius-pill,color-accent,font-serif,ease-out"
      className="relative w-full overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24"
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
            aria-live="polite"
          >
            <span className="hero-headline__prompt">{hero.headlinePrompt}</span>{" "}
            <span
              className="hero-headline__slot"
              style={{ minWidth: `${maxLen}ch` }}
            >
              <span className="hero-headline__word">{typed}</span>
              <span className="hero-headline__caret" aria-hidden="true" />
            </span>
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
            className="mt-[42px] flex flex-wrap items-center justify-center gap-3"
            data-component="HeroCtas"
            data-source={DATA_SOURCE}
            data-tokens="radius-pill,color-accent,color-bg,color-border-strong,ease-out"
          >
            <a
              href="#download"
              className="cta-pill cta-pill--primary inline-flex h-12 min-w-[220px] items-center justify-center gap-2 rounded-[var(--radius-pill)] px-7 text-[16px] font-medium"
            >
              {hero.ctaPrimary}
            </a>
            <a
              href="#how"
              className="cta-pill cta-pill--ghost inline-flex h-12 items-center rounded-[var(--radius-pill)] px-7 text-[16px] font-medium"
              style={{
                border: "1px solid var(--color-border-strong)",
                color: "var(--color-text)",
                backgroundColor: "transparent",
              }}
            >
              {hero.ctaSecondary}
            </a>
          </motion.div>
        </div>

        <div className="mt-14 md:mt-20">
          <HeroLibraryDemo />
        </div>
      </div>
    </section>
  );
}
