"use client";

import { copy } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/Features.tsx";

/**
 * Section 5  --  Features.
 *
 * 6-cell hairline-bordered grid, 3 cols at lg, 2 at sm, 1 at base. No icons.
 * Each cell renders a unique inline-SVG mock per `visualHint` from copy.json.
 * Style follows the `GoogleMeetMock` reference in
 * `src/components/hero/HeroLibraryDemo.tsx`  --  clean shapes, no external
 * assets, viewBox-driven, minimal ASCII text labels.
 *
 * visualHint cases:
 *   - mini-timeline-fragment : two stacked speaker rows + per-speaker ticks +
 *                              one playhead dot (the accent spotlight).
 *   - screen-video-frame     : 16:9 dark frame with centred play button
 *                              (the accent spotlight).
 *   - menu-bar-capsule       : macOS menu bar with a notification card,
 *                              solid accent "Record" pill (the accent
 *                              spotlight) + outlined "Skip".
 *   - drag-out-gesture       : small transcript card + dashed curve to a
 *                              Notion drop target. The curve itself is the
 *                              accent spotlight.
 *   - audio-sound-row        : macOS-Sound-preferences-style row list.
 *                              The selected "Corder" row carries the accent
 *                              left-border + filled radio dot (the
 *                              accent spotlight).
 *   - version-sequence       : Flash 2.5 -> Flash 3 -> Pro 4 chips, middle
 *                              chip outlined in accent (the accent
 *                              spotlight).
 *
 * Doctrine compliant: zero pictograms in the cell chrome, hairlines as the
 * only structural separator, no shadows, doctrine easing on all hover
 * transitions, ASCII only inside <text> elements, no microphone icons.
 *
 * Each illustration uses accent green (#217a50 via var(--color-accent)) in
 * exactly ONE element role per cell  --  see CHANGELOG entry for the per-cell
 * mapping.
 */
export function Features() {
  const { features } = copy;

  return (
    <section
      id="features"
      data-component="Features"
      data-source={DATA_SOURCE}
      data-tokens="color-text,color-text-muted,color-border,color-accent,font-serif,font-mono"
      className="relative w-full overflow-hidden"
    >
      <div aria-hidden className="section-blob section-blob--features" />
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
      <p className="feature-cell__body">{cell.body}</p>
      <FeatureVisual cell={cell} />
    </article>
  );
}

function FeatureVisual({ cell }: { cell: FeatureCellData }) {
  switch (cell.visualHint) {
    case "mini-timeline-fragment":
      return (
        <div
          className="feature-cell__visual"
          data-component="FeatureVisual.MiniTimelineFragment"
          data-source={DATA_SOURCE}
          data-tokens="color-surface,color-border,color-accent,font-sans"
        >
          <MiniTimelineFragment />
        </div>
      );

    case "screen-video-frame":
      return (
        <div
          className="feature-cell__visual"
          data-component="FeatureVisual.ScreenVideoFrame"
          data-source={DATA_SOURCE}
          data-tokens="color-accent,font-sans"
        >
          <ScreenVideoFrame />
        </div>
      );

    case "menu-bar-capsule":
      return (
        <div
          className="feature-cell__visual"
          data-component="FeatureVisual.MenuBarCapsule"
          data-source={DATA_SOURCE}
          data-tokens="color-surface,color-border,color-text,color-accent,font-sans"
        >
          <MenuBarCapsule />
        </div>
      );

    case "drag-out-gesture":
      return (
        <div
          className="feature-cell__visual"
          data-component="FeatureVisual.DragOutGesture"
          data-source={DATA_SOURCE}
          data-tokens="color-surface,color-border,color-text-muted,color-accent,font-sans,font-mono"
        >
          <DragOutGesture />
        </div>
      );

    case "audio-sound-row":
      return (
        <div
          className="feature-cell__visual"
          data-component="FeatureVisual.AudioSoundRow"
          data-source={DATA_SOURCE}
          data-tokens="color-surface,color-border,color-text,color-accent,font-sans"
        >
          <AudioSoundRow />
        </div>
      );

    case "version-sequence":
      return (
        <div
          className="feature-cell__visual"
          data-component="FeatureVisual.VersionSequence"
          data-source={DATA_SOURCE}
          data-tokens="color-accent,color-surface,color-border,font-mono"
        >
          <VersionSequence sequence={cell.versionSequence ?? "Flash 2.5 -> Flash 3 -> Pro 4"} />
        </div>
      );

    default:
      return null;
  }
}

