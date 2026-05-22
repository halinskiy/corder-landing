import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "You're in | Corder",
  description:
    "Welcome to Corder Pro. Your licence is in your inbox. Open the Mac app to activate.",
  robots: { index: false, follow: false },
};

const DATA_SOURCE = "projects/corder-landing/src/app/thanks/page.tsx";

/**
 * /thanks -- post-checkout welcome page.
 *
 * Layout mirrors the Vendo dashboard reference the maker likes: brand
 * mark top-left, small "Pro activated" tag top-right, an oversize serif
 * greeting on the left, lead line under it, two action cards side by
 * side (primary accent-fill + secondary hairline), and a small status
 * row underneath.
 *
 * Linked from Paddle Checkout's successUrl. Not in the sitemap; tagged
 * noindex in metadata above so search engines never see it.
 */
export default function ThanksPage() {
  return (
    <main
      data-component="ThanksPage"
      data-source={DATA_SOURCE}
      className="thanks-page"
    >
      <div className="thanks-page__inner">
        {/* Top bar: brand wordmark left, small status pill right. */}
        <header className="thanks-page__top">
          <Link href="/" className="thanks-page__brand" aria-label="Corder home">
            <BrandMark />
            <span>Corder</span>
          </Link>
          <span className="thanks-page__status">Pro activated</span>
        </header>

        {/* Hero block: eyebrow, big serif heading, lead line. */}
        <section className="thanks-page__hero">
          <p className="thanks-page__eyebrow">Welcome to Pro</p>
          <h1 className="thanks-page__heading">
            You&apos;re in. Welcome to Pro.
          </h1>
          <p className="thanks-page__lead">
            We&apos;ve emailed your licence key. Open Corder, paste the key,
            start recording without limits. The inbox should land in 1-2
            minutes.
          </p>
        </section>

        {/* Two action cards. Left primary (open the Mac app), right
            secondary (find the email). Same shape as Vendo: heading,
            body, arrow CTA. */}
        <section className="thanks-page__cards">
          <a
            href="corder://activate"
            className="thanks-card thanks-card--primary"
            data-track-event="thanks_open_corder"
          >
            <h2 className="thanks-card__heading">Open Corder</h2>
            <p className="thanks-card__body">
              Launch the Mac app. Pro activates automatically once it sees
              the licence on your account.
            </p>
            <span className="thanks-card__cta">
              Open <ArrowRight />
            </span>
          </a>

          <a
            href="mailto:support@corder.app?subject=Cannot%20find%20my%20licence%20email"
            className="thanks-card thanks-card--secondary"
            data-track-event="thanks_no_email"
          >
            <h2 className="thanks-card__heading">Can&apos;t find the email?</h2>
            <p className="thanks-card__body">
              Check spam first (sender is{" "}
              <code>noreply@paddle.com</code>). Still nothing? Drop us a
              line and we resend in minutes.
            </p>
            <span className="thanks-card__cta">
              Email support <ArrowRight />
            </span>
          </a>
        </section>

        {/* Status row -- small grey separator items, Vendo footer style. */}
        <footer className="thanks-page__status-row">
          <span>14-day refund window</span>
          <span aria-hidden>·</span>
          <span>Cancel anytime</span>
          <span aria-hidden>·</span>
          <Link href="/">Back to corder.app</Link>
        </footer>
      </div>
    </main>
  );
}

/* Brand wordmark glyph -- two rounded black bars on a white tile, same
 * geometry as the Nav / Footer mark and the favicon. */
function BrandMark() {
  return (
    <svg
      width="32"
      height="32"
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

/* Inline arrow glyph -- matches the Vendo card "→" affordance. */
function ArrowRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </svg>
  );
}
