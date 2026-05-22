import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not found | Corder",
  description:
    "The page you were looking for moved or never existed. Head back to corder.app.",
};

const DATA_SOURCE = "projects/corder-landing/src/app/not-found.tsx";

/**
 * 404 — Page not found.
 *
 * Next.js App Router conventions: `not-found.tsx` at the app root is the
 * catch-all 404 boundary. With `output: "export"` it emits as `out/404.html`,
 * which GitHub Pages serves for any unknown path on the custom domain.
 *
 * Design follows the same "quiet article page" pattern as /privacy-policy
 * and /terms: page-container, large serif heading, single line of body,
 * a single primary CTA back home. No nav, no footer -- the 404 has no use
 * for them and the visitor's only action is to go back.
 */
export default function NotFound() {
  return (
    <main
      data-component="NotFoundPage"
      data-source={DATA_SOURCE}
      className="not-found-page"
    >
      <div className="page-container">
        <div className="not-found-page__inner">
          {/* Brand mark sits at the top so the page still feels like
              part of the site, not a generic provider 404. */}
          <Link
            href="/"
            className="not-found-page__mark"
            aria-label="Corder home"
          >
            <BrandMark />
            <span>Corder</span>
          </Link>

          <p className="not-found-page__eyebrow">Error 404</p>
          <h1 className="not-found-page__heading">
            This page took a detour.
          </h1>
          <p className="not-found-page__body">
            The path you followed moved, was renamed, or never existed.
            Nothing is wrong with the app -- just this URL.
          </p>

          <div className="not-found-page__actions">
            <Link
              href="/"
              className="cta-pill cta-pill--primary not-found-page__cta"
              data-track-event="not_found_back_home"
            >
              Back to corder.app
            </Link>
            <Link
              href="/#faq"
              className="not-found-page__secondary"
            >
              Or jump to FAQ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

/* The same wordmark glyph used in the Footer and Nav. Two rounded black
 * bars on a soft white tile -- the abstract "pause" the brand uses as
 * its monogram. */
function BrandMark() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 1024 1024"
      aria-hidden="true"
      role="img"
      style={{
        filter:
          "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.06)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.05))",
      }}
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