/* ---------- Inline SVG mocks ---------------------------------------- */

/**
 * 01  --  Two horizontal speaker rows. Vadym row uses purple `#5a3aa6` (the
 * landing's secondary speaker colour, scoped to product-UI demos). Kostiantyn
 * row uses neutral grey ticks. A single accent-green playhead dot sits on the
 * Vadym row  --  that is the accent spotlight for this cell.
 *
 * Why purple is not a "second accent": it lives only inside speaker-coded
 * product UI (Hero demo + this fragment), never in chrome.
 */
function MiniTimelineFragment() {
  return (
    <svg
      className="ftr-svg ftr-svg--timeline"
      viewBox="0 0 320 120"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Timeline with two speaker rows and a playhead"
    >
      {/* Background card */}
      <rect x="0" y="0" width="320" height="120" rx="8" fill="var(--color-surface-2)" stroke="var(--color-border)" />

      {/* Row 1  --  Vadym (purple ticks) */}
      <text
        x="14" y="34"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="11"
        fontWeight="600"
        fill="var(--color-text)"
      >
        Vadym
      </text>
      <rect x="78" y="26" width="226" height="8" rx="4" fill="var(--color-border)" />
      {/* Vadym ticks  --  varying widths */}
      <rect x="86"  y="26" width="14" height="8" rx="2" fill="#5a3aa6" />
      <rect x="108" y="26" width="22" height="8" rx="2" fill="#5a3aa6" />
      <rect x="138" y="26" width="10" height="8" rx="2" fill="#5a3aa6" />
      <rect x="158" y="26" width="30" height="8" rx="2" fill="#5a3aa6" />
      <rect x="196" y="26" width="16" height="8" rx="2" fill="#5a3aa6" />
      <rect x="222" y="26" width="20" height="8" rx="2" fill="#5a3aa6" />
      <rect x="252" y="26" width="12" height="8" rx="2" fill="#5a3aa6" />
      <rect x="272" y="26" width="22" height="8" rx="2" fill="#5a3aa6" />
      {/* Playhead  --  accent spotlight */}
      <line x1="172" y1="18" x2="172" y2="42" stroke="var(--color-accent)" strokeWidth="1.5" />
      <circle cx="172" cy="30" r="5" fill="var(--color-accent)" />
      <circle cx="172" cy="30" r="2" fill="#ffffff" />

      {/* Row 2  --  Kostiantyn (neutral ticks) */}
      <text
        x="14" y="80"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="11"
        fontWeight="600"
        fill="var(--color-text)"
      >
        Kostiantyn
      </text>
      <rect x="78" y="72" width="226" height="8" rx="4" fill="var(--color-border)" />
      <rect x="84"  y="72" width="18" height="8" rx="2" fill="var(--color-text-subtle)" />
      <rect x="110" y="72" width="12" height="8" rx="2" fill="var(--color-text-subtle)" />
      <rect x="130" y="72" width="24" height="8" rx="2" fill="var(--color-text-subtle)" />
      <rect x="162" y="72" width="14" height="8" rx="2" fill="var(--color-text-subtle)" />
      <rect x="184" y="72" width="20" height="8" rx="2" fill="var(--color-text-subtle)" />
      <rect x="212" y="72" width="10" height="8" rx="2" fill="var(--color-text-subtle)" />
      <rect x="230" y="72" width="26" height="8" rx="2" fill="var(--color-text-subtle)" />
      <rect x="264" y="72" width="16" height="8" rx="2" fill="var(--color-text-subtle)" />

      {/* Time scale */}
      <text x="78"  y="104" fontFamily="var(--font-mono), ui-monospace, monospace" fontSize="9" fill="var(--color-text-muted)">00:00</text>
      <text x="280" y="104" fontFamily="var(--font-mono), ui-monospace, monospace" fontSize="9" fill="var(--color-text-muted)">12:40</text>
    </svg>
  );
}

