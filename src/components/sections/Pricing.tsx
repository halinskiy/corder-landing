"use client";

import { Check } from "lucide-react";

import { copy } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/Pricing.tsx";

/**
 * Section 6 — Pricing.
 *
 * Two paid packages: Monthly $12 + Annual $99. Free is not a card here --
 * the download itself is free (the Hero pill says so), so the pricing
 * section is only about the subscription tier.
 *
 * Annual carries the accent border + "SAVE 31%" badge + primary CTA so the
 * default visual choice is the annual plan. Monthly stays on a hairline
 * border with a secondary CTA.
 *
 * Side-by-side 2 columns at md+, stacked at base. Each card is a real
 * pricing slab (name + price + bill-note + features + CTA).
 *
 * Track events: both CTAs fire cta_pro_click with billing=monthly|annual.
 */
export function Pricing() {
  const { pricing } = copy;

  return (
    <section
      id="pricing"
      data-component="Pricing"
      data-source={DATA_SOURCE}
      data-tokens="color-text,color-text-muted,color-border,color-accent,radius-window,radius-pill,font-serif"
      className="relative w-full overflow-hidden"
    >
      <div aria-hidden className="section-blob section-blob--pricing" />
      <div className="page-container py-8 md:py-[52px]">
        {/* Header */}
        <div className="grid grid-cols-1 gap-x-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2
              className="section-heading"
              data-component="PricingHeading"
              data-source={DATA_SOURCE}
              data-tokens="display-md,font-serif,lh-display,ls-display,color-text"
            >
              {pricing.heading}
            </h2>
            <p
              className="section-subhead"
              data-component="PricingSubhead"
              data-source={DATA_SOURCE}
              data-tokens="body-lg,lh-body,color-text-muted,font-sans"
            >
              {pricing.subhead}
            </p>
          </div>
        </div>

        {/* Tier grid */}
        <div className="mt-10 pricing-grid md:mt-14">
          {pricing.tiers.map((tier) => (
            <PricingCard key={tier.name} tier={tier as Tier} />
          ))}
        </div>

        {/* Microcopy */}
        <p className="pricing-microcopy">{pricing.microcopy}</p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

type Tier = {
  name: string;
  price: string;
  priceOriginal?: string;
  priceUnit: string;
  billNote?: string;
  badge?: string;
  features: readonly string[];
  cta: string;
  ctaStyle: "primary" | "secondary";
  highlight: boolean;
  trackEvent: string;
  trackBilling?: string;
};

function PricingCard({ tier }: { tier: Tier }) {
  const ctaPrimary = tier.ctaStyle === "primary";
  return (
    <article
      className={`pricing-card pricing-card--horizontal${tier.highlight ? " pricing-card--highlight" : ""}`}
      data-component="PricingCard"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-text,color-border,color-accent,radius-window,font-serif,font-sans"
    >
      {/* Summary column: plan label + badge, price block, bill note, CTA. */}
      <div className="pricing-card__summary">
        <div className="pricing-card__header">
          <span className="pricing-card__plan-label">{tier.name}</span>
          {tier.badge && (
            <span className="pricing-card__badge">{tier.badge}</span>
          )}
        </div>

        <div>
          <div className="pricing-card__price-row">
            {tier.priceOriginal && (
              <span
                className="pricing-card__price-original"
                aria-label={`Was ${tier.priceOriginal} a year`}
              >
                {tier.priceOriginal}
              </span>
            )}
            <span className="pricing-card__price">{tier.price}</span>
            <span className="pricing-card__price-suffix">/{tier.priceUnit}</span>
          </div>
          {tier.billNote && (
            <p className="pricing-card__annual-note">{tier.billNote}</p>
          )}
        </div>

        <a
          href="#download"
          className={
            ctaPrimary
              ? "pricing-card__cta cta-pill cta-pill--primary"
              : "pricing-card__cta cta-pill cta-pill--ghost"
          }
          data-track-event={tier.trackEvent}
          data-track-tier={tier.name}
          data-track-billing={tier.trackBilling}
          style={
            ctaPrimary
              ? undefined
              : {
                  border: "1px solid var(--color-border-strong)",
                  color: "var(--color-text)",
                  backgroundColor: "transparent",
                }
          }
        >
          <span className="cta-text">{tier.cta}</span>
        </a>
      </div>

      {/* Features column: same list both slabs (both ARE Pro). */}
      <ul className="pricing-card__features pricing-card__features--col">
        {tier.features.map((feature) => (
          <li key={feature} className="pricing-card__feature">
            <span className="pricing-card__feature-icon" aria-hidden>
              <Check size={14} strokeWidth={2.4} />
            </span>
            <span className="pricing-card__feature-text">{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
