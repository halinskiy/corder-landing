/**
 * Phase 1 mock account data. Replaced in Phase 3 by real fetch calls
 * to the Cloudflare Worker on api.getcorder.com. The shape comes
 * from `account-types.ts` so the swap is type-safe.
 *
 * The mock is INTENTIONALLY logged-in. /account does not yet check
 * auth -- it just renders this object so the maker can review the
 * UI end-to-end without standing up the backend first.
 */

import type { UserAccount } from "./account-types";

export const MOCK_USER: UserAccount = {
  id: "uuid-mock-0001",
  email: "founder@hollow.studio",
  name: "Paul Turner",
  appleId: null,
  createdAt: "2026-04-12T09:14:00.000Z",
  lastLoginAt: "2026-05-25T08:31:00.000Z",
  subscription: {
    plan: "pro_annual",
    status: "active",
    nextBillingAt: "2027-04-12T09:14:00.000Z",
    managePortalUrl:
      "https://customer-portal.paddle.com/cpl_01ks8t000000mock00000000",
    paddlePriceId: "pri_01ks8s0c5drt5147fsem76wxtq",
  },
  notifications: {
    productUpdates: true,
    tipsAndTricks: false,
    newFeatures: true,
  },
  referral: {
    code: "PAUL2026",
    qualifiedCount: 3,
    freeMonthsEarned: 3,
  },
};

/**
 * Format an ISO timestamp as "April 12, 2027" (en-US). Used by the
 * /account subscription card for the next-billing line and by
 * the createdAt line in the profile.
 */
export function formatBillingDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