/**
 * 02  --  16:9 dark frame mocking a screen-recording preview. A single accent
 * play button sits centred; that is the accent spotlight. Inner geometry
 * (window chrome strip + faint code-line stripes) signals "screen content"
 * without being a participant grid or a microphone icon.
 */
function ScreenVideoFrame() {
  return (
    <svg
      className="ftr-svg ftr-svg--screen"
      viewBox="0 0 320 180"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Screen recording preview with a play button"
    >
      {/* Outer device frame */}
      <rect x="0" y="0" width="320" height="180" rx="10" fill="#202124" />

      {/* Mock window chrome inside the screen */}
      <rect x="14" y="14" width="292" height="152" rx="6" fill="#2d2e30" />
      <rect x="14" y="14" width="292" height="22" rx="6" fill="#3c4043" />
      <circle cx="26" cy="25" r="3.2" fill="#ea4335" />
      <circle cx="38" cy="25" r="3.2" fill="#fbbc04" />
      <circle cx="50" cy="25" r="3.2" fill="#34a853" />
      <rect x="120" y="20" width="80" height="10" rx="3" fill="#202124" />

      {/* Faint "code" lines inside the window  --  pure decoration */}
      <rect x="26" y="50"  width="60"  height="4" rx="1" fill="#3c4043" />
      <rect x="92" y="50"  width="120" height="4" rx="1" fill="#3c4043" />
      <rect x="26" y="62"  width="40"  height="4" rx="1" fill="#3c4043" />
      <rect x="72" y="62"  width="160" height="4" rx="1" fill="#3c4043" />
      <rect x="26" y="74"  width="100" height="4" rx="1" fill="#3c4043" />
      <rect x="26" y="118" width="60"  height="4" rx="1" fill="#3c4043" />
      <rect x="92" y="118" width="80"  height="4" rx="1" fill="#3c4043" />
      <rect x="26" y="130" width="140" height="4" rx="1" fill="#3c4043" />
      <rect x="26" y="142" width="50"  height="4" rx="1" fill="#3c4043" />

      {/* Centre play button  --  accent spotlight */}
      <circle cx="160" cy="90" r="22" fill="var(--color-accent)" />
      <path d="M154 80 L154 100 L172 90 Z" fill="#ffffff" />
    </svg>
  );
}

/**
 * 03  --  macOS menu bar fragment with a notification capsule.
 * Top strip: dark menu bar with three faint chrome glyphs.
 * Capsule: light card on neutral background. Solid accent "Record" button is
 * the spotlight. "Skip" is an outlined neutral pill.
 */
