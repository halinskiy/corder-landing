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
 * redirects to /account. No real verification happens; the page just
 * paints the UX for the flow.
 *
 * Phase 3: the client component will hit
 *   GET https://api.getcorder.com/auth/verify?token=...
 * which sets the JWT cookie + 302-redirects to /account. If the
 * token is invalid or expired the Worker redirects to /login with
 * an inline error flag.
 */
export default function VerifyPage() {
  return (
    <main
      className="legal-page"
      data-component="VerifyPage"
      data-source={DATA_SOURCE}
    >
      <div className="page-container py-16 md:py-24">
        <div className="mx-auto max-w-[460px] account-verify-body">
          <a href="/" className="account-brand" aria-label="Corder home">
            <BrandMark />
            <span>Corder</span>
          </a>
          <h1 className="account-auth-heading">Verifying your link…</h1>
          <p className="account-auth-lead">
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

function BrandMark() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 1024 1024"
      aria-hidden="true"
      role="img"
    >
      <rect
        x="6"
        y="6"
        width="1012"
        height="1012"
        rx="227"
        ry="227"
        fill="#ffffff"
        stroke="rgba(0, 0, 0, 0.12)"
        strokeWidth="12"
      />
      <rect x="340" y="248" width="144" height="528" rx="72" ry="72" fill="#111111" />
      <rect x="540" y="248" width="144" height="528" rx="72" ry="72" fill="#111111" />
    </svg>
  );
}
