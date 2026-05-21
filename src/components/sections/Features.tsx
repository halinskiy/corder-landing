"use client";

import { copy } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/Features.tsx";

/**
 * Section 5  ----  Features.
 *
 * 6-cell hairline-bordered grid, 3 cols at lg, 2 at sm, 1 at base. No icons.
 * Each cell renders a unique inline-SVG mock per `visualHint` from copy.json.
 * Style follows the `GoogleMeetMock` reference in
 * `src/components/hero/HeroLibraryDemo.tsx`  ----  clean shapes, no external
 * assets, viewBox-driven, minimal ASCII text labels.
 *
 * visualHint cases:
 *   - mini-timeline-fragment : two stacked speaker rows + per-speaker ticks +
 *                              one playhead dot (the accent spotlight).
 *   - screen-video-frame     : 16:9 dark frame with centred play button
 *                              (the accent spotlight).
 *   - popover-widget         : faithful idle-state mock of the real Corder
 *                              menu-bar popover (Sources/Corder/UI/
 *                              PopoverContentView.swift). Dark 280x240 card
 *                              with a hairline status row, a light Start
 *                              recording button (red dot, product-faithful),
 *                              a separator, an outlined Open library
 *                              secondary button, and a small Quit link. The
 *                              accent spotlight is the dropdown caret anchor
 *                              at the top  ----  the visual signal that this
 *                              widget lives in the menu bar. Decision logged
 *                              in DECISIONS.md 2026-05-21.
 *   - drag-out-gesture       : small transcript card + dashed curve to a
 *                              Notion drop target. The curve itself is the
 *                              accent spotlight.
 *   - no-bot-grid            : Zoom-style 2-tile call grid ("Vadym" + "You")
 *                              with no third "Corder" participant. An off-grid
 *                              annotation labelled "Corder" with a hairline
 *                              pointing up to the menu bar area. The
 *                              annotation hairline + label is the accent
 *                              spotlight  ----  it teaches the absence.
 *   - transcript-fragment    : audio scrubber on top + one transcript line
 *                              underneath with a coloured speaker badge
 *                              ("KH"). The scrubber's accent progress fill is
 *                              the accent spotlight.
 *
 * Doctrine compliant: zero pictograms in the cell chrome, hairlines as the
 * only structural separator, no shadows, doctrine easing on all hover
 * transitions, ASCII only inside <text> elements, no microphone icons.
 *
 * Each illustration uses accent green (#217a50 via var(--color-accent)) in
 * exactly ONE element role per cell.
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
      <div className="page-container py-8 md:py-[52px]">
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

    case "popover-widget":
      return (
        <div
          className="feature-cell__visual"
          data-component="FeatureVisual.PopoverWidget"
          data-source={DATA_SOURCE}
          data-tokens="color-surface,color-border,color-text,color-accent,font-sans,font-mono"
        >
          <PopoverWidget />
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

    case "no-bot-grid":
      return (
        <div
          className="feature-cell__visual"
          data-component="FeatureVisual.NoBotGrid"
          data-source={DATA_SOURCE}
          data-tokens="color-surface,color-border,color-text,color-accent,font-sans"
        >
          <NoBotGrid />
        </div>
      );

    case "transcript-fragment":
      return (
        <div
          className="feature-cell__visual"
          data-component="FeatureVisual.TranscriptFragment"
          data-source={DATA_SOURCE}
          data-tokens="color-surface,color-border,color-text,color-accent,font-sans"
        >
          <TranscriptFragment />
        </div>
      );

    case "language-mock":
      return (
        <div
          className="feature-cell__visual"
          data-component="FeatureVisual.LanguageMock"
          data-source={DATA_SOURCE}
          data-tokens="color-surface,color-border,color-text,color-accent,font-sans"
        >
          <LanguageMock />
        </div>
      );

    default:
      return null;
  }
}

/* ---------- Inline SVG mocks ---------------------------------------- */

