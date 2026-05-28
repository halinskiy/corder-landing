import type { Metadata } from "next";

import { AccountView } from "@/components/account/AccountView";

export const metadata: Metadata = {
  title: "Account",
  description:
    "Manage your Corder account, subscription, notification preferences, and referrals.",
  alternates: { canonical: "/account/" },
  robots: { index: false, follow: false },
};

const DATA_SOURCE = "projects/corder-landing/src/app/account/page.tsx";

/**
 * /account -- the logged-in surface.
 *
 * Phase 1 always paints the mock user (see src/lib/account-mock.ts).
 * Phase 3 will gate the route on a JWT cookie + fetch the real
 * user via `GET https://api.getcorder.com/me` (credentials: include)
 * and redirect unauthenticated visits to /login.
 *
 * Five sections, top to bottom:
 *   1. Profile: email (readonly), name (editable inline), Apple ID
 *      (readonly, "Not connected" placeholder until the Mac app links)
 *   2. Subscription: plan badge + status + next billing + Manage
 *      Subscription link to Paddle Customer Portal
 *   3. Notifications: three toggles (product updates / tips / new
 *      features). Each writes to NotificationPrefs in the DB.
 *   4. Referrals: code + share link + invited count + free months
 *      earned + reward explainer
 *   5. Danger zone: Delete account button -> modal requiring the
 *      user to type DELETE before the destructive action fires.
 *      Phase 3: hits DELETE /me (cascading delete + Paddle cancel)
 *      with a 30-day grace period per GDPR pattern.
 */
export default function AccountPage() {
  return (
    <main
      className="legal-page account-page"
      data-component="AccountPage"
      data-source={DATA_SOURCE}
    >
      <div className="page-container py-16 md:py-24">
        <div className="mx-auto max-w-[760px] account-body">
          <header className="account-header">
            <a href="/" className="account-brand" aria-label="Corder home">
              <BrandMark />
              <span>Corder</span>
            </a>
            <h1 className="account-title">Account</h1>
          </header>
          <AccountView />
        </div>
      </div>
    </main>
  );
}

function BrandMark() {
  return (
    <img
      src="/brand-mark-128.png"
      width={28}
      height={28}
      alt=""
      aria-hidden="true"
      decoding="async"
      style={{ display: "block" }}
    />
  );
}
