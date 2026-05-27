"use client";

/**
 * PricingBillingToggle -- Monthly / Yearly switch that sits to the
 * right of the Pricing heading. Pill-shaped track with two segment
 * buttons. The active segment carries the accent fill; the inactive
 * is hairline. Used by Pricing.tsx to flip every card's price block
 * between monthly and annual values without re-rendering the whole
 * section.
 *
 * Lives outside Pricing.tsx so the heading row stays a clean flex
 * container (heading on the left, subhead + toggle on the right with
 * space-between).
 */
export type PricingBilling = "monthly" | "annual";

export function PricingBillingToggle({
  billing,
  onChange,
  monthlyLabel = "Monthly",
  annualLabel = "Yearly",
}: {
  billing: PricingBilling;
  onChange: (next: PricingBilling) => void;
  monthlyLabel?: string;
  annualLabel?: string;
}) {
  return (
    <div
      className="pricing-toggle"
      role="radiogroup"
      aria-label="Billing period"
      data-component="PricingBillingToggle"
      data-source="projects/corder-landing/src/components/sections/PricingBillingToggle.tsx"
      data-tokens="color-accent,color-bg,color-border,radius-pill,ease-out"
    >
      <button
        type="button"
        role="radio"
        aria-checked={billing === "monthly"}
        data-active={billing === "monthly"}
        onClick={() => onChange("monthly")}
        className="pricing-toggle__seg"
      >
        {monthlyLabel}
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={billing === "annual"}
        data-active={billing === "annual"}
        onClick={() => onChange("annual")}
        className="pricing-toggle__seg"
      >
        {annualLabel}
      </button>
    </div>
  );
}
