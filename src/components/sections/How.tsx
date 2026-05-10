"use client";

import { useEffect, useRef, useState } from "react";

import { copy, type HowLiveDemo } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/How.tsx";

type StepNumber = "01" | "02" | "03" | "04";

/**
 * Section 4 — How it works (the 4 things that actually matter).
 *
 * Sticky panel on the LEFT renders **real Corder app UI** for each pillar —
 * not invented mocks. Components are ported 1:1 from
 * `~/Corder/Web/src/components/` with the `.hl-*` token namespace shared
 * with the hero so visual language stays consistent.
 *
 * Pillars (replace the earlier "click flow" steps):
 *   01 — No bot in your call.            -> Library window: sidebar of meetings
 *                                           + transcript panel. Real UI, no Zoom mock.
 *   02 — Granola-grade transcript.       -> Transcript pane + RightPanel
 *                                           (audio scrubber + per-speaker timeline).
 *   03 — Re-transcribe is free.          -> SpeakersClarifyBanner (real component)
 *                                           sitting above a transcript fragment.
 *   04 — No subscription. BYO Gemini.    -> Menu-bar popover with Stop button +
 *                                           cost-math typographic block.
 *
 * Desktop (lg+): LEFT column sticks at top:96px. RIGHT column scrolls 4 chapter
 * blocks; an IntersectionObserver picks the most-visible chapter and CSS
 * cross-fades the four panels via `data-active-step`.
 *
 * Mobile (< lg): sticky disabled; each chapter renders its panel inline above
 * the copy as a static state.
 */
