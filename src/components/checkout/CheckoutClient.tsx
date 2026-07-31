"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { copy } from "@/content/copy";
import { getSupabase, SUPABASE_CONFIGURED } from "@/lib/supabase";
import {
  PADDLE_SUCCESS_URL,
  isLaunchTier,
  resolvePriceId,
  resolveTier,
  type PaddleBilling,
} from "@/lib/paddle";

const DATA_SOURCE =
  "projects/corder-landing/src/components/checkout/CheckoutClient.tsx";

type CheckoutState =
  | "loading"
  | "signin"
  | "ready"
  | "invalid"
  | "paddle-missing";

/**
 * Inline Paddle checkout, embedded inside our own /checkout/ shell.
 *
 * URL contract:
 *   /checkout/?tier=<trackBilling>&billing=<monthly|annual>
 *
 * trackBilling matches the strings copy.json#pricing.tiers[].trackBilling
 * uses ("pro" / "pro_launch" / "max" / "max_launch") so a future
 * pricing-page change does not have to coordinate with this page.
 *
 * A purchase MUST be linked to a Corder (Supabase) account: the Paddle
 * webhook reads `custom_data.supabase_user_id` to flip that account's
 * tier. So the visitor signs in (magic link) before Paddle opens; an
 * anonymous checkout would take money and grant nothing. We sign in
 * inline (reusing the shared `.account-auth-*` styles) rather than
 * bouncing to /login, which is a Phase-1 mock with no real session.
 *
 * On success Paddle navigates the top-level page to
 * settings.successUrl (PADDLE_SUCCESS_URL = /thanks/) and the app picks
 * up the new tier via SupabaseTierSync on next foreground.
 */
