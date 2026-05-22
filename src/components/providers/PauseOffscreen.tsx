"use client";

import { useEffect } from "react";

/**
 * PauseOffscreen
 *
 * Single global IntersectionObserver that toggles `data-anim-paused` on
 * every `[data-pauseable]` root when it leaves the viewport. The matching
 * CSS rule in `globals.css` pauses every CSS animation in that subtree:
 *
 *     [data-anim-paused="true"],
 *     [data-anim-paused="true"] * { animation-play-state: paused !important }
 *
 * Why a single observer at root, not one per section: cheaper. We register
 * every pause-able element with one IO instance configured at threshold 0
 * with a small negative rootMargin so we pause as soon as the section's
 * edge crosses the viewport, not after it's fully out.
 *
 * What it pauses (as of 2026-05-22):
 *   - `works-with-scroll` (the marquee in WorksWith) -- 80s infinite
 *   - `hl-scrub` + `hl-cursor` in HeroLibraryDemo -- 18s infinite each
 * Earlier this also paused cta-sparkles and blob-jelly loops, but those
 * are now removed entirely.
 */
export function PauseOffscreen() {
  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          // Pause when not intersecting at all; resume on any pixel visible.
          el.dataset.animPaused = entry.isIntersecting ? "false" : "true";
        }
      },
      {
        // Some breathing room so paused sections resume slightly before
        // their first row enters the viewport -- avoids a perceptible
        // resume-jump at the edge.
        rootMargin: "120px 0px 120px 0px",
        threshold: 0,
      }
    );

    // Initial pass: observe every element marked pauseable.
    const observed = new Set<Element>();
    function scan() {
      for (const el of document.querySelectorAll("[data-pauseable]")) {
        if (observed.has(el)) continue;
        observed.add(el);
        io.observe(el);
      }
    }
    scan();

    // Re-scan periodically in case of late-mounted nodes (e.g. presence
    // morph chain swapping a window in/out). Cheap -- the set dedupes.
    const interval = window.setInterval(scan, 2000);

    return () => {
      window.clearInterval(interval);
      io.disconnect();
    };
  }, []);

  return null;
}
