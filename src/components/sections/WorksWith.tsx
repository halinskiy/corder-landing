"use client";

import type { IconType } from "react-icons";
import {
  SiApple,
  SiDiscord,
  SiDropbox,
  SiGoogledrive,
  SiGooglemeet,
  SiIcloud,
  SiLinear,
  SiNotion,
  SiObsidian,
  SiSlack,
  SiZoom,
} from "react-icons/si";

import { copy } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/WorksWith.tsx";

const LOGO_BY_NAME: Record<string, IconType> = {
  Zoom: SiZoom,
  "Google Meet": SiGooglemeet,
  Discord: SiDiscord,
  "Slack huddle": SiSlack,
  Notion: SiNotion,
  Obsidian: SiObsidian,
  "Apple Notes": SiApple,
  Linear: SiLinear,
  Dropbox: SiDropbox,
  "iCloud Drive": SiIcloud,
  "Google Drive": SiGoogledrive,
};

/**
 * WorksWith — section 4.5
 *
 * Visual treatment: the whole block sits inside a Corder-app "window"
 * (titlebar + dropdown shell, reusing the `.hl-*` token base). Inside
 * are three cluster rows (Call / Note / Store) with horizontally
 * marquee'd logo tiles. Slow, readable loop, hover-to-pause.
 */
export function WorksWith() {
  const { worksWith } = copy;

  return (
    <section
      id="works-with"
      data-component="WorksWith"
      data-source={DATA_SOURCE}
      data-tokens="color-text,color-text-muted,color-border,color-accent,radius-window,font-serif"
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

        <div className="works-with-shell mt-12 md:mt-16">
          <div
            className="hero-library-demo works-with-window"
            data-component="WorksWithWindow"
            data-source={DATA_SOURCE}
            data-tokens="hl-bg,hl-border,radius-window"
            role="img"
            aria-label="Corder fits into a familiar Mac stack"
          >
            <div className="hl-titlebar" aria-hidden="true">
              <span className="hl-traffic close" />
              <span className="hl-traffic minimize" />
              <span className="hl-traffic maximize" />
              <span className="works-with-titlebar__name">Corder</span>
            </div>

            <div className="works-with-body">
              {worksWith.clusters.map((cluster) => (
                <ClusterRow key={cluster.label} cluster={cluster} />
              ))}

              <div className="works-with-catchall" aria-hidden="true">
                <span className="works-with-catchall__plus">+</span>
                <span className="works-with-catchall__label">
                  {worksWith.catchallTile}
                </span>
              </div>
            </div>
          </div>

          {worksWith.footnote && (
            <p className="works-with-footnote">{worksWith.footnote}</p>
          )}
        </div>
      </div>
    </section>
  );
}

function ClusterRow({
  cluster,
}: {
  cluster: (typeof copy.worksWith.clusters)[number];
}) {
  const apps = cluster.apps;
  return (
    <div className="works-with-cluster" data-cluster={cluster.label.toLowerCase()}>
      <div className="works-with-cluster__head">
        <span className="works-with-cluster__label">{cluster.label}</span>
        {cluster.note && (
          <span className="works-with-cluster__note">{cluster.note}</span>
        )}
      </div>
      <div className="works-with-marquee" aria-hidden="true">
        <div className="works-with-track">
          {[...apps, ...apps, ...apps].map((app, i) => (
            <AppTile key={`${app}-${i}`} name={app} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AppTile({ name }: { name: string }) {
  const Icon = LOGO_BY_NAME[name];
  return (
    <div className="works-with-tile">
      <span className="works-with-tile__logo">
        {Icon ? <Icon /> : <CustomLogo name={name} />}
      </span>
      <span className="works-with-tile__name">{name}</span>
    </div>
  );
}

function CustomLogo({ name }: { name: string }) {
  if (name === "Microsoft Teams") return <TeamsMark />;
  if (name === "Bear") return <BearMark />;
  return <GenericMark name={name} />;
}

function TeamsMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.5 8.5h-4V6h4a1.5 1.5 0 0 0 0-3 1.5 1.5 0 0 0-1.5 1.5h-3A4.5 4.5 0 0 1 20.5 0a4.5 4.5 0 0 1 0 9 4.4 4.4 0 0 1-1.5-.3v.3a1.5 1.5 0 0 0 1.5 1.5zm-9 11A1.5 1.5 0 0 1 10 18V8H4v10a1.5 1.5 0 0 0 1.5 1.5h6zM14 7H1.5A1.5 1.5 0 0 0 0 8.5v10A1.5 1.5 0 0 0 1.5 20H14a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 14 7zm-2.5 4.5H9V17H6.5v-5.5H4V10h7.5z"
      />
    </svg>
  );
}

function BearMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M5 3a3 3 0 0 1 3 3 3 3 0 0 1-.3 1.3A8 8 0 0 1 12 6a8 8 0 0 1 4.3 1.3A3 3 0 0 1 16 6a3 3 0 1 1 5.7 1.3A8 8 0 0 1 22 11a8 8 0 0 1-3 6.2V19a2 2 0 0 1-2 2h-1.5a2 2 0 0 1-2-2v-.5h-3V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-1.8A8 8 0 0 1 2 11a8 8 0 0 1 .3-3.7A3 3 0 0 1 2 6a3 3 0 0 1 3-3zm4 9.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
      />
    </svg>
  );
}

function GenericMark({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" fill="currentColor" opacity="0.15" />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fontFamily="var(--font-sans)"
        fontWeight={600}
        fontSize="11"
        fill="currentColor"
      >
        {name.slice(0, 2).toUpperCase()}
      </text>
    </svg>
  );
}