export function CheckoutClient() {
  const params = useSearchParams();
  const trackBilling = params.get("tier");
  const billingParam = params.get("billing");
  const billing: PaddleBilling =
    billingParam === "monthly" ? "monthly" : "annual";

  const priceId = useMemo(
    () => resolvePriceId(trackBilling, billing),
    [trackBilling, billing]
  );

  // Find the matching tier row in copy.json so the left column can
  // render the exact plan name + features + bill note the visitor
  // saw on /#pricing. Pro launch + Pro both map to "Pro" copy; same
  // for Max.
  const tierData = useMemo(() => {
    const tierName = resolveTier(trackBilling);
    if (!tierName) return null;
    return copy.pricing.tiers.find(
      (t) =>
        (tierName === "pro" && t.name === "Pro") ||
        (tierName === "max" && t.name === "Max")
    );
  }, [trackBilling]);

  const [state, setState] = useState<CheckoutState>("loading");

  // ── Auth. The buyer must be signed in so the webhook can map the
  // payment back to their Supabase account. We read the session and
  // keep it live via onAuthStateChange (the magic-link return re-fires
  // it, which resumes the flow below without a manual refresh).
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  useEffect(() => {
    if (!SUPABASE_CONFIGURED) {
      setAuthChecked(true);
      return;
    }
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setAuthChecked(true);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthChecked(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Paddle. Open the inline checkout once we have a valid plan AND a
  // signed-in user. Paddle.js is loaded with `defer` in app/layout.tsx,
  // so poll briefly for window.Paddle on slow networks.
  const mountedRef = useRef(false);
  useEffect(() => {
    if (!authChecked) return;
    if (!priceId || !trackBilling) {
      setState("invalid");
      return;
    }
    if (!user) {
      setState("signin");
      return;
    }
    if (mountedRef.current) return;

    let attempts = 0;
    const interval = window.setInterval(() => {
      attempts += 1;
      if (window.Paddle) {
        window.clearInterval(interval);
        mount();
      } else if (attempts > 50) {
        // 5 seconds with 100ms ticks -- give up, show error.
        window.clearInterval(interval);
        setState("paddle-missing");
      }
    }, 100);

    function mount() {
      if (mountedRef.current) return;
      mountedRef.current = true;
      const tierName = resolveTier(trackBilling);
      const launch = isLaunchTier(trackBilling) && billing === "monthly";
      const buyer = user!;
      try {
        // Cast lets us pass `frameTarget` / `frameInitialHeight` /
        // `frameStyle` -- Paddle.js v2 inline-mode keys that our
        // minimal Window.Paddle type does not enumerate.
        const settings: Record<string, unknown> = {
          successUrl: PADDLE_SUCCESS_URL,
          displayMode: "inline",
          theme: "light",
          locale: "en",
          frameTarget: "checkout-page__paddle-frame",
          frameInitialHeight: 450,
          frameStyle:
            "width: 100%; min-width: 312px; background-color: transparent; border: none;",
        };
        window.Paddle!.Checkout.open({
          items: [{ priceId: priceId!, quantity: 1 }],
          settings: settings as Parameters<
            NonNullable<typeof window.Paddle>["Checkout"]["open"]
          >[0]["settings"],
          // `customer.email` prefills the Paddle form; `supabase_user_id`
          // is the load-bearing link the webhook reads to upgrade the
          // right account. tier/billing/launch ride along for analytics.
          customer: buyer.email ? { email: buyer.email } : undefined,
          customData: {
            tier: tierName ?? "unknown",
            billing,
            launch,
            supabase_user_id: buyer.id,
          },
        });
        setState("ready");
      } catch {
        setState("paddle-missing");
      }
    }

    return () => window.clearInterval(interval);
  }, [authChecked, user, priceId, trackBilling, billing]);

  if (state === "invalid") {
    return (
      <div
        className="checkout-page__error"
        data-component="CheckoutInvalidPlan"
        data-source={DATA_SOURCE}
      >
        <p className="checkout-page__error-text">
          This checkout link is no longer valid. Pick a plan and we will
          take you back here.
        </p>
        <Link
          href="/#pricing"
          className="cta-pill cta-pill--primary inline-flex h-12 items-center justify-center rounded-[var(--radius-pill)] px-7 text-[16px] font-medium"
        >
          Back to pricing
        </Link>
      </div>
    );
  }

  if (!tierData) return null;

  // copy.json's Free tier has no `priceOriginal`, so TS narrows the
  // price shape to the smallest common subset across all three tiers.
  // Pro and Max do include the optional original; cast to the wider
  // shape so the strike-through render compiles.
  const price = (
    billing === "annual" ? tierData.annual : tierData.monthly
  ) as {
    price: string;
    priceUnit: string;
    billNote?: string;
    priceOriginal?: string;
  };

  return (
    <div
      className="checkout-page__grid"
      data-component="CheckoutGrid"
      data-source={DATA_SOURCE}
    >
      <aside
        className="checkout-page__summary"
        data-component="CheckoutSummary"
        data-source={DATA_SOURCE}
        data-tokens="color-bg,color-text,color-text-muted,color-border,color-accent,radius-window,font-serif,font-sans"
      >
        <p className="checkout-page__summary-eyebrow">Order summary</p>
        <h2 className="checkout-page__summary-heading">
          Corder {tierData.name}
        </h2>

        <div className="checkout-page__price-row">
          {price.priceOriginal && (
            <span
              className="checkout-page__price-original"
              aria-label={`Was ${price.priceOriginal} a ${price.priceUnit}`}
            >
              {price.priceOriginal}
            </span>
          )}
          <span className="checkout-page__price">{price.price}</span>
          <span className="checkout-page__price-suffix">
            /{price.priceUnit}
          </span>
        </div>
        {price.billNote && (
          <p className="checkout-page__bill-note">{price.billNote}</p>
        )}

        {/* Feature list removed 2026-06-01 per maker -- the order
            summary keeps eyebrow + plan name + price + bill note,
            then jumps straight to the trust line. The features
            still live on /#pricing where the visitor saw them
            before clicking the CTA. */}

        <p className="checkout-page__trust">
          <Link className="checkout-page__trust-link" href="/refunds/">
            14-day refund
          </Link>
          . Cancel anytime.{" "}
          <Link className="checkout-page__trust-link" href="/privacy-policy/">
            Our privacy policy
          </Link>
          . Paddle is the merchant of record and handles tax and invoicing.
        </p>
      </aside>

      <div
        className="checkout-page__paddle"
        data-component="CheckoutPaddleFrame"
        data-source={DATA_SOURCE}
      >
        {state === "loading" && (
          <div className="checkout-page__paddle-loading" aria-live="polite">
            Loading checkout
          </div>
        )}
        {state === "signin" && <CheckoutSignIn />}
        {state === "paddle-missing" && (
          <div className="checkout-page__paddle-error">
            <p>Checkout could not start. Try refreshing the page.</p>
            <Link
              href="/#pricing"
              className="cta-pill cta-pill--ghost inline-flex h-12 items-center justify-center rounded-[var(--radius-pill)] px-7 text-[16px] font-medium"
            >
              Back to pricing
            </Link>
          </div>
        )}
        {/* Paddle inline iframe mounts inside this container. The
            class name is what `settings.frameTarget` above points at. */}
        <div className="checkout-page__paddle-frame" />
      </div>
    </div>
  );
}

/**
 * Magic-link sign-in shown inside the checkout column before Paddle
 * opens. Sends a Supabase OTP link that returns to THIS checkout URL
 * (tier + billing preserved), so the purchase resumes the moment the
 * session lands. Mirrors AdminGuard's real signInWithOtp call.
 */
function CheckoutSignIn() {
  // Google is the primary path: one click, no email round-trip (so no
  // provider email-rate-limit), and it matches how people sign into the
  // Corder app. Magic-link email stays as a secondary option behind a
  // toggle for anyone who prefers it.
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function withGoogle() {
    setError(null);
    if (!SUPABASE_CONFIGURED) {
      setError("Sign-in is not configured on this build.");
      return;
    }
    setSubmitting(true);
    const { error: oauthError } = await getSupabase().auth.signInWithOAuth({
      provider: "google",
      options: {
        // Return to THIS checkout (tier + billing preserved) so the
        // purchase resumes the moment the session lands.
        redirectTo:
          typeof window !== "undefined" ? window.location.href : undefined,
      },
    });
    // On success the browser navigates to Google, so we keep the button
    // busy; only an immediate error needs surfacing.
    if (oauthError) {
      setSubmitting(false);
      setError(oauthError.message);
    }
  }

  async function sendLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!SUPABASE_CONFIGURED) {
      setError("Sign-in is not configured on this build.");
      return;
    }
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
          typeof window !== "undefined" ? window.location.href : undefined,
      },
    });
    setSubmitting(false);
    if (otpError) {
      setError(otpError.message);
      return;
    }
    setSent(true);
  }

  // Same `.checkout-page__signin` wrapper in every state so the column
  // width never jumps between sign-in and the sent confirmation.
  if (sent) {
    return (
      <div className="checkout-page__signin">
        <div className="account-auth-sent" role="status">
          <h2 className="account-auth-sent__heading">Check your inbox</h2>
          <p className="account-auth-sent__body">
            We sent a one-time sign-in link to <strong>{email}</strong>. Open it
            on this device and we will bring you straight back to checkout.
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
      </div>
    );
  }

  return (
    <div className="checkout-page__signin">
      <h2 className="checkout-page__signin-heading">Sign in to continue</h2>
      <p className="checkout-page__signin-sub">
        Your plan is tied to your Corder account. Sign in with the account you
        use in the app and we will bring you right back to finish.
      </p>

      <button
        type="button"
        onClick={withGoogle}
        disabled={submitting}
        className="cta-pill account-auth-submit checkout-page__google-btn inline-flex items-center justify-center gap-2"
      >
        <GoogleGlyph />
        Continue with Google
      </button>

      {showEmail ? (
        <form className="account-auth-form" onSubmit={sendLink} noValidate>
          <label htmlFor="checkout-email" className="account-auth-label">
            Email
          </label>
          <input
            id="checkout-email"
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
            aria-describedby={error ? "checkout-email-error" : undefined}
          />
          <button
            type="submit"
            className="cta-pill cta-pill--ghost account-auth-submit"
            disabled={submitting}
          >
            {submitting ? "Sending…" : "Send magic link"}
          </button>
        </form>
      ) : (
        <button
          type="button"
          className="account-auth-link checkout-page__signin-alt"
          onClick={() => setShowEmail(true)}
        >
          or sign in with email
        </button>
      )}

      {error && (
        <p id="checkout-email-error" className="account-auth-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// Google "G" logomark, inlined (no icon dependency).
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
