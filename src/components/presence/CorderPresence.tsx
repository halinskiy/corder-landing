"use client";

/**
 * CorderPresence — scroll-anchored persistent affordance.
 *
 * As the user scrolls past the HowItWorks section (the sticky live-Library
 * window is the visual centre of that block), the window MORPHS into a small
 * circular "presence" orb pinned to the bottom-right corner of the viewport.
 * The orb stays there through every following section (Fit, WorksWith,
 * Features, Pricing, Faq, Newsletter, Footer). Scrolling back up into
 * HowItWorks morphs the orb back into the window.
 *
 * Above HowItWorks (Hero region) the orb does NOT exist.
 *
 * The morph is implemented via framer-motion `layoutId="corder-presence"`:
 * the HowItWorks `.hiw-window-inner` and the orb both carry that id, and
 * framer interpolates the bounding box between them when one unmounts and
 * the other mounts. Wrapped in `<LayoutGroup id="corder-presence">` so the
 * shared id is scoped to this subtree.
 *
 * Visual reference: the real Corder app's RecordingHUDPanel floating green
 * orb (see research/corder-feature-inventory-2026-05.md section 19, item 1).
 * The orb is decorative-only in v1 — no click handler, no hover state, no
 * tooltip. A future iteration may turn this into the assistant entry point,
 * which is why the orb is `<CorderPresenceOrb />` rather than a static
 * `<div>`.
 *
 * Motion killswitch: when `prefers-reduced-motion: reduce` is set OR when
 * the project's `?motion=0` flag sets `<html data-motion="off">`, the orb
 * is hidden entirely — no morph, no orb. The window scrolls out of view
 * normally as before.
 */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { LayoutGroup, motion, useReducedMotion } from "framer-motion";

const DATA_SOURCE_PROVIDER =
  "projects/corder-landing/src/components/presence/CorderPresence.tsx";

// Doctrine easing + duration for the layout morph.
const MORPH_TRANSITION = {
  duration: 0.6,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
} as const;

// ---------------------------------------------------------------------------
// Context — single source of truth for "is the user past the HowItWorks
// section, going down?"
// ---------------------------------------------------------------------------

type CorderPresenceContextValue = {
  pastHowItWorks: boolean;
  setPastHowItWorks: (value: boolean) => void;
  /** True when motion is disabled (reduced motion OR ?motion=0). Consumers
   *  use this to render the standard non-morphing window directly instead
   *  of the framer.motion variant. */
  motionDisabled: boolean;
};

const CorderPresenceContext = createContext<CorderPresenceContextValue | null>(
  null,
);

export function useCorderPresence(): CorderPresenceContextValue {
  const ctx = useContext(CorderPresenceContext);
  if (!ctx) {
    // Soft fallback rather than a throw — the hook is consumed by sections
    // that may render in isolation in tests / story books.
    return {
      pastHowItWorks: false,
      setPastHowItWorks: () => {},
      motionDisabled: true,
    };
  }
  return ctx;
}

/**
 * Provider — wraps the page in a LayoutGroup so the window and the orb
 * share the same framer layout context for `layoutId` morphing. Renders the
 * orb at the page root so its `position: fixed` is anchored to the viewport,
 * not to a transformed ancestor.
 */
