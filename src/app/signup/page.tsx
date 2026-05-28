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
 * Same standalone-page header pattern as the rest of the project:
 * ghost arrow back to home 16 px to the left of the heading, no brand
 * wordmark. Phase 1 form is wired to a mock submit; Phase 3 swaps the
 * handler for `POST /auth/magic-link` against the Worker.
 */
export default function SignupPage() {
  return (
    <main className="legal-page" data-component="SignupPage" data-source={DATA_SOURCE}>
      <div className="page-container py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] account-auth-body">
            <h1 className="install-page__heading">Create your account</h1>
          <p className="install-page__sub">
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
