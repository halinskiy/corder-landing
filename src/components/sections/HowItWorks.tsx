"use client";

import { useEffect, useRef, useState } from "react";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import { copy } from "@/content/copy";
import {
  CORDER_PRESENCE_LAYOUT_ID,
  CORDER_PRESENCE_MORPH_TRANSITION,
  CorderPresenceSentinel,
  useCorderPresenceMode,
} from "@/components/presence/CorderPresence";
import { ChapterMockup } from "@/components/sections/HowItWorksMockups";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/HowItWorks.tsx";

// Spring physics for the snap motion. Tuned for a noticeable ease-in-out
// settle without overshoot -- the window should feel like it lifts off the
// page, glides to the next slot, and lands.
const SPRING = { stiffness: 105, damping: 24, mass: 0.7 } as const;

type Chapter = 1 | 2 | 3;

/**
 * HowItWorks -- three real rows with a single shared window block that
 * snaps between slots as the user scrolls past each threshold.
 *
 * Snap behaviour: target top/left are step functions of scrollYProgress
 * (flat at row centres, sharp transitions at progress 0.34/0.36 and
 * 0.64/0.66). The targets feed a useSpring so the perceived motion is a
 * smooth ease-in-out into each new slot rather than a 1-to-1 scroll
 * follow. A lift pulse peaks during each transition and drives a subtle
 * scale + drop-shadow on the window inner wrap, so it feels like the
 * block is lifted, dragged, and placed.
 *
 * The INSIDE of the window swaps between three full-fidelity Corder UI
 * mockups (Dashboard / Library + Transcript / Settings) as the user
 * crosses each chapter midline. Window CHROME (the macOS titlebar)
 * stays constant; only the inner content crossfades through an
 * `AnimatePresence` block keyed on the active chapter.
 *
 * Each row carries a faint dashed ghost in the slot where the window
 * will eventually land -- visual scaffolding so the user reads the
 * destination before the snap.
 */
export function HowItWorks() {
  const { howItWorks } = copy;
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  // CorderPresence morph state. When the user scrolls past the section
  // going down, the live window unmounts and the orb (mounted at the page
  // root via CorderPresenceProvider) takes its place via framer's shared
  // `layoutId`. When motion is disabled, the morph never engages.
  const presence = useCorderPresenceMode();

  // Active chapter -- 1 = Record from anywhere, 2 = Have your meeting,
  // 3 = Tune it. The chapter is driven by scrollYProgress on the same
  // section the window position uses, so the chapter change is locked
  // to the window snap rather than an IntersectionObserver that could
  // fall out of sync (previously the chapter activated AFTER the window
  // had already landed in its next slot, especially for chapter 3).
  const [activeChapter, setActiveChapter] = useState<Chapter>(1);
  const rowRefs = useRef<Array<HTMLElement | null>>([]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Chapter activates RIGHT AS the window starts moving toward the next
  // slot. Window snap zones are 0.34-0.36 and 0.64-0.66; switch chapter
  // at 0.30 and 0.60 so the new mockup is already in place when the
  // window finishes settling.
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next: Chapter = p < 0.3 ? 1 : p < 0.6 ? 2 : 3;
    setActiveChapter((current) => (current === next ? current : next));
  });

  // Stepped numeric targets in vh and %. Row centres at 35, 105, 175vh
  // (rows are 70vh tall, section total 210vh).
  const targetTop = useTransform(
    scrollYProgress,
    [0, 0.34, 0.36, 0.64, 0.66, 1],
    [35, 35, 105, 105, 175, 175],
  );
  const targetLeft = useTransform(
    scrollYProgress,
    [0, 0.34, 0.36, 0.64, 0.66, 1],
    [0, 0, 52, 52, 0, 0],
  );

  // Spring-smoothed for the ease-in-out settle on each snap.
  const topNum = useSpring(targetTop, SPRING);
  const leftNum = useSpring(targetLeft, SPRING);

  const windowTop = useTransform(topNum, (v) => `${v}vh`);
  const windowLeft = useTransform(leftNum, (v) => `${v}%`);

  // Lift pulse -- small bumps centred on each threshold. Drives scale +
  // drop-shadow so the window appears to lift, travel, and settle.
  const liftPulse = useTransform(
    scrollYProgress,
    [0.3, 0.35, 0.4, 0.6, 0.65, 0.7],
    [0, 1, 0, 0, 1, 0],
  );
  const scale = useTransform(liftPulse, [0, 1], [1, 1.035]);
  const filterShadow = useTransform(
    liftPulse,
    (v) =>
      `drop-shadow(0 ${10 + v * 24}px ${22 + v * 36}px rgba(10, 10, 10, ${
        0.1 + v * 0.18
      }))`,
  );

  return (
    <section
      id="how-it-works"
      data-component="HowItWorks"
      data-source={DATA_SOURCE}
      data-tokens="color-text,color-text-muted,color-border,color-accent,radius-window,font-serif"
      className="relative w-full overflow-hidden"
    >
      <div aria-hidden className="section-blob section-blob--howitworks" />
      <div className="page-container pt-14 md:pt-[88px]">
        <Header
          eyebrow={howItWorks.eyebrow}
          heading={howItWorks.heading}
          subhead={howItWorks.subhead}
        />
      </div>

      {reduced ? (
        <div className="page-container hiw-static mt-16">
          {howItWorks.steps.map((step, i) => {
            const chapter = (i + 1) as Chapter;
            return (
              <article key={step.number} className="hiw-static__row">
                <div className="hiw-text">
                  <h3 className="hiw-text__heading">{step.heading}</h3>
                  <p className="hiw-text__body">{step.body}</p>
                </div>
                <WindowFrame chapter={chapter} reduced />
              </article>
            );
          })}
        </div>
      ) : (
        <div ref={sectionRef} className="hiw-track page-container">
          {/* Animated window -- z above all row content. Hidden once the
              user has scrolled past the section so the bottom-right orb
              (mounted at the page root) owns the shared `layoutId` and
              framer can interpolate the bounding box smoothly between the
              two states. When motion is disabled the window renders without
              any layoutId so it never tries to morph. */}
          {presence.mode !== "hidden" && (
            <motion.div
              className="hiw-window-wrap"
              style={{ top: windowTop, left: windowLeft }}
              aria-hidden="true"
            >
              <motion.div
                className="hiw-window-inner"
                style={{ scale, filter: filterShadow }}
                {...(presence.mode === "window"
                  ? {
                      layoutId: CORDER_PRESENCE_LAYOUT_ID,
                      transition: { layout: CORDER_PRESENCE_MORPH_TRANSITION },
                    }
                  : {})}
              >
                <WindowFrame chapter={activeChapter} />
              </motion.div>
            </motion.div>
          )}

          {howItWorks.steps.map((step, i) => (
            <article
              key={step.number}
              ref={(node) => {
                rowRefs.current[i] = node;
              }}
              data-hiw-chapter={i + 1}
              className={`hiw-row${
                i === 1 ? " hiw-row--text-left" : " hiw-row--text-right"
              }`}
            >
              <div className="hiw-text">
                <h3 className="hiw-text__heading">{step.heading}</h3>
                <p className="hiw-text__body">{step.body}</p>
              </div>
              <Ghost />
            </article>
          ))}

          {/* Scroll sentinel -- IntersectionObserver target at the bottom
              edge of the HowItWorks track. When it leaves the viewport
              going down, CorderPresence flips `pastHowItWorks` true and
              the orb materialises from the window's last position. */}
          <CorderPresenceSentinel />
        </div>
      )}
    </section>
  );
}

