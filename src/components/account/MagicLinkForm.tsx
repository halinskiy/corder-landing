"use client";

import { useState } from "react";

const DATA_SOURCE = "projects/corder-landing/src/components/account/MagicLinkForm.tsx";

/**
 * Magic-link form shared by /signup and /login. Single email input
 * + "Send magic link" submit. Phase 1: mock submit shows the
 * "Check your inbox" confirmation without calling the Worker.
 *
 * In Phase 3 the `onSubmit` handler will fire
 *   POST https://api.getcorder.com/auth/magic-link { email }
 * and surface 200 / 4xx as the same confirmation / inline error
 * states this scaffold already paints.
 */
export function MagicLinkForm({ mode }: { mode: "signup" | "login" }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("That doesn't look like a valid email.");
      return;
    }
    setSubmitting(true);
    // PHASE 1 MOCK: pretend the Worker accepted the email after a
    // small delay. Phase 3 replaces this with a real fetch call.
    window.setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 600);
  }

  if (sent) {
    return (
      <div
        className="account-auth-sent"
        role="status"
        data-component="MagicLinkSent"
        data-source={DATA_SOURCE}
      >
        <h2 className="account-auth-sent__heading">Check your inbox</h2>
        <p className="account-auth-sent__body">
          We sent a one-time sign-in link to <strong>{email}</strong>. Click
          it and you're in -- the link expires in 15 minutes. No password
          to remember.
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
    );
  }

  return (
    <form
      className="account-auth-form"
      onSubmit={handleSubmit}
      data-component="MagicLinkForm"
      data-source={DATA_SOURCE}
      noValidate
    >
      <label htmlFor="magic-email" className="account-auth-label">
        Email
      </label>
      <input
        id="magic-email"
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
        aria-describedby={error ? "magic-email-error" : undefined}
      />
      {error && (
        <p
          id="magic-email-error"
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
      <p className="account-auth-fineprint">
        By {mode === "signup" ? "creating an account" : "signing in"} you
        agree to our{" "}
        <a href="/terms/" className="account-auth-link">
          Terms
        </a>{" "}
        and{" "}
        <a href="/privacy-policy/" className="account-auth-link">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}
