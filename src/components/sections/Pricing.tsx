"use client";

import { useState } from "react";

import { copy } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/Pricing.tsx";

type Billing = "monthly" | "annual";

/**
 * Section 6 — Pricing.
 *
 * Two tier cards (Free / Pro) in equal columns at md+, stack at base.
 * Updated 2026-05-22 for ad-test: dropped Personal tier and the Lifetime
 * plank; copy.json carries only Free + Pro. Annual toggle: Pro switches
 * from "$12/month" to "$99/year, save 31%". Free stays at $0/forever in
 * both modes.
 *
 * Track events fire from data-track-event on each CTA so analytics picks
 * up cta_download_click (Free) and cta_pro_click (Pro) without touching
 * component-level click handlers.
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
  // Pro: annual mode flips the per-month suffix to per-year.
  const priceSuffix =
    billing === "annual" && !isFree && "priceSuffixAnnual" in tier && tier.priceSuffixAnnual
      ? tier.priceSuffixAnnual
      : tier.priceSuffix;

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
          <span className="pricing-card__price-suffix">/{priceSuffix}</span>
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
        href={isFree ? "#download" : "#download"}
        className={
          ctaPrimary
            ? "pricing-card__cta cta-pill cta-pill--primary"
            : "pricing-card__cta cta-pill cta-pill--ghost"
        }
        data-track-event={tier.trackEvent}
        data-track-tier={tier.name}
        data-track-billing={billing}
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
    </article>
  );
}

