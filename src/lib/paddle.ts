/**
 * Paddle credentials and catalogue (production).
 *
 * All six priceIds + the production client-side token are committed
 * inline as defaults because they are designed to be public:
 * priceIds appear in every Checkout.open network payload, and
 * client-side tokens are scoped to a single Paddle account and gated
 * by the Approved Domains list (only getcorder.com can open
 * checkouts against this token).
 *
 * Env vars override the defaults so a forked / staging deploy can
 * point at a different Paddle account without code changes:
 *   NEXT_PUBLIC_PADDLE_ENV                       sandbox | production
 *   NEXT_PUBLIC_PADDLE_TOKEN                     test_... or live_...
 *   NEXT_PUBLIC_PADDLE_PRICE_PRO_MONTHLY         pri_...
 *   NEXT_PUBLIC_PADDLE_PRICE_PRO_LAUNCH_MONTHLY  pri_...
 *   NEXT_PUBLIC_PADDLE_PRICE_PRO_ANNUAL          pri_...
 *   NEXT_PUBLIC_PADDLE_PRICE_MAX_MONTHLY         pri_...
 *   NEXT_PUBLIC_PADDLE_PRICE_MAX_LAUNCH_MONTHLY  pri_...
 *   NEXT_PUBLIC_PADDLE_PRICE_MAX_ANNUAL          pri_...
 *
 * The webhook signing secret + Paddle server API key are NOT here --
 * they live in the (future) activation Worker, never on the client.
 */

export const PADDLE_ENV =
  process.env.NEXT_PUBLIC_PADDLE_ENV ?? "production";

export const PADDLE_TOKEN =
  process.env.NEXT_PUBLIC_PADDLE_TOKEN ??
  "live_5b954efa46f5dcfab151b3e66a3";

// Six priceIds, two per tier x billing period.
//
// `*_launch_monthly` exists only while the launch promotion is live.
// When copy.json#pricing flips trackBilling from "pro_launch" /
// "max_launch" back to "pro" / "max", new purchases route to the
// regular monthly priceIds and the launch ones quietly retire.
//
// Annual priceIds have no launch variant by design -- the launch
// discount was monthly-only.
const PRICE_PRO_MONTHLY =
  process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_MONTHLY ??
  "pri_01kszshrfje0safhq8e2yfe8rh";

const PRICE_PRO_LAUNCH_MONTHLY =
  process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_LAUNCH_MONTHLY ??
  "pri_01kszsmvs5qvch2mkgcmdaqqk1";

const PRICE_PRO_ANNUAL =
  process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_ANNUAL ??
  "pri_01kszsr83e2y84jyxg1bj8qnyq";

const PRICE_MAX_MONTHLY =
  process.env.NEXT_PUBLIC_PADDLE_PRICE_MAX_MONTHLY ??
  "pri_01kt01msttrfnj80r9gx6beb4b";

const PRICE_MAX_LAUNCH_MONTHLY =
  process.env.NEXT_PUBLIC_PADDLE_PRICE_MAX_LAUNCH_MONTHLY ??
  "pri_01kt01r6bx872y0s6zamg719k3";

const PRICE_MAX_ANNUAL =
  process.env.NEXT_PUBLIC_PADDLE_PRICE_MAX_ANNUAL ??
  "pri_01kt025kjhgrbj1nxhz9bsz9mn";

/**
 * Catalogue keyed by `${trackBilling}_${billing}` -- the shape the
 * Pricing component composes from copy.json. trackBilling carries
 * the tier hint ("pro" / "pro_launch" / "max" / "max_launch");
 * billing is the active toggle position ("monthly" / "annual").
 *
 * The `*_launch_annual` keys intentionally collapse to the regular
 * annual priceId -- annual has no launch variant.
 */
const CATALOGUE: Record<string, string | undefined> = {
  pro_monthly: PRICE_PRO_MONTHLY,
  pro_annual: PRICE_PRO_ANNUAL,
  pro_launch_monthly: PRICE_PRO_LAUNCH_MONTHLY,
  pro_launch_annual: PRICE_PRO_ANNUAL,
  max_monthly: PRICE_MAX_MONTHLY,
  max_annual: PRICE_MAX_ANNUAL,
  max_launch_monthly: PRICE_MAX_LAUNCH_MONTHLY,
  max_launch_annual: PRICE_MAX_ANNUAL,
};

export type PaddleBilling = "monthly" | "annual";
export type PaddleTier = "pro" | "max";

/**
 * Resolve a Paddle priceId for the (trackBilling, billing) pair
 * coming off the pricing grid. Free tier passes trackBilling = null
 * and resolves to undefined -- the caller falls back to the
 * #download anchor in that case.
 */
export function resolvePriceId(
  trackBilling: string | null | undefined,
  billing: PaddleBilling
): string | undefined {
  if (!trackBilling) return undefined;
  return CATALOGUE[`${trackBilling}_${billing}`];
}

/** Strip the optional `_launch` suffix to get the bare tier name. */
export function resolveTier(
  trackBilling: string | null | undefined
): PaddleTier | null {
  if (!trackBilling) return null;
  if (trackBilling.startsWith("pro")) return "pro";
  if (trackBilling.startsWith("max")) return "max";
  return null;
}

/** True if the trackBilling string is a launch-promotion variant. */
export function isLaunchTier(
  trackBilling: string | null | undefined
): boolean {
  return /_launch$/.test(trackBilling ?? "");
}

/** Where Paddle redirects after a successful checkout. */
export const PADDLE_SUCCESS_URL = "https://getcorder.com/thanks/";

// Minimal typing for the global Paddle object so callers don't need
// `(window as any).Paddle`. The full Paddle.js API surface is much
// larger; we only call Checkout.open.
declare global {
  interface Window {
    Paddle?: {
      Environment: { set: (env: "sandbox" | "production") => void };
      Initialize: (options: {
        token: string;
        eventCallback?: (data: { name: string; data?: unknown }) => void;
      }) => void;
      Checkout: {
        open: (options: {
          items: Array<{ priceId: string; quantity: number }>;
          /**
           * Paddle.js v2: per-checkout overrides live here. Top-level
           * `successUrl` is silently ignored by v2 and the checkout
           * falls back to the default Paddle success modal. Always pass
           * the URL through `settings.successUrl`.
           */
          settings?: {
            successUrl?: string;
            displayMode?: "overlay" | "inline";
            theme?: "light" | "dark";
            locale?: string;
          };
          customer?: { email?: string };
          customData?: Record<string, unknown>;
        }) => void;
      };
    };
  }
}
