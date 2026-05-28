import type { Metadata } from "next";

import { VerifyClient } from "@/components/account/VerifyClient";

export const metadata: Metadata = {
  title: "Verifying",
  description:
    "Verifying your magic link. Hold on a second.",
  alternates: { canonical: "/verify/" },
  robots: { index: false, follow: false },
};

const DATA_SOURCE = "projects/corder-landing/src/app/verify/page.tsx";

/**
 * /verify?token=... -- the user lands here from the email magic link.
 *
 * Phase 1: client component shows a loading spinner for ~800 ms then
 * redirects to /account. Phase 3: hits
 *   GET https://api.getcorder.com/auth/verify?token=...
 * which sets the JWT cookie + 302-redirects to /account.
 *
 * Same standalone-page header pattern as the rest of the project:
 * ghost arrow back to home 16 px to the left of the heading.
 */
export default function VerifyPage() {
  return (
    <main
      className="legal-page"
      data-component="VerifyPage"
      data-source={DATA_SOURCE}
    >
      <div className="page-container py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] account-verify-body">
            <h1 className="install-page__heading">Verifying your link...</h1>
          <p className="install-page__sub">
            One second -- we're signing you in. You'll land in your
            account page automatically.
          </p>
          <div className="account-verify-spinner" aria-hidden>
            <span />
            <span />
            <span />
          </div>
          <VerifyClient />
        </div>
      </div>
    </main>
  );
}
