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
      pastHowItWorks,
      setPastHowItWorks,
      pastFormZone,
      setPastFormZone,
      motionDisabled,
    }),
    [pastHowItWorks, pastFormZone, motionDisabled],
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
    const target = document.getElementById("faq");
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
      aria-label="Jump to FAQ and subscribe"
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
      <HelpCircleIcon />
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

// Lucide HelpCircle icon, inlined (no lucide-react dependency).
function HelpCircleIcon() {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setStatus("submitted");
  }

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
        bottom: "max(32px, calc(env(safe-area-inset-bottom, 0px) + 28px))",
        width: "380px",
        height: "auto",
        minHeight: "260px",
        zIndex: 31,
        background: "var(--color-bg)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-window)",
        pointerEvents: "auto",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        padding: "20px 20px 18px",
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
            className="presence-form-submit"
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
          [data-component="CorderPresenceForm"] {
            width: min(92vw, 360px) !important;
            right: 28px !important;
            bottom: max(28px, calc(env(safe-area-inset-bottom, 0px) + 28px)) !important;
          }
        }
        .presence-form-input {
          width: 100%;
          min-height: 44px;
          padding: 0 16px;
          border: 1px solid var(--color-border-strong);
          border-radius: var(--radius-button);
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
        .presence-form-input:focus-visible {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 4px rgba(33, 122, 80, 0.14);
        }
        .presence-form-submit {
          width: 100%;
          min-height: 44px;
          padding: 0 20px;
          border-radius: var(--radius-button);
          border: 1px solid var(--color-accent);
          background: var(--color-accent);
          color: var(--color-accent-contrast, #ffffff);
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: background-color 150ms cubic-bezier(0.16, 1, 0.3, 1),
            border-color 150ms cubic-bezier(0.16, 1, 0.3, 1),
            transform 150ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .presence-form-submit:hover {
          background: var(--color-accent-hover, var(--color-accent));
          border-color: var(--color-accent-hover, var(--color-accent));
        }
        .presence-form-submit:active {
          transform: translateY(1px);
        }
        .presence-form-submit:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 2px;
        }
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

  if (!motionDisabled) return null;

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
 *    the orb (or form) mounted at the layout level owns the layoutId.
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