function MenuBarCapsule() {
  return (
    <svg
      className="ftr-svg ftr-svg--menubar"
      viewBox="0 0 320 160"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="macOS menu bar notification asking to record"
    >
      {/* Page backdrop */}
      <rect x="0" y="0" width="320" height="160" rx="8" fill="var(--color-surface-2)" />

      {/* Top dark menu bar strip */}
      <rect x="0" y="0" width="320" height="20" fill="#1c1c1e" />
      <circle cx="11" cy="10" r="3" fill="#ffffff" opacity="0.85" />
      <rect x="20" y="7" width="22" height="6" rx="1" fill="#ffffff" opacity="0.7" />
      <rect x="48" y="7" width="14" height="6" rx="1" fill="#ffffff" opacity="0.55" />
      <rect x="68" y="7" width="16" height="6" rx="1" fill="#ffffff" opacity="0.55" />
      {/* Right cluster  --  clock + status dots */}
      <rect x="266" y="7" width="22" height="6" rx="1" fill="#ffffff" opacity="0.7" />
      <circle cx="298" cy="10" r="2.4" fill="#ffffff" opacity="0.6" />
      <circle cx="308" cy="10" r="2.4" fill="#ffffff" opacity="0.6" />

      {/* Notification anchor caret pointing up to the menu bar */}
      <path d="M252 26 L258 32 L246 32 Z" fill="var(--color-bg)" stroke="var(--color-border)" strokeWidth="1" />
      <rect x="245" y="31.5" width="14" height="2" fill="var(--color-bg)" />

      {/* Notification card */}
      <rect x="60" y="34" width="248" height="84" rx="10" fill="var(--color-bg)" stroke="var(--color-border)" strokeWidth="1" />

      {/* App tag / source */}
      <text
        x="74" y="54"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="9.5"
        fontWeight="600"
        letterSpacing="0.5"
        fill="var(--color-text-muted)"
      >
        CORDER
      </text>

      {/* Headline */}
      <text
        x="74" y="78"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="13"
        fontWeight="600"
        fill="var(--color-text)"
      >
        Zoom is open. Record?
      </text>

      {/* Skip pill  --  neutral outline */}
      <rect x="74" y="92" width="60" height="20" rx="10" fill="var(--color-bg)" stroke="var(--color-border-strong)" strokeWidth="1" />
      <text
        x="104" y="106"
        textAnchor="middle"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="11"
        fontWeight="500"
        fill="var(--color-text)"
      >
        Skip
      </text>

      {/* Record pill  --  accent spotlight */}
      <rect x="142" y="92" width="74" height="20" rx="10" fill="var(--color-accent)" />
      <circle cx="154" cy="102" r="3.5" fill="#ffffff" />
      <text
        x="186" y="106"
        textAnchor="middle"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="11"
        fontWeight="600"
        fill="#ffffff"
      >
        Record
      </text>
    </svg>
  );
}

/**
 * 04  --  A small transcript file-card (title + truncated lines) drifts toward a
 * dashed Notion drop-target. The accent-green dashed curve is the spotlight.
 *
 * ASCII inside text labels only.
 */
function DragOutGesture() {
  return (
    <svg
      className="ftr-svg ftr-svg--drag"
      viewBox="0 0 320 160"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Transcript card being dragged onto a Notion drop target"
    >
      {/* Background */}
      <rect x="0" y="0" width="320" height="160" rx="8" fill="var(--color-surface-2)" />

      {/* Notion drop target  --  dashed outline */}
      <rect
        x="200" y="36" width="108" height="88" rx="8"
        fill="var(--color-bg)"
        stroke="var(--color-border-strong)"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      <text
        x="254" y="64"
        textAnchor="middle"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="11"
        fontWeight="600"
        fill="var(--color-text-muted)"
      >
        Notion
      </text>
      <text
        x="254" y="82"
        textAnchor="middle"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="10"
        fill="var(--color-text-subtle)"
      >
        Drop here
      </text>
      {/* Small page glyph inside the target  --  two stacked lines */}
      <rect x="232" y="94" width="44" height="2" rx="1" fill="var(--color-border-strong)" />
      <rect x="232" y="100" width="32" height="2" rx="1" fill="var(--color-border-strong)" />
      <rect x="232" y="106" width="38" height="2" rx="1" fill="var(--color-border-strong)" />

      {/* Transcript card  --  mid-drag, slightly rotated */}
      <g transform="translate(12 30) rotate(-4 60 50)">
        <rect
          x="0" y="0" width="140" height="98" rx="8"
          fill="var(--color-bg)"
          stroke="var(--color-border-strong)"
          strokeWidth="1"
        />
        {/* Card eyebrow */}
        <text
          x="14" y="22"
          fontFamily="var(--font-sans), system-ui, sans-serif"
          fontSize="9"
          fontWeight="600"
          letterSpacing="0.5"
          fill="var(--color-text-muted)"
        >
          TRANSCRIPT
        </text>
        {/* Card title */}
        <text
          x="14" y="42"
          fontFamily="var(--font-serif), Georgia, serif"
          fontSize="13"
          fontWeight="600"
          fill="var(--color-text)"
        >
          Investor call
        </text>
        {/* Truncated lines */}
        <rect x="14" y="54" width="112" height="3" rx="1" fill="var(--color-border)" />
        <rect x="14" y="64" width="92"  height="3" rx="1" fill="var(--color-border)" />
        <rect x="14" y="74" width="100" height="3" rx="1" fill="var(--color-border)" />
        <rect x="14" y="84" width="70"  height="3" rx="1" fill="var(--color-border)" />
      </g>

      {/* Dashed accent curve  --  drag trace, the accent spotlight */}
      <path
        d="M158 70 Q 184 24, 220 60"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        strokeLinecap="round"
      />
      {/* Arrowhead */}
      <path
        d="M220 60 L 213 56 L 215 64 Z"
        fill="var(--color-accent)"
      />
    </svg>
  );
}

