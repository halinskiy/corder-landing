"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { trackEvent } from "@/lib/track";

const DATA_SOURCE = "projects/corder-landing/src/components/install/InstallClient.tsx";

const ZIP_URL =
  "https://github.com/halinskiy/corder-updates/releases/latest/download/Corder.zip";

type Phase = "waiting" | "started" | "manual";

export function InstallClient() {
  const [phase, setPhase] = useState<Phase>("waiting");
  const triggeredRef = useRef(false);

  // Auto-trigger the download on mount via a real anchor click. Some
  // browsers ignore window.location assignments with `download` headers
  // when invoked from beforeLoad; an actual <a> in the DOM with
  // `download` attribute is the reliable cross-browser path.
  useEffect(() => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;

    // Defer one tick so React has mounted the page chrome before the
    // browser's download prompt fires -- the user reads "Download
    // started" before their save dialog opens.
    const id = window.setTimeout(() => {
      try {
        const a = document.createElement("a");
        a.href = ZIP_URL;
        a.download = "Corder.zip";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setPhase("started");
        trackEvent("install_auto_download_started", { source: "install_page" });
      } catch {
        setPhase("manual");
      }
    }, 120);

    return () => window.clearTimeout(id);
  }, []);

  return (
    <main
      data-component="InstallPage"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-text,color-text-muted,color-accent,font-serif,font-sans,radius-window"
      className="install-page"
    >
      <div className="page-container py-16 md:py-24">
        <div className="install-page__inner mx-auto max-w-[920px]">
          <StatusPill phase={phase} />

          <h1 className="install-page__heading">
            Thanks for downloading.
            <br />
            Just a few steps left
          </h1>

          <p className="install-page__sub">
            Your download will begin automatically. If it did not start,{" "}
            <a
              href={ZIP_URL}
              download="Corder.zip"
              className="install-page__manual-link"
              data-track-event="install_manual_download_click"
              onClick={() => setPhase("started")}
            >
              download Corder manually.
            </a>
          </p>

          <ol className="install-steps" aria-label="Install steps">
            <InstallStep
              n={1}
              label={
                <>
                  Open <em>Corder.zip</em> from your{" "}
                  <em>Downloads</em> folder
                </>
              }
            >
              <DownloadsIllustration />
            </InstallStep>
            <InstallStep
              n={2}
              label={
                <>
                  Drag the <em>Corder</em> icon into your{" "}
                  <em>Applications</em> folder
                </>
              }
            >
              <DragIllustration />
            </InstallStep>
            <InstallStep
              n={3}
              label={
                <>
                  Open the Corder app from your{" "}
                  <em>Applications</em> folder
                </>
              }
            >
              <ApplicationsIllustration />
            </InstallStep>
          </ol>

          <div className="install-page__footer-links">
            <Link href="/" className="install-page__back">
              Back to corder.app
            </Link>
            <span aria-hidden className="install-page__dot">
              ·
            </span>
            <a
              href="mailto:hello@getcorder.com"
              className="install-page__back"
              data-track-event="install_help_email_click"
            >
              Need help? hello@getcorder.com
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatusPill({ phase }: { phase: Phase }) {
  const label =
    phase === "started"
      ? "DOWNLOAD STARTED"
      : phase === "manual"
        ? "TAP THE LINK BELOW"
        : "STARTING DOWNLOAD";
  return (
    <div className="install-status-pill" data-phase={phase} role="status" aria-live="polite">
      <span className="install-status-pill__dot" aria-hidden>
        {phase === "started" ? (
          <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden>
            <circle cx="7" cy="7" r="7" fill="currentColor" />
            <path
              d="M4 7.2l2 2 4-4.4"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <span className="install-status-pill__spinner" />
        )}
      </span>
      <span className="install-status-pill__label">{label}</span>
    </div>
  );
}

function InstallStep({
  n,
  label,
  children,
}: {
  n: number;
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="install-step">
      <div className="install-step__badge" aria-hidden>
        {n}
      </div>
      <div className="install-step__art">{children}</div>
      <p className="install-step__label">{label}</p>
    </li>
  );
}

/* ── Step illustrations ────────────────────────────────────
 * Minimal stylised renders of the macOS Downloads / Drag /
 * Applications surfaces. SVG-only so they scale crisply and
 * stay on brand (cream + accent green + greyscale).
 * ──────────────────────────────────────────────────────── */

function DownloadsIllustration() {
  return (
    <svg
      viewBox="0 0 320 220"
      className="install-step__svg"
      role="img"
      aria-label="Downloads folder with Corder zip"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="downloads-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0.18" />
          <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0.32" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="320" height="220" rx="22" fill="url(#downloads-bg)" />

      {/* Downloads label callout */}
      <g transform="translate(72, 28)">
        <rect width="118" height="34" rx="10" fill="#ffffff" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
        <text
          x="59"
          y="22"
          textAnchor="middle"
          fontFamily="var(--font-serif, Georgia, serif)"
          fontSize="16"
          fontWeight="600"
          fill="#0a0a0a"
        >
          Downloads
        </text>
        <path d="M55 34 L59 40 L63 34 Z" fill="#ffffff" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
      </g>

      {/* Three file slots */}
      <g transform="translate(48, 90)">
        {/* empty slot */}
        <rect x="0" y="0" width="64" height="80" rx="10" fill="rgba(255,255,255,0.6)" stroke="rgba(0,0,0,0.08)" />
        {/* corder.zip slot, highlighted */}
        <g>
          <rect x="80" y="0" width="64" height="80" rx="10" fill="#ffffff" stroke="rgba(0,0,0,0.16)" />
          {/* mini zip icon */}
          <rect x="100" y="14" width="24" height="32" rx="3" fill="#e5e5e5" stroke="rgba(0,0,0,0.15)" />
          <rect x="110" y="18" width="4" height="4" fill="#0a0a0a" opacity="0.4" />
          <rect x="110" y="26" width="4" height="4" fill="#0a0a0a" opacity="0.4" />
          <rect x="110" y="34" width="4" height="4" fill="#0a0a0a" opacity="0.4" />
          <text
            x="112"
            y="62"
            textAnchor="middle"
            fontFamily="var(--font-sans, system-ui)"
            fontSize="8"
            fill="#0a0a0a"
            opacity="0.65"
          >
            Corder.zip
          </text>
        </g>
        {/* trash slot */}
        <g transform="translate(160, 0)">
          <rect x="0" y="0" width="64" height="80" rx="10" fill="rgba(255,255,255,0.6)" stroke="rgba(0,0,0,0.08)" />
          <g transform="translate(20, 22) scale(0.9)">
            <rect x="0" y="6" width="24" height="28" rx="3" fill="#ffffff" stroke="rgba(0,0,0,0.2)" />
            <rect x="-3" y="2" width="30" height="5" rx="2" fill="#ffffff" stroke="rgba(0,0,0,0.2)" />
            <line x1="8" y1="14" x2="8" y2="28" stroke="rgba(0,0,0,0.18)" />
            <line x1="12" y1="14" x2="12" y2="28" stroke="rgba(0,0,0,0.18)" />
            <line x1="16" y1="14" x2="16" y2="28" stroke="rgba(0,0,0,0.18)" />
          </g>
        </g>
      </g>

      {/* Cursor on the zip */}
      <CursorGlyph x={138} y={148} />
    </svg>
  );
}

function DragIllustration() {
  return (
    <svg
      viewBox="0 0 320 220"
      className="install-step__svg"
      role="img"
      aria-label="Drag Corder app into Applications"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect x="0" y="0" width="320" height="220" rx="22" fill="rgba(247, 246, 246, 1)" stroke="rgba(0,0,0,0.06)" />

      {/* Corder.app tile (canonical mark) */}
      <g transform="translate(80, 78)">
        <rect x="0" y="0" width="68" height="68" rx="18" fill="#ffffff" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
        <rect x="22" y="16" width="9" height="36" rx="4.5" fill="#111111" />
        <rect x="36" y="16" width="9" height="36" rx="4.5" fill="#111111" />
      </g>

      {/* Applications folder ghost-outlined drop target */}
      <g transform="translate(190, 70)">
        <rect
          x="0"
          y="0"
          width="80"
          height="80"
          rx="12"
          fill="rgba(255,255,255,0.5)"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeDasharray="6 5"
          opacity="0.7"
        />
        {/* macOS Applications folder icon (stylised) */}
        <g transform="translate(16, 22)">
          <rect x="0" y="6" width="48" height="32" rx="5" fill="#9ec9f7" stroke="rgba(0,0,0,0.16)" />
          <rect x="2" y="2" width="20" height="8" rx="3" fill="#9ec9f7" stroke="rgba(0,0,0,0.16)" />
          <path
            d="M24 18 l-6 8 4 0 0 6 4 0 0 -6 4 0 z"
            fill="#ffffff"
            stroke="rgba(0,0,0,0.2)"
          />
        </g>
      </g>

      {/* Arrow from app to folder */}
      <path
        d="M148 110 Q 170 92, 190 110"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeDasharray="0 0"
        markerEnd="url(#arrowhead)"
      />
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="var(--color-accent)" />
        </marker>
      </defs>

      {/* Cursor with grab hand on the Corder tile */}
      <CursorGlyph x={132} y={120} variant="grab" />
    </svg>
  );
}

function ApplicationsIllustration() {
  return (
    <svg
      viewBox="0 0 320 220"
      className="install-step__svg"
      role="img"
      aria-label="Corder.app highlighted in Applications"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect x="0" y="0" width="320" height="220" rx="22" fill="#ffffff" stroke="rgba(0,0,0,0.08)" />

      {/* Header row */}
      <text
        x="22"
        y="34"
        fontFamily="var(--font-sans, system-ui)"
        fontSize="14"
        fontWeight="600"
        fill="#0a0a0a"
      >
        Applications
      </text>
      <line x1="14" y1="46" x2="306" y2="46" stroke="rgba(0,0,0,0.08)" />

      {/* Row: Calendar.app */}
      <g transform="translate(14, 60)">
        <AppRow icon={<CalendarIcon />} label="Calendar.app" />
      </g>

      {/* Row: Corder.app (HIGHLIGHTED) */}
      <g transform="translate(0, 102)">
        <rect x="0" y="0" width="320" height="36" fill="var(--color-accent)" />
        <g transform="translate(14, 4)">
          <CorderMarkSmall y={3} bgInverted />
          <text
            x="46"
            y="22"
            fontFamily="var(--font-sans, system-ui)"
            fontSize="14"
            fontWeight="600"
            fill="#ffffff"
          >
            Corder.app
          </text>
          {/* cursor on the row */}
          <CursorGlyph x={284} y={14} dark />
        </g>
      </g>

      {/* Row: Finder.app */}
      <g transform="translate(14, 148)">
        <AppRow icon={<FinderIcon />} label="Finder.app" />
      </g>

      {/* Row: Mail.app */}
      <g transform="translate(14, 190)">
        <AppRow icon={<MailIcon />} label="Mail.app" trailing="..." />
      </g>
    </svg>
  );
}

function AppRow({
  icon,
  label,
  trailing,
}: {
  icon: React.ReactNode;
  label: string;
  trailing?: string;
}) {
  return (
    <g>
      <g transform="translate(0, 4)">{icon}</g>
      <text
        x="46"
        y="22"
        fontFamily="var(--font-sans, system-ui)"
        fontSize="14"
        fill="#0a0a0a"
      >
        {label}
      </text>
      {trailing && (
        <text
          x="284"
          y="22"
          textAnchor="end"
          fontFamily="var(--font-sans, system-ui)"
          fontSize="14"
          fill="rgba(10,10,10,0.4)"
        >
          {trailing}
        </text>
      )}
    </g>
  );
}

function CorderMarkSmall({ y = 0, bgInverted = false }: { y?: number; bgInverted?: boolean }) {
  return (
    <g transform={`translate(0, ${y})`}>
      <rect x="0" y="0" width="28" height="28" rx="6.3" fill={bgInverted ? "#ffffff" : "#ffffff"} stroke="rgba(0,0,0,0.12)" strokeWidth="0.6" />
      <rect x="9" y="6.8" width="3.9" height="14.4" rx="1.95" fill="#111111" />
      <rect x="14.9" y="6.8" width="3.9" height="14.4" rx="1.95" fill="#111111" />
    </g>
  );
}

function CalendarIcon() {
  return (
    <g>
      <rect x="0" y="0" width="28" height="28" rx="6" fill="#ffffff" stroke="rgba(0,0,0,0.12)" />
      <rect x="0" y="0" width="28" height="7" rx="6" fill="#e54848" />
      <text x="14" y="22" textAnchor="middle" fontFamily="var(--font-sans, system-ui)" fontSize="11" fontWeight="700" fill="#0a0a0a">
        27
      </text>
    </g>
  );
}

function FinderIcon() {
  return (
    <g>
      <rect x="0" y="0" width="28" height="28" rx="6" fill="#3aa7ff" stroke="rgba(0,0,0,0.12)" />
      <circle cx="10" cy="12" r="1.6" fill="#ffffff" />
      <circle cx="18" cy="12" r="1.6" fill="#ffffff" />
      <path d="M10 19 Q 14 22, 18 19" stroke="#ffffff" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </g>
  );
}

function MailIcon() {
  return (
    <g>
      <rect x="0" y="0" width="28" height="28" rx="6" fill="#ffffff" stroke="rgba(0,0,0,0.12)" />
      <rect x="4" y="8" width="20" height="12" rx="2" fill="none" stroke="#0a0a0a" strokeWidth="1.4" />
      <path d="M4 9 L14 16 L24 9" fill="none" stroke="#0a0a0a" strokeWidth="1.4" strokeLinejoin="round" />
    </g>
  );
}

function CursorGlyph({
  x,
  y,
  variant = "arrow",
  dark = false,
}: {
  x: number;
  y: number;
  variant?: "arrow" | "grab";
  dark?: boolean;
}) {
  if (variant === "grab") {
    return (
      <g transform={`translate(${x}, ${y})`}>
        <path
          d="M0 0 c2 -4, 8 -6, 12 -4 l0 -3 c0 -3, 4 -3, 4 0 l0 4 c0 -3, 4 -3, 4 0 l0 5 c0 -2, 3 -2, 3 0 l0 6 c0 6, -4 10, -10 10 c-6 0, -10 -3, -13 -8 l-4 -7 c-1 -3, 2 -5, 4 -3 z"
          fill="#ffffff"
          stroke="#0a0a0a"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </g>
    );
  }
  const fill = dark ? "#ffffff" : "#0a0a0a";
  const stroke = dark ? "rgba(0,0,0,0.6)" : "#ffffff";
  return (
    <g transform={`translate(${x}, ${y})`}>
      <path
        d="M0 0 L0 18 L4 14 L7 22 L10 21 L7 13 L13 13 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </g>
  );
}
