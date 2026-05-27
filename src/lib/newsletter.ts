/**
 * Newsletter subscription helper.
 *
 * The form lives in two places (the floating CorderPresenceForm card +
 * the reduced-motion CorderPresenceStaticSection). Both submit the same
 * payload to the same endpoint, so the transport + state machine live
 * here as a single hook -- one place to point at a real backend when
 * Phase 2-5 (Cloudflare Worker + Resend Audiences) lands.
 *
 * Endpoint contract (matches apps/newsletter-worker/):
 *   POST {NEXT_PUBLIC_NEWSLETTER_ENDPOINT}
 *   body: { "email": "user@host.tld", "source": "landing-floating" | "landing-static" }
 *   200 { "ok": true }
 *   400 { "ok": false, "error": "invalid_email" }
 *   409 { "ok": false, "error": "already_subscribed" }  -- still treated as success in UI
 *   500 { "ok": false, "error": "server_error" }
 *
 * If the env var is absent (local dev, preview branches without secrets),
 * the hook keeps the legacy "fake success" behaviour so the form still
 * reads as wired up. Real submissions only happen in production where
 * the env var is set.
 */

import { useCallback, useState } from "react";

export type NewsletterStatus = "idle" | "submitting" | "submitted" | "error";

export type NewsletterSource = "landing-floating" | "landing-static";

const ENDPOINT = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function useNewsletter(source: NewsletterSource) {
  const [status, setStatus] = useState<NewsletterStatus>("idle");
  const [email, setEmail] = useState("");

  const submit = useCallback(
    async (event?: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      const value = email.trim();
      if (!EMAIL_RE.test(value)) {
        setStatus("error");
        return;
      }

      setStatus("submitting");

      if (!ENDPOINT) {
        // No backend configured (local dev, preview without secrets).
        // Keep the legacy optimistic success so the form still reads
        // as wired during design iteration.
        await new Promise((r) => setTimeout(r, 350));
        setStatus("submitted");
        return;
      }

      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email: value, source }),
        });

        // 409 (already subscribed) is a UX success -- the user's address
        // is on the list either way, no point shouting at them.
        if (res.ok || res.status === 409) {
          setStatus("submitted");
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    },
    [email, source]
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setEmail("");
  }, []);

  return { status, email, setEmail, submit, reset };
}