/**
 * 05  --  macOS Sound preferences-style row list. Three rows; the third
 * ("Corder") is selected: accent left-border + filled radio dot. That is the
 * accent spotlight. Other rows are inert neutral rings.
 */
function AudioSoundRow() {
  return (
    <svg
      className="ftr-svg ftr-svg--audio"
      viewBox="0 0 320 160"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Audio device list with Corder selected"
    >
      {/* Card */}
      <rect x="0" y="0" width="320" height="160" rx="8" fill="var(--color-bg)" stroke="var(--color-border)" strokeWidth="1" />

      {/* Column header */}
      <text
        x="20" y="22"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="9"
        fontWeight="600"
        letterSpacing="0.6"
        fill="var(--color-text-muted)"
      >
        OUTPUT DEVICE
      </text>

      {/* Header divider */}
      <line x1="0" y1="34" x2="320" y2="34" stroke="var(--color-border)" strokeWidth="1" />

      {/* Row 1  --  MacBook microphone (inactive) */}
      <g>
        <circle cx="32" cy="58" r="5" fill="none" stroke="var(--color-border-strong)" strokeWidth="1" />
        <text
          x="48" y="62"
          fontFamily="var(--font-sans), system-ui, sans-serif"
          fontSize="12"
          fontWeight="500"
          fill="var(--color-text)"
        >
          MacBook microphone
        </text>
        <rect x="218" y="50" width="56" height="16" rx="3" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="1" />
        <text
          x="246" y="61"
          textAnchor="middle"
          fontFamily="var(--font-sans), system-ui, sans-serif"
          fontSize="9"
          fontWeight="600"
          letterSpacing="0.4"
          fill="var(--color-text-muted)"
        >
          BUILT-IN
        </text>
      </g>
      <line x1="20" y1="78" x2="300" y2="78" stroke="var(--color-border)" strokeWidth="1" />

      {/* Row 2  --  External display (inactive) */}
      <g>
        <circle cx="32" cy="98" r="5" fill="none" stroke="var(--color-border-strong)" strokeWidth="1" />
        <text
          x="48" y="102"
          fontFamily="var(--font-sans), system-ui, sans-serif"
          fontSize="12"
          fontWeight="500"
          fill="var(--color-text)"
        >
          External display
        </text>
      </g>
      <line x1="20" y1="118" x2="300" y2="118" stroke="var(--color-border)" strokeWidth="1" />

      {/* Row 3  --  Corder (selected, accent spotlight) */}
      <g>
        {/* Accent left border */}
        <rect x="0" y="118" width="3" height="42" fill="var(--color-accent)" />
        {/* Subtle accent tint across the row */}
        <rect x="3" y="118" width="317" height="42" fill="var(--color-accent-subtle)" />
        {/* Filled radio dot */}
        <circle cx="32" cy="139" r="5" fill="var(--color-accent)" />
        <circle cx="32" cy="139" r="2" fill="#ffffff" />
        <text
          x="48" y="143"
          fontFamily="var(--font-sans), system-ui, sans-serif"
          fontSize="12"
          fontWeight="600"
          fill="var(--color-text)"
        >
          Corder
        </text>
        <text
          x="48" y="156"
          fontFamily="var(--font-sans), system-ui, sans-serif"
          fontSize="10"
          fill="var(--color-text-muted)"
        >
          CoreAudio process tap
        </text>
      </g>
    </svg>
  );
}