/**
 * 01  ----  Two horizontal speaker rows. Vadym row uses purple `#5a3aa6` (the
 * landing's secondary speaker colour, scoped to product-UI demos). Kostiantyn
 * row uses neutral grey ticks. A single accent-green playhead dot sits on the
 * Vadym row  ----  that is the accent spotlight for this cell.
 *
 * Why purple is not a "second accent": it lives only inside speaker-coded
 * product UI (Hero demo + this fragment), never in chrome.
 */
function MiniTimelineFragment() {
  // Four speaker rows so the illustration fills the same vertical space
  // as the popover and screen-video mocks. Each row has its own colour
  // pulled from the project's speaker palette (purple + amber + light
  // purple variant + neutral). Playhead sits on Vadym's row and is the
  // single accent-green spotlight.
  const rows = [
    { name: "Mike",      y: 24,  color: "#5a3aa6", track: [[6,14],[28,22],[58,10],[78,30],[116,16],[142,20],[172,12],[192,22]] },
    { name: "David", y: 76,  color: "#a16207", track: [[4,18],[30,12],[50,24],[82,14],[104,20],[132,10],[150,26],[184,16]] },
    { name: "Paul",       y: 128, color: "#7e57c2", track: [[10,16],[34,10],[52,22],[80,12],[100,28],[136,14],[158,18],[182,24]] },
    { name: "Sarah",       y: 180, color: "#8a8a86", track: [[2,12],[22,20],[50,14],[72,26],[104,10],[122,18],[146,14],[170,30]] },
  ];
  return (
    <svg
      className="ftr-svg ftr-svg--timeline"
      viewBox="0 0 320 240"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Timeline with four speaker rows and a playhead"
    >
      {/* Background card */}
      <rect x="0" y="0" width="320" height="240" rx="8" fill="var(--color-surface-2)" stroke="var(--color-border)" />

      {rows.map((row) => (
        <g key={row.name}>
          <text
            x="14"
            y={row.y + 10}
            fontFamily="var(--font-sans), system-ui, sans-serif"
            fontSize="11"
            fontWeight="600"
            fill="var(--color-text)"
          >
            {row.name}
          </text>
          {/* Track */}
          <rect x="78" y={row.y + 2} width="226" height="8" rx="4" fill="var(--color-border)" />
          {/* Ticks */}
          {row.track.map(([x, w], i) => (
            <rect
              key={i}
              x={86 + x}
              y={row.y + 2}
              width={w}
              height="8"
              rx="2"
              fill={row.color}
            />
          ))}
        </g>
      ))}

      {/* Time scale */}
      <text x="78"  y="222" fontFamily="var(--font-mono), ui-monospace, monospace" fontSize="9" fill="var(--color-text-muted)">00:00</text>
      <text x="280" y="222" fontFamily="var(--font-mono), ui-monospace, monospace" fontSize="9" fill="var(--color-text-muted)">12:40</text>
    </svg>
  );
}

/**
 * 02  ----  16:9 dark frame mocking a screen-recording preview. A single accent
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

      {/* Faint "code" lines inside the window  ----  pure decoration */}
      <rect x="26" y="50"  width="60"  height="4" rx="1" fill="#3c4043" />
      <rect x="92" y="50"  width="120" height="4" rx="1" fill="#3c4043" />
      <rect x="26" y="62"  width="40"  height="4" rx="1" fill="#3c4043" />
      <rect x="72" y="62"  width="160" height="4" rx="1" fill="#3c4043" />
      <rect x="26" y="74"  width="100" height="4" rx="1" fill="#3c4043" />
      <rect x="26" y="118" width="60"  height="4" rx="1" fill="#3c4043" />
      <rect x="92" y="118" width="80"  height="4" rx="1" fill="#3c4043" />
      <rect x="26" y="130" width="140" height="4" rx="1" fill="#3c4043" />
      <rect x="26" y="142" width="50"  height="4" rx="1" fill="#3c4043" />

      {/* Centre play button  ----  accent spotlight */}
      <circle cx="160" cy="90" r="22" fill="var(--color-accent)" />
      <path d="M154 80 L154 100 L172 90 Z" fill="#ffffff" />
    </svg>
  );
}

