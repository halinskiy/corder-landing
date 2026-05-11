"use client";

import { useState } from "react";

import { copy } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/FinalCta.tsx";

export function FinalCta() {
  const { finalCta } = copy;
  const [hours, setHours] = useState<number>(finalCta.defaultHours);
  const cost = (hours * finalCta.ratePerHour).toFixed(2);

  return (
    <section
      id="download"
      data-component="FinalCta"
      data-source={DATA_SOURCE}
      data-tokens="color-text,color-bg,color-accent,radius-pill,font-serif,ease-out"
      className="relative w-full overflow-hidden"
    >
      <div
        aria-hidden
        className="dot-grid-surface pointer-events-none absolute inset-0 -z-10"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0, rgba(0,0,0,0.4) 25%, rgba(0,0,0,0.4) 75%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0, rgba(0,0,0,0.4) 25%, rgba(0,0,0,0.4) 75%, transparent 100%)",
        }}
      />

      <div className="page-container py-32 md:py-44">
        <div className="final-cta-calc">
          <p
            className="final-cta-calc__preheading"
            data-component="FinalCtaPreheading"
            data-source={DATA_SOURCE}
            data-tokens="font-serif,color-text,ls-display"
          >
            {finalCta.preheading}
          </p>

          <div className="final-cta-calc__row">
            <output
              className="final-cta-calc__hours"
              aria-live="polite"
              htmlFor="hours"
            >
              ${cost}
            </output>

            <input
              type="range"
              min={finalCta.minHours}
              max={finalCta.maxHours}
              step={1}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              aria-label="Hours of meetings per month"
              className="final-cta-calc__range"
            />

            <span className="final-cta-calc__phrase">
              for {hours} {finalCta.calculatorSuffix}
            </span>
          </div>

          <p className="final-cta-calc__line final-cta-calc__line--us">
            {finalCta.lineUs}
          </p>

          <div className="final-cta-calc__cta-row">
            <a
              href={finalCta.ctaHref}
              className="cta-pill cta-pill--primary inline-flex h-12 min-w-[240px] items-center justify-center gap-2 rounded-[var(--radius-pill)] px-7 text-[16px] font-medium"
              data-component="FinalCtaPrimary"
              data-source={DATA_SOURCE}
              data-tokens="radius-pill,color-accent,color-bg,ease-out"
            >
              {finalCta.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
