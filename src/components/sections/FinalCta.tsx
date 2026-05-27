"use client";

import { copy } from "@/content/copy";
import { AppleIcon } from "@/components/icons/AppleIcon";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/FinalCta.tsx";

export function FinalCta() {
  const { finalCta } = copy;

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
              <AppleIcon size={20} />
              {finalCta.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
