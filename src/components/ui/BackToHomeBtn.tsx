"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const DATA_SOURCE = "projects/corder-landing/src/components/ui/BackToHomeBtn.tsx";

/**
 * BackToHomeBtn -- the single back-to-home affordance for every
 * non-home page.
 *
 * Mirror of the bottom-left <CookieConsentButton />: 56 px (48 px on
 * mobile) ghost circle, white surface + hairline border, fixed to the
 * TOP-LEFT corner of the viewport. Same visual language and same
 * hover / active behaviour as the cookie trigger; the only difference
 * is the corner and what clicking does -- this one navigates home,
 * the other one opens the consent banner.
 *
 * Mounted once in src/app/layout.tsx; this component decides whether
 * to render based on the current pathname. Home (/) is excluded
 * because there is nothing to go back to. Every other page on the
 * site automatically gets the button without any per-page wiring.
 */
export function BackToHomeBtn() {
  const pathname = usePathname();
  // Home does not need a back-to-home arrow.
  if (pathname === null || pathname === "/") return null;

  return (
    <Link
      href="/"
      className="standalone-back"
      aria-label="Back to Corder"
      title="Back to Corder"
      data-component="BackToHomeBtn"
      data-source={DATA_SOURCE}
      data-track-event="standalone_back_home"
    >
      <svg
        width="20"
        height="20"
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
