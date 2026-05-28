import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "You're in",
  description:
    "Welcome to Corder Pro. Your licence is in your inbox. Open the Mac app to activate.",
  alternates: { canonical: "/thanks/" },
  robots: { index: false, follow: false },
};

const DATA_SOURCE = "projects/corder-landing/src/app/thanks/page.tsx";

/**
 * /thanks -- post-checkout welcome page.
 *
 * Compact one-screen layout: brand bar at top, single serif heading,
 * short lead, two side-by-side action cards, light status row. The
 * page is the *quietest* surface on the site -- a buyer just paid,
 * they want a clear next-step, not another marketing page. Fits in a
 * standard 800px-tall laptop viewport without scrolling.
 *
 * Linked from Paddle Checkout's `settings.successUrl`. Tagged
 * noindex so search engines never see it.
 */
export default function ThanksPage() {
  return (
    <main
      data-component="ThanksPage"
      data-source={DATA_SOURCE}
      className="thanks-page"
    >
      <div className="thanks-page__inner">
        <header className="thanks-page__top">
          <Link href="/" className="thanks-page__brand" aria-label="Corder home">
            <BrandMark />
            <span>Corder</span>
          </Link>
          <span className="thanks-page__status">Pro activated</span>
        </header>

        <section className="thanks-page__hero">
          <h1 className="thanks-page__heading">You&apos;re in.</h1>
          <p className="thanks-page__lead">
            Licence key is on its way to your inbox. Open Corder and paste it
            in. Should land within 1-2 minutes.
          </p>
        </section>

        <section className="thanks-page__cards">
          <a
            href="corder://activate"
            className="thanks-card thanks-card--primary"
            data-track-event="thanks_open_corder"
          >
            <div className="thanks-card__row">
              <h2 className="thanks-card__heading">Open Corder</h2>
              <ArrowRight />
            </div>
            <p className="thanks-card__body">
              Launch the Mac app. Pro activates as soon as it sees the licence.
            </p>
          </a>

          <a
            href="mailto:support@corder.app?subject=Cannot%20find%20my%20licence%20email"
            className="thanks-card thanks-card--secondary"
            data-track-event="thanks_no_email"
          >
            <div className="thanks-card__row">
              <h2 className="thanks-card__heading">No email?</h2>
              <ArrowRight />
            </div>
            <p className="thanks-card__body">
              Check spam (sender <code>noreply@paddle.com</code>). Still
              nothing, email us and we resend.
            </p>
          </a>
        </section>

        <footer className="thanks-page__status-row">
          <span>14-day refund</span>
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
    <img
      src="/brand-mark-128.png"
      width={28}
      height={28}
      alt=""
      aria-hidden="true"
      decoding="async"
      style={{ display: "block" }}
    />
  );
}

/* Inline arrow glyph -- sits inline with each card's heading. */
function ArrowRight() {
  return (
    <svg
      className="thanks-card__arrow"
      width="20"
      height="20"
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
