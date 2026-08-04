"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { LayoutGroup, motion } from "framer-motion";

import { copy } from "@/content/copy";
import { CORDER_PRESENCE_MORPH_TRANSITION } from "@/components/presence/CorderPresence";
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

  // CTA morph: ONE pill exists the whole time. While the service block is
  // off-screen it floats bottom-right ("Want this finish?"); when the block
  // scrolls into view the floating pill unmounts and the block's primary
  // button mounts under the SAME framer layoutId, so the pill visibly
  // flies into place and becomes "Get this for your product". Same shared
  // layoutId + morph transition pattern (and the exact transition value)
  // as the homepage's CorderPresence.
  const ctaRef = useRef<HTMLElement | null>(null);
  const [docked, setDocked] = useState(false);
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setDocked(entry.isIntersecting),
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <LayoutGroup id="case">
    <div data-component="CaseView" data-source={DATA_SOURCE}>
      <SmoothAnchors />
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

      <section
        id="pricing"
        className="case-cta"
        ref={(node) => {
          ctaRef.current = node;
        }}
      >
        <div className="page-container">
          <div className="case-fit">
          <h2 className="case-cta__heading">{t.cta.heading}</h2>
          <p className="case-cta__subhead">{t.cta.subhead}</p>
          <div className="case-cta__actions">
            {/* Morph dock: an invisible ghost keeps the slot's size so the
                layout never jumps; when the section is in view the REAL
                button mounts on top under the shared layoutId and the
                floating pill flies in to become it. */}
            <span className="case-cta-dock">
              <span
                className="cta-pill cta-pill--primary inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-pill)] px-7 text-[15px] font-medium case-cta-dock__ghost"
                aria-hidden
              >
                {t.cta.buttonLabel}
              </span>
              {docked && (
                <motion.a
                  layoutId="case-cta-pill"
                  transition={{ layout: CORDER_PRESENCE_MORPH_TRANSITION }}
                  href={t.cta.buttonHref}
                  className="cta-pill cta-pill--primary inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-pill)] px-7 text-[15px] font-medium case-cta-dock__live"
                  data-track-event="case_cta_click"
                >
                  {t.cta.buttonLabel}
                </motion.a>
              )}
            </span>
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

      {!docked && (
        <motion.a
          layoutId="case-cta-pill"
          transition={{ layout: CORDER_PRESENCE_MORPH_TRANSITION }}
          href="#pricing"
          className="case-float cta-pill cta-pill--primary inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-pill)] px-6 text-[15px] font-medium"
          data-track-event="case_float_click"
        >
          {t.floatLabel}
        </motion.a>
      )}
    </div>
    </LayoutGroup>
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
    const onLeave = () => {
      target = 0.5;
      schedule();
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerdown", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onMove);
      host.removeEventListener("pointerleave", onLeave);
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
      <span className="case-ba__badge case-ba__badge--left">May 2026</span>
      <span className="case-ba__badge case-ba__badge--right">Today</span>
    </div>
  );
}

