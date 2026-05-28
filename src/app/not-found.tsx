import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Not found  -  Corder" },
  description:
    "The page you were looking for moved or never existed. Head back to corder.app.",
  robots: { index: false, follow: true },
};

const DATA_SOURCE = "projects/corder-landing/src/app/not-found.tsx";

/**
 * 404 — Page not found.
 *
 * Uses the unified standalone-page typography (.install-page__heading +
 * .install-page__sub via the .legal-page left-aligned override) so the
 * 404 reads as the same family as /privacy-policy/, /terms/,
 * /refunds/, and the auth pages. Primary CTA back to home pinned via
 * .install-page__footer-actions.
 */
export default function NotFound() {
  return (
    <main
      data-component="NotFoundPage"
      data-source={DATA_SOURCE}
      className="legal-page"
    >
      <div className="page-container py-16 md:py-24">
        <div className="mx-auto max-w-[1080px]">
          <h1 className="install-page__heading">
            This page took a detour.
          </h1>
          <p className="install-page__sub">
            The path you followed moved, was renamed, or never existed.
            Nothing is wrong with the app  -  just this URL.
          </p>

          <div className="install-page__footer-actions">
            <Link
              href="/"
              className="cta-pill cta-pill--primary inline-flex h-14 w-full md:w-auto md:min-w-[260px] items-center justify-center rounded-[var(--radius-pill)] px-7 md:px-9 text-[17px] font-medium"
              data-track-event="not_found_back_home"
            >
              Back to corder.app
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
