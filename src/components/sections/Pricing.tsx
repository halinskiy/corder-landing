"use client";

import { copy } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/Pricing.tsx";

/**
 * Section 6 — Pricing.
 *
 * Two horizontal slabs stacked vertically. Free above, Pro below.
 *
 * Free uses a single price block (`$0 /forever`) + a secondary CTA pill.
 * Pro replaces the old monthly/annual toggle with two Corder-style plan
 * cards rendered side-by-side inside the summary column. Each plan card
 * is itself a CTA: clicking "Monthly" sends cta_pro_click with
 * billing=monthly; clicking "Annual" sends billing=annual. The Annual
 * card is `featured` (accent border + Save 31% tag) so the eye lands
 * there first.
 *
 * No JS state (no toggle, no useState). The component is now a thin
 * presentational shell over copy.json.
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

        {/* Tier slabs */}
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
//   Types -- two tier shapes share the same array, discriminated by `kind`.
// ---------------------------------------------------------------------------

type TierBase = {
  name: string;
  features: readonly string[];
  highlight?: boolean;
};

type SingleTier = TierBase & {
  kind: "single";
  price: string;
  priceUnit: string;
  cta: string;
  ctaStyle: "primary" | "secondary";
  trackEvent: string;
};

type Plan = {
  label: string;
  price: string;
  unit: string;
  note: string;
  badge?: string;
  featured?: boolean;
  trackBilling: "monthly" | "annual";
};

type PlansTier = TierBase & {
  kind: "plans";
  plans: readonly Plan[];
  trackEvent: string;
};

type Tier = SingleTier | PlansTier;

// ---------------------------------------------------------------------------
//   PricingCard -- one horizontal slab. Renders one of two summary shapes
//   depending on tier.kind.
// ---------------------------------------------------------------------------

function PricingCard({ tier }: { tier: Tier }) {
  return (
    <article
      className={`pricing-card pricing-card--horizontal${tier.highlight ? " pricing-card--highlight" : ""}`}
      data-component="PricingCard"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-text,color-border,color-accent,radius-window,font-serif,font-sans"
    >
      <div className="pricing-card__summary">
        <div className="pricing-card__header">
          <h3 className="pricing-card__name">{tier.name}</h3>
          {tier.highlight && (
            <span className="pricing-card__badge">Recommended</span>
          )}
        </div>

        {tier.kind === "single" ? (
          <SingleSummary tier={tier} />
        ) : (
          <PlansSummary tier={tier} />
        )}
      </div>

      <ul className="pricing-card__features pricing-card__features--col">
        {tier.features.map((feature) => (
          <li key={feature} className="pricing-card__feature">
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

// ---------------------------------------------------------------------------
//   Single-price tier (Free).
// ---------------------------------------------------------------------------

function SingleSummary({ tier }: { tier: SingleTier }) {
  const ctaPrimary = tier.ctaStyle === "primary";
  return (
    <>
      <div className="pricing-card__price-row">
        <span className="pricing-card__price">{tier.price}</span>
        <span className="pricing-card__price-suffix">/{tier.priceUnit}</span>
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
    </>
  );
}

// ---------------------------------------------------------------------------
//   Plans tier (Pro: Monthly + Annual).
// ---------------------------------------------------------------------------

function PlansSummary({ tier }: { tier: PlansTier }) {
  return (
    <div className="pricing-plans" role="group" aria-label="Choose a billing period">
      {tier.plans.map((plan) => (
        <a
          key={plan.label}
          href="#download"
          className={`pricing-plan${plan.featured ? " pricing-plan--featured" : ""}`}
          data-component="PricingPlan"
          data-source={DATA_SOURCE}
          data-track-event={tier.trackEvent}
          data-track-tier={tier.name}
          data-track-billing={plan.trackBilling}
        >
          <span className="pricing-plan__label">
            {plan.label}
            {plan.badge && (
              <span className="pricing-plan__save">{plan.badge}</span>
            )}
          </span>
          <span className="pricing-plan__price-row">
            <span className="pricing-plan__price">{plan.price}</span>
            <span className="pricing-plan__unit">/{plan.unit}</span>
          </span>
          <span className="pricing-plan__note">{plan.note}</span>
        </a>
      ))}
    </div>
  );
}
