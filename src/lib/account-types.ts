/**
 * Account-side data shapes. Used by Phase 1 mock + Phase 3 Worker
 * client. Keep this file plain types (no runtime values) so it can
 * be imported anywhere without bundle-size cost.
 *
 * Mirrors the Postgres schema that the Cloudflare Worker writes to
 * Supabase: each TS field maps 1:1 onto a column. When the Worker
 * lands, swap `account-mock` for real fetch calls; the types do not
 * change.
 */

export type SubscriptionPlan = "free" | "pro_monthly" | "pro_annual";

export type SubscriptionStatus =
  | "active"
  | "past_due"
  | "canceled"
  | "trialing"
  | "paused";

export interface Subscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  /** ISO-8601 timestamp of next renewal, null when the plan is "free". */
  nextBillingAt: string | null;
  /** Direct Paddle Customer Portal URL the Worker resolves from the
   * Paddle customer object. Opens in a new tab; Paddle handles the
   * actual billing / cancel / change-plan flow. Null when "free". */
  managePortalUrl: string | null;
  /** Mirrors the Paddle price id so the UI can match copy.json. */
  paddlePriceId: string | null;
}

export interface NotificationPrefs {
  productUpdates: boolean;
  tipsAndTricks: boolean;
  newFeatures: boolean;
}

export interface Referral {
  /** 7-char alphanumeric code the user shares. Worker generates on
   * signup; never changes. */
  code: string;
  /** Number of users that signed up via this code AND completed at
   * least one Pro month. Used to compute free months earned. */
  qualifiedCount: number;
  /** Free months credited to the user. 1 month per qualified
   * referral. Worker writes this from the Paddle webhook when a
   * referred user passes their first billing cycle. */
  freeMonthsEarned: number;
}

export interface UserAccount {
  /** Supabase uuid. */
  id: string;
  /** Email is the login credential AND the receipt address. */
  email: string;
  /** User-editable display name. Defaults to email's local-part on
   * signup. */
  name: string;
  /** Apple ID linked from the Mac app (Sign in with Apple). Used to
   * tie a Paddle subscription bought on the web to the same account
   * the user opens the Mac app with. Null until the Mac app links. */
  appleId: string | null;
  /** ISO-8601 timestamp of account creation. */
  createdAt: string;
  /** ISO-8601 timestamp of last successful magic-link verification. */
  lastLoginAt: string;
  subscription: Subscription;
  notifications: NotificationPrefs;
  referral: Referral;
}
