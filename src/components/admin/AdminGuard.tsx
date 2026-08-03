"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { getSupabase, SUPABASE_CONFIGURED } from "@/lib/supabase";

const DATA_SOURCE =
  "projects/corder-landing/src/components/admin/AdminGuard.tsx";

type GuardState = "loading" | "signin" | "denied" | "ok" | "unconfigured";

function isAdmin(session: Session | null): boolean {
  return session?.user?.app_metadata?.role === "admin";
}

/**
 * Client-side gate for every /admin/** route.
 *
 * The landing is a static export, so there is no Next middleware: the
 * gate runs in the browser. It reads the Supabase session, and:
 *   - no session             -> Google sign-in
 *   - session, role != admin -> "not authorised" + sign out
 *   - session, role == admin -> render the panel
 *
 * This is a UX gate, not a security boundary. The corder-api Worker
 * re-verifies the admin JWT on every request, so a forged client state
 * still gets 403 from the API. Real privilege lives server-side.
 *
 * Sign-in is Google OAuth (one click, no email round-trip) rather than a
 * magic link: the magic link rate-limits the operator out for hours after
 * a couple of retries, and Google matches the operator's existing admin
 * account by email anyway.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GuardState>(
    SUPABASE_CONFIGURED ? "loading" : "unconfigured",
  );
  const [operator, setOperator] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return;
    const supabase = getSupabase();

    function apply(session: Session | null) {
      if (!session) {
        setState("signin");
        setOperator("");
      } else if (isAdmin(session)) {
        setOperator(session.user.email ?? "");
        setState("ok");
      } else {
        setOperator(session.user.email ?? "");
        setState("denied");
      }
    }

    supabase.auth.getSession().then(({ data }) => apply(data.session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => apply(session));

    return () => subscription.unsubscribe();
  }, []);

  async function withGoogle() {
    setError(null);
    if (!SUPABASE_CONFIGURED) {
      setError("Sign-in is not configured on this build.");
      return;
    }
    setBusy(true);
    const { error: oauthError } = await getSupabase().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/admin/`
            : undefined,
      },
    });
    // On success the browser navigates to Google; keep the button busy.
    if (oauthError) {
      setBusy(false);
      setError(oauthError.message);
    }
  }

  async function signOut() {
    await getSupabase().auth.signOut();
  }

  if (state === "ok") return <>{children}</>;

  // Everything below shares the standalone-page shell so the gate reads
  // like /login and the rest of the site.
  return (
    <main
      className="legal-page admin-gate"
      data-component="AdminGuard"
      data-source={DATA_SOURCE}
    >
      <div className="page-container py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] account-auth-body">
          {state === "loading" && (
            <p className="admin-gate__loading" aria-live="polite">
              Checking access
            </p>
          )}

          {state === "unconfigured" && (
            <>
              <h1 className="install-page__heading">Not configured</h1>
              <p className="install-page__sub">
                The Supabase anon key is missing from this build. Set
                NEXT_PUBLIC_SUPABASE_ANON_KEY and rebuild.
              </p>
            </>
          )}

          {state === "denied" && (
            <>
              <h1 className="install-page__heading">No access</h1>
              <p className="install-page__sub">
                You are signed in as {operator}, which is not an admin
                account.
              </p>
              <div className="admin-gate__actions">
                <button
                  type="button"
                  className="cta-pill cta-pill--ghost admin-gate__signout"
                  onClick={signOut}
                >
                  Sign out
                </button>
              </div>
            </>
          )}

          {state === "signin" && (
            <>
              <h1 className="install-page__heading">Admin</h1>
              <p className="install-page__sub">
                Sign in with your operator Google account.
              </p>
              <div className="account-auth-form">
                <button
                  type="button"
                  onClick={withGoogle}
                  disabled={busy}
                  className="cta-pill account-auth-submit checkout-page__google-btn inline-flex items-center justify-center gap-2"
                >
                  <GoogleGlyph />
                  Continue with Google
                </button>
                {error && (
                  <p className="account-auth-error" role="alert">
                    {error}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

// Google "G" logomark, inlined (matches the checkout + account sign-in).
function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.71a5.4 5.4 0 0 1 0-3.42V4.96H.96a9 9 0 0 0 0 8.08l3.01-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}
