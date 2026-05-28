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
 * Same shell + heading typography as the rest of the standalone pages.
 * Back-to-home affordance is the shared <BackToHomeBtn /> ghost arrow
 * sitting 16 px to the left of the heading; no primary footer CTA.
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
        </div>
      </div>
    </main>
  );
}