/**
 * 03  ----  Faithful inline-SVG mock of the IDLE state of the real Corder
 * menu-bar popover. Source: `/Users/3mpq/Corder/Sources/Corder/UI/
 * PopoverContentView.swift` (idleSection, IdleStatus, FlatButtonView).
 *
 * Geometry follows the Swift values:
 *   - Outer card: 280x240, padding 20 (matches `.padding(20)` + `.frame(width: 320)`
 *     minus the surrounding sidebar/menubar margin shown here implicitly).
 *   - VStack spacing 18 between sections (idle row, separator, library row).
 *   - IdleStatus inner padding: horizontal 16, vertical 14, corner radius 8.
 *   - Buttons: vertical padding 13, horizontal 16, corner radius 8.
 *   - Quit link: 12pt grey, centered, 4pt vertical padding.
 *
 * Colour choices:
 *   - Card background: `#1c1c1e` (a faithful stand-in for
 *     `NSColor.windowBackgroundColor` in macOS Dark appearance, which is the
 *     popover's natural rendering on a system menu bar).
 *   - Idle status dot: 45% white (matches `Color.secondary.opacity(0.45)`).
 *   - Start recording button: light fill (`#f5f5f7`), near-black text
 *     (`#111`), red 8x8 dot (`#dc2626` reads as the same crimson family as
 *     the real `Color.red`). Keeping the dot RED preserves product semantics
 *     (red = recording state); switching it to accent green would mislead
 *     users who later open the app and see a red dot. Decision in
 *     DECISIONS.md 2026-05-21.
 *   - Open library secondary button: transparent fill, white-10% border,
 *     white 85% text. Mirrors `.secondary` FlatButtonStyle.
 *   - Quit link: white 45%, 12pt, centered.
 *   - Separator: white 8% hairline, matches `Color.primary.opacity(0.08)`.
 *
 * Accent spotlight: the dropdown caret/anchor at the top-center. It is the
 * only accent-coloured element in the illustration and signals "this widget
 * lives in the menu bar". Without it the popover would float context-free;
 * with it the meaning of AUTO-DETECT is reinforced visually.
 */
