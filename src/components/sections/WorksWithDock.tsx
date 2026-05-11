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

const DATA_SOURCE = "projects/corder-landing/src/components/sections/WorksWithDock.tsx";

type Logo = { icon: IconType | null; color: string; label: string };

const LOGOS: Record<string, Logo> = {
  Zoom: { icon: SiZoom, color: "#0B5CFF", label: "Zoom" },
  "Google Meet": { icon: SiGooglemeet, color: "#00897B", label: "Google Meet" },
  "Microsoft Teams": { icon: null, color: "#4F52B2", label: "Microsoft Teams" },
  Discord: { icon: SiDiscord, color: "#5865F2", label: "Discord" },
  "Slack huddle": { icon: SiSlack, color: "#611F69", label: "Slack" },
  Notion: { icon: SiNotion, color: "#FFFFFF", label: "Notion" },
  Obsidian: { icon: SiObsidian, color: "#5A2EBE", label: "Obsidian" },
  "Apple Notes": { icon: SiApple, color: "#FBC02D", label: "Apple Notes" },
  Bear: { icon: null, color: "#D8442C", label: "Bear" },
  Linear: { icon: SiLinear, color: "#5E6AD2", label: "Linear" },
  Dropbox: { icon: SiDropbox, color: "#0061FF", label: "Dropbox" },
  "iCloud Drive": { icon: SiIcloud, color: "#3693F3", label: "iCloud" },
  "Google Drive": { icon: SiGoogledrive, color: "#1FA463", label: "Google Drive" },
};

/**
 * WorksWithDock — alternative compatibility surface.
 *
 * Renders the same `worksWith` cluster apps as a macOS-style Dock: a
 * translucent dark bar of squircle app icons. Corder sits right-of-centre,
 * statically magnified (the "hover" pose), with a tooltip floating above
 * it. Reads as "Corder lives next to the apps you already keep in your
 * Dock — and we never join the meeting."
 */
export function WorksWithDock() {
  const { worksWith } = copy;

  // Flatten clusters into one ordered list. Insert Corder right-of-centre.
  const apps = worksWith.clusters.flatMap((c) => c.apps);
  const corderIndex = Math.ceil(apps.length / 2) + 1;
  const dockItems: Array<{ kind: "app"; name: string } | { kind: "corder" }> = [];
  apps.forEach((name, i) => {
    if (i === corderIndex) dockItems.push({ kind: "corder" });
    dockItems.push({ kind: "app", name });
  });
  if (dockItems.findIndex((it) => it.kind === "corder") === -1) {
    dockItems.push({ kind: "corder" });
  }

  return (
    <section
      id="works-with-dock"
      data-component="WorksWithDock"
      data-source={DATA_SOURCE}
      data-tokens="color-text,color-text-muted,color-border,color-accent,font-serif"
      className="relative w-full"
    >
      <div className="page-container py-24 md:py-32">
        <div className="grid grid-cols-1 gap-x-10 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <p className="eyebrow-label">{worksWith.eyebrow}</p>
            <h2 className="section-heading">{worksWith.heading}</h2>
            <p className="section-subhead">{worksWith.subhead}</p>
          </div>
        </div>

        <div className="dock-stage mt-12 md:mt-16" aria-hidden="true">
          <div className="dock">
            <ul className="dock__list">
              {dockItems.map((item, i) => {
                if (item.kind === "corder") {
                  return <CorderDockIcon key="corder" />;
                }
                return <DockIcon key={`${item.name}-${i}`} name={item.name} />;
              })}
              <li className="dock__divider" aria-hidden="true" />
              <DockSystemIcon kind="downloads" />
              <DockSystemIcon kind="trash" />
            </ul>
          </div>
        </div>

        {worksWith.footnote && (
          <p className="works-with-footnote">{worksWith.footnote}</p>
        )}
      </div>
    </section>
  );
}

function DockIcon({ name }: { name: string }) {
  const logo = LOGOS[name];
  const Icon = logo?.icon;
  const isLight = logo?.color === "#FFFFFF";
  return (
    <li className="dock__item">
      <span
        className={`dock__icon${isLight ? " dock__icon--light" : ""}`}
        style={{ background: logo?.color ?? "#888" }}
        aria-label={logo?.label ?? name}
      >
        {Icon ? <Icon /> : <CustomMark name={name} />}
      </span>
      <span className="dock__dot" aria-hidden="true" />
    </li>
  );
}

function CorderDockIcon() {
  return (
    <li className="dock__item dock__item--corder">
      <span className="dock__tooltip" aria-hidden="true">
        Corder
        <span className="dock__tooltip-arrow" />
      </span>
      <span className="dock__icon dock__icon--corder" aria-label="Corder">
        <CorderMark />
      </span>
      <span className="dock__dot" aria-hidden="true" />
    </li>
  );
}

function DockSystemIcon({ kind }: { kind: "downloads" | "trash" }) {
  if (kind === "downloads") {
    return (
      <li className="dock__item dock__item--system">
        <span className="dock__icon dock__icon--folder" aria-label="Downloads">
          <FolderDownloadsMark />
        </span>
      </li>
    );
  }
  return (
    <li className="dock__item dock__item--system">
      <span className="dock__icon dock__icon--trash" aria-label="Trash">
        <TrashMark />
      </span>
    </li>
  );
}

/* ---- Marks ---------------------------------------------------------- */

function CorderMark() {
  // Same wordmark shape as Nav: white squircle with two black vertical bars.
  return (
    <svg viewBox="0 0 1024 1024" aria-hidden="true">
      <rect x="0" y="0" width="1024" height="1024" rx="232" fill="#ffffff" />
      <rect x="312" y="212" width="160" height="600" rx="44" fill="#0a0a0a" />
      <rect x="552" y="212" width="160" height="600" rx="44" fill="#0a0a0a" />
    </svg>
  );
}

function CustomMark({ name }: { name: string }) {
  if (name === "Microsoft Teams") return <TeamsMark />;
  if (name === "Bear") return <BearMark />;
  return null;
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

function FolderDownloadsMark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M6 18a4 4 0 0 1 4-4h18l5 6h21a4 4 0 0 1 4 4v26a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V18z"
        fill="#5AC8FA"
      />
      <path
        d="M32 30v12m-5-5l5 5 5-5"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function TrashMark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="14" y="22" width="36" height="34" rx="3" fill="#E5E5EA" />
      <rect x="12" y="16" width="40" height="8" rx="2" fill="#A1A1A6" />
      <path d="M26 30v18M32 30v18M38 30v18" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
