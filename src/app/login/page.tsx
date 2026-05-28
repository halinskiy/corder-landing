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
 * /login -- magic-link sign-in. Same form component as /signup with
 * slightly different copy. The Worker treats both endpoints the same:
 * if the email already exists, send a sign-in link; if it doesn't,
 * send a sign-up link. The user never has to pick the right page.
 *
 * Same standalone-page header pattern as the rest of the project:
 * ghost arrow back to home 16 px to the left of the heading.
 */
export default function LoginPage() {
  return (
    <main className="legal-page" data-component="LoginPage" data-source={DATA_SOURCE}>
      <div className="page-container py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] account-auth-body">
            <h1 className="install-page__heading">Welcome back</h1>
          <p className="install-page__sub">
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