export function How() {
  const { how } = copy;
  const [activeStep, setActiveStep] = useState<StepNumber>("01");
  const chaptersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = chaptersRef.current;
    if (!root) return;

    const chapters = Array.from(
      root.querySelectorAll<HTMLElement>("[data-step]"),
    );
    if (chapters.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;

        const viewportCentre = window.innerHeight / 2;
        let best = visible[0];
        let bestDist = Math.abs(
          best.boundingClientRect.top + best.boundingClientRect.height / 2 - viewportCentre,
        );
        for (const e of visible.slice(1)) {
          const d = Math.abs(
            e.boundingClientRect.top + e.boundingClientRect.height / 2 - viewportCentre,
          );
          if (d < bestDist) {
            best = e;
            bestDist = d;
          }
        }
        const step = best.target.getAttribute("data-step") as StepNumber | null;
        if (step) setActiveStep(step);
      },
      {
        rootMargin: "-35% 0px -35% 0px",
        threshold: [0, 0.5, 1],
      },
    );

    chapters.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="how"
      data-component="How"
      data-source={DATA_SOURCE}
      data-tokens="color-text,color-text-muted,color-border,color-accent,radius-window,font-serif"
      className="relative w-full"
    >
      <div className="page-container py-24 md:py-32">
        <div className="how-grid">
          {/* LEFT: sticky live-UI */}
          <div className="how-sticky">
            <HowWindow activeStep={activeStep} />
          </div>

          {/* RIGHT: scroll chapters */}
          <div ref={chaptersRef}>
            {how.steps.map((step) => (
              <div
                key={step.number}
                data-step={step.number}
                className="how-chapter"
                data-component="HowChapter"
                data-source={DATA_SOURCE}
                data-tokens="font-serif,color-accent,color-text,color-text-muted,color-border"
              >
                <p className="how-chapter__number">{step.number}</p>
                <h3 className="how-chapter__heading">{step.heading}</h3>
                <p className="how-chapter__body">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/*  HowWindow — frame chrome + 4 real-Corder panels keyed by step          */
/* ---------------------------------------------------------------------- */

function HowWindow({ activeStep }: { activeStep: StepNumber }) {
  return (
    <div
      className="how-window hero-library-demo how-window--app"
      data-component="HowWindow"
      data-source={DATA_SOURCE}
      data-tokens="hl-bg,hl-border-strong,radius-window,ease-out"
      data-active-step={activeStep}
      role="img"
      aria-label="Corder app demonstrating the current pillar"
    >
      <div className="hl-titlebar" aria-hidden="true">
        <span className="hl-traffic close" />
        <span className="hl-traffic minimize" />
        <span className="hl-traffic maximize" />
      </div>

      {/* Step 01 — Library window: sidebar + main pane (no bot, just Mac UI) */}
      <div className="how-step-pane" data-step="01">
        <NoBotPanel />
      </div>

      {/* Step 02 — Transcript pane + RightPanel (dual-track quality) */}
      <div className="how-step-pane" data-step="02">
        <TranscriptDualTrackPanel />
      </div>

      {/* Step 03 — SpeakersClarifyBanner above transcript (free re-transcribe) */}
      <div className="how-step-pane" data-step="03">
        <ClarifyPanel />
      </div>

      {/* Step 04 — Menu-bar popover + cost-math (BYO Gemini, no subscription) */}
      <div className="how-step-pane" data-step="04">
        <ByokPanel />
      </div>
    </div>
  );
}

/* ====================================================================== */
/*  Pillar 01 — NoBotPanel                                                 */
/*  Real Corder Library window: sidebar + main pane with transcript.       */
/*  No participant tile mock, no Zoom strip. Just the actual UI.           */
/* ====================================================================== */

function NoBotPanel() {
  return (
    <div className="how-app">
      <SidebarMock />
      <div className="hl-main">
        <div className="hl-main-header">
          <div className="hl-breadcrumb">
            <span>Recordings</span>
            <span aria-hidden>›</span>
            <span className="hl-breadcrumb-current">Today, 17:09</span>
          </div>
          <div className="hl-spacer" />
          <div className="hl-toolbar" aria-hidden="true">
            <button type="button" tabIndex={-1}>EN</button>
            <button type="button" tabIndex={-1}>Copy</button>
          </div>
        </div>
        <div className="hl-detail">
          <div className="hl-detail-tabs">
            <div className="hl-detail-tab-col hl-detail-tab-col-left">
              <span className="hl-tab active">Transcript</span>
            </div>
            <div className="hl-detail-tab-col hl-detail-tab-col-right">
              <span className="hl-tab active">Recording</span>
            </div>
          </div>
          <div className="hl-detail-body">
            <TranscriptShort />
            <RightPanelStatic playing={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====================================================================== */
/*  Pillar 02 — TranscriptDualTrackPanel                                   */
/*  Same Library, but no sidebar so the transcript and per-speaker         */
/*  timeline get full breathing room. Adds a tiny mic/system → Gemini      */
/*  diagram label above the transcript so the dual-track story is read.    */
/* ====================================================================== */

function TranscriptDualTrackPanel() {
  return (
    <div className="how-app how-app--main-only">
      <div className="hl-main">
        <div className="hl-main-header">
          <div className="hl-breadcrumb">
            <span>Recordings</span>
            <span aria-hidden>›</span>
            <span className="hl-breadcrumb-current">Today, 17:09</span>
          </div>
          <div className="hl-spacer" />
          <div className="how-pipeline" aria-hidden="true">
            <span className="how-pipeline__chip how-pipeline__chip--mic">mic.wav</span>
            <span className="how-pipeline__arrow">→</span>
            <span className="how-pipeline__chip how-pipeline__chip--system">system.wav</span>
            <span className="how-pipeline__arrow">→</span>
            <span className="how-pipeline__chip how-pipeline__chip--out">Gemini, merged</span>
          </div>
        </div>
        <div className="hl-detail">
          <div className="hl-detail-tabs">
            <div className="hl-detail-tab-col hl-detail-tab-col-left">
              <span className="hl-tab active">Transcript</span>
            </div>
            <div className="hl-detail-tab-col hl-detail-tab-col-right">
              <span className="hl-tab active">Recording</span>
            </div>
          </div>
          <div className="hl-detail-body">
            <TranscriptShort />
            <RightPanelStatic playing={true} highlightSpeaker="purple" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====================================================================== */
/*  Pillar 03 — ClarifyPanel                                               */
/*  Real SpeakersClarifyBanner ported 1:1 from                             */
/*  ~/Corder/Web/src/components/SpeakersClarifyBanner.tsx, sitting at the  */
/*  top of the transcript pane. The "2" pill is .active because that's     */
/*  the user's current selection. Below: a fragment of re-mapped speakers. */
/* ====================================================================== */

function ClarifyPanel() {
  const options: Array<{ key: string; label: string; active?: boolean }> = [
    { key: "just_me", label: "Just me" },
    { key: "2", label: "2", active: true },
    { key: "3", label: "3" },
    { key: "4", label: "4+" },
  ];

  return (
    <div className="how-app how-app--main-only">
      <div className="hl-main">
        <div className="hl-main-header">
          <div className="hl-breadcrumb">
            <span>Recordings</span>
            <span aria-hidden>›</span>
            <span className="hl-breadcrumb-current">Today, 17:09</span>
          </div>
          <div className="hl-spacer" />
          <span className="how-cache-tag" aria-hidden="true">
            <span className="how-cache-tag__dot" />
            cached locally, 0 API calls
          </span>
        </div>
        <div className="hl-detail">
          <div className="hl-detail-tabs">
            <div className="hl-detail-tab-col hl-detail-tab-col-left">
              <span className="hl-tab active">Transcript</span>
            </div>
            <div className="hl-detail-tab-col hl-detail-tab-col-right">
              <span className="hl-tab active">Recording</span>
            </div>
          </div>
          <div className="hl-detail-body">
            <div className="hl-transcript-wrap">
              <div className="hl-clarify-banner" role="status">
                <button
                  className="hl-clarify-dismiss"
                  type="button"
                  aria-label="Dismiss"
                  tabIndex={-1}
                >
                  <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M3 3l8 8M11 3l-8 8" />
                  </svg>
                </button>
                <div className="hl-clarify-text">
                  <div className="hl-clarify-body">How many people were on the call?</div>
                </div>
                <div className="hl-clarify-actions">
                  {options.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      tabIndex={-1}
                      className={`hl-clarify-btn${opt.active ? " active" : ""}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="hl-transcript hl-transcript--clarify-context" data-revealing="true">
                <SegmentGroup
                  initials="KH"
                  color="var(--hl-speaker-purple)"
                  name="Kostiantyn Halynskyi"
                >
                  Right, so the next step is to validate it. Let us circle back on Thursday.
                </SegmentGroup>
                <SegmentGroup
                  initials="VG"
                  color="var(--hl-accent)"
                  name="Vadym Grosko"
                >
                  Hmm, let me think about that for a second. Good point.
                </SegmentGroup>
              </div>
            </div>
            <RightPanelStatic playing={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====================================================================== */
/*  Pillar 04 — ByokPanel                                                  */
/*  macOS menu-bar fragment + Stop popover (reusing the .hl-rec-stop look) */
/*  + typographic price math (numbers oversize). No subscription, no SaaS. */
/* ====================================================================== */

function ByokPanel() {
  return (
    <div className="how-byok">
      <div className="how-byok__menubar" aria-hidden="true">
        <span className="how-byok__menubar-left">
          <span className="how-byok__apple">●</span>
          <span className="how-byok__menubar-faint">Library</span>
          <span className="how-byok__menubar-faint">Edit</span>
        </span>
        <span className="how-byok__menubar-right">
          <span className="how-byok__corder-icon">
            <span className="how-byok__corder-dot" />
          </span>
          <span className="how-byok__menubar-faint">14:32</span>
        </span>
      </div>

      <div className="how-byok__popover" role="dialog" aria-label="Recording controls">
        <div className="how-byok__popover-header">
          <span className="how-byok__popover-eyebrow">Recording</span>
          <span className="how-byok__popover-time">04:17</span>
        </div>
        <button type="button" className="how-byok__stop" tabIndex={-1}>
          <span className="how-byok__stop-square" />
          Stop recording
        </button>
        <div className="how-byok__popover-meta">
          <span>Gemini 2.5 Flash</span>
          <span className="how-byok__popover-dot" aria-hidden="true" />
          <span>Your API key</span>
        </div>
      </div>

      <div className="how-byok__math" aria-label="Cost math">
        <p className="how-byok__math-eyebrow">Your bill from Google</p>
        <p className="how-byok__math-line">
          <span className="how-byok__math-num">$0.30</span>
          <span className="how-byok__math-unit">/ hour</span>
        </p>
        <p className="how-byok__math-line how-byok__math-line--mid">
          <span className="how-byok__math-num">×</span>
          <span className="how-byok__math-unit">30 hours of meetings</span>
        </p>
        <p className="how-byok__math-line how-byok__math-line--total">
          <span className="how-byok__math-num">= $9.00</span>
          <span className="how-byok__math-unit">/ month</span>
        </p>
        <p className="how-byok__math-foot">
          Granola charges $14 to $35. Otter, $17 to $30. Read.ai, $15 to $40.
        </p>
      </div>
    </div>
  );
}

/* ====================================================================== */
/*  Sub-components — sidebar list, transcript groups, RightPanel           */
/*  (Ported 1:1 from HeroLibraryDemo for visual consistency.)              */
/* ====================================================================== */

function SidebarMock() {
  return (
    <aside className="hl-sidebar" aria-hidden="true">
      <div className="hl-sidebar-titlebar-pad" />
      <div className="hl-sidebar-search">
        <div className="hl-search-field">
          <SearchIcon />
          <input type="search" placeholder="Search recordings" readOnly tabIndex={-1} />
        </div>
      </div>
      <div className="hl-sidebar-list">
        <div className="hl-sidebar-section-label">Today</div>
        <MeetingItem
          title="Today, 17:09"
          people={2}
          duration="28s"
          preview="He says it is almost there, just a few days left."
          active
        />
        <MeetingItem
          title="Today, 16:20"
          people={3}
          duration="12m 04s"
          preview="Right, so the next step is to validate it."
        />
        <div className="hl-sidebar-section-label">Yesterday</div>
        <MeetingItem
          title="Yesterday, 18:51"
          people={2}
          duration="23s"
          preview="You start recording, say something."
        />
        <MeetingItem
          title="Yesterday, 17:00"
          people={1}
          duration="11s"
          preview="The only problem is that, well, like."
        />
      </div>
    </aside>
  );
}

function MeetingItem({
  title,
  people,
  duration,
  preview,
  active = false,
}: {
  title: string;
  people: number;
  duration: string;
  preview: string;
  active?: boolean;
}) {
  return (
    <div className={`hl-meeting-item${active ? " active" : ""}`}>
      <div className="hl-meeting-row">
        <div className="hl-meeting-title">{title}</div>
        <span className="hl-meeting-people">
          <span>{people}</span>
          <PeopleIcon />
        </span>
      </div>
      <div className="hl-meeting-meta">
        <span className="hl-status-dot ready" />
        <span>{duration}</span>
      </div>
      <div className="hl-meeting-preview">{preview}</div>
    </div>
  );
}

function TranscriptShort() {
  return (
    <div className="hl-transcript-wrap">
      <div className="hl-transcript-toolbar">
        <div className="hl-search-field">
          <SearchIcon />
          <input type="search" placeholder="Search the transcript" readOnly tabIndex={-1} />
        </div>
      </div>
      <div className="hl-transcript" data-revealing="true">
        <SegmentGroup
          initials="KH"
          color="var(--hl-speaker-purple)"
          name="Kostiantyn Halynskyi"
        >
          Right, so the next step is to validate it.{" "}
          <span className="hl-segment-line active">Let us circle back on Thursday.</span>{" "}
          Sounds reasonable.
        </SegmentGroup>
        <SegmentGroup initials="VG" color="var(--hl-accent)" name="Vadym Grosko">
          Hmm, let me think about that for a second. Good point.
        </SegmentGroup>
      </div>
    </div>
  );
}

function SegmentGroup({
  initials,
  color,
  name,
  children,
}: {
  initials: string;
  color: string;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div className="hl-segment-group">
      <div className="hl-segment-head">
        <div className="hl-speaker-avatar" style={{ background: color }}>
          {initials}
        </div>
        <div className="hl-speaker-name">{name}</div>
      </div>
      <div className="hl-segment-paragraph">{children}</div>
    </div>
  );
}

/**
 * RightPanelStatic — audio scrubber + per-speaker timeline. Static state
 * (no React state, no event wires) because How panels are read-only.
 */
function RightPanelStatic({
  playing,
  highlightSpeaker,
}: {
  playing: boolean;
  highlightSpeaker?: "purple" | "green";
}) {
  return (
    <div className="hl-right-panel">
      <div className="hl-audio-controls">
        <button
          type="button"
          className="hl-audio-btn-primary"
          aria-label={playing ? "Pause" : "Play"}
          aria-pressed={playing}
          data-disabled="false"
          tabIndex={-1}
        >
          <svg
            className="hl-icon-play"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M4 2.5v11c0 .6.7 1 1.2.6l8.4-5.5a.7.7 0 0 0 0-1.2L5.2 1.9C4.7 1.5 4 1.9 4 2.5z" />
          </svg>
        </button>
        <div className="hl-audio-time">{playing ? "0:14 / 4:32" : "0:00 / 4:32"}</div>
        <div className="hl-audio-scrub" data-disabled="false">
          <div className="hl-audio-scrub-fill" style={{ width: playing ? "12%" : "0%" }} />
        </div>
      </div>

      <div className="hl-timeline-card" data-disabled="false">
        <div className="hl-timeline-tabs">
          <span className="hl-timeline-tab active">Timeline</span>
        </div>

        <TimelineRow
          name="Kostiantyn Halynskyi"
          stats="43%, 1m 58s"
          ticks={[3, 5, 7, 9, 11, 13, 15, 18, 30, 32, 34, 36, 38, 40, 42, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82]}
          color="var(--hl-speaker-purple)"
          showCursor={playing}
          glow={highlightSpeaker === "purple"}
        />

        <TimelineRow
          name="Vadym Grosko"
          stats="7%, 17s"
          ticks={[23, 25, 27, 50, 52, 54, 88, 90, 92]}
          color="var(--hl-accent)"
          glow={highlightSpeaker === "green"}
        />
      </div>
    </div>
  );
}

function TimelineRow({
  name,
  stats,
  ticks,
  color,
  showCursor = false,
  glow = false,
}: {
  name: string;
  stats: string;
  ticks: number[];
  color: string;
  showCursor?: boolean;
  glow?: boolean;
}) {
  return (
    <div className={`hl-tl-row${glow ? " hl-tl-row--glow" : ""}`}>
      <div className="hl-tl-row-head">
        <span className="hl-tl-name">{name}</span>
        <span className="hl-tl-stats">{stats}</span>
      </div>
      <div className="hl-tl-bar">
        {ticks.map((left, i) => (
          <div
            key={i}
            className="hl-tl-bar-tick"
            style={{ left: `${left}%`, background: color }}
          />
        ))}
        {showCursor && <div className="hl-tl-bar-cursor" />}
      </div>
    </div>
  );
}

/* ── Icons ─────────────────────────────────────────────────── */

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="6" cy="3.5" r="2.2" />
      <path d="M1.5 11c0-2.3 2-4 4.5-4s4.5 1.7 4.5 4v0.5h-9V11z" />
    </svg>
  );
}

// Touch the type so the `HowLiveDemo` import isn't dead weight when visual
// demos are referenced indirectly via step.liveDemo elsewhere.
export type HowDemoKey = HowLiveDemo;
