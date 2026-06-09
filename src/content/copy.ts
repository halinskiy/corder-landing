/**
 * Typed wrapper around content/copy.json.
 *
 * Why this file exists:
 *   TypeScript widens JSON nested arrays (e.g. `[[1,5],[5,9],[10,15]]`) to
 *   `number[][]` when imported via `resolveJsonModule`, losing the tuple shape.
 *   When a component needs `ReadonlyArray<readonly [number, number]>` for
 *   destructuring (`forEach(([start, end]) => ...)`), a direct cast from
 *   `number[][]` is rejected by TS strict (TS2352 — "neither type sufficiently
 *   overlaps") and breaks `next build` even though `next dev` is lenient.
 *
 *   This wrapper centralises the structural-typing fix in one place. Every
 *   component imports `copy` from here, never from `copy.json` directly.
 *   Future structured fields (`privacy.cards`, `features.cells`, `faq.items`,
 *   `pricing.tiers`, ...) get their typing tightened here without touching the
 *   underlying JSON or every consumer.
 *
 *   Source-of-truth still lives in `content/copy.json` — copywriter edits there.
 *   This file only narrows the inferred TS types.
 */

import raw from "@content/copy.json";

/** Identifier for which sticky live-UI panel a How-step renders. */
type HowLiveDemo = "no-bot" | "transcript" | "clarify" | "byok";

export type Copy = typeof raw & {
  audienceLine: {
    /** Half-open word ranges `[start, end)` — see `_accentRangesNote` in copy.json. */
    accentRanges: ReadonlyArray<readonly [number, number]>;
  };
  how: typeof raw.how & {
    steps: ReadonlyArray<
      (typeof raw.how.steps)[number] & {
        liveDemo: HowLiveDemo;
      }
    >;
  };
};

export const copy = raw as Copy;
