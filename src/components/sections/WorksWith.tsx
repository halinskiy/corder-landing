import { copy } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/WorksWith.tsx";

// next.config.ts sets basePath="/corder-landing" only in production. Static
// SVGs under /public must carry that prefix when referenced in markup so they
// resolve correctly on GitHub Pages. In dev (basePath="") the prefix is empty.
const ASSET_PREFIX = process.env.NODE_ENV === "production" ? "/corder-landing" : "";

const LOGO_FILE: Record<string, string> = {
  Zoom: "zoom.svg",
  "Google Meet": "google-meet.svg",
  "Microsoft Teams": "microsoft-teams.svg",
  Discord: "discord.svg",
  Slack: "slack.svg",
  Notion: "notion.svg",
  Obsidian: "obsidian.svg",
  "Apple Notes": "apple-notes.svg",
  Bear: "bear.svg",
  Linear: "linear.svg",
  Dropbox: "dropbox.svg",
  "iCloud Drive": "icloud.svg",
  "Google Drive": "google-drive.svg",
};

/**
 * WorksWith — three marquee rows of brand pills, no cluster labels.
 *
 * Rows 1 and 3 scroll left to right; row 2 scrolls in the opposite
 * direction so the strip reads as motion in both directions, similar
 * to the Granola / Cursor "wall of integrations" pattern. Hover on a
 * row pauses its track so the user can read what they hovered.
 */
export function WorksWith() {
  const { worksWith } = copy;

  return (
    <section
      id="works-with"
      data-component="WorksWith"
      data-source={DATA_SOURCE}
      data-tokens="color-text,color-text-muted,color-border,color-accent,font-serif"
      className="relative w-full"
    >
      <div className="page-container py-24 md:py-32">
        <div className="grid grid-cols-1 gap-x-10 lg:grid-cols-12">
          <div className="lg:col-span-9">
            {worksWith.eyebrow && (
              <p
                className="eyebrow-label"
                data-component="WorksWithEyebrow"
                data-source={DATA_SOURCE}
                data-tokens="eyebrow,color-text-muted,ls-eyebrow"
              >
                {worksWith.eyebrow}
              </p>
            )}
            <h2
              className="section-heading"
              data-component="WorksWithHeading"
              data-source={DATA_SOURCE}
              data-tokens="display-md,font-serif,lh-display,ls-display,color-text"
            >
              {worksWith.heading}
            </h2>
            <p
              className="section-subhead"
              data-component="WorksWithSubhead"
              data-source={DATA_SOURCE}
              data-tokens="body-lg,lh-body,color-text-muted,font-sans"
            >
              {worksWith.subhead}
            </p>
          </div>
        </div>

        <div className="works-with-rows mt-12 md:mt-16">
          {worksWith.clusters.map((cluster, idx) => (
            <Row key={cluster.label} apps={cluster.apps} reverse={idx === 1} />
          ))}
        </div>

        {worksWith.footnote && (
          <p className="works-with-footnote">{worksWith.footnote}</p>
        )}
      </div>
    </section>
  );
}

const TRACK_COPIES = 8;

function Row({ apps, reverse }: { apps: readonly string[]; reverse: boolean }) {
  // Eight copies of the apps array, translated by -12.5% (== one copy width)
  // per cycle. The high duplication count guarantees the visible viewport
  // is always shorter than (N-1) copies worth of track, even for the
  // 3-tile Store row on wide screens — so no empty gap appears on the
  // right edge before the snap back.
  const tiles = Array.from({ length: TRACK_COPIES }).flatMap(() => apps);
  return (
    <div className="works-with-marquee">
      <div
        className={`works-with-track${reverse ? " works-with-track--reverse" : ""}`}
      >
        {tiles.map((app, i) => (
          <AppTile key={`${app}-${i}`} name={app} />
        ))}
      </div>
    </div>
  );
}

function AppTile({ name }: { name: string }) {
  const file = LOGO_FILE[name];
  return (
    <div className="works-with-tile">
      {file && (
        <img
          src={`${ASSET_PREFIX}/logos/${file}`}
          alt=""
          width={26}
          height={26}
          className="works-with-tile__logo"
          loading="lazy"
        />
      )}
      <span className="works-with-tile__name">{name}</span>
    </div>
  );
}
