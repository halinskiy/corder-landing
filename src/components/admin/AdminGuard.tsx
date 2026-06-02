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
 *   - no session            -> inline magic-link sign-in (signInWithOtp)
 *   - session, role != admin -> "not authorised" + sign out
 *   - session, role == admin -> render the panel
 *
 * This is a UX gate, not a security boundary. The corder-api Worker
 * re-verifies the admin JWT on every request, so a forged client state
 * still gets 403 from the API. Real privilege lives server-side.
 *
 * We sign in inline rather than redirecting to /login because that page
 * is a Phase-1 mock that never creates a real Supabase session. Keeping
 * the magic-link here makes the panel self-contained and reuses the
 * shared `.account-auth-*` styles so it reads as the same family.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GuardState>(
    SUPABASE_CONFIGURED ? "loading" : "unconfigured",
  );
  const [email, setEmail] = useState("");
  const [operator, setOperator] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
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

  async function sendLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("That does not look like a valid email.");
      return;
    }
    setSubmitting(true);
    const { error: otpError } = await getSupabase().auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/admin/`
            : undefined,
      },
    });
    setSubmitting(false);
    if (otpError) {
      setError(otpError.message);
      return;
    }
    setSent(true);
  }

  async function signOut() {
    await getSupabase().auth.signOut();
    setSent(false);
    setEmail("");
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

          {state === "signin" &&
            (sent ? (
              <div className="account-auth-sent" role="status">
                <h2 className="account-auth-sent__heading">
                  Check your inbox
                </h2>
                <p className="account-auth-sent__body">
                  We sent a one-time sign-in link to <strong>{email}</strong>.
                  Open it on this device to enter the panel.
                </p>
                <p className="account-auth-sent__hint">
                  Wrong email?{" "}
                  <button
                    type="button"
                    className="account-auth-link"
                    onClick={() => {
                      setSent(false);
                      setEmail("");
                    }}
                  >
                    Try a different address
                  </button>
                </p>
              </div>
            ) : (
              <>
                <h1 className="install-page__heading">Admin</h1>
                <p className="install-page__sub">
                  Sign in with your operator email. We send a one-time link.
                </p>
                <form
                  className="account-auth-form"
                  onSubmit={sendLink}
                  noValidate
                >
                  <label htmlFor="admin-email" className="account-auth-label">
                    Email
                  </label>
                  <input
                    id="admin-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="account-auth-input"
                    disabled={submitting}
                    aria-describedby={error ? "admin-email-error" : undefined}
                  />
                  {error && (
                    <p
                      id="admin-email-error"
                      className="account-auth-error"
                      role="alert"
                    >
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="cta-pill cta-pill--primary account-auth-submit"
                    disabled={submitting}
                  >
                    {submitting ? "Sending…" : "Send magic link"}
                  </button>
                </form>
              </>
            ))}
        </div>
      </div>
    </main>
  );
}
