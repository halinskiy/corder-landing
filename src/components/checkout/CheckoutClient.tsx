"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { copy } from "@/content/copy";
import {
  PADDLE_SUCCESS_URL,
  isLaunchTier,
  resolvePriceId,
  resolveTier,
  type PaddleBilling,
} from "@/lib/paddle";

const DATA_SOURCE =
  "projects/corder-landing/src/components/checkout/CheckoutClient.tsx";

type CheckoutState = "loading" | "ready" | "invalid" | "paddle-missing";

/**
 * Inline Paddle checkout, embedded inside our own /checkout/ shell.
 *
 * URL contract:
 *   /checkout/?tier=<trackBilling>&billing=<monthly|annual>
 *
 * trackBilling matches the strings copy.json#pricing.tiers[].trackBilling
 * uses ("pro" / "pro_launch" / "max" / "max_launch") so a future
 * pricing-page change does not have to coordinate with this page.
 *
 * The order summary on the left is rendered from copy.json --
 * same source of truth as the Pricing section, so any maker-side
 * edit to plan name, features or billing copy automatically flows
 * into the checkout shell with no additional wiring.
 *
 * The Paddle iframe on the right is mounted via
 * `Paddle.Checkout.open({ settings.displayMode: "inline",
 * settings.frameTarget: "paddle-checkout-frame" })`. Custom colours,
 * fonts and radii live in Paddle dashboard -> Checkout Settings ->
 * Inline tab; nothing here forces a particular palette so the
 * dashboard remains the single point of styling control.
 *
 * On successful payment Paddle navigates the top-level page to
 * settings.successUrl (PADDLE_SUCCESS_URL = /thanks/?_ptxn=...) and
 * ActivationStatus picks the txn id off the query string.
 */