export function CorderPresenceProvider({ children }: { children: ReactNode }) {
  const [pastHowItWorks, setPastHowItWorks] = useState(false);
  const framerPrefersReduced = useReducedMotion() ?? false;
  const [htmlMotionOff, setHtmlMotionOff] = useState(false);

  // Mirror the project's ?motion=0 doctrine flag. The pre-hydration script
  // in layout.tsx sets <html data-motion="off"> before first paint, but we
  // read it in an effect because SSR doesn't know which query string the
  // client will arrive with. Defaults to "on" until the client confirms.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const check = () => {
      setHtmlMotionOff(document.documentElement.dataset.motion === "off");
    };
    check();
    // Re-check after the MotionProvider has had a chance to set the attr.
    const t = window.setTimeout(check, 50);
    return () => window.clearTimeout(t);
  }, []);

  const motionDisabled = framerPrefersReduced || htmlMotionOff;

  const value = useMemo<CorderPresenceContextValue>(
    () => ({
      pastHowItWorks,
      setPastHowItWorks,
      motionDisabled,
    }),
    [pastHowItWorks, motionDisabled],
  );

  return (
    <CorderPresenceContext.Provider value={value}>
      <LayoutGroup id="corder-presence">
        {children}
        <CorderPresenceOrb />
      </LayoutGroup>
    </CorderPresenceContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Orb — the bottom-right circular presence that the window morphs into.
// ---------------------------------------------------------------------------

/**
 * The orb itself. Rendered only when:
 *  - motion is NOT disabled, AND
 *  - the user has scrolled past the HowItWorks section going down.
 *
 * Decorative-only in v1: no click handler, no hover state, no tooltip,
 * no children. The optional centre dot is a quiet visual nod to the real
 * Corder app's RecordingHUDPanel (a single accent dot inside the chrome,
 * decorations stay monochrome per doctrine — only the inner dot uses
 * --color-accent).
 *
 * Position: fixed bottom-right with safe-area-inset awareness so iOS
 * Safari's home-indicator strip doesn't clip the orb on landscape phones.
 * Z-index 30 — above section content, below Nav (z-40).
 *
 * Future-proof: the file exposes the orb separately so a future iteration
 * can wrap it in an interactive shell (`<CorderPresence>` with a `children`
 * slot for the assistant tray, etc.) without rewriting the morph.
 */
function CorderPresenceOrb() {
  const { pastHowItWorks, motionDisabled } = useCorderPresence();

  // Motion killswitch: no orb at all when motion is disabled.
  if (motionDisabled) return null;
  if (!pastHowItWorks) return null;

  return (
    <motion.div
      layoutId="corder-presence"
      data-component="CorderPresenceOrb"
      data-source={DATA_SOURCE_PROVIDER}
      data-tokens="color-bg,color-border,color-accent,radius-window"
      aria-hidden="true"
      // Decorative; not focusable, not in the tab order.
      // `pointer-events: none` so the orb never blocks clicks on underlying
      // content. Decorative-only contract.
      style={{
        position: "fixed",
        right: "32px",
        bottom: "max(32px, calc(env(safe-area-inset-bottom, 0px) + 28px))",
        width: "56px",
        height: "56px",
        zIndex: 30,
        background: "var(--color-bg)",
        border: "1px solid var(--color-border)",
        borderRadius: "9999px",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      transition={{ layout: MORPH_TRANSITION }}
    >
      {/* Subtle accent dot — echoes the macOS RecordingHUDPanel blob. */}
      <span
        aria-hidden="true"
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "9999px",
          background: "var(--color-accent)",
          display: "block",
        }}
      />
      <style>{`
        @media (max-width: 640px) {
          [data-component="CorderPresenceOrb"] {
            width: 48px !important;
            height: 48px !important;
            right: 28px !important;
            bottom: max(28px, calc(env(safe-area-inset-bottom, 0px) + 28px)) !important;
          }
        }
      `}</style>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Sentinel — scroll-tied target placed at the bottom of the HowItWorks
// section. When the sentinel scrolls ABOVE the viewport top edge, user is
// past the section going down and `pastHowItWorks` flips true. When it
// re-enters at the top (user scrolled back up), the flag flips false.
//
// Implementation note: we DON'T use a bare IntersectionObserver here because
// a threshold-0 observer can miss state for a 1px-tall element that crosses
// the viewport in a single scroll frame, and there is no IntersectionObserver
// option for "fire continuously while element is above the viewport". A
// rAF-throttled scroll listener is one getBoundingClientRect per scroll batch
// (cheap) and unconditionally correct.
// ---------------------------------------------------------------------------

export function CorderPresenceSentinel() {
  const { setPastHowItWorks, motionDisabled } = useCorderPresence();

  useEffect(() => {
    if (motionDisabled) {
      // Never engage the orb when motion is off. Make sure the flag stays
      // false in case it was set true before the bootstrap script ran.
      setPastHowItWorks(false);
      return;
    }
    if (typeof window === "undefined") return;
    const el = document.getElementById("corder-presence-sentinel");
    if (!el) return;

    let raf = 0;
    let lastPast: boolean | null = null;

    const measure = () => {
      raf = 0;
      const sentinel = document.getElementById("corder-presence-sentinel");
      if (!sentinel) return;
      const rect = sentinel.getBoundingClientRect();
      // `past` fires earlier than top-of-viewport: when the sentinel has
      // scrolled into the upper 40% of the viewport. Matches user reading
      // the last HowItWorks pillar and starting to move away — orb morphs
      // in as they leave the section, not after they're two sections gone.
      const past = rect.top < window.innerHeight * 0.4;
      if (past !== lastPast) {
        lastPast = past;
        setPastHowItWorks(past);
      }
    };

    const schedule = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(measure);
    };

    // Measure once on mount so the initial state reflects current scroll.
    measure();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [setPastHowItWorks, motionDisabled]);

  return (
    <div
      id="corder-presence-sentinel"
      aria-hidden="true"
      style={{
        width: "100%",
        height: "1px",
        pointerEvents: "none",
        // Zero visual footprint. Pure scroll anchor.
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// WindowAnchor — wraps the existing `.hiw-window-inner` so it can carry
// `layoutId="corder-presence"`. Rendered only when motion is enabled AND
// the user is NOT past HowItWorks.
// ---------------------------------------------------------------------------

/**
 * Read whether the window-state of the morph should be rendered. The
 * HowItWorks section calls this to decide whether to render `.hiw-window-wrap`
 * with the framer layoutId attached.
 *
 * Returns:
 *  - { mode: "static" } — motion disabled, render the plain window without
 *    any layoutId or AnimatePresence wrapping.
 *  - { mode: "window" } — render the window WITH layoutId="corder-presence"
 *    so framer can morph it into the orb when the user scrolls past.
 *  - { mode: "hidden" } — user is past HowItWorks; window is unmounted so
 *    the orb (mounted at the layout level) owns the layoutId.
 */
export function useCorderPresenceMode():
  | { mode: "static" }
  | { mode: "window" }
  | { mode: "hidden" } {
  const { pastHowItWorks, motionDisabled } = useCorderPresence();
  if (motionDisabled) return { mode: "static" };
  if (pastHowItWorks) return { mode: "hidden" };
  return { mode: "window" };
}

export const CORDER_PRESENCE_LAYOUT_ID = "corder-presence";
export const CORDER_PRESENCE_MORPH_TRANSITION = MORPH_TRANSITION;
