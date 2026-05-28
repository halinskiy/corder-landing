import Link from "next/link";

const DATA_SOURCE = "projects/corder-landing/src/components/ui/BackToHomeBtn.tsx";

/**
 * BackToHomeBtn -- the single back-affordance for every standalone
 * page.
 *
 * Renders a 40 px ghost circle with a left-arrow glyph inside, anchored
 * 16 px to the LEFT of the page heading via the surrounding
 * .standalone-page-header wrapper. On desktop the button sits in the
 * left gutter so the heading position is not shifted; on small
 * viewports it falls back to a stacked breadcrumb above the heading.
 *
 * Placement contract:
 *   <div className="standalone-page-header">
 *     <BackToHomeBtn />
 *     <h1 className="install-page__heading">...</h1>
 *   </div>
 *
 * The aria-label says "Back to Corder" -- icon-only buttons need an
 * accessible name; the domain ".app" is dropped from the spoken text
 * to match the rest of the site's brand voice.
 */
export function BackToHomeBtn() {
  return (
    <Link
      href="/"
      className="standalone-back"
      aria-label="Back to Corder"
      data-component="BackToHomeBtn"
      data-source={DATA_SOURCE}
      data-track-event="standalone_back_home"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 12H5" />
        <path d="m11 18-6-6 6-6" />
      </svg>
    </Link>
  );
}