export function CheckoutClient() {
  const params = useSearchParams();
  const trackBilling = params.get("tier");
  const billingParam = params.get("billing");
  const billing: PaddleBilling =
    billingParam === "monthly" ? "monthly" : "annual";

  const priceId = useMemo(
    () => resolvePriceId(trackBilling, billing),
    [trackBilling, billing]
  );

  // Find the matching tier row in copy.json so the left column can
  // render the exact plan name + features + bill note the visitor
  // saw on /#pricing. Pro launch + Pro both map to "Pro" copy; same
  // for Max.
  const tierData = useMemo(() => {
    const tierName = resolveTier(trackBilling);
    if (!tierName) return null;
    return copy.pricing.tiers.find(
      (t) =>
        (tierName === "pro" && t.name === "Pro") ||
        (tierName === "max" && t.name === "Max")
    );
  }, [trackBilling]);

  const [state, setState] = useState<CheckoutState>("loading");
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    if (!priceId || !trackBilling) {
      setState("invalid");
      return;
    }

    // Paddle.js is loaded with `defer` in app/layout.tsx, so by the
    // time this client component hydrates window.Paddle should be
    // ready. A short polling fallback covers slow networks where
    // the deferred script hasn't yet executed.
    let attempts = 0;
    const interval = window.setInterval(() => {
      attempts += 1;
      if (window.Paddle) {
        window.clearInterval(interval);
        mount();
      } else if (attempts > 50) {
        // 5 seconds with 100ms ticks -- give up, show error.
        window.clearInterval(interval);
        setState("paddle-missing");
      }
    }, 100);

    function mount() {
      if (mountedRef.current) return;
      mountedRef.current = true;
      const tierName = resolveTier(trackBilling);
      const launch = isLaunchTier(trackBilling) && billing === "monthly";
      try {
        // Cast lets us pass `frameTarget` / `frameInitialHeight` /
        // `frameStyle` -- Paddle.js v2 inline-mode keys that our
        // minimal Window.Paddle type does not enumerate.
        const settings: Record<string, unknown> = {
          successUrl: PADDLE_SUCCESS_URL,
          displayMode: "inline",
          theme: "light",
          locale: "en",
          frameTarget: "checkout-page__paddle-frame",
          frameInitialHeight: 450,
          frameStyle:
            "width: 100%; min-width: 312px; background-color: transparent; border: none;",
        };
        window.Paddle!.Checkout.open({
          items: [{ priceId: priceId!, quantity: 1 }],
          settings: settings as Parameters<
            NonNullable<typeof window.Paddle>["Checkout"]["open"]
          >[0]["settings"],
          customData: {
            tier: tierName ?? "unknown",
            billing,
            launch,
          },
        });
        setState("ready");
      } catch {
        setState("paddle-missing");
      }
    }

    return () => window.clearInterval(interval);
  }, [priceId, trackBilling, billing]);

  if (state === "invalid") {
    return (
      <div
        className="checkout-page__error"
        data-component="CheckoutInvalidPlan"
        data-source={DATA_SOURCE}
      >
        <p className="checkout-page__error-text">
          This checkout link is no longer valid. Pick a plan and we will
          take you back here.
        </p>
        <Link
          href="/#pricing"
          className="cta-pill cta-pill--primary inline-flex h-12 items-center justify-center rounded-[var(--radius-pill)] px-7 text-[16px] font-medium"
        >
          Back to pricing
        </Link>
      </div>
    );
  }

  if (!tierData) return null;

  // copy.json's Free tier has no `priceOriginal`, so TS narrows the
  // price shape to the smallest common subset across all three tiers.
  // Pro and Max do include the optional original; cast to the wider
  // shape so the strike-through render compiles.
  const price = (
    billing === "annual" ? tierData.annual : tierData.monthly
  ) as {
    price: string;
    priceUnit: string;
    billNote?: string;
    priceOriginal?: string;
  };
  const tierName = resolveTier(trackBilling);

  return (
    <div
      className="checkout-page__grid"
      data-component="CheckoutGrid"
      data-source={DATA_SOURCE}
    >
      <aside
        className="checkout-page__summary"
        data-component="CheckoutSummary"
        data-source={DATA_SOURCE}
        data-tokens="color-bg,color-text,color-text-muted,color-border,color-accent,radius-window,font-serif,font-sans"
      >
        <p className="checkout-page__summary-eyebrow">Order summary</p>
        <h2 className="checkout-page__summary-heading">
          Corder {tierData.name}
        </h2>

        <div className="checkout-page__price-row">
          {price.priceOriginal && (
            <span
              className="checkout-page__price-original"
              aria-label={`Was ${price.priceOriginal} a ${price.priceUnit}`}
            >
              {price.priceOriginal}
            </span>
          )}
          <span className="checkout-page__price">{price.price}</span>
          <span className="checkout-page__price-suffix">
            /{price.priceUnit}
          </span>
        </div>
        {price.billNote && (
          <p className="checkout-page__bill-note">{price.billNote}</p>
        )}

        <ul className="checkout-page__features" aria-label="What is included">
          {tierData.features.map((feature, i) => {
            const isHeader = /^Everything in /i.test(feature);
            return (
              <li
                key={`${tierName}-${i}`}
                className={`checkout-page__feature${
                  isHeader ? " checkout-page__feature--header" : ""
                }`}
              >
                <span aria-hidden className="checkout-page__feature-tick">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {isHeader ? (
                      <>
                        <path d="M8 3v10" />
                        <path d="M3 8h10" />
                      </>
                    ) : (
                      <path d="m3.5 8.5 3 3 6-7" />
                    )}
                  </svg>
                </span>
                <span className="checkout-page__feature-text">{feature}</span>
              </li>
            );
          })}
        </ul>

        <p className="checkout-page__trust">
          14-day refund. Cancel anytime. Paddle is the merchant of record
          and handles tax and invoicing.
        </p>
      </aside>

      <div
        className="checkout-page__paddle"
        data-component="CheckoutPaddleFrame"
        data-source={DATA_SOURCE}
      >
        {state === "loading" && (
          <div className="checkout-page__paddle-loading" aria-live="polite">
            Loading checkout
          </div>
        )}
        {state === "paddle-missing" && (
          <div className="checkout-page__paddle-error">
            <p>Checkout could not start. Try refreshing the page.</p>
            <Link
              href="/#pricing"
              className="cta-pill cta-pill--ghost inline-flex h-12 items-center justify-center rounded-[var(--radius-pill)] px-7 text-[16px] font-medium"
            >
              Back to pricing
            </Link>
          </div>
        )}
        {/* Paddle inline iframe mounts inside this container. The
            class name is what `settings.frameTarget` above points at. */}
        <div className="checkout-page__paddle-frame" />
      </div>
    </div>
  );
}