function PopoverWidget() {
  // Port of Sources/Corder/UI/PopoverContentView.swift idleSection
  // with the colours taken straight from FlatButtonStyle:336-341 in
  // dark mode (Color.primary = #ffffff, NSColor.windowBackgroundColor
  // ~= #1d1d1f, Color.secondary ~= white @ 0.55).
  //
  // Layout maths (matches SwiftUI VStack(spacing:18) .padding(20)):
  //   y=8 popover top (caret above)
  //   y=28 IdleStatus rect start (top padding 20)
  //   y=100 IdleStatus end (h:72 = padding 14 + label 17 + spacing 1
  //                                    + time 26 + padding 14)
  //   y=114 Start button start (idleSection internal spacing 14)
  //   y=158 Start button end (h:44)
  //   y=178 Separator line (outer spacing 18, padding-v 2)
  //   y=198 Open library start (outer spacing 18 + line + padding-v 2)
  //   y=242 Open library end (h:44)
  //   y=262 Quit baseline (VStack(spacing:10) + padding-v 4)
  //   y=290 popover end (bottom padding 20)
  return (
    <svg
      className="ftr-svg ftr-svg--popover"
      viewBox="0 0 320 298"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Corder menu bar popover, idle state"
    >
      {/* Caret -- same fill as popover, no accent */}
      <path d="M160 0 L168 8 L152 8 Z" fill="#1d1d1f" />

      {/* Popover card */}
      <rect x="0" y="8" width="320" height="282" rx="14" fill="#1d1d1f" />

      {/* IdleStatus group: 280x72, padding 16h/14v, hairline 10% white */}
      <rect
        x="20" y="28" width="280" height="72" rx="8"
        fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1"
      />
      {/* 10x10 dot, secondary @ 0.45, vertically centred (28 + 36 = 64) */}
      <circle cx="36" cy="64" r="5" fill="rgba(255,255,255,0.45)" />
      {/* VStack(alignment:.leading, spacing:1) - label then 00:00.
       *  Container 72 tall, padding-v 14, content 44 tall:
       *    label baseline at y = 28 + 14 + 13 = 55
       *    time  baseline at y = 28 + 14 + 17 + 1 + 19 = 79
       *  Both use Color.secondary opacity ~ 0.55. */}
      <text
        x="56" y="55"
        fontFamily="-apple-system, system-ui, sans-serif"
        fontSize="13" fontWeight="400"
        fill="rgba(255,255,255,0.55)"
      >
        Not recording
      </text>
      <text
        x="56" y="83"
        fontFamily="-apple-system, system-ui, sans-serif"
        fontSize="22" fontWeight="300"
        fill="rgba(255,255,255,0.55)"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        00:00
      </text>

      {/* Start recording: 280x44, fill #ffffff (Color.primary in dark),
       *  text #1d1d1f (NSColor.windowBackgroundColor in dark).
       *  Red dot + label centred as a single visual group. */}
      <rect
        x="20" y="114" width="280" height="44" rx="8"
        fill="#ffffff"
      />
      <circle cx="118" cy="136" r="4" fill="#d33d4a" />
      <text
        x="130" y="141"
        fontFamily="-apple-system, system-ui, sans-serif"
        fontSize="14" fontWeight="500"
        fill="#1d1d1f"
      >
        Start recording
      </text>

      {/* Hairline separator: padding-v 2 on each side, line at centre y */}
      <line
        x1="20" y1="178" x2="300" y2="178"
        stroke="rgba(255,255,255,0.08)" strokeWidth="1"
      />

      {/* Open library: 280x44, transparent fill, stroke 16% white */}
      <rect
        x="20" y="198" width="280" height="44" rx="8"
        fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1"
      />
      {/* SF Symbols rectangle.stack at HStack(spacing:10) before label */}
      <g
        transform="translate(116, 211)"
        stroke="rgba(255,255,255,0.95)" strokeWidth="1.4"
        fill="none" strokeLinejoin="round"
      >
        <rect x="3" y="0" width="14" height="10" rx="2.5" />
        <rect x="0" y="4" width="14" height="10" rx="2.5" />
      </g>
      <text
        x="138" y="225"
        fontFamily="-apple-system, system-ui, sans-serif"
        fontSize="14" fontWeight="500"
        fill="rgba(255,255,255,0.95)"
      >
        Open library
      </text>

      {/* Quit: 12pt secondary, centred, vertical padding 4 each side */}
      <text
        x="160" y="270"
        textAnchor="middle"
        fontFamily="-apple-system, system-ui, sans-serif"
        fontSize="12" fontWeight="400"
        fill="rgba(255,255,255,0.5)"
      >
        Quit
      </text>
    </svg>
  );
}

