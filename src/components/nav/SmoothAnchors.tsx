"use client";

import { useEffect } from "react";

/**
 * SmoothAnchors — one delegated click handler for every in-page `#` link
 * (header nav, footer product links, "Back to top", etc.).
 *
 * Why a global listener instead of per-link onClick:
 *  - It covers Nav AND Footer AND any future anchor in one place.
 *  - It does the two things the plain `<a href="#x">` default gets wrong:
 *     1. Smooth scroll. The old `html:focus-within { scroll-behavior:smooth }`
 *        trick only fires when the click actually moves focus into the page,
 *        which Safari/WebKit skip for links — so the jump was abrupt there.
 *     2. It does NOT write the hash to the URL. The default anchor jump pushes
 *        `#how-it-works` into the address bar; a user who then copies and
 *        shares that URL sends recipients straight-anchored into mid-page.
 *        `preventDefault()` keeps the shared URL clean (getcorder.com/).
 *
 * Reduced motion is respected (instant jump). Modifier-clicks / middle-clicks
 * fall through untouched. Unknown anchors (no matching element) fall through so
 * nothing that isn't a real section is hijacked.
 */
export function SmoothAnchors() {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const onClick = (e: MouseEvent) => {
      // Let the browser own anything that isn't a plain left-click.
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      const anchor = (e.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.charAt(0) !== "#" || href === "#") return;

      const id = href.slice(1);
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const behavior: ScrollBehavior = prefersReduced ? "auto" : "smooth";

      // `#top` is the whole page — scroll to the very top (0), not to the
      // <main id="top"> offset by scroll-padding, which would leave a gap.
      if (id === "top") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior });
        return;
      }

      const target = document.getElementById(id);
      if (!target) return; // unknown anchor: leave the default behaviour alone

      e.preventDefault();
      // scroll-padding-top (88px on <html>) clears the fixed nav pill, so
      // block:"start" lands the section just below it.
      target.scrollIntoView({ behavior, block: "start" });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
