import { copy } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/AudienceLine.tsx";

/**
 * Accent ranges live in `content/copy.json` under `audienceLine.accentRanges`.
 * Word indices are 0-based, half-open [start, end). Copy is the source of truth
 * for both the words and which words are accented. This component just renders.
 *
 * The tuple shape `ReadonlyArray<readonly [number, number]>` is enforced by
 * `src/content/copy.ts` so we can destructure `[start, end]` without an
 * unsafe assertion here.
 *
 * For the current text:
 *   "For founders taking investor calls, consultants on client kickoffs,
 *    and anyone who thinks out loud and needs it written down."
 *
 * The three audience pillars resolve to:
 *   [1, 5)  → "founders taking investor calls,"
 *   [5, 9)  → "consultants on client kickoffs,"
 *   [10, 15) → "anyone who thinks out loud"
 */

export function AudienceLine() {
  const { audienceLine } = copy;
  const words = audienceLine.text.split(/\s+/);
  const { accentRanges } = audienceLine;

  const isAccent = (i: number): boolean =>
    accentRanges.some(([start, end]) => i >= start && i < end);

  return (
    <section
      id="audience"
      data-component="AudienceLine"
      data-source={DATA_SOURCE}
      data-tokens="font-serif,color-accent,color-text,ease-out"
      className="relative w-full"
      style={{ contain: "layout paint" }}
    >
      <div className="page-container py-24 md:py-40">
        <p
          className="mx-auto max-w-[1080px] text-center font-serif font-medium [text-wrap:balance]"
          style={{
            fontSize: "clamp(28px, 4vw, 56px)",
            lineHeight: 1.18,
            letterSpacing: "-0.014em",
          }}
        >
          {words.map((word, i) => {
            const accent = isAccent(i);
            return (
              <span
                key={`${word}-${i}`}
                className={
                  accent
                    ? "audience-line__word audience-line__word--accent"
                    : "audience-line__word"
                }
                style={{ animationDelay: `${i * 12}ms` }}
              >
                {word}
                {i < words.length - 1 ? " " : ""}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
