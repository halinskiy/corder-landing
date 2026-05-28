import type { Metadata } from "next";

import { BackToHomeBtn } from "@/components/ui/BackToHomeBtn";

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
 * Shares the same shell as /install and /contact (.install-page +
 * .install-page__inner) so the three hub-style standalone pages read
 * as one family. The two action cards (corder:// deep link primary,
 * mailto secondary) are kept because they are functional, not just
 * decorative -- one launches the Mac app, the other opens a help
 * message draft for the missing-email case.
 *
 * Linked from Paddle Checkout's `settings.successUrl`. Tagged
 * noindex so search engines never see it.
 */
export default function ThanksPage() {
  return (
    <main
      data-component="ThanksPage"
      data-source={DATA_SOURCE}
      className="install-page"
    >
      <div className="page-container py-16 md:py-24">
        <div className="install-page__inner mx-auto max-w-[1080px]">
          <span className="thanks-page__status">Pro activated</span>

          <div className="standalone-page-header">
            <BackToHomeBtn />
            <h1 className="install-page__heading">You&apos;re in.</h1>
          </div>
          <p className="install-page__sub install-page__sub--multi">
            Licence key is on its way to your inbox. Open Corder and paste
            it in. Should land within 1-2 minutes.
          </p>

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
                Launch the Mac app. Pro activates as soon as it sees the
                licence.
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
            <span>Cancel anytime</span>
          </footer>
        </div>
      </div>
    </main>
  );
}

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
