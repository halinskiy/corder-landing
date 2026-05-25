import type { Metadata } from "next";

import { MagicLinkForm } from "@/components/account/MagicLinkForm";

export const metadata: Metadata = {
  title: "Log in | Corder",
  description:
    "Sign in to your Corder account. We email you a magic link -- no passwords, no setup.",
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
      <div className="legal-body account-auth-body">
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
        x="0"
        y="0"
        width="1024"
        height="1024"
        rx="232"
        fill="#ffffff"
        stroke="rgba(0, 0, 0, 0.06)"
        strokeWidth="1"
      />
      <rect x="312" y="212" width="160" height="600" rx="44" fill="#0a0a0a" />
      <rect x="552" y="212" width="160" height="600" rx="44" fill="#0a0a0a" />
    </svg>
  );
}
