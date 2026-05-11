"use client";

import { useRef } from "react";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { copy } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/HowItWorks.tsx";

/**
 * HowItWorks — pinned-scroll flow section above Fit.
 *
 * A 300vh outer track holds a sticky 100vh stage. The single window block
 * sits absolutely positioned inside the stage; its `left` is interpolated
 * from scroll progress so it slides left→right→left across three steps,
 * Webflow-style. The three step copy blocks live in their final left/right
 * slots and fade in/out as the scroll window passes them.
 *
 * Reduced-motion fallback: vertical stack of step + window pairs, no
 * sticky pinning, no transforms.
 */
export function HowItWorks() {
  const { howItWorks } = copy;
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Window slides: 0% (left slot) → 52% (right slot) → 0% (left slot).
  const windowLeft = useTransform(scrollYProgress, [0, 0.5, 1], ["0%", "52%", "0%"]);

  // Per-step opacity windows. Each step is visible across roughly a third
  // of the scroll, with short cross-fades at the seams.
  const step1Opacity = useTransform(scrollYProgress, [0, 0.05, 0.28, 0.38], [1, 1, 1, 0]);
  const step2Opacity = useTransform(scrollYProgress, [0.28, 0.38, 0.62, 0.72], [0, 1, 1, 0]);
  const step3Opacity = useTransform(scrollYProgress, [0.62, 0.72, 0.95, 1], [0, 1, 1, 1]);

  if (reduced) {
    return (
      <section
        id="how-it-works"
        data-component="HowItWorks"
        data-source={DATA_SOURCE}
        className="relative w-full"
      >
        <div className="page-container py-24 md:py-32">
          <Header heading={howItWorks.heading} eyebrow={howItWorks.eyebrow} subhead={howItWorks.subhead} />
          <div className="hiw-static mt-16">
            {howItWorks.steps.map((step) => (
              <article key={step.number} className="hiw-static__row">
                <div className="hiw-static__text">
                  <p className="hiw-text__eyebrow">{step.number}</p>
                  <h3 className="hiw-text__heading">{step.heading}</h3>
                  <p className="hiw-text__body">{step.body}</p>
                </div>
                <div className="how-window hero-library-demo how-window--app hiw-static__window">
                  <Chrome />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="how-it-works"
      data-component="HowItWorks"
      data-source={DATA_SOURCE}
      data-tokens="color-text,color-text-muted,color-border,color-accent,radius-window,font-serif"
      className="hiw"
    >
      <div className="page-container pt-24 md:pt-32">
        <Header heading={howItWorks.heading} eyebrow={howItWorks.eyebrow} subhead={howItWorks.subhead} />
      </div>

      <div ref={trackRef} className="hiw-track">
        <div className="hiw-pin">
          <div className="hiw-stage">
            <motion.div className="hiw-window-wrap" style={{ left: windowLeft }}>
              <div
                className="how-window hero-library-demo how-window--app"
                data-component="HowItWorksWindow"
                data-source={DATA_SOURCE}
                role="img"
                aria-label="Corder app placeholder"
              >
                <Chrome />
              </div>
            </motion.div>

            <motion.div
              className="hiw-text hiw-text--right"
              style={{ opacity: step1Opacity }}
            >
              <p className="hiw-text__eyebrow">{howItWorks.steps[0].number}</p>
              <h3 className="hiw-text__heading">{howItWorks.steps[0].heading}</h3>
              <p className="hiw-text__body">{howItWorks.steps[0].body}</p>
            </motion.div>

            <motion.div
              className="hiw-text hiw-text--left"
              style={{ opacity: step2Opacity }}
            >
              <p className="hiw-text__eyebrow">{howItWorks.steps[1].number}</p>
              <h3 className="hiw-text__heading">{howItWorks.steps[1].heading}</h3>
              <p className="hiw-text__body">{howItWorks.steps[1].body}</p>
            </motion.div>

            <motion.div
              className="hiw-text hiw-text--right"
              style={{ opacity: step3Opacity }}
            >
              <p className="hiw-text__eyebrow">{howItWorks.steps[2].number}</p>
              <h3 className="hiw-text__heading">{howItWorks.steps[2].heading}</h3>
              <p className="hiw-text__body">{howItWorks.steps[2].body}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Header({
  heading,
  eyebrow,
  subhead,
}: {
  heading: string;
  eyebrow?: string;
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

function Chrome() {
  return (
    <div className="hl-titlebar" aria-hidden="true">
      <span className="hl-traffic close" />
      <span className="hl-traffic minimize" />
      <span className="hl-traffic maximize" />
    </div>
  );
}
