"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { LayoutGroup, motion } from "framer-motion";

import { copy } from "@/content/copy";
import { CaseContactModal } from "@/components/case/CaseContactModal";
import { CORDER_PRESENCE_MORPH_TRANSITION } from "@/components/presence/CorderPresence";

const DATA_SOURCE = "projects/corder-landing/src/components/case/CasePresence.tsx";

/** Id the service block's button row carries so the provider can watch it. */
export const CASE_DOCK_ROW_ID = "case-dock-row";

/**
 * CasePresence -- the /case morphing CTA, restructured EXACTLY like the
 * homepage's CorderPresence: a thin provider owns the scroll state and
 * renders the fixed-position morph targets at the PAGE ROOT, while the
 * page content is passed through as stable children. A state flip
 * re-renders only this provider and the tiny CTA components, never the
 * heavy chapter tree -- that full-page re-render happening on the same
 * frame the FLIP started was what made the morph stutter.
 */
type Ctx = {
  heroVisible: boolean;
  docked: boolean;
  setHeroVisible: (v: boolean) => void;
  openContact: () => void;
};

const CasePresenceCtx = createContext<Ctx | null>(null);

export function useCasePresence(): Ctx {
  const ctx = useContext(CasePresenceCtx);
  if (!ctx) throw new Error("useCasePresence outside CasePresenceProvider");
  return ctx;
}

export function CasePresenceProvider({ children }: { children: ReactNode }) {
  const t = copy.caseStudy;
  const [heroVisible, setHeroVisible] = useState(true);
  const [docked, setDocked] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  // Watch the service block's button row (by id, so the heavy tree does
  // not need refs from us): morph the circle into the corner card when
  // the row is genuinely on screen.
  useEffect(() => {
    const el = document.getElementById(CASE_DOCK_ROW_ID);
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setDocked(entry.isIntersecting),
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <CasePresenceCtx.Provider
      value={{
        heroVisible,
        docked,
        setHeroVisible,
        openContact: () => setContactOpen(true),
      }}
    >
      <LayoutGroup id="case-presence">
        {children}

        {/* Fixed morph targets live at the page root (never inside a
            transformed ancestor), same as the homepage orb/form. */}
        {docked ? (
          <div className="case-presence-stack" data-source={DATA_SOURCE}>
            <motion.div
              layoutId="case-presence-pill"
              transition={{ layout: CORDER_PRESENCE_MORPH_TRANSITION }}
              style={{ borderRadius: 16 }}
              className="case-presence-card"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.18, duration: 0.24 } }}
                className="case-presence-card__inner"
              >
                <h3 className="case-presence-card__heading">{t.floatCard.heading}</h3>
                <p className="case-presence-card__sub">{t.floatCard.sub}</p>
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="cta-pill cta-pill--primary inline-flex h-12 w-full items-center justify-center rounded-[var(--radius-pill)] text-[15px] font-medium"
                  data-track-event="case_float_click"
                >
                  {t.floatCard.buttonLabel}
                </button>
              </motion.div>
            </motion.div>
          </div>
        ) : !heroVisible ? (
          <motion.a
            layoutId="case-presence-pill"
            transition={{ layout: CORDER_PRESENCE_MORPH_TRANSITION }}
            style={{ borderRadius: 999 }}
            href="#pricing"
            onClick={(e) => {
              e.preventDefault();
              setContactOpen(true);
            }}
            className="case-float"
            aria-label={t.floatLabel}
            title={t.floatLabel}
            data-track-event="case_float_click"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.12, duration: 0.2 } }}
              className="case-float__icon"
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
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </motion.span>
          </motion.a>
        ) : null}

        <CaseContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      </LayoutGroup>
    </CasePresenceCtx.Provider>
  );
}

/**
 * The hero CTA: a small self-contained subscriber. Its slot reports
 * visibility up to the provider; only THIS component re-renders on the
 * flip, and the shared layoutId hands the pill to the fixed circle.
 */
export function CaseHeroCta() {
  const t = copy.caseStudy;
  const { heroVisible, docked, setHeroVisible, openContact } = useCasePresence();
  const slotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = slotRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [setHeroVisible]);

  return (
    <div ref={slotRef} className="case-hero-cta">
      {heroVisible && !docked && (
        <motion.button
          type="button"
          layoutId="case-presence-pill"
          transition={{ layout: CORDER_PRESENCE_MORPH_TRANSITION }}
          style={{ borderRadius: 999 }}
          onClick={openContact}
          className="cta-pill cta-pill--primary inline-flex h-14 items-center justify-center gap-2 rounded-[var(--radius-pill)] px-9 text-[17px] font-medium md:min-w-[260px]"
          data-track-event="case_hero_cta_click"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.12, duration: 0.2 } }}
            className="whitespace-nowrap"
          >
            {t.cta.buttonLabel}
          </motion.span>
        </motion.button>
      )}
    </div>
  );
}
