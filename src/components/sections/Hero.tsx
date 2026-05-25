"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { motion, useReducedMotion } from "framer-motion";

import { HeroLibraryDemo } from "@/components/hero/HeroLibraryDemo";
import {
  CORDER_PRESENCE_LAYOUT_ID,
  CORDER_PRESENCE_MORPH_TRANSITION,
  useHeroPresenceMode,
} from "@/components/presence/CorderPresence";

import { copy } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/Hero.tsx";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Hero() {
  const reduced = useReducedMotion() ?? false;
  const heroPresence = useHeroPresenceMode();
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
      className="relative w-full overflow-x-clip pt-[200px] pb-8 md:pt-[168px] md:pb-12"
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
            data-pauseable
          >
            <HeadlineWithRec text={hero.headline} target="Record" />
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
              href="https://github.com/halinskiy/corder-updates/releases/latest/download/Corder.zip"
              download="Corder.zip"
              className="cta-pill cta-pill--primary inline-flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] px-6 text-[17px] font-medium md:w-auto md:min-w-[260px] md:px-9"
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
          {heroPresence.mode === "live" ? (
            // Live block: HeroLibraryDemo wrapped in motion.div with the
            // shared layoutId. When the user scrolls into HIW, the
            // sentinel flips pastHero true; this element unmounts, HIW's
            // window-wrap mounts with the same layoutId, and framer
            // FLIP-morphs the bounds. Visually the whole block flies
            // from Hero into HIW row 1.
            <motion.div
              layoutId={CORDER_PRESENCE_LAYOUT_ID}
              transition={{ layout: CORDER_PRESENCE_MORPH_TRANSITION }}
              className="hero-demo-live"
              data-component="HeroDemoLive"
            >
              <HeroLibraryDemo />
            </motion.div>
          ) : heroPresence.mode === "ghost" ? (
            // Past the handoff. HIW owns the layoutId now; Hero shows a
            // dashed placeholder so the page composition still reads
            // correctly when the user scrolls back up.
            <div className="hero-demo-ghost" aria-hidden="true" />
          ) : (
            // Motion disabled. No morph, no layoutId. Render the demo
            // flat, exactly as the pre-morph build did.
            <HeroLibraryDemo />
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * HeadlineWithRec — splits the headline text once at `target` (the
 * word to wrap as an animated "record" pill) and renders the wrap
 * inline. All the motion lives in the .hero-rec-pill CSS rule + its
 * keyframes; this component is just structural. If `target` is not
 * present in `text` the whole string renders untouched.
 *
 * The pill cycles: outline rest → click squeeze + pulse ring →
 * filled red recording → click squeeze + pulse ring → outline rest.
 * Loop. data-pauseable on the parent h1 stops the cycle once the
 * hero leaves the viewport (CPU/battery saver).
 */
function HeadlineWithRec({
  text,
  target,
}: {
  text: string;
  target: string;
}) {
  // Binary state machine. The pill holds either "rest" or "recording".
  // The auto-cycle alternates between them on a timer (1.8 s page-
  // settle warm-up, then 7 s rest / 3 s recording). The CSS uses
  // `[data-rec]` selectors to drive bg opacity + text colour as
  // smooth transitions, so the swap is seamless even mid-flight.
  //
  // The user can click / Space / Enter to toggle state at any time.
  // Toggling just flips the state -- the cycle keeps running, the
  // next phase fires from the new state. No animation restart, no
  // 0%-jump.
  //
  // The brief squeeze on every state change is a separate transient
  // class that React adds for 280 ms each toggle. It maps cleanly to
  // the existing transform-transition; no keyframe.
  const idx = text.indexOf(target);
  const [recState, setRecState] = useState<"rest" | "recording">("rest");
  const [squeezing, setSqueezing] = useState(false);
  const warmedRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const squeezeTimerRef = useRef<number | null>(null);

  const flip = useCallback(() => {
    setRecState((s) => (s === "rest" ? "recording" : "rest"));
    setSqueezing(true);
    if (squeezeTimerRef.current)
      window.clearTimeout(squeezeTimerRef.current);
    squeezeTimerRef.current = window.setTimeout(
      () => setSqueezing(false),
      280,
    );
  }, []);

  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    const delay = warmedRef.current
      ? recState === "rest"
        ? 7000
        : 3000
      : 1800;
    warmedRef.current = true;
    timerRef.current = window.setTimeout(flip, delay);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [recState, flip]);

  useEffect(
    () => () => {
      if (squeezeTimerRef.current)
        window.clearTimeout(squeezeTimerRef.current);
    },
    [],
  );

  if (idx < 0) return <>{text}</>;
  const before = text.slice(0, idx);
  const after = text.slice(idx + target.length);

  return (
    <>
      {before}
      <span
        className={`hero-rec-pill${squeezing ? " hero-rec-pill--squeeze" : ""}`}
        data-rec={recState}
        role="button"
        tabIndex={0}
        aria-label={`Toggle ${target} recording`}
        onClick={flip}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            flip();
          }
        }}
      >
        {target}
      </span>
      {after}
    </>
  );
}
