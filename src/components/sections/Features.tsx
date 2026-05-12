"use client";

import { copy } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/Features.tsx";

/**
 * Section 5 — Features.
 *
 * 6-cell hairline-bordered grid, 3 cols at lg, 2 at sm, 1 at base. No icons.
 * Each cell renders a unique typographic gesture per `visualHint` from copy.json:
 *   - mini-timeline-fragment: two coloured rows with ticks
 *   - typographic-mark: <mark> over the word "phrase" inside body
 *   - split-cell-illustration: CORDER | NOTION split with `→`
 *   - kbd-cap-glyph: macOS keyboard cap rendering of ⌘W
 *   - monospace-path: real file path as the visual
 *   - version-sequence: v1.4.2 → v1.4.3 → v1.5.0 chips
 *
 * Doctrine compliant: zero icons, hairlines as the only structural chrome,
 * no shadows, doctrine easing on all hover transitions.
 */
export function Features() {
  const { features } = copy;

  return (
    <section
      id="features"
      data-component="Features"
      data-source={DATA_SOURCE}
      data-tokens="color-text,color-text-muted,color-border,color-accent,font-serif,font-mono"
      className="relative w-full"
    >
      <div className="page-container py-14 md:py-[88px]">
        <div className="grid grid-cols-1 gap-x-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2
              className="section-heading"
              data-component="FeaturesHeading"
              data-source={DATA_SOURCE}
              data-tokens="display-md,font-serif,lh-display,ls-display,color-text"
            >
              {features.heading}
            </h2>
          </div>
        </div>

        <div className="mt-12 features-grid md:mt-16">
          {features.cells.map((cell) => (
            <FeatureCell key={cell.heading} cell={cell} />
          ))}
        </div>
      </div>
    </section>
  );
}

type FeatureCellData = (typeof copy)["features"]["cells"][number];

function FeatureCell({ cell }: { cell: FeatureCellData }) {
  return (
    <article
      className="feature-cell"
      data-component="FeatureCell"
      data-source={DATA_SOURCE}
      data-tokens="font-serif,font-mono,color-text,color-text-muted,color-accent,color-border,color-surface"
    >
      <h3 className="feature-cell__heading">{cell.heading}</h3>
      <FeatureBody cell={cell} />
      <FeatureVisual cell={cell} />
    </article>
  );
}

function FeatureBody({ cell }: { cell: FeatureCellData }) {
  // Search cell uses an inline mark over the word "phrase" per COPY_AUDIT §4.
  if (cell.visualHint === "typographic-mark") {
    const body = cell.body;
    const idx = body.indexOf("phrase");
    if (idx >= 0) {
      return (
        <p className="feature-cell__body">
          {body.slice(0, idx)}
          <span className="feature-mark">phrase</span>
          {body.slice(idx + "phrase".length)}
        </p>
      );
    }
  }
  return <p className="feature-cell__body">{cell.body}</p>;
}

function FeatureVisual({ cell }: { cell: FeatureCellData }) {
  switch (cell.visualHint) {
    case "mini-timeline-fragment":
      return (
        <div
          className="feature-cell__visual"
          data-component="FeatureVisualTimeline"
          data-source={DATA_SOURCE}
          data-tokens="color-surface,color-border,color-accent"
        >
          <div className="feature-timeline">
            <div className="feature-timeline__row">
              <span
                className="feature-timeline__avatar"
                style={{ background: "#5a3aa6" }}
              >
                KH
              </span>
              <div className="feature-timeline__bar">
                {[10, 18, 28, 38, 50, 64, 78, 88].map((left) => (
                  <span
                    key={left}
                    className="feature-timeline__tick"
                    style={{ left: `${left}%`, background: "#5a3aa6" }}
                  />
                ))}
              </div>
            </div>
            <div className="feature-timeline__row">
              <span
                className="feature-timeline__avatar"
                style={{ background: "var(--color-accent)" }}
              >
                VG
              </span>
              <div className="feature-timeline__bar">
                {[24, 44, 70, 92].map((left) => (
                  <span
                    key={left}
                    className="feature-timeline__tick"
                    style={{ left: `${left}%`, background: "var(--color-accent)" }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      );

    case "monospace-path":
      return (
        <div
          className="feature-cell__visual"
          data-component="FeatureVisualPath"
          data-source={DATA_SOURCE}
          data-tokens="font-mono,color-surface,color-border"
        >
          <span className="feature-mono">
            {cell.monoPath ?? "~/Dropbox/Corder/"}
          </span>
        </div>
      );

    case "version-sequence":
      return (
        <div
          className="feature-cell__visual"
          data-component="FeatureVisualVersions"
          data-source={DATA_SOURCE}
          data-tokens="font-mono,color-surface,color-accent,color-border"
        >
          <div className="feature-version-row">
            {(cell.versionSequence ?? "v1.4.2 → v1.4.3 → v1.5.0")
              .split("→")
              .map((part, i, arr) => {
                const trimmed = part.trim();
                const isLast = i === arr.length - 1;
                return (
                  <span key={`${trimmed}-${i}`} className="inline-flex items-center gap-2">
                    <span
                      className={
                        isLast
                          ? "feature-version-row__chip feature-version-row__chip--latest"
                          : "feature-version-row__chip"
                      }
                    >
                      {trimmed}
                    </span>
                    {!isLast && (
                      <span className="feature-version-row__arrow" aria-hidden>
                        →
                      </span>
                    )}
                  </span>
                );
              })}
          </div>
        </div>
      );

    case "pro-pill":
      return (
        <div
          className="feature-cell__visual"
          data-component="FeatureVisualProPill"
          data-source={DATA_SOURCE}
          data-tokens="color-accent,radius-pill,font-sans"
        >
          <span className="feature-pro-pill">
            <span className="feature-pro-pill__sparkles" aria-hidden>
              <span>✦</span>
              <span>✧</span>
              <span>✦</span>
              <span>✧</span>
              <span>✦</span>
              <span>✧</span>
            </span>
            <span className="feature-pro-pill__text">Pro</span>
          </span>
        </div>
      );

    case "typographic-mark":
    default:
      return null;
  }
}