/**
 * 04  ----  A small transcript file-card (title + truncated lines) drifts toward a
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

      {/* Notion drop target  ----  dashed outline */}
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
      {/* Small page glyph inside the target  ----  two stacked lines */}
      <rect x="232" y="94" width="44" height="2" rx="1" fill="var(--color-border-strong)" />
      <rect x="232" y="100" width="32" height="2" rx="1" fill="var(--color-border-strong)" />
      <rect x="232" y="106" width="38" height="2" rx="1" fill="var(--color-border-strong)" />

      {/* Transcript card  ----  mid-drag, slightly rotated */}
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

      {/* Dashed accent curve  ----  drag trace, the accent spotlight */}
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
 * 05  ----  Zoom-style 2-tile call grid. Two participants ("Vadym" + "You"),
 * no third "Corder" tile in the call. An off-grid annotation labelled
 * "Corder" with a thin accent hairline points up to the menu-bar area above
 * the grid. The annotation hairline + label is the accent spotlight  ----
 * the picture teaches the absence: Corder lives in the menu bar, not in the
 * participant list.
 *
 * No microphone icons. Participant labels are ASCII initials in coloured
 * speaker chips (purple #5a3aa6 + amber #a16207, the same product-UI palette
 * used in the Hero demo  ----  never used as standalone chrome).
 */
function NoBotGrid() {
  // Google Meet style call canvas with 3 real participants and a
  // visible struck-out 4th tile labelled "Otter Notetaker" - the kind
  // of bot row most meeting tools add to a call. The strike-through +
  // EXCLUDED tag is the accent spotlight. The point lands without copy.
  return (
    <svg
      className="ftr-svg ftr-svg--nobot"
      viewBox="0 0 320 200"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Meet style call grid with three participants and a struck-out bot tile labelled Otter Notetaker excluded"
    >
      {/* Meet top chrome strip */}
      <rect x="0" y="0" width="320" height="14" fill="#202124" />
      <text
        x="10" y="10"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="8"
        fontWeight="500"
        fill="rgba(255,255,255,0.78)"
      >
        Quarterly sync
      </text>
      <circle cx="304" cy="7" r="3" fill="rgba(255,255,255,0.55)" />
      <circle cx="294" cy="7" r="3" fill="rgba(255,255,255,0.55)" />
      <circle cx="284" cy="7" r="3" fill="rgba(255,255,255,0.55)" />

      {/* Call canvas */}
      <rect x="0" y="14" width="320" height="186" fill="#0f1011" />

      {/* Tile 1  ----  Vadym (purple) */}
      <g>
        <rect x="6" y="22" width="152" height="80" rx="6" fill="#1f2123" />
        <circle cx="82" cy="56" r="16" fill="#5a3aa6" />
        <text x="82" y="61" textAnchor="middle" fontFamily="var(--font-sans), system-ui, sans-serif" fontSize="12" fontWeight="600" fill="#ffffff">M</text>
        <rect x="12" y="86" width="44" height="12" rx="2" fill="rgba(0,0,0,0.55)" />
        <text x="17" y="95" fontFamily="var(--font-sans), system-ui, sans-serif" fontSize="8" fontWeight="500" fill="#ffffff">Mike</text>
      </g>

      {/* Tile 2  ----  Marc (amber) */}
      <g>
        <rect x="162" y="22" width="152" height="80" rx="6" fill="#1f2123" />
        <circle cx="238" cy="56" r="16" fill="#a16207" />
        <text x="238" y="61" textAnchor="middle" fontFamily="var(--font-sans), system-ui, sans-serif" fontSize="12" fontWeight="600" fill="#ffffff">M</text>
        <rect x="168" y="86" width="36" height="12" rx="2" fill="rgba(0,0,0,0.55)" />
        <text x="173" y="95" fontFamily="var(--font-sans), system-ui, sans-serif" fontSize="8" fontWeight="500" fill="#ffffff">Mark</text>
      </g>

      {/* Tile 3  ----  You (cool blue) */}
      <g>
        <rect x="6" y="106" width="152" height="80" rx="6" fill="#1f2123" />
        <circle cx="82" cy="140" r="16" fill="#1a73e8" />
        <text x="82" y="145" textAnchor="middle" fontFamily="var(--font-sans), system-ui, sans-serif" fontSize="12" fontWeight="600" fill="#ffffff">Y</text>
        <rect x="12" y="170" width="32" height="12" rx="2" fill="rgba(0,0,0,0.55)" />
        <text x="17" y="179" fontFamily="var(--font-sans), system-ui, sans-serif" fontSize="8" fontWeight="500" fill="#ffffff">You</text>
      </g>

      {/* Tile 4  ----  "Otter Notetaker" bot, struck out (accent spotlight) */}
      <g>
        <rect x="162" y="106" width="152" height="80" rx="6"
          fill="#1f2123"
          stroke="var(--color-accent)"
          strokeWidth="1.4"
          strokeDasharray="4 3" />
        {/* Faded bot avatar */}
        <circle cx="238" cy="140" r="16" fill="#2a2c30" />
        <rect x="232" y="134" width="12" height="12" rx="2" fill="rgba(255,255,255,0.32)" />
        {/* Label */}
        <rect x="168" y="170" width="86" height="12" rx="2" fill="rgba(0,0,0,0.55)" />
        <text x="173" y="179" fontFamily="var(--font-sans), system-ui, sans-serif" fontSize="8" fontWeight="500" fill="rgba(255,255,255,0.55)">Otter Notetaker</text>
        {/* Strike-through line across the whole tile */}
        <line x1="166" y1="186" x2="310" y2="106"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeLinecap="round" />
        {/* "EXCLUDED" accent tag at top of the tile */}
        <rect x="234" y="112" width="74" height="14" rx="3" fill="var(--color-accent)" />
        <text x="271" y="122" textAnchor="middle"
          fontFamily="var(--font-sans), system-ui, sans-serif"
          fontSize="8"
          fontWeight="700"
          letterSpacing="0.6"
          fill="#ffffff">
          EXCLUDED
        </text>
      </g>
    </svg>
  );
}

