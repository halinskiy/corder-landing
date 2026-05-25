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
 * Per-user (2026-05-25): no brand mark / wordmark at the top, no
 * "Error 404" eyebrow, no "Or jump to FAQ" link. Heading sits on
 * a single line. Vertical offsets match the legal-page shell
 * (Privacy / Terms / Refunds) so the 404 lands the same distance
 * from the top as the rest of the standalone pages.
 */
export default function NotFound() {
  return (
    <main
      data-component="NotFoundPage"
      data-source={DATA_SOURCE}
      className="legal-page not-found-page"
    >
      <div className="page-container py-16 md:py-24">
        <div className="mx-auto max-w-[720px]">
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
          </div>
        </div>
      </div>
    </main>
  );
}
