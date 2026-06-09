"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const DATA_SOURCE = "projects/corder-landing/src/components/ui/BackToHomeBtn.tsx";

/**
 * Pathnames that opt OUT of the floating top-left back arrow.
 *
 *   /            home itself: nothing to go back to.
 *   /install/    has a primary "Back" pill at the bottom of the
 *                footer-actions stack; the floating arrow at the top
 *                would compete with it for the same intent.
 *   /contact/    same: the page ends with its own primary "Back" CTA.
 *
 * Pathnames stored with the trailing slash to match Next.js
 * usePathname() output for static-exported routes; the fallback
 * compares without the trailing slash too in case Next ever changes.
 */
const HIDE_ON = new Set([
  "/",
  "/install",
  "/install/",
  "/contact",
  "/contact/",
]);

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
 * to render based on the current pathname. Pages in HIDE_ON above
 * are skipped because they already carry their own primary "Back"
 * affordance at the bottom of the page.
 */
export function BackToHomeBtn() {
  const pathname = usePathname();
  const router = useRouter();
  if (pathname === null || HIDE_ON.has(pathname)) return null;

  /**
   * Prefer a real history "back" so the browser restores the previous
   * scroll position (e.g. the user clicked "Get Pro" on /#pricing ->
   * /checkout; back should land them exactly where they were, not at
   * the top of the home page). Only fall back to a fresh navigation to
   * "/" when there is no in-app history to return to -- a direct deep
   * link, a fresh tab, or an arrival from an external referrer.
   */
  const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window === "undefined") return;
    // history.length > 1 means this tab has a previous entry to return
    // to -- the normal /#pricing -> /checkout flow. router.back() lets
    // the browser + Next restore the prior scroll position (and the
    // #pricing anchor). A fresh tab / direct deep link has length 1, so
    // we let the <a href="/"> default fire and just go home.
    if (window.history.length > 1) {
      e.preventDefault();
      router.back();
    }
  };

  return (
    <Link
      href="/"
      onClick={handleBack}
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