/**
 * 06  ----  Audio scrubber + one transcript line beneath. The scrubber's
 * accent progress fill (filled portion + playhead handle) is the accent
 * spotlight. The speaker badge "KH" sits in the secondary product-UI palette
 * (purple, scoped to demos), the transcript line is neutral grey.
 *
 * Approximate IBM Plex Sans metrics drive the line geometry; no real text
 * length math, just placeholder rects to keep CLS at zero.
 */
function TranscriptFragment() {
  return (
    <svg
      className="ftr-svg ftr-svg--transcript"
      viewBox="0 0 320 160"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Audio scrubber and one transcript line with a speaker initials badge"
    >
      {/* Card background */}
      <rect x="0" y="0" width="320" height="160" rx="8" fill="var(--color-bg)" stroke="var(--color-border)" strokeWidth="1" />

      {/* ---- Audio scrubber row ---- */}
      {/* Time label left */}
      <text
        x="18" y="42"
        fontFamily="var(--font-mono), ui-monospace, monospace"
        fontSize="10"
        fill="var(--color-text-muted)"
      >
        02:14
      </text>
      {/* Scrubber track  ----  208px wide, full neutral */}
      <rect x="58" y="34" width="208" height="6" rx="3" fill="var(--color-border)" />
      {/* Accent progress fill  ----  ~58% of 208 = 120px (the spotlight) */}
      <rect x="58" y="34" width="120" height="6" rx="3" fill="var(--color-accent)" />
      {/* Playhead handle */}
      <circle cx="178" cy="37" r="6" fill="var(--color-accent)" />
      <circle cx="178" cy="37" r="2.5" fill="#ffffff" />
      {/* Time label right */}
      <text
        x="272" y="42"
        fontFamily="var(--font-mono), ui-monospace, monospace"
        fontSize="10"
        fill="var(--color-text-muted)"
      >
        06:48
      </text>

      {/* Hairline divider between scrubber and transcript */}
      <line x1="18" y1="62" x2="302" y2="62" stroke="var(--color-border)" strokeWidth="1" />

      {/* ---- Transcript line ---- */}
      {/* Speaker badge "KH"  ----  purple chip from product UI palette */}
      <rect x="18" y="82" width="32" height="32" rx="6" fill="#5a3aa6" />
      <text
        x="34" y="103"
        textAnchor="middle"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="12"
        fontWeight="600"
        fill="#ffffff"
      >
        KH
      </text>

      {/* Speaker name + timestamp */}
      <text
        x="62" y="92"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="11"
        fontWeight="600"
        fill="var(--color-text)"
      >
        Kostiantyn
      </text>
      <text
        x="138" y="92"
        fontFamily="var(--font-mono), ui-monospace, monospace"
        fontSize="9"
        fill="var(--color-text-muted)"
      >
        02:14
      </text>

      {/* Snippet text  ----  one short line */}
      <text
        x="62" y="110"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="12"
        fontWeight="400"
        fill="var(--color-text)"
      >
        We can ship the cache by Friday.
      </text>

      {/* Faint second line for body */}
      <rect x="62" y="120" width="180" height="3" rx="1" fill="var(--color-border)" />
      <rect x="62" y="130" width="148" height="3" rx="1" fill="var(--color-border)" />
    </svg>
  );
}

