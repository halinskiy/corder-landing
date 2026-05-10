"use client";

import { FAQAccordion } from "@aisoldier/ui-kit";

import { copy } from "@/content/copy";

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
      <div className="page-container py-24 md:py-32">
        <div className="grid grid-cols-1 gap-x-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2
              className="section-heading"
              data-component="FaqHeading"
              data-source={DATA_SOURCE}
              data-tokens="display-md,font-serif,lh-display,ls-display,color-text"
            >
              {faq.heading}
            </h2>
          </div>
        </div>

        <div className="mt-12 md:mt-16">
          <FAQAccordion
            items={items}
            mode="multi"
            dataSource={DATA_SOURCE}
          />
        </div>
      </div>
    </section>
  );
}
