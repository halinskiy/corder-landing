/**
 * track — single funnel for ad / analytics events.
 *
 * Why a tiny wrapper instead of calling each vendor inline:
 *   1. The build is a static export; vendor scripts may load asynchronously
 *      or be blocked by ad-blockers. Inline calls would throw "twq is not
 *      defined". This wrapper safely no-ops when a vendor is missing.
 *   2. The same call site emits to every wired vendor at once -- swapping
 *      analytics later is a single-file change.
 *
 * Wired vendors (2026-05-22, prep for paid ad test):
 *   - Twitter Pixel (twq) via NEXT_PUBLIC_TWQ_ID
 *   - Plausible      via NEXT_PUBLIC_PLAUSIBLE_DOMAIN
 *
 * Both vendor scripts are injected from `src/app/layout.tsx`. They each
 * expose a global function (`window.twq` / `window.plausible`). This
 * module just decides what to call and when.
 */

type EventProps = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    twq?: (action: string, eventNameOrId: string, props?: EventProps) => void;
    plausible?: (eventName: string, options?: { props?: EventProps }) => void;
  }
}

// Twitter pixel event IDs live in env. When unset, twq calls no-op.
// `tw-` IDs come from Twitter Ads dashboard once an event is registered.
const TWQ_EVENTS: Record<string, string | undefined> = {
  pageview: process.env.NEXT_PUBLIC_TWQ_EVENT_PAGEVIEW,
  cta_download_click: process.env.NEXT_PUBLIC_TWQ_EVENT_DOWNLOAD,
  cta_pro_click: process.env.NEXT_PUBLIC_TWQ_EVENT_PRO,
  faq_open: process.env.NEXT_PUBLIC_TWQ_EVENT_FAQ,
};

/**
 * Fire a named event. Safe to call before vendor scripts have loaded
 * (they will simply not receive this call). Safe to call from SSR (no-ops
 * outside `window`).
 *
 * @param name  short snake_case event name shared across vendors
 * @param props optional payload (vendor-specific shapes are flattened)
 */
export function trackEvent(name: string, props: EventProps = {}): void {
  if (typeof window === "undefined") return;

  // Plausible: simple `(eventName, { props })`. Plain GET to /api/event.
  try {
    if (typeof window.plausible === "function") {
      window.plausible(name, { props });
    }
  } catch {
    // Swallow vendor errors -- analytics must never break the page.
  }

  // Twitter: needs the registered tw-id. Skip if not configured.
  try {
    const twqId = TWQ_EVENTS[name];
    if (twqId && typeof window.twq === "function") {
      window.twq("event", twqId, props);
    }
  } catch {
    // No-op (see above).
  }
}

/**
 * Click-delegation autowire: any element carrying
 * `data-track-event="<name>"` fires `trackEvent(name, dataset)` on click.
 * Extra dataset fields with the `track-` prefix are forwarded as props.
 *
 * Called once from `PauseOffscreen` mount (it already runs at layout root
 * and we don't want a second client component just for this).
 */
export function autoWireTracking(): () => void {
  if (typeof document === "undefined") return () => {};

  function onClick(event: Event) {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const trigger = target.closest<HTMLElement>("[data-track-event]");
    if (!trigger) return;
    const name = trigger.dataset.trackEvent;
    if (!name) return;
    // Collect every other data-track-* attribute as props.
    const props: EventProps = {};
    for (const [key, value] of Object.entries(trigger.dataset)) {
      if (key === "trackEvent") continue;
      if (!key.startsWith("track")) continue;
      const propKey = key.replace(/^track/, "").replace(/^./, (c) => c.toLowerCase());
      props[propKey] = value;
    }
    trackEvent(name, props);
  }

  document.addEventListener("click", onClick, true);
  return () => document.removeEventListener("click", onClick, true);
}