/**
 * 06 -- Language mock. Vertical stack of language rows in their native
 * scripts. The "English" row carries the accent green check + tint as
 * the active UI language; the other rows are present but muted to
 * read as "available". The accent check is the spotlight.
 *
 * Native scripts are NOT punctuation, so they pass the ASCII audit
 * (which only catches em-dash family + curly quotes + bullet etc.).
 */
function LanguageMock() {
  const rows: Array<{ label: string; native: string; active?: boolean }> = [
    { label: "English", native: "English", active: true },
    { label: "Ukrainian", native: "Українська" },
    { label: "German", native: "Deutsch" },
    { label: "Japanese", native: "日本語" },
    { label: "Spanish", native: "Español" },
    { label: "Chinese", native: "中文" },
  ];
  return (
    <svg
      className="ftr-svg ftr-svg--languages"
      viewBox="0 0 320 220"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Language picker showing English active and several other languages available"
    >
      {/* Card background */}
      <rect x="0" y="0" width="320" height="220" rx="10" fill="var(--color-bg)" stroke="var(--color-border)" strokeWidth="1" />

      {/* Header */}
      <text
        x="16" y="22"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="10"
        fontWeight="600"
        letterSpacing="0.6"
        fill="var(--color-text-subtle)"
      >
        INTERFACE
      </text>

      {/* Rows */}
      {rows.map((row, i) => {
        const y = 38 + i * 28;
        const isActive = row.active === true;
        return (
          <g key={row.label}>
            {/* Row background - subtle accent tint for active */}
            {isActive && (
              <rect x="8" y={y} width="304" height="22" rx="6"
                fill="rgba(33, 122, 80, 0.10)" />
            )}
            {/* Status dot / check */}
            {isActive ? (
              <g>
                <circle cx="22" cy={y + 11} r="6" fill="var(--color-accent)" />
                <path d={`M ${22 - 2.5} ${y + 11} l 2 2 l 4 -4`}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round" />
              </g>
            ) : (
              <circle cx="22" cy={y + 11} r="3"
                fill="none"
                stroke="var(--color-border-strong)"
                strokeWidth="1" />
            )}
            {/* Native label */}
            <text
              x="36" y={y + 15}
              fontFamily="var(--font-sans), system-ui, sans-serif"
              fontSize="12"
              fontWeight={isActive ? 600 : 500}
              fill={isActive ? "var(--color-text)" : "var(--color-text-muted)"}
            >
              {row.native}
            </text>
            {/* English name to the right, smaller */}
            <text
              x="304" y={y + 15}
              textAnchor="end"
              fontFamily="var(--font-sans), system-ui, sans-serif"
              fontSize="10"
              fontWeight="400"
              fill="var(--color-text-subtle)"
            >
              {row.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
