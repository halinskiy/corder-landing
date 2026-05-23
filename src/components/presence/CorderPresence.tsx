"use client";

/**
 * CorderPresence — scroll-anchored persistent affordance with three states.
 *
 * The presence flows through three render states tied to scroll position,
 * all sharing the framer-motion `layoutId="corder-presence"`:
 *
 *   A. WINDOW — live Library window sticky inside the HowItWorks block.
 *      Rendered in-place by `HowItWorks.tsx` while the user is reading that
 *      section. (This file does NOT render state A; it only owns the
 *      `useCorderPresenceMode` hook that HowItWorks consults.)
 *
 *   B. ORB — 56x56 (48x48 mobile) circle pinned bottom-right. Mounts when
 *      the user has scrolled past HowItWorks' upper-40% threshold and has
 *      NOT yet entered the form zone above the footer. Decorative only.
 *
 *   C. FORM — expanded contact card pinned bottom-right at the same inset
 *      as the orb. Mounts when the user enters the form-zone sentinel
 *      (placed where the old Newsletter section used to sit, between Faq
 *      and Footer). Real interactive subscribe form, reusing
 *      `copy.json#newsletter`.
 *
 * Because only ONE of {window, orb, form} is mounted at a time and all
 * three carry the same `layoutId`, framer-motion interpolates the bounding
 * box, border-radius and content as the user scrolls — the window glides
 * to the corner as an orb, then the orb unfolds into a card.
 *
 * Motion killswitch: when `prefers-reduced-motion: reduce` is set OR the
 * project's `?motion=0` flag sets `<html data-motion="off">`, the orb AND
 * the form are both hidden — a corner-pinned, animation-justified
 * affordance with no animation would be intrusive and pointless. Instead,
 * the inline contact section (`CorderPresenceStaticSection`) renders in
 * normal page flow between Faq and Footer, so the user still has a way to
 * subscribe.
 *
 * Visual reference for the orb: the real Corder app's RecordingHUDPanel
 * floating green dot (see research/corder-feature-inventory-2026-05.md).
 */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { LayoutGroup, motion, useReducedMotion } from "framer-motion";

import { copy } from "@/content/copy";

const DATA_SOURCE_PROVIDER =
  "projects/corder-landing/src/components/presence/CorderPresence.tsx";

// Doctrine easing + duration for the layout morph. Shared across all three
// states so the morph feels uniform regardless of which transition fires.
const MORPH_TRANSITION = {
  duration: 0.4,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
} as const;

// ---------------------------------------------------------------------------
// Context — shared scroll-state flags. `pastHowItWorks` flips when the user
// has read past the HowItWorks section; `pastFormZone` flips when they
// reach the bottom (just above the footer) where the form should open.
// ---------------------------------------------------------------------------

type CorderPresenceContextValue = {
  /** True once the user has scrolled to (or past) the HowItWorks heading
   *  area. While false, the live-window layoutId belongs to the Hero
   *  block (mode "hero"). When it flips true, framer FLIPs the layoutId
   *  bounds from the Hero rect into the HIW row-1 rect -- the whole
   *  block visually flies from Hero into the first HIW slot. */
  pastHero: boolean;
  setPastHero: (value: boolean) => void;
  pastHowItWorks: boolean;
  setPastHowItWorks: (value: boolean) => void;
  pastFormZone: boolean;
  setPastFormZone: (value: boolean) => void;
  /** True when motion is disabled (reduced motion OR ?motion=0). Consumers
   *  use this to render the standard non-morphing window directly instead
   *  of the framer.motion variant, and the inline static contact section. */
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
      pastHero: false,
      setPastHero: () => {},
      pastHowItWorks: false,
      setPastHowItWorks: () => {},
      pastFormZone: false,
      setPastFormZone: () => {},
      motionDisabled: true,
    };
  }
  return ctx;
}

/**
 * Provider — wraps the page in a LayoutGroup so the window, orb and form
 * share the same framer layout context for `layoutId` morphing. Renders
 * the orb AND the form at the page root so their `position: fixed` is
 * anchored to the viewport, not to a transformed ancestor. Only one of
 * {orb, form} is mounted at a time (driven by the `mode` selector below).
 */