function Ghost() {
  return (
    <div className="hiw-ghost" aria-hidden="true">
      <svg
        className="hiw-ghost__frame"
        viewBox="0 0 1180 738"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <rect
          x="6"
          y="6"
          width="1168"
          height="726"
          rx="14"
          fill="none"
          stroke="rgba(10, 10, 10, 0.07)"
          strokeWidth="3"
          strokeDasharray="18 12"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function Header({
  eyebrow,
  heading,
  subhead,
}: {
  eyebrow?: string;
  heading: string;
  subhead?: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-10 lg:grid-cols-12">
      <div className="lg:col-span-9">
        {eyebrow && <p className="eyebrow-label">{eyebrow}</p>}
        <h2 className="section-heading">{heading}</h2>
        {subhead && <p className="section-subhead">{subhead}</p>}
      </div>
    </div>
  );
}

const TILT_MAX_X = 3;
const TILT_MAX_Y = 4;
const TILT_LIFT = 4;

function WindowFrame({
  chapter,
  reduced = false,
}: {
  chapter: Chapter;
  reduced?: boolean;
}) {
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = tiltRef.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let targetRX = 0;
    let targetRY = 0;
    let targetLift = 0;
    let curRX = 0;
    let curRY = 0;
    let curLift = 0;

    const onPointerMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      targetRY = Math.max(-1, Math.min(1, dx)) * TILT_MAX_Y;
      targetRX = -Math.max(-1, Math.min(1, dy)) * TILT_MAX_X;
      targetLift = TILT_LIFT;
      schedule();
    };

    const onPointerLeave = () => {
      targetRX = 0;
      targetRY = 0;
      targetLift = 0;
      schedule();
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(tick);
    };

    const tick = () => {
      frame = 0;
      curRX += (targetRX - curRX) * 0.18;
      curRY += (targetRY - curRY) * 0.18;
      curLift += (targetLift - curLift) * 0.18;
      el.style.transform = `perspective(1600px) rotateX(${curRX.toFixed(2)}deg) rotateY(${curRY.toFixed(2)}deg) translateY(${(-curLift).toFixed(2)}px)`;
      const dxLeft = Math.abs(targetRX - curRX);
      const dxRight = Math.abs(targetRY - curRY);
      const dxLift = Math.abs(targetLift - curLift);
      if (dxLeft + dxRight + dxLift > 0.05) {
        schedule();
      } else if (targetRX === 0 && targetRY === 0 && targetLift === 0) {
        el.style.transform = "";
      }
    };

    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerleave", onPointerLeave);
    return () => {
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
      if (frame) window.cancelAnimationFrame(frame);
      el.style.transform = "";
    };
  }, []);

  return (
    <div
      ref={tiltRef}
      className="hiw-window-tilt"
      data-component="HowItWorksWindow"
      data-source={DATA_SOURCE}
      data-tokens="hl-bg,hl-border,hl-accent,radius-window"
      role="img"
      aria-label={`Corder app -- chapter ${chapter}`}
    >
      <div
        className="how-window hero-library-demo how-window--app"
        data-active-chapter={chapter}
      >
        <div className="hl-titlebar" aria-hidden="true">
          <span className="hl-traffic close" />
          <span className="hl-traffic minimize" />
          <span className="hl-traffic maximize" />
        </div>
        {reduced ? (
          /* Reduced-motion: no AnimatePresence, no key, no enter/exit
             -- render the single mockup statically. */
          <div className="hiw-window-content hiw-window-content--static">
            <ChapterMockup chapter={chapter} />
          </div>
        ) : (
          // Sync mode + absolute positioning lets the outgoing and
          // incoming mockups overlap during the fade so there is no
          // empty window flash between chapters. The result reads as a
          // gentle cross-blend rather than a snap.
          <AnimatePresence initial={false}>
            <motion.div
              key={chapter}
              className="hiw-window-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.32,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <ChapterMockup chapter={chapter} />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
