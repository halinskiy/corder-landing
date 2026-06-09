"use client";

import { useState } from "react";

import { copy } from "@/content/copy";
import {
  PricingBillingToggle,
  type PricingBilling,
} from "@/components/sections/PricingBillingToggle";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/Pricing.tsx";

/* Inlined lucide icons (Check, Plus) -- the only two icons used on the
 * site. Inlining drops the lucide-react dependency (~10 KB gzip) from the
 * critical-path bundle. Geometry/stroke match lucide's defaults exactly. */
function CheckIcon({ size = 14, strokeWidth = 2.4 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function PlusIcon({ size = 14, strokeWidth = 2.4 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

/**
 * Section 6 -- Pricing.
 *
 * Three tiers (Free / Pro / Max) in a Granola-style 3-card grid. A
 * monthly / yearly toggle sits to the right of the section heading and
 * flips every card's price block in place (price + bill note swap; the
 * feature list stays constant per tier).
 *
 * Tier copy + pricing comes from copy.json#pricing, written from the
 * 2026-05-27 pricing brief in content/pricing-brief.md.
 *
 * The Free tier CTA is a direct download trigger (routes through
 * /install). Pro and Max CTAs open Paddle checkout when the SDK is
 * loaded, otherwise fall back to the #download anchor.
 */
export function Pricing() {
  const { pricing } = copy;
  const [billing, setBilling] = useState<PricingBilling>("annual");

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
        {/* Section head -- heading + subhead stacked on the left,
            billing toggle alone on the right. Updated 2026-05-27 per
            maker: short subhead lives under the heading where it
            belongs, not next to the toggle. */}
        <div className="pricing-section-head">
          <div className="pricing-section-head__copy">
            <h2
              className="section-heading"
              data-component="PricingHeading"
              data-source={DATA_SOURCE}
              data-tokens="display-md,font-serif,lh-display,ls-display,color-text"
            >
              {pricing.heading}
            </h2>
            <p className="pricing-section-head__subhead">{pricing.subhead}</p>
          </div>

          <div className="pricing-section-head__aside">
            <PricingBillingToggle
              billing={billing}
              onChange={setBilling}
              monthlyLabel={pricing.billing?.monthlyLabel ?? "Monthly"}
              annualLabel={pricing.billing?.annualLabel ?? "Yearly"}
            />
          </div>
        </div>

        {/* Tier grid */}
        <div className="mt-10 pricing-grid md:mt-14">
          {pricing.tiers.map((tier) => (
            <PricingCard
              key={tier.name}
              tier={tier as unknown as Tier}
              billing={billing}
            />
          ))}
        </div>

        {/* Microcopy */}
        <p className="pricing-microcopy">{pricing.microcopy}</p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

type TierPrice = {
  price: string;
  priceOriginal?: string;
  priceUnit: string;
  billNote?: string;
};

type Tier = {
  name: string;
  tagline?: string;
  badge?: string | null;
  features: readonly string[];
  cta: string;
  ctaHref?: string;
  ctaStyle: "primary" | "secondary";
  highlight: boolean;
  trackEvent: string;
  trackBilling?: string | null;
  monthly: TierPrice;
  annual: TierPrice;
};

function PricingCard({ tier, billing }: { tier: Tier; billing: PricingBilling }) {
  const ctaPrimary = tier.ctaStyle === "primary";
  const priceBlock = billing === "annual" ? tier.annual : tier.monthly;
  // Free tier keeps its own ctaHref (/install/). Paid tiers route to
  // the /checkout/ shell where the Paddle inline embed mounts. The
  // checkout page reads ?tier and ?billing off the query string and
  // hands them to resolvePriceId on the client.
  const ctaHref = tier.trackBilling
    ? `/checkout/?tier=${encodeURIComponent(tier.trackBilling)}&billing=${billing}`
    : (tier.ctaHref ?? "#download");

  return (
    <article
      className={`pricing-card pricing-card--vertical${tier.highlight ? " pricing-card--highlight" : ""}`}
      data-component="PricingCard"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-text,color-border,color-accent,radius-window,font-serif,font-sans"
    >
      <div className="pricing-card__header">
        <div className="pricing-card__header-row">
          <span className="pricing-card__plan-label">{tier.name}</span>
          {tier.badge && (
            <span className="pricing-card__badge">{tier.badge}</span>
          )}
        </div>
        {/* Tagline removed from render 2026-05-27 per maker. Strings
            still live in copy.json#pricing.tiers[].tagline in case
            they come back later. */}
      </div>

      <div className="pricing-card__price-block">
        <div className="pricing-card__price-row">
          {priceBlock.priceOriginal && (
            <span
              className="pricing-card__price-original"
              aria-label={`Was ${priceBlock.priceOriginal} a ${priceBlock.priceUnit}`}
            >
              {priceBlock.priceOriginal}
            </span>
          )}
          <span className="pricing-card__price">{priceBlock.price}</span>
          <span className="pricing-card__price-suffix">
            /{priceBlock.priceUnit}
          </span>
        </div>
        {priceBlock.billNote && (
          <p className="pricing-card__annual-note">{priceBlock.billNote}</p>
        )}
      </div>

      <a
        href={ctaHref}
        className={`pricing-card__cta cta-pill ${ctaPrimary ? "cta-pill--primary" : "cta-pill--ghost"}`}
        data-track-event={tier.trackEvent}
        data-track-tier={tier.name}
        data-track-billing={tier.trackBilling ?? billing}
        // Free tier still resolves via its own ctaHref to /install/;
        // Paid tiers route the anchor to /checkout/?tier=...&billing=...
        // where the dedicated CheckoutClient mounts Paddle inline.
        // No JS onClick is needed -- the href carries the routing.
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

      <ul className="pricing-card__features">
        {tier.features.map((feature, i) => {
          const isHeader = /^Everything in /i.test(feature);
          return (
            <li
              key={`${tier.name}-${i}`}
              className={`pricing-card__feature${isHeader ? " pricing-card__feature--header" : ""}`}
            >
              <span className="pricing-card__feature-icon" aria-hidden>
                {isHeader ? (
                  <PlusIcon size={14} strokeWidth={2.4} />
                ) : (
                  <CheckIcon size={14} strokeWidth={2.4} />
                )}
              </span>
              <span className="pricing-card__feature-text">{feature}</span>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