export function CorderPresenceProvider({ children }: { children: ReactNode }) {
  const [pastHero, setPastHero] = useState(false);
  const [pastHowItWorks, setPastHowItWorks] = useState(false);
  const [pastFormZone, setPastFormZone] = useState(false);
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
      pastHero,
      setPastHero,
      pastHowItWorks,
      setPastHowItWorks,
      pastFormZone,
      setPastFormZone,
      motionDisabled,
    }),
    [pastHero, pastHowItWorks, pastFormZone, motionDisabled],
  );

  return (
    <CorderPresenceContext.Provider value={value}>
      <LayoutGroup id="corder-presence">
        {children}
        <CorderPresenceCorner />
      </LayoutGroup>
    </CorderPresenceContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Corner switch — mounts the orb (state B) OR the form (state C) at the
// page root. NO AnimatePresence wrapper: with both elements sharing the
// same `layoutId` inside a LayoutGroup, framer interpolates bounds + radius
// in a single render cycle when one unmounts and the other mounts. This
// avoids the dual-element artifact (huge rounded outline visible around
// the form during transition) that AnimatePresence's `popLayout` produced.
// ---------------------------------------------------------------------------

function CorderPresenceCorner() {
  const { pastHowItWorks, pastFormZone, motionDisabled } = useCorderPresence();

  // Motion killswitch: no orb, no form. The inline static section
  // (rendered separately by page.tsx) carries the subscribe affordance.
  if (motionDisabled) return null;
  if (!pastHowItWorks) return null;

  return pastFormZone ? <CorderPresenceForm /> : <CorderPresenceOrb />;
}

// ---------------------------------------------------------------------------
// Orb (state B) — the bottom-right green CTA the window morphs into.
// Interactive: clicking smooth-scrolls to the FAQ section so the user
// crosses the form-zone sentinel and the orb morphs into the contact
// card (state C). Visual: accent-filled circle with a white lucide
// HelpCircle icon. Same `layoutId` as the form so framer interpolates
// the bounds + radius when the corner switches state.
// ---------------------------------------------------------------------------

function CorderPresenceOrb() {
  const handleClick = () => {
    if (typeof document === "undefined") return;
    const target = document.getElementById("pricing");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <motion.button
      type="button"
      layoutId="corder-presence"
      data-component="CorderPresenceOrb"
      data-source={DATA_SOURCE_PROVIDER}
      data-tokens="color-accent,color-accent-contrast,radius-window"
      aria-label="Jump to Pricing and download"
      onClick={handleClick}
      style={{
        position: "fixed",
        right: "32px",
        bottom: "max(32px, calc(env(safe-area-inset-bottom, 0px) + 28px))",
        width: "56px",
        height: "56px",
        zIndex: 30,
        background: "var(--color-accent)",
        border: 0,
        borderRadius: "9999px",
        pointerEvents: "auto",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        color: "#ffffff",
      }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      transition={{ layout: MORPH_TRANSITION }}
    >
      <CloudDownloadIcon />
      <style>{`
        @media (max-width: 640px) {
          [data-component="CorderPresenceOrb"] {
            width: 48px !important;
            height: 48px !important;
            right: 28px !important;
            bottom: max(28px, calc(env(safe-area-inset-bottom, 0px) + 28px)) !important;
          }
        }
        [data-component="CorderPresenceOrb"]:hover {
          background: var(--color-accent-hover, var(--color-accent));
        }
        [data-component="CorderPresenceOrb"]:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 3px;
        }
      `}</style>
    </motion.button>
  );
}

// Lucide CloudDownload icon, inlined (no lucide-react dependency).
function CloudDownloadIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 13v8l-4-4" />
      <path d="m12 21 4-4" />
      <path d="M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Form (state C) — the orb expands into a contact card. Reuses the
// content/copy.json#newsletter block. Real interactive form.
// ---------------------------------------------------------------------------

function CorderPresenceForm() {
  const { newsletter } = copy;
  const [status, setStatus] = useState<"idle" | "submitted">("idle");
  const [email, setEmail] = useState("");
  // `bottom` is recomputed on scroll so the form pins 64px above the
  // footer baseline once the baseline approaches the viewport bottom.
  // Default = 32px viewport-bottom inset.
  const [bottomPx, setBottomPx] = useState(32);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setStatus("submitted");
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const baseline = document.querySelector(".site-footer__baseline");
      const viewportH = window.innerHeight;
      if (!baseline) {
        setBottomPx(32);
        return;
      }
      const r = (baseline as HTMLElement).getBoundingClientRect();
      // If the baseline is below the viewport, default behaviour: pin
      // the form 32px from the viewport bottom. Once the baseline is
      // inside (or above) the viewport, the form's bottom-anchor moves
      // upward so it sits 64px above the baseline top edge.
      if (r.top >= viewportH - 32) {
        setBottomPx(32);
      } else {
        setBottomPx(Math.round(viewportH - r.top + 64));
      }
    };
    const onScrollOrResize = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  // Content lives directly inside the morphing motion.div — no inner
  // motion.div wrapper. With AnimatePresence removed in the corner switch
  // there's only ONE element on screen at a time, so the bounds + radius
  // interpolation reads as a clean unfold from the orb to the card.
  return (
    <motion.div
      layoutId="corder-presence"
      data-component="CorderPresenceForm"
      data-source={DATA_SOURCE_PROVIDER}
      data-tokens="color-bg,color-border,color-text,color-accent,radius-window,font-serif,font-sans"
      role="region"
      aria-label="Subscribe to product updates"
      style={{
        position: "fixed",
        right: "32px",
        bottom: `max(${bottomPx}px, calc(env(safe-area-inset-bottom, 0px) + 28px))`,
        width: "380px",
        // Card hugs its content (heading + subhead + form OR success
        // message). Earlier we held a minHeight of 260px so the morph
        // from orb to card had a chunky target -- the side effect was
        // dead space below the Subscribe button on mobile. Remove the
        // min and let padding handle the rhythm.
        height: "auto",
        zIndex: 31,
        background: "var(--color-bg)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-window)",
        pointerEvents: "auto",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        // 22px all sides -- equal horizontal + vertical padding so the
        // card reads as a tight ticket rather than a tall capsule.
        // User asked the form be shorter on 2026-05-22; earlier we had
        // 40px top/bottom which was too generous.
        padding: "22px",
        boxSizing: "border-box",
      }}
      transition={{ layout: MORPH_TRANSITION }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 500,
            fontSize: "24px",
            lineHeight: 1.18,
            letterSpacing: "-0.012em",
            color: "var(--color-text)",
            margin: 0,
          }}
        >
          {newsletter.heading}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "14px",
            lineHeight: 1.5,
            color: "var(--color-text-muted)",
            margin: 0,
          }}
        >
          {newsletter.subhead}
        </p>
      </div>

      {status === "idle" ? (
        <form
          onSubmit={handleSubmit}
          aria-label="Subscribe to product updates"
          noValidate
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={newsletter.placeholder}
            aria-label="Email address"
            className="presence-form-input"
          />
          <button
            type="submit"
            className="cta-pill cta-pill--primary inline-flex h-12 w-full items-center justify-center rounded-[var(--radius-pill)] px-6 text-[15px] font-medium"
          >
            {newsletter.cta}
          </button>
        </form>
      ) : (
        <p
          role="status"
          aria-live="polite"
          style={{
            margin: 0,
            fontFamily: "var(--font-sans)",
            fontSize: "14px",
            lineHeight: 1.5,
            color: "var(--color-text-muted)",
          }}
        >
          {newsletter.successMessage}
        </p>
      )}
      <style>{`
        @media (max-width: 640px) {
          /* Mobile: equal insets on left + right + bottom so the form is
           * symmetrically pinned, not cornered. Width is auto-derived
           * from the left/right anchors. */
          [data-component="CorderPresenceForm"] {
            width: auto !important;
            left: 28px !important;
            right: 28px !important;
            bottom: max(28px, calc(env(safe-area-inset-bottom, 0px) + 28px)) !important;
          }
        }
        /* Input mirrors the project's existing pill-shaped search field
         * (Search the transcript inside the Hero demo): 999px radius,
         * hairline border, accent focus ring. Pairs with the cta-pill
         * Subscribe button below. */
        .presence-form-input {
          width: 100%;
          height: 48px;
          padding: 0 20px;
          border: 1px solid var(--color-border-strong);
          border-radius: 999px;
          background: var(--color-bg);
          font-family: var(--font-sans);
          font-size: 15px;
          color: var(--color-text);
          appearance: none;
          -webkit-appearance: none;
          outline: none;
          box-sizing: border-box;
          transition: border-color 150ms cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 150ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .presence-form-input:hover {
          border-color: var(--color-text);
        }
        /* Pill input + pill focus ring. The global :focus-visible rule
         * paints a rectangular outline AND forces border-radius: inherit
         * (which collapses to 0 because the parent form has no radius).
         * Override both so the pill shape and the halo both stay round. */
        .presence-form-input:focus,
        .presence-form-input:focus-visible {
          outline: none !important;
          border-radius: 999px !important;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(33, 122, 80, 0.20);
        }
        /* Subscribe button uses the project's .cta-pill .cta-pill--primary
         * classes (same pattern as Hero's Download for Mac CTA). No bespoke
         * submit styles here - single source of truth. */
      `}</style>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Sentinels — scroll-tied targets that flip the two scroll flags. Both use
