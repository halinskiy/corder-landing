"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { LayoutGroup, motion } from "framer-motion";

import { copy } from "@/content/copy";
import { CaseContactModal } from "@/components/case/CaseContactModal";
import { CORDER_PRESENCE_MORPH_TRANSITION } from "@/components/presence/CorderPresence";
import { Footer } from "@/components/sections/Footer";
import { Nav } from "@/components/sections/Nav";
import { SmoothAnchors } from "@/components/nav/SmoothAnchors";

const DATA_SOURCE = "projects/corder-landing/src/components/case/CaseView.tsx";

type Pair = { before: string; after: string };

/**
 * CaseView -- the /case study page. Text block, then a full app-window
 * before/after wipe, four times: each window holds two REAL builds of
 * the app (inert DOM snapshots in iframes) and the divider line follows
 * the cursor. The window is sized to fit INSIDE the viewport height so
 * every pair reads whole on laptop screens. The travelling-window morph
 * was tried and pulled (2026-08-05, felt jumpy while scroll-reading);
 * the rows are static until a calmer treatment is designed.
 */
export function CaseView({ pairs }: { pairs: Pair[] }) {
  const t = copy.caseStudy;

  // Floating CTA: visible from the top, fades out once the service
  // block's button row is on screen (a full layoutId morph was tried and
  // pulled -- the label swap mid-flight read as a glitch).
  // Observe the BUTTON ROW itself (not the whole section) with a small
  // bottom inset, so the pill docks exactly when its destination slot is
  // genuinely on screen -- a short believable hop instead of a long
  // cross-screen flight the moment the section's top edge appears.
  const dockRowRef = useRef<HTMLDivElement | null>(null);
  const [docked, setDocked] = useState(false);
  // Contact modal (the Corder-update-modal shell with the lead form).
  const [contactOpen, setContactOpen] = useState(false);
  useEffect(() => {
    const el = dockRowRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setDocked(entry.isIntersecting),
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div data-component="CaseView" data-source={DATA_SOURCE}>
      <SmoothAnchors />
      <Nav />
      <header className="page-container case-head">
        <div className="case-fit">
          <h1 className="section-heading case-head__heading">{t.heading}</h1>
          <p className="section-subhead case-head__subhead">{t.subhead}</p>
        </div>
      </header>

      <hr className="section-divider" />

      <div className="page-container case-static">
        {t.chapters.map((ch, i) => (
          <article key={ch.heading} className="case-static__row case-fit">
            <div className="case-text">
              <h3 className="case-text__heading">{ch.heading}</h3>
              <p className="case-text__body">{ch.body}</p>
            </div>
            <div className="case-window-hold">
              <div className="case-window">
                <div className="case-titlebar" aria-hidden="true">
                  <span className="case-traffic case-traffic--close" />
                  <span className="case-traffic case-traffic--min" />
                  <span className="case-traffic case-traffic--max" />
                </div>
                <div className="case-window-content">
                  <BeforeAfter pair={pairs[i]} />
                </div>
              </div>
              {/* Era chips OUTSIDE the window (its overflow:hidden would kill
                  sticky): each rides the viewport bottom while the window
                  scrolls past, then parks at the window's bottom corner. */}
              <div className="case-badges" aria-hidden="true">
                <div className="case-badges__col">
                  <span className="case-ba__badge">{ch.beforeLabel}</span>
                </div>
                <div className="case-badges__col">
                  <span className="case-ba__badge">Today</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="case-result">
        <div className="page-container">
          <div className="case-fit">
            <p className="case-cta__result">{t.resultLine}</p>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      <section id="pricing" className="case-cta">
        <div className="page-container">
          <div className="case-fit">
          <h2 className="case-cta__heading">{t.cta.heading}</h2>
          <p className="case-cta__subhead">{t.cta.subhead}</p>
          <div className="case-cta__actions" ref={dockRowRef}>
            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className="cta-pill cta-pill--primary inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-pill)] px-7 text-[15px] font-medium"
              data-track-event="case_cta_click"
            >
              {t.cta.buttonLabel}
            </button>
            <a
              href={t.cta.secondaryHref}
              className="cta-pill cta-pill--ghost inline-flex h-12 items-center justify-center rounded-[var(--radius-pill)] px-7 text-[15px] font-medium"
            >
              {t.cta.secondaryLabel}
            </a>
          </div>
          </div>
        </div>
      </section>

      {/* One shared element, two states (the homepage CorderPresence
          pattern, same morph transition): a floating mail circle while
          the reader is in the chapters, MORPHING into a compact service
          card (like the homepage's "Ready to record?") once the service
          block is on screen. Both open the contact modal. */}
      <LayoutGroup id="case-presence">
        {docked ? (
          <div className="case-presence-stack">
            {/* Product Hunt badge above the card, same treatment as the
                homepage's presence stack (fade-in a beat after the morph). */}
            <motion.a
              href="https://www.producthunt.com/products/corder?utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-corder"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Corder on Product Hunt"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="case-ph-banner"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1183830&theme=light"
                alt="Corder on Product Hunt"
                width={250}
                height={54}
                style={{ display: "block", maxWidth: "100%", height: "auto" }}
              />
            </motion.a>
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
        ) : (
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
        )}
      </LayoutGroup>

      <hr className="section-divider" />

      <Footer />

      <CaseContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * BeforeAfter -- two REAL app builds (inert DOM snapshots in iframes)
 * under a cursor-following wipe. Left of the line: the first shipped
 * build. Right: today's. The divider chases the pointer with the same
 * rAF lerp factor the homepage tilt uses (0.18); on pointer leave it
 * glides back to centre.
 * ──────────────────────────────────────────────────────────────────── */

const APP_W = 1180;

function BeforeAfter({ pair }: { pair: Pair }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  // Scale the fixed 1180x760 app viewport to the host width.
  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const apply = () => {
      host.style.setProperty("--ba-scale", String(host.clientWidth / APP_W));
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  // Cursor-chasing divider. Direct style mutation (no setState) -- the
  // same pattern and lerp factor as the homepage window tilt.
  useEffect(() => {
    const host = hostRef.current;
    const top = topRef.current;
    const line = lineRef.current;
    if (!host || !top || !line) return;

    let frame = 0;
    let target = 0.5;
    let cur = 0.5;

    const paint = () => {
      const x = cur * 100;
      top.style.clipPath = `inset(0 0 0 ${x}%)`;
      line.style.left = `${x}%`;
    };
    paint();

    const tick = () => {
      frame = 0;
      cur += (target - cur) * 0.18;
      paint();
      if (Math.abs(target - cur) > 0.0008) schedule();
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      target = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      schedule();
    };
    // The divider STAYS where the user left it on pointer leave (a
    // spring back to centre threw away the comparison they had set up).
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerdown", onMove);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={hostRef} className="case-ba">
      <div className="case-ba__layer" aria-hidden="true">
        <iframe
          className="case-ba__frame"
          srcDoc={pair.before}
          tabIndex={-1}
          loading="lazy"
          title="First shipped build"
        />
      </div>
      <div ref={topRef} className="case-ba__layer case-ba__layer--top" aria-hidden="true">
        <iframe
          className="case-ba__frame"
          srcDoc={pair.after}
          tabIndex={-1}
          loading="lazy"
          title="Current build"
        />
      </div>
      <div ref={lineRef} className="case-ba__line" aria-hidden="true">
        <span className="case-ba__grip" />
      </div>
    </div>
  );
}

