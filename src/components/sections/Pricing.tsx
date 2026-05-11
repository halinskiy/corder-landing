"use client";

import { useState } from "react";

import { copy } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/Pricing.tsx";

type Billing = "monthly" | "annual";

/**
 * Section 6 — Pricing.
 *
 * Three tier cards (Free / Personal / Pro) in equal columns at md+, stack
 * at base. The Lifetime offer is a separate full-width plank below the
 * grid, not a fourth column. Annual toggle controls monthly/annual prices
 * with the "3 months free" framing from pricing-brief.md (never "save 25%").
 *
 * No icons. Bullet markers are the typographic middle dot · in accent. Pro
 * is highlighted via a darker border + tint, not a coloured fill or shadow.
 */
export function Pricing() {
  const { pricing } = copy;
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <section
      id="pricing"
      data-component="Pricing"
      data-source={DATA_SOURCE}
      data-tokens="color-text,color-text-muted,color-border,color-accent,radius-window,radius-pill,font-serif"
      className="relative w-full"
    >
      <div className="page-container py-24 md:py-32">
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

        {/* Annual toggle */}
        <div className="mt-12 flex flex-wrap items-center gap-4 md:mt-16">
          <div
            className="pricing-toggle"
            role="group"
            aria-label="Billing period"
            data-component="PricingToggle"
            data-source={DATA_SOURCE}
            data-tokens="radius-pill,color-text,color-bg,color-border,ease-out"
          >
            <button
              type="button"
              className="pricing-toggle__btn"
              aria-pressed={billing === "monthly"}
              onClick={() => setBilling("monthly")}
            >
              Monthly
            </button>
            <button
              type="button"
              className="pricing-toggle__btn"
              aria-pressed={billing === "annual"}
              onClick={() => setBilling("annual")}
            >
              Annual
            </button>
          </div>
          <span className="pricing-savings">{pricing.annualToggleLabel}</span>
        </div>

        {/* Tier grid */}
        <div className="mt-10 pricing-grid">
          {pricing.tiers.map((tier) => (
            <PricingCard key={tier.name} tier={tier} billing={billing} />
          ))}
        </div>

        {/* Microcopy */}
        <p className="pricing-microcopy">{pricing.microcopy}</p>
      </div>
    </section>
  );
}

type Tier = (typeof copy)["pricing"]["tiers"][number];

function PricingCard({ tier, billing }: { tier: Tier; billing: Billing }) {
  const price = billing === "annual" ? tier.price.annual : tier.price.monthly;
  const ctaPrimary = tier.ctaStyle === "primary";
  const isFree = tier.name === "Free";

  return (
    <article
      className={`pricing-card${tier.highlight ? " pricing-card--highlight" : ""}`}
      data-component="PricingCard"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-text,color-border,color-accent,radius-window,font-serif,font-sans"
    >
      <div className="pricing-card__header">
        <h3 className="pricing-card__name">{tier.name}</h3>
        {tier.highlight && (
          <span className="pricing-card__badge">Recommended</span>
        )}
      </div>

      <div>
        <div className="pricing-card__price-row">
          <span className="pricing-card__price">{price}</span>
          <span className="pricing-card__price-suffix">/{tier.priceSuffix}</span>
        </div>
        {billing === "annual" && tier.annualNote && !isFree && (
          <p className="pricing-card__annual-note">{tier.annualNote}</p>
        )}
      </div>

      {tier.subline && <p className="pricing-card__subline">{tier.subline}</p>}

      <div className="pricing-card__divider" />

      <ul className="pricing-card__features">
        {tier.features.map((feature) => (
          <li key={feature} className="pricing-card__feature">
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <a
        href="#pricing"
        className={
          ctaPrimary
            ? "pricing-card__cta cta-pill cta-pill--primary"
            : "pricing-card__cta cta-pill cta-pill--ghost"
        }
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
        {ctaPrimary && tier.highlight && (
          <span className="cta-sparkles" aria-hidden>
            <span>✦</span>
            <span>✧</span>
            <span>✦</span>
            <span>✦</span>
            <span>✧</span>
            <span>✦</span>
            <span>✧</span>
            <span>✦</span>
          </span>
        )}
        <span className="cta-text">{tier.cta}</span>
      </a>
    </article>
  );
}

