"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import { copy } from "@/content/copy";
import { SmoothAnchors } from "@/components/nav/SmoothAnchors";

const DATA_SOURCE = "projects/corder-landing/src/components/case/CaseView.tsx";

/* Spring physics + crossfade timing are copied 1:1 from HowItWorks.tsx --
 * the case page must move exactly like the homepage, not "similarly". */
const SPRING = { stiffness: 105, damping: 24, mass: 0.7 } as const;
const CROSSFADE = { duration: 0.32, ease: [0.16, 1, 0.3, 1] as const };

type Pair = { before: string; after: string };
type Chapter = 0 | 1 | 2 | 3;

/* 4 chapters → 3 transition zones, same 0.02-wide sharp ramps as the
 * homepage's 0.34-0.36 / 0.64-0.66, spaced for four rows. */
const ZONES: Array<[number, number]> = [
  [0.24, 0.26],
  [0.49, 0.51],
  [0.74, 0.76],
];

/**
 * CaseView -- the /case study page. Text block, then a full-width
 * app-window slot, four times. ONE shared window (same spring snap, same
 * lift pulse, same content crossfade as the homepage's HowItWorks
 * section) glides down the page from slot to slot; each slot's ghost is
 * the same dashed SVG frame. Inside the window: a before/after wipe
 * between two REAL builds of the app (DOM snapshots in iframes), the
 * divider line following the cursor.
 */
export function CaseView({ pairs }: { pairs: Pair[] }) {
  const t = copy.caseStudy;
  const reduced = useReducedMotion() ?? false;
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const isStatic = reduced || narrow;

  return (
    <div data-component="CaseView" data-source={DATA_SOURCE}>
      <SmoothAnchors />
      <header className="page-container case-head">
        <a href="/" className="case-head__brand" aria-label="Corder home">
          Corder
        </a>
        <p className="eyebrow-label">{t.eyebrow}</p>
        <h1 className="section-heading case-head__heading">{t.heading}</h1>
        <p className="section-subhead case-head__subhead">{t.subhead}</p>
      </header>

      {isStatic ? (
        <StaticRows pairs={pairs} />
      ) : (
        <AnimatedTrack pairs={pairs} />
      )}

      <section id="pricing" className="case-cta">
        <div className="page-container">
          <p className="case-cta__result">{t.resultLine}</p>
          <h2 className="case-cta__heading">{t.cta.heading}</h2>
          <p className="case-cta__subhead">{t.cta.subhead}</p>
          <div className="case-cta__actions">
            <a
              href={t.cta.buttonHref}
              className="cta-pill cta-pill--primary inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-pill)] px-7 text-[15px] font-medium"
              data-track-event="case_cta_click"
            >
              {t.cta.buttonLabel}
            </a>
            <a
              href={t.cta.secondaryHref}
              className="cta-pill cta-pill--ghost inline-flex h-12 items-center justify-center rounded-[var(--radius-pill)] px-7 text-[15px] font-medium"
            >
              {t.cta.secondaryLabel}
            </a>
          </div>
        </div>
      </section>

      <FloatingCta label={t.floatLabel} />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * Animated track: the homepage HowItWorks mechanic, verticalised.
 * ──────────────────────────────────────────────────────────────────── */

function AnimatedTrack({ pairs }: { pairs: Pair[] }) {
  const t = copy.caseStudy;
  const trackRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<Array<HTMLDivElement | null>>([]);
  const slotTops = useRef<number[]>([0, 0, 0, 0]);
  const [activeChapter, setActiveChapter] = useState<Chapter>(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Slot Y positions are measured (rows have real content heights), then
  // fed through the SAME step-function-with-sharp-ramps + spring the
  // homepage uses. Physics identical; only the coordinates are measured
  // instead of hardcoded vh.
  const targetY = useMotionValue(0);
  const springY = useSpring(targetY, SPRING);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    // offsetTop alone is relative to the closest positioned ancestor (the
    // .case-row), not the track -- walk the offsetParent chain up to the
    // track so slot positions are in track coordinates.
    slotTops.current = slotRefs.current.map((el) => {
      let y = 0;
      let node: HTMLElement | null = el;
      while (node && node !== track) {
        y += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      return y;
    });
    // Before the first scroll event the motion values still sit at 0,
    // which parks the window on top of the first chapter's TEXT. Snap
    // both to the first slot immediately (jump, no spring animation).
    if (targetY.get() === 0) {
      const y0 = slotTops.current[0] ?? 0;
      targetY.jump(y0);
      springY.jump(y0);
    }
  }, [targetY, springY]);
  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const ys = slotTops.current;
    let y = ys[0] ?? 0;
    for (let i = 0; i < ZONES.length; i++) {
      const [a, b] = ZONES[i];
      const from = ys[i] ?? 0;
      const to = ys[i + 1] ?? 0;
      if (p < a) break;
      y = p >= b ? to : from + ((p - a) / (b - a)) * (to - from);
    }
    targetY.set(y);
    const next: Chapter = p < 0.25 ? 0 : p < 0.5 ? 1 : p < 0.75 ? 2 : 3;
    setActiveChapter((cur) => (cur === next ? cur : next));
  });

  // Same lift pulse as the homepage: scale peaks mid-transition.
  const liftPulse = useTransform(
    scrollYProgress,
    [0.2, 0.25, 0.3, 0.45, 0.5, 0.55, 0.7, 0.75, 0.8],
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
  );
  const scale = useTransform(liftPulse, [0, 1], [1, 1.035]);

  return (
    <div ref={trackRef} className="case-track page-container">
      <motion.div className="case-window-wrap" style={{ y: springY }}>
        <motion.div className="hiw-window-inner case-window-inner" style={{ scale }}>
          <div className="case-window">
            <div className="case-titlebar" aria-hidden="true">
              <span className="case-traffic case-traffic--close" />
              <span className="case-traffic case-traffic--min" />
              <span className="case-traffic case-traffic--max" />
            </div>
            {/* Sync-mode AnimatePresence, same as the homepage window:
                outgoing and incoming content overlap during the fade so
                the window never flashes empty between chapters. */}
            <AnimatePresence initial={false}>
              <motion.div
                key={activeChapter}
                className="case-window-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={CROSSFADE}
              >
                <BeforeAfter pair={pairs[activeChapter]} />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {t.chapters.map((ch, i) => (
        <article key={ch.heading} className="case-row">
          <div className="case-text">
            <p className="case-text__index">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="case-text__heading">{ch.heading}</h3>
            <p className="case-text__body">{ch.body}</p>
          </div>
          <div
            ref={(node) => {
              slotRefs.current[i] = node;
            }}
            className="case-slot"
          >
            <Ghost />
          </div>
        </article>
      ))}
    </div>
  );
}

