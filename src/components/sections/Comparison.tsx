"use client";

import { useEffect, useRef } from "react";

import { copy } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/Comparison.tsx";

/**
 * Section 5b — How Corder is different.
 *
 * Full 9-rows × 9-products differentiation matrix from the brief
 * (Corder, Granola, Otter, Grain, Fireflies, Fathom, tl;dv, Read.ai,
 * MacWhisper). Cells are Yes / No / Partial — rendered with typography
 * (✓ — Partial), not emoji, per project doctrine.
 *
 * Desktop (md+): hairline-bordered table. Corder column tinted with
 * `--color-accent-subtle`. Cells with `highlight: true` are bold accent.
 *
 * Mobile (< md): single horizontal-scroll wrapper. We chose this over the
 * earlier card-stack fallback per user direction (2026-05-10) — wide tables
 * read fine on mobile with a scroll indicator hint.
 */
export function Comparison() {
  const { comparison } = copy;
  const headers = comparison.headers; // 10 entries: ["", "Corder", ...8 competitors]

  const scrollRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLSpanElement>(null);
  const corderHeaderRef = useRef<HTMLTableCellElement>(null);

  // Align the rounded accent frame to the actual Corder column. CSS-only
  // percentages drift when table column widths get post-adjusted by the
  // browser (padding, box-sizing edge cases). Measuring directly is the
  // only fully accurate path.
  useEffect(() => {
    const update = () => {
      const cell = corderHeaderRef.current;
      const scroller = scrollRef.current;
      const frame = frameRef.current;
      if (!cell || !scroller || !frame) return;
      const cellRect = cell.getBoundingClientRect();
      const scrollerRect = scroller.getBoundingClientRect();
      frame.style.left = `${cellRect.left - scrollerRect.left + scroller.scrollLeft}px`;
      frame.style.width = `${cellRect.width}px`;
    };
    update();
    window.addEventListener("resize", update);
    const scroller = scrollRef.current;
    scroller?.addEventListener("scroll", update);
    return () => {
      window.removeEventListener("resize", update);
      scroller?.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <section
      id="compare"
      data-component="Comparison"
      data-source={DATA_SOURCE}
      data-tokens="color-text,color-text-muted,color-border,color-accent,radius-window,font-serif"
      className="relative w-full"
    >
      <div className="page-container py-14 md:py-[88px]">
        <div className="grid grid-cols-1 gap-x-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2
              className="section-heading"
              data-component="ComparisonHeading"
              data-source={DATA_SOURCE}
              data-tokens="display-md,font-serif,lh-display,ls-display,color-text"
            >
              {comparison.heading}
            </h2>
            <p
              className="section-subhead"
              data-component="ComparisonSubhead"
              data-source={DATA_SOURCE}
              data-tokens="body-lg,lh-body,color-text-muted,font-sans"
            >
              {comparison.subhead}
            </p>
          </div>
        </div>

        {/* Single matrix; scroll horizontally on narrow viewports ----------- */}
        <div className="comparison-table-wrap mt-12 md:mt-16">
          <div
            ref={scrollRef}
            className="comparison-scroll"
            role="region"
            aria-label="Comparison matrix"
          >
            {/* Accent rounded frame over the Corder column. Sits inside
              * .comparison-scroll so it tracks horizontal scroll. Its
              * left/width are set in useEffect from the real Corder
              * header cell's bounding rect. */}
            <span ref={frameRef} className="comparison-corder-frame" aria-hidden="true" />
            <table
              className="comparison-table"
              data-component="ComparisonTable"
              data-source={DATA_SOURCE}
              data-tokens="color-border,color-accent,color-accent-subtle,font-serif,font-sans"
            >
              <thead>
                <tr>
                  {headers.map((h, i) => (
                    <th
                      key={`${h}-${i}`}
                      ref={i === 1 ? corderHeaderRef : undefined}
                      scope="col"
                      className={`comparison-table__th${
                        i === 1 ? " comparison-table__th--corder" : ""
                      }${i === 0 ? " comparison-table__th--feature" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.rows.map((row) => (
                  <tr key={row.feature}>
                    <th scope="row" className="comparison-table__feature">
                      {row.feature}
                    </th>
                    {row.values.map((value, i) => {
                      const corderCol = i === 0;
                      const win = row.highlight[i];
                      return (
                        <td
                          key={`${row.feature}-${i}`}
                          className={`comparison-table__cell${
                            corderCol ? " comparison-table__cell--corder" : ""
                          }${win ? " comparison-table__cell--win" : ""}`}
                        >
                          <CellGlyph value={value} win={win} />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="comparison-scroll-hint" aria-hidden="true">
            Scroll to compare →
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * CellGlyph — pure typography cell. No emoji. We translate the raw value
 * into a glyph + screen-reader label:
 *  - "Yes" / "Yes (one-time)" → ✓ + visible "Yes (one-time)" if suffix present
 *  - "No"                     → "No" plain text, visually muted
 *  - "Partial"                → "Partial" lowercase italic muted
 */
function CellGlyph({ value, win }: { value: string; win: boolean }) {
  const trimmed = value.trim();
  if (trimmed === "No") {
    return (
      <span className="comparison-glyph comparison-glyph--no" aria-label="No">
        No
      </span>
    );
  }
  if (trimmed === "—") {
    return (
      <span className="comparison-glyph comparison-glyph--dash" aria-label="Not really">
        —
      </span>
    );
  }
  if (trimmed === "Yes") {
    return (
      <span
        className={`comparison-glyph comparison-glyph--yes${
          win ? " comparison-glyph--yes-win" : ""
        }`}
        aria-label="Yes"
      >
        <span className="comparison-glyph__check" aria-hidden="true">
          ✓
        </span>
      </span>
    );
  }
  // Unknown value — render as plain text so the matrix never silently drops content.
  return <span className="comparison-glyph">{value}</span>;
}
