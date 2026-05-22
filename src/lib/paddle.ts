/**
 * Paddle credentials.
 *
 * Sandbox values are committed inline as fallbacks because they are
 * deliberately public (client-side token, sandbox-only). When KYB
 * approves and we move to production, swap the four NEXT_PUBLIC_PADDLE_*
 * env values in GitHub Actions secrets and the build picks them up --
 * the constants below stay untouched.
 *
 * See `landing-prompt.md` for the full sandbox spec.
 */

export const PADDLE_ENV =
  process.env.NEXT_PUBLIC_PADDLE_ENV ?? "sandbox";

export const PADDLE_TOKEN =
  process.env.NEXT_PUBLIC_PADDLE_TOKEN ?? "test_642bcf86f349f296bce7814c10f";

export const PADDLE_PRICE_MONTHLY =
  process.env.NEXT_PUBLIC_PADDLE_PRICE_MONTHLY ??
  "pri_01ks8rxaz7567n2531ymyt1y0e";

export const PADDLE_PRICE_ANNUAL =
  process.env.NEXT_PUBLIC_PADDLE_PRICE_ANNUAL ??
  "pri_01ks8s0c5drt5147fsem76wxtq";

/** Where Paddle redirects after a successful checkout. */
export const PADDLE_SUCCESS_URL = "https://getcorder.com/thanks";

/** Map a Pricing tier's `trackBilling` value to the Paddle price id. */
export const PADDLE_PRICE_BY_BILLING: Record<string, string | undefined> = {
  monthly: PADDLE_PRICE_MONTHLY,
  monthly_launch: PADDLE_PRICE_MONTHLY,
  annual: PADDLE_PRICE_ANNUAL,
};

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
          successUrl?: string;
          customer?: { email?: string };
          customData?: Record<string, unknown>;
        }) => void;
      };
    };
  }
}
