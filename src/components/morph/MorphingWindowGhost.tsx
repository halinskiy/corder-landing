"use client";

import { useEffect, useRef } from "react";

const DATA_SOURCE =
  "projects/corder-landing/src/components/morph/MorphingWindowGhost.tsx";

/**
 * MorphingWindowGhost — fixed-position visual "ghost" of the
 * Hero / HIW window shell.
 *
 * What it does:
 *   The hero's `.hero-library-demo` window and the HowItWorks
 *   `.hiw-window-wrap` first slot are two separate visual blocks
 *   today. As the user scrolls from hero into HIW, the ghost
 *   smoothly travels between them, so the eye reads ONE window
 *   that flies from the hero into the first HIW slot.
 *
 *   Both anchor blocks share the `.hero-library-demo` CSS base
 *   (see globals.css#L457 "The How window reuses the
 *   .hero-library-demo token base"), so the ghost can use the same
 *   shell visual (border, bg, traffic-light dots) and pixel-match
 *   both ends.
 *
 * Geometry:
 *   - Hero anchor: `[data-morph-anchor="hero"]` placed on the
 *     `.hero-library-demo` div inside `HeroLibraryDemo`.
 *   - HIW anchor:  `[data-morph-anchor="hiw"]` placed on the
 *     `.hiw-window-wrap` motion.div inside `HowItWorks`.
 *   - Each animation frame, both `getBoundingClientRect()` values
 *     are read and a progress p ∈ [0, 1] is computed:
 *       p = 0 while hero anchor center is below 40% viewport
 *             (i.e. hero hasn't started leaving)
 *       p = 1 once hiw anchor top is at or above 20% viewport
 *             (i.e. HIW row 1 has reached its landing position)
 *       between: p = heroDriver / (heroDriver + hiwDriver) -- the
 *             two distances each anchor still needs to travel
 *             through their trigger lines.
 *   - Ghost rect = lerp(heroRect, hiwRect, p).
 *
 * Visibility swap:
 *   - During morph (0 < p < 1): ghost opacity 1, both anchors get
 *     a `.morph-passive` class that drops their opacity to 0.
 *   - At edges (p == 0 or p == 1): ghost opacity 0, anchors regain
 *     their natural opacity.
 *   The swap is instant (no transition) because at p == 0 the ghost
 *   rect is identical to the hero rect and at p == 1 identical to
 *   the hiw rect, so there's no visible jump.
 *
 * Off:
 *   - mobile (< 768px): ghost is hidden permanently;
 *   - prefers-reduced-motion: ghost is hidden permanently;
 *   - ?motion=0: ghost is hidden permanently (set by the bootstrap
 *     script in `layout.tsx`).
 *
 * Performance:
 *   - One rAF per scroll event (passive listener).
 *   - Two `getBoundingClientRect` reads per tick -- cheap, no
 *     layout thrash.
 *   - Style writes are batched into a single `transform` + width +
 *     height assignment.
 */
export function MorphingWindowGhost() {
  const ghostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ghost = ghostRef.current;
    if (!ghost) return;

    const desktopMql = window.matchMedia("(min-width: 768px)");
    const reducedMql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motionOff =
      document.documentElement.dataset.motion === "off";

    if (!desktopMql.matches || reducedMql.matches || motionOff) {
      ghost.style.display = "none";
      return;
    }

    let frame = 0;
    let wasInMorph = false;

    const tick = () => {
      frame = 0;

      const heroAnchor = document.querySelector<HTMLElement>(
        '[data-morph-anchor="hero"]',
      );
      const hiwAnchor = document.querySelector<HTMLElement>(
        '[data-morph-anchor="hiw"]',
      );
      if (!heroAnchor || !hiwAnchor) return;

      const heroRect = heroAnchor.getBoundingClientRect();
      const hiwRect = hiwAnchor.getBoundingClientRect();
      if (heroRect.width === 0 || hiwRect.width === 0) return;

      const vh = window.innerHeight;
      const heroDriver = vh * 0.4 - (heroRect.top + heroRect.height / 2);
      const hiwDriver = hiwRect.top - vh * 0.2;

      let p: number;
      if (heroDriver <= 0) {
        p = 0;
      } else if (hiwDriver <= 0) {
        p = 1;
      } else {
        p = heroDriver / (heroDriver + hiwDriver);
      }
      p = Math.max(0, Math.min(1, p));

      // Lerp ghost rect between hero rect and hiw rect.
      const top = heroRect.top + (hiwRect.top - heroRect.top) * p;
      const left = heroRect.left + (hiwRect.left - heroRect.left) * p;
      const width = heroRect.width + (hiwRect.width - heroRect.width) * p;
      const height = heroRect.height + (hiwRect.height - heroRect.height) * p;

      ghost.style.transform =
        `translate(${left.toFixed(2)}px, ${top.toFixed(2)}px)`;
      ghost.style.width = `${width.toFixed(2)}px`;
      ghost.style.height = `${height.toFixed(2)}px`;

      const inMorph = p > 0.001 && p < 0.999;
      if (inMorph !== wasInMorph) {
        ghost.style.opacity = inMorph ? "1" : "0";
        heroAnchor.classList.toggle("morph-passive", inMorph);
        hiwAnchor.classList.toggle("morph-passive", inMorph);
        wasInMorph = inMorph;
      }
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(tick);
    };

    schedule(); // initial paint
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
      document
        .querySelector('[data-morph-anchor="hero"]')
        ?.classList.remove("morph-passive");
      document
        .querySelector('[data-morph-anchor="hiw"]')
        ?.classList.remove("morph-passive");
    };
  }, []);

  return (
    <div
      ref={ghostRef}
      className="morph-ghost"
      data-component="MorphingWindowGhost"
      data-source={DATA_SOURCE}
      aria-hidden="true"
    >
      <div className="hl-titlebar" aria-hidden="true">
        <span className="hl-traffic close" />
        <span className="hl-traffic minimize" />
        <span className="hl-traffic maximize" />
      </div>
    </div>
  );
}
