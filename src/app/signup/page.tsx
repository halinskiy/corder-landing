import type { Metadata } from "next";

import { MagicLinkForm } from "@/components/account/MagicLinkForm";

export const metadata: Metadata = {
  title: "Sign up",
  description:
    "Create a Corder account in two clicks. We email you a magic link -- no passwords, no setup.",
  alternates: { canonical: "/signup/" },
  robots: { index: false, follow: true },
};

const DATA_SOURCE = "projects/corder-landing/src/app/signup/page.tsx";

/**
 * /signup -- magic-link signup page.
 *
 * Phase 1: form is wired to a mock submit (lands on "check your
 * inbox" confirmation, no email is sent). Phase 3 will swap the
 * submit handler for `POST /auth/magic-link` against the Worker.
 */
export default function SignupPage() {
  return (
    <main className="legal-page" data-component="SignupPage" data-source={DATA_SOURCE}>
      <div className="page-container py-16 md:py-24">
        <div className="mx-auto max-w-[460px] account-auth-body">
          <a href="/" className="account-brand" aria-label="Corder home">
            <BrandMark />
            <span>Corder</span>
          </a>
          <h1 className="account-auth-heading">Create your account</h1>
          <p className="account-auth-lead">
            Enter your email -- we send you a one-time sign-in link. No
            passwords, no setup. Free tier ships with every account.
          </p>
          <MagicLinkForm mode="signup" />
          <p className="account-auth-foot">
            Already have an account?{" "}
            <a href="/login" className="account-auth-link">
              Log in
            </a>
          </p>
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