/**
 * 06  --  Three monospace chips connected by ASCII `->`. Middle chip ("Flash 3")
 * carries the accent outline  --  that is the accent spotlight.
 *
 * Parses the sequence string, swaps any typographic arrow for `->`, and
 * trims whitespace.
 */
function VersionSequence({ sequence }: { sequence: string }) {
  // Normalise: accept "Flash 2.5 -> Flash 3 -> Pro 4" or legacy "→" variants.
  // ASCII only inside the rendered text.
  const ascii = sequence.replace(/→/g, "->");
  const parts = ascii.split("->").map((p) => p.trim()).filter(Boolean);
  // Active chip = the middle one ("current model"). If only 2 chips, the
  // newer (right) one is current; if 1, that one is current.
  const activeIndex = parts.length >= 3 ? 1 : parts.length - 1;

  // Chip widths follow the longest label so the row stays balanced.
  const CHIP_H = 30;
  const CHIP_PAD_X = 12;
  const ARROW_W = 22;
  // Approximate glyph width for IBM Plex Mono 13px is ~7.6px. We size each
  // chip to fit its own label so SVG layout matches CSS reality.
  const chipW = (label: string) => Math.max(56, label.length * 7.6 + CHIP_PAD_X * 2);

  // Compute cumulative x positions.
  const positions: { x: number; w: number; label: string; active: boolean }[] = [];
  let cursor = 0;
  parts.forEach((label, i) => {
    const w = chipW(label);
    positions.push({ x: cursor, w, label, active: i === activeIndex });
    cursor += w + ARROW_W;
  });
  // Total used width minus the trailing arrow allowance.
  const totalW = cursor - ARROW_W;
  const VB_W = Math.max(280, totalW + 8);
  const VB_H = 56;
  // Centre the row in viewBox.
  const offsetX = (VB_W - totalW) / 2;

  return (
    <svg
      className="ftr-svg ftr-svg--versions"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Version sequence with the current model highlighted"
    >
      {positions.map((p, i) => {
        const cx = offsetX + p.x;
        const cy = (VB_H - CHIP_H) / 2;
        return (
          <g key={`${p.label}-${i}`}>
            <rect
              x={cx}
              y={cy}
              width={p.w}
              height={CHIP_H}
              rx="6"
              fill={p.active ? "var(--color-accent-subtle)" : "var(--color-surface)"}
              stroke={p.active ? "var(--color-accent)" : "var(--color-border)"}
              strokeWidth={p.active ? 1.5 : 1}
            />
            <text
              x={cx + p.w / 2}
              y={cy + CHIP_H / 2 + 4}
              textAnchor="middle"
              fontFamily="var(--font-mono), ui-monospace, monospace"
              fontSize="13"
              fontWeight={p.active ? 600 : 500}
              fill={p.active ? "var(--color-accent)" : "var(--color-text)"}
            >
              {p.label}
            </text>
            {i < positions.length - 1 && (
              <text
                x={cx + p.w + ARROW_W / 2}
                y={cy + CHIP_H / 2 + 4}
                textAnchor="middle"
                fontFamily="var(--font-mono), ui-monospace, monospace"
                fontSize="13"
                fontWeight="500"
                fill="var(--color-text-subtle)"
              >
                {"->"}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
