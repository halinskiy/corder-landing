import type { Metadata } from "next";

import { MagicLinkForm } from "@/components/account/MagicLinkForm";

export const metadata: Metadata = {
  title: "Log in",
  description:
    "Sign in to your Corder account. We email you a magic link -- no passwords, no setup.",
  alternates: { canonical: "/login/" },
  robots: { index: false, follow: true },
};

const DATA_SOURCE = "projects/corder-landing/src/app/login/page.tsx";

/**
 * /login -- magic-link sign-in. Same form component as /signup
 * with slightly different copy. The Worker treats both endpoints
 * the same: if the email already exists, send a sign-in link; if
 * it doesn't, send a sign-up link. The user never has to pick the
 * right page.
 */
export default function LoginPage() {
  return (
    <main className="legal-page" data-component="LoginPage" data-source={DATA_SOURCE}>
      <div className="page-container py-16 md:py-24">
        <div className="mx-auto max-w-[460px] account-auth-body">
          <a href="/" className="account-brand" aria-label="Corder home">
            <BrandMark />
            <span>Corder</span>
          </a>
          <h1 className="account-auth-heading">Welcome back</h1>
          <p className="account-auth-lead">
            Enter the email you signed up with. We send a one-time link --
            click it and you're in. No password to remember.
          </p>
          <MagicLinkForm mode="login" />
          <p className="account-auth-foot">
            No account yet?{" "}
            <a href="/signup" className="account-auth-link">
              Create one
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