/* Dashed destination ghost -- same SVG treatment as the homepage rows,
 * at the app window's 1180x760 aspect (+titlebar). */
function Ghost() {
  return (
    <div className="case-ghost" aria-hidden="true">
      <svg
        className="case-ghost__frame"
        viewBox="0 0 1180 788"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <rect
          x="6"
          y="6"
          width="1168"
          height="776"
          rx="14"
          fill="none"
          stroke="rgba(10, 10, 10, 0.07)"
          strokeWidth="3"
          strokeDasharray="18 12"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * Static fallback: reduced motion / narrow viewports. Every chapter
 * renders its own before/after block in flow.
 * ──────────────────────────────────────────────────────────────────── */

function StaticRows({ pairs }: { pairs: Pair[] }) {
  const t = copy.caseStudy;
  return (
    <div className="page-container case-static">
      {t.chapters.map((ch, i) => (
        <article key={ch.heading} className="case-static__row">
          <div className="case-text">
            <p className="case-text__index">{String(i + 1).padStart(2, "0")}</p>
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
const APP_H = 760;

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

/* ────────────────────────────────────────────────────────────────────
 * Floating CTA -- a right-side pill that appears once the reader is
 * into the chapters and anchors to the pricing block. Same pill classes
 * as every primary button on the homepage.
 * ──────────────────────────────────────────────────────────────────── */

function FloatingCta({ label }: { label: string }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          className="case-float"
          initial={{ opacity: 0, y: 14, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.94 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          <a
            href="#pricing"
            className="cta-pill cta-pill--primary inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-pill)] px-6 text-[15px] font-medium"
            data-track-event="case_float_click"
          >
            {label}
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
