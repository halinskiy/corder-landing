"use client";

import { useRef } from "react";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import { copy } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/HowItWorks.tsx";

// Spring physics for the snap motion. Tuned for a noticeable ease-in-out
// settle without overshoot — the window should feel like it lifts off the
// page, glides to the next slot, and lands.
const SPRING = { stiffness: 105, damping: 24, mass: 0.7 } as const;

/**
 * HowItWorks — three real rows with a single shared window block that
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
 * Each row carries a faint dashed ghost in the slot where the window
 * will eventually land — visual scaffolding so the user reads the
 * destination before the snap.
 */
export function HowItWorks() {
  const { howItWorks } = copy;
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Stepped numeric targets in vh and %.
  const targetTop = useTransform(
    scrollYProgress,
    [0, 0.34, 0.36, 0.64, 0.66, 1],
    [50, 50, 150, 150, 250, 250],
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

  // Lift pulse — small bumps centred on each threshold. Drives scale +
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
      className="relative w-full"
    >
      <div className="page-container pt-24 md:pt-32">
        <Header
          eyebrow={howItWorks.eyebrow}
          heading={howItWorks.heading}
          subhead={howItWorks.subhead}
        />
      </div>

      {reduced ? (
        <div className="page-container hiw-static mt-16">
          {howItWorks.steps.map((step) => (
            <article key={step.number} className="hiw-static__row">
              <div className="hiw-text">
                <p className="hiw-text__eyebrow">{step.number}</p>
                <h3 className="hiw-text__heading">{step.heading}</h3>
                <p className="hiw-text__body">{step.body}</p>
              </div>
              <WindowFrame />
            </article>
          ))}
        </div>
      ) : (
        <div ref={sectionRef} className="hiw-track page-container">
          {/* Animated window — z above all row content. */}
          <motion.div
            className="hiw-window-wrap"
            style={{ top: windowTop, left: windowLeft }}
            aria-hidden="true"
          >
            <motion.div
              className="hiw-window-inner"
              style={{ scale, filter: filterShadow }}
            >
              <WindowFrame />
            </motion.div>
          </motion.div>

          {howItWorks.steps.map((step, i) => (
            <article
              key={step.number}
              className={`hiw-row${
                i === 1 ? " hiw-row--text-left" : " hiw-row--text-right"
              }`}
            >
              <div className="hiw-text">
                <p className="hiw-text__eyebrow">{step.number}</p>
                <h3 className="hiw-text__heading">{step.heading}</h3>
                <p className="hiw-text__body">{step.body}</p>
              </div>
              <div className="hiw-ghost" aria-hidden="true" />
            </article>
          ))}
        </div>
      )}
    </section>
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

function WindowFrame() {
  return (
    <div
      className="how-window hero-library-demo how-window--app"
      data-component="HowItWorksWindow"
      data-source={DATA_SOURCE}
      role="img"
      aria-label="Corder app placeholder"
    >
      <div className="hl-titlebar" aria-hidden="true">
        <span className="hl-traffic close" />
        <span className="hl-traffic minimize" />
        <span className="hl-traffic maximize" />
      </div>
    </div>
  );
}
