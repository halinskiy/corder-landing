"use client";

import { useRef } from "react";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { copy } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/HowItWorks.tsx";

/**
 * HowItWorks — three real rows of step copy with a single shared window
 * that slides diagonally across the section as you scroll.
 *
 * Layout: each row is its own 100vh slab with text aligned to one side
 * (right for steps 1 and 3, left for step 2). The window block is
 * absolutely positioned inside the section, its vertical position
 * linearly tracks scroll progress so it stays at the viewport's vertical
 * centre, and its horizontal position triangle-waves between left (0%)
 * and right (52%) — producing the diagonal motion the brief asked for.
 *
 * Reduced-motion fallback: vertical static stack, one window per row.
 */
export function HowItWorks() {
  const { howItWorks } = copy;
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Linear vertical motion keeps the window centred on the active row.
  // The CSS layer applies translateY(-50%), so these `top` values are
  // the desired window CENTRE in section coordinates: row 1 centre at
  // 50vh, row 3 centre at 250vh.
  const windowTop = useTransform(scrollYProgress, [0, 1], ["50vh", "250vh"]);

  // Triangle wave: 0% → 52% → 0%. Steps 1 and 3 keep the window on the
  // left (text right). Step 2 swings it across to the right (text left).
  const windowLeft = useTransform(scrollYProgress, [0, 0.5, 1], ["0%", "52%", "0%"]);

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
        <div ref={sectionRef} className="hiw-track">
          {/* The single moving window, animated by scrollYProgress.
              Lives above the rows in the stacking order but does not
              intercept pointer events. */}
          <motion.div
            className="hiw-window-wrap"
            style={{ top: windowTop, left: windowLeft }}
            aria-hidden="true"
          >
            <WindowFrame />
          </motion.div>

          {howItWorks.steps.map((step, i) => (
            <article
              key={step.number}
              className={`hiw-row${i === 1 ? " hiw-row--text-left" : " hiw-row--text-right"}`}
            >
              <div className="hiw-text">
                <p className="hiw-text__eyebrow">{step.number}</p>
                <h3 className="hiw-text__heading">{step.heading}</h3>
                <p className="hiw-text__body">{step.body}</p>
              </div>
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