// the same rAF-throttled `getBoundingClientRect` measure pattern; an
// IntersectionObserver threshold-0 can miss state for a 1px-tall element
// that crosses the viewport in a single scroll frame.
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

/**
 * Form-zone sentinel — placed where the Newsletter section used to sit
 * (between Faq and Footer in page.tsx). When the sentinel scrolls into
 * the upper 40% of the viewport (matches the existing trigger pattern),
 * `pastFormZone` flips true and the orb morphs into the form card.
 *
 * Renders as a zero-height anchor so it occupies no visual space — the
 * old Newsletter section is going away, not being replaced inline.
 */
export function CorderPresenceFormSentinel() {
  const { setPastFormZone, motionDisabled } = useCorderPresence();

  useEffect(() => {
    if (motionDisabled) {
      setPastFormZone(false);
      return;
    }
    if (typeof window === "undefined") return;
    const el = document.getElementById("corder-presence-form-sentinel");
    if (!el) return;

    let raf = 0;
    let lastPast: boolean | null = null;

    const measure = () => {
      raf = 0;
      const sentinel = document.getElementById("corder-presence-form-sentinel");
      if (!sentinel) return;
      const rect = sentinel.getBoundingClientRect();
      const past = rect.top < window.innerHeight * 0.4;
      if (past !== lastPast) {
        lastPast = past;
        setPastFormZone(past);
      }
    };

    const schedule = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [setPastFormZone, motionDisabled]);

  return (
    <div
      id="corder-presence-form-sentinel"
      aria-hidden="true"
      style={{
        width: "100%",
        height: 0,
        margin: 0,
        pointerEvents: "none",
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Static fallback section — for `prefers-reduced-motion` / `?motion=0`. The
// corner-pinned orb/form would be intrusive without animation justification,
// so in reduced-motion mode the contact form appears inline in page flow
// instead, slotted where the old Newsletter section used to live.
// ---------------------------------------------------------------------------

export function CorderPresenceStaticSection() {
  const { motionDisabled } = useCorderPresence();
  const { newsletter } = copy;
  const [status, setStatus] = useState<"idle" | "submitted">("idle");
  const [email, setEmail] = useState("");
  // Mobile: a fixed-corner card stomps on footer content, so the
  // subscribe form moves inline at the bottom of the page even when
  // motion is on. Desktop keeps the floating morphing form unless
  // motion is disabled.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 640px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!motionDisabled && !isMobile) return null;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setStatus("submitted");
  }

  return (
    <section
      id="newsletter"
      data-component="CorderPresenceStaticSection"
      data-source={DATA_SOURCE_PROVIDER}
      data-tokens="color-bg,color-border,color-text,color-text-muted,color-accent,radius-button,font-serif,font-sans"
      className="presence-static"
    >
      <div className="page-container">
        <div className="presence-static__inner">
          <h2 className="presence-static__heading">{newsletter.heading}</h2>
          <p className="presence-static__subhead">{newsletter.subhead}</p>

          {status === "idle" ? (
            <form
              className="presence-static__form"
              onSubmit={handleSubmit}
              aria-label="Subscribe to product updates"
              noValidate
            >
              <input
                type="email"
                required
                placeholder={newsletter.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="presence-static__input"
                aria-label="Email address"
              />
              <button type="submit" className="presence-static__submit">
                {newsletter.cta}
              </button>
            </form>
          ) : (
            <p
              className="presence-static__status"
              role="status"
              aria-live="polite"
            >
              {newsletter.successMessage}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// HowItWorks consumer hook — decides whether the in-section live window
// should render with the framer layoutId. With three states now, the orb
// OR form takes ownership of the layoutId once the user is past HowItWorks.
// ---------------------------------------------------------------------------

/**
 * Read whether the HIW window-state should be rendered.
 *
 * Returns:
 *  - { mode: "static" } — motion disabled, render the plain window without
 *    any layoutId or AnimatePresence wrapping.
 *  - { mode: "hero" }   — user is still in Hero; HIW should NOT render its
 *    window-wrap because Hero owns the layoutId for the live block. The
 *    HIW row-1 slot shows only a dashed ghost placeholder.
 *  - { mode: "window" } — render the window WITH layoutId="corder-presence"
 *    so framer can morph it into the orb when the user scrolls past.
 *  - { mode: "hidden" } — user is past HowItWorks; window is unmounted so
 *    the orb (or form) mounted at the layout level owns the layoutId.
 */
export function useCorderPresenceMode():
  | { mode: "static" }
  | { mode: "hero" }
  | { mode: "window" }
  | { mode: "hidden" } {
  const { pastHero, pastHowItWorks, motionDisabled } = useCorderPresence();
  if (motionDisabled) return { mode: "static" };
  if (pastHowItWorks) return { mode: "hidden" };
  if (!pastHero) return { mode: "hero" };
  return { mode: "window" };
}

/**
 * Mirror hook for the Hero section. Tells Hero whether to render its
 * HeroLibraryDemo wrapped in the layoutId motion element (the morph
 * source) or just the static dashed placeholder.
 *
 * Returns:
 *  - { mode: "static" }   — motion disabled, render HeroLibraryDemo flat.
 *  - { mode: "live" }     — render HeroLibraryDemo inside a motion.div
 *    that carries the shared `layoutId="corder-presence"`. When pastHero
 *    flips true, framer FLIP-morphs its bounds into the HIW window slot.
 *  - { mode: "ghost" }    — user has scrolled past the Hero -> HIW
 *    handoff. HIW owns the layoutId; Hero shows only a dashed placeholder
 *    so the heading still reads "this is where the window lived".
 */
export function useHeroPresenceMode():
  | { mode: "static" }
  | { mode: "live" }
  | { mode: "ghost" } {
  const { pastHero, motionDisabled } = useCorderPresence();
  if (motionDisabled) return { mode: "static" };
  if (!pastHero) return { mode: "live" };
  return { mode: "ghost" };
}

/**
 * Sentinel placed at the top of the .hiw-track. `pastHero` flips true
 * the moment the sentinel crosses the viewport's TOP edge -- not the
 * centre. At that scroll position, HIW row 1 naturally sits at ~35% of
 * the viewport (its useTransform "top: 35vh" target), so the morph
 * lands the block exactly where row 1's dashed placeholder lives. An
 * earlier IntersectionObserver fired at the viewport centre instead,
 * which froze the destination at ~85% of the viewport (the very
 * bottom) -- the block visually landed below where the user expected
 * it ("встаёт ниже слишком").
 *
 * Bidirectional: when the user scrolls back up and the sentinel re-
 * enters the viewport (top > 0), `pastHero` flips false and the block
 * morphs back to its Hero slot.
 *
 * Implementation: rAF-throttled scroll listener, single
 * getBoundingClientRect read per frame, no layout thrash.
 */
export function CorderPresenceHeroSentinel() {
  const { setPastHero, motionDisabled } = useCorderPresence();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (motionDisabled) return;
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;
    let rafId = 0;
    const tick = () => {
      rafId = 0;
      const top = el.getBoundingClientRect().top;
      setPastHero(top <= 0);
    };
    const schedule = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(tick);
    };
    schedule(); // initial state
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [motionDisabled, setPastHero]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        pointerEvents: "none",
        opacity: 0,
      }}
    />
  );
}

export const CORDER_PRESENCE_LAYOUT_ID = "corder-presence";
export const CORDER_PRESENCE_MORPH_TRANSITION = MORPH_TRANSITION;
