"use client";

import { FAQAccordion } from "@/lib/ui-vendor/FAQAccordion";

import { copy } from "@/content/copy";
import { trackEvent } from "@/lib/track";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/Faq.tsx";

/**
 * Section 7 — FAQ.
 *
 * Re-uses the kit's `FAQAccordion` (multi-open by default), backed by
 * the 10 questions in copy.json. Privacy questions sit first per the
 * F.A "Skeptic" structure.
 */
export function Faq() {
  const { faq } = copy;
  const items = faq.items.map((q) => ({
    question: q.q,
    answer: q.a,
  }));

  return (
    <section
      id="faq"
      data-component="Faq"
      data-source={DATA_SOURCE}
      data-tokens="color-text,color-text-muted,color-border,font-serif,ease-out"
      className="relative w-full"
    >
      <div className="page-container py-8 md:py-[52px]">
        {/* `.faq-list` wrap reserves the right side of the page for the
            floating CorderPresenceForm. At lg+ it pulls the FAQ items in
            by 436px (form right-inset 32 + form width 380 + 64px gap
            minus page-container padding 40), so the FAQ buttons never
            run under the subscribe card. */}
        <div className="faq-list">
          <h2
            className="section-heading"
            data-component="FaqHeading"
            data-source={DATA_SOURCE}
            data-tokens="display-md,font-serif,lh-display,ls-display,color-text"
          >
            {faq.heading}
          </h2>

          <div className="mt-12 md:mt-16">
            <FAQAccordion
              items={items}
              mode="multi"
              dataSource={DATA_SOURCE}
              onItemToggle={(index, isOpen) => {
                // Only the open transition counts as engagement; closes are
                // noise in the ad-test funnel.
                if (isOpen) {
                  trackEvent("faq_open", {
                    index,
                    question: items[index]?.question ?? "",
                  });
                }
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
