"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import "./HeroLibraryDemo.css";

const DATA_SOURCE = "projects/corder-landing/src/components/hero/HeroLibraryDemo.tsx";

const TILT_MAX_X = 3;
const TILT_MAX_Y = 4;
const TILT_LIFT = 4;

const TRANSCRIBING_DURATION_MS = 1200;

type DemoMode = "recording" | "transcribing" | "transcript";

export function HeroLibraryDemo() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [reveal, setReveal] = useState<"initial" | "visible" | "reduced">("initial");
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState<DemoMode>("recording");
  const [elapsed, setElapsed] = useState(0);

  // Live timer for the recording state — ticks once per second, frozen
  // when the user clicks Stop.
  useEffect(() => {
    if (mode !== "recording") return;
    const id = window.setInterval(() => {
      setElapsed((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [mode]);

  const transcribingTimerRef = useRef<number | null>(null);
  const handleStopRecording = useCallback(() => {
    setMode("transcribing");
    if (transcribingTimerRef.current !== null) {
      window.clearTimeout(transcribingTimerRef.current);
    }
    transcribingTimerRef.current = window.setTimeout(() => {
      setMode("transcript");
      transcribingTimerRef.current = null;
    }, TRANSCRIBING_DURATION_MS);
  }, []);

  // Auto-stop the recording after 2 minutes if the user hasn't pressed Stop —
  // keeps the demo from sitting in a forever-recording state for tab-leavers.
  useEffect(() => {
    if (mode !== "recording") return;
    const id = window.setTimeout(() => {
      handleStopRecording();
    }, 120_000);
    return () => window.clearTimeout(id);
  }, [mode, handleStopRecording]);

  useEffect(() => {
    return () => {
      if (transcribingTimerRef.current !== null) {
        window.clearTimeout(transcribingTimerRef.current);
      }
    };
  }, []);

  // S1 reveal — runs once on mount, respects reduced-motion.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setReveal("reduced");
      return;
    }
    const id = window.requestAnimationFrame(() => {
      setReveal("visible");
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  // S3 hover tilt — pointer-driven 3D, vanilla JS, single rAF tick at a time.
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let targetRX = 0;
    let targetRY = 0;
    let targetLift = 0;
    let curRX = 0;
    let curRY = 0;
    let curLift = 0;

    const onPointerMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      targetRY = Math.max(-1, Math.min(1, dx)) * TILT_MAX_Y;
      targetRX = -Math.max(-1, Math.min(1, dy)) * TILT_MAX_X;
      targetLift = TILT_LIFT;
      schedule();
    };

    const onPointerLeave = () => {
      targetRX = 0;
      targetRY = 0;
      targetLift = 0;
      schedule();
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(tick);
    };

    const tick = () => {
      frame = 0;
      curRX += (targetRX - curRX) * 0.18;
      curRY += (targetRY - curRY) * 0.18;
      curLift += (targetLift - curLift) * 0.18;
      el.style.transform = `perspective(1600px) rotateX(${curRX.toFixed(2)}deg) rotateY(${curRY.toFixed(2)}deg) translateY(${(-curLift).toFixed(2)}px)`;
      const dxLeft = Math.abs(targetRX - curRX);
      const dxRight = Math.abs(targetRY - curRY);
      const dxLift = Math.abs(targetLift - curLift);
      if (dxLeft + dxRight + dxLift > 0.05) {
        schedule();
      } else if (targetRX === 0 && targetRY === 0 && targetLift === 0) {
        el.style.transform = "";
      }
    };

    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerleave", onPointerLeave);
    return () => {
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
      if (frame) window.cancelAnimationFrame(frame);
      el.style.transform = "";
    };
  }, [reveal]);

  return (
    <div
      className="hero-art"
      data-component="HeroArt"
      data-source={DATA_SOURCE}
      data-tokens="radius-window,color-border-strong,color-surface,ease-out"
    >
      <div
        ref={cardRef}
        className="hero-library-demo"
        data-component="HeroLibraryDemo"
        data-source={DATA_SOURCE}
        data-tokens="hl-bg,hl-border,hl-accent,hl-status-ready,radius-window"
        data-reveal={reveal}
        data-playing={playing ? "true" : "false"}
        role="img"
        aria-label="Corder Library window with transcript and per-speaker timeline"
      >
        <div className="hl-titlebar" aria-hidden="true">
          <span className="hl-traffic close" />
          <span className="hl-traffic minimize" />
          <span className="hl-traffic maximize" />
        </div>

        <div className="hl-app">
          <Sidebar />
          <Main
            playing={playing}
            onTogglePlay={() => setPlaying((p) => !p)}
            mode={mode}
            elapsedSeconds={elapsed}
            onStopRecording={handleStopRecording}
          />
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
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

        <div className="hl-sidebar-section-label">This week</div>

        <MeetingItem
          title="May 1, 16:20"
          people={3}
          duration="40m 00s"
          preview="Right, so the next step is to validate it."
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

function Main({
  playing,
  onTogglePlay,
  mode,
  elapsedSeconds,
  onStopRecording,
}: {
  playing: boolean;
  onTogglePlay: () => void;
  mode: DemoMode;
  elapsedSeconds: number;
  onStopRecording: () => void;
}) {
  return (
    <div className="hl-main">
      <div className="hl-main-header">
        <div className="hl-breadcrumb">
          <span>Recordings</span>
          <span aria-hidden>›</span>
          <span className="hl-breadcrumb-current">Today, 17:09</span>
        </div>

        <button
          className="hl-boost-switch"
          type="button"
          aria-pressed="false"
          aria-label="Boost off"
          data-on="false"
          tabIndex={-1}
        >
          <span className="hl-boost-track">
            <span className="hl-boost-thumb" />
          </span>
          <span>Boost</span>
        </button>

        <div className="hl-spacer" />

        <div className="hl-toolbar" aria-hidden="true">
          <button type="button" tabIndex={-1}>
            <GlobeIcon />
            EN
          </button>
          <button type="button" tabIndex={-1}>
            <CopyIcon />
            Copy
          </button>
          <button type="button" tabIndex={-1}>
            <TrashIcon />
            Delete
          </button>
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
          <Transcript
            mode={mode}
            elapsedSeconds={elapsedSeconds}
            onStopRecording={onStopRecording}
          />
          <RightPanel
            playing={playing}
            onTogglePlay={onTogglePlay}
            mode={mode}
          />
        </div>
      </div>
    </div>
  );
}

function Transcript({
  mode,
  elapsedSeconds,
  onStopRecording,
}: {
  mode: DemoMode;
  elapsedSeconds: number;
  onStopRecording: () => void;
}) {
  const minutes = Math.floor(elapsedSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");

  return (
    <div className="hl-transcript-wrap">
      <div className="hl-transcript-toolbar">
        <div className="hl-search-field">
          <SearchIcon />
          <input type="search" placeholder="Search the transcript" readOnly tabIndex={-1} />
        </div>
        <button className="hl-toolbar-icon-btn" type="button" aria-label="Speakers" tabIndex={-1}>
          <SpeakersIcon />
        </button>
      </div>

      {mode === "recording" && (
        <div className="hl-rec-banner" role="status" aria-live="polite">
          <div className="hl-rec-banner-row">
            <span className="hl-rec-dot hl-rec-dot--on" />
            <div className="hl-rec-text">
              <div className="hl-rec-label">
                Recording <span className="hl-rec-aside">(not really)</span>
              </div>
              <div className="hl-rec-time">{`${minutes}:${seconds}`}</div>
            </div>
          </div>
          <button
            className="hl-rec-stop"
            onClick={onStopRecording}
            type="button"
          >
            <span className="hl-rec-stop-square" />
            Stop recording
          </button>
        </div>
      )}

      {mode === "transcribing" && (
        <div
          className="hl-rec-banner hl-rec-banner--transcribing"
          role="status"
          aria-live="polite"
        >
          <div className="hl-rec-banner-row">
            <span className="hl-rec-dot hl-rec-dot--transcribing" />
            <div className="hl-rec-text">
              <div className="hl-rec-label">Transcribing…</div>
            </div>
          </div>
        </div>
      )}

      {mode === "transcript" && (
        <div className="hl-transcript" data-revealing="true">
          <SegmentGroup
            initials="KH"
            color="var(--hl-speaker-purple)"
            name="Kostiantyn Halynskyi"
          >
            Right, so the next step is to validate it.{" "}
            <span className="hl-segment-line active">
              Let us circle back on Thursday.
            </span>{" "}
            Sounds reasonable.
          </SegmentGroup>

          <SegmentGroup initials="VG" color="var(--hl-accent)" name="Vadym Grosko">
            Hmm, let me think about that for a second. Good point. I will write that
            up.
          </SegmentGroup>

          <SegmentGroup
            initials="KH"
            color="var(--hl-speaker-purple)"
            name="Kostiantyn Halynskyi"
          >
            What about the timeline? We can re-scope and follow up.
          </SegmentGroup>
        </div>
      )}
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

function RightPanel({
  playing,
  onTogglePlay,
  mode,
}: {
  playing: boolean;
  onTogglePlay: () => void;
  mode: DemoMode;
}) {
  const isActive = mode === "transcript";

  return (
    <div className="hl-right-panel">
      <div className="hl-audio-controls">
        <button
          className="hl-audio-btn-primary"
          type="button"
          aria-label={playing ? "Pause" : "Play"}
          aria-pressed={playing}
          onClick={isActive ? onTogglePlay : undefined}
          data-disabled={isActive ? "false" : "true"}
          tabIndex={isActive ? 0 : -1}
        >
          <svg
            className="hl-icon-play"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M4 2.5v11c0 .6.7 1 1.2.6l8.4-5.5a.7.7 0 0 0 0-1.2L5.2 1.9C4.7 1.5 4 1.9 4 2.5z" />
          </svg>
          <svg
            className="hl-icon-pause"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <rect x="4" y="2.5" width="3" height="11" rx="0.8" />
            <rect x="9" y="2.5" width="3" height="11" rx="0.8" />
          </svg>
        </button>
        <div className="hl-audio-time">
          {isActive ? "0:14 / 4:32" : "0:00 / 0:00"}
        </div>
        <div className="hl-audio-scrub" data-disabled={isActive ? "false" : "true"}>
          <div className="hl-audio-scrub-fill" />
        </div>
        {!isActive && (
          <button
            className="hl-audio-download"
            type="button"
            aria-label="Download recording"
            tabIndex={-1}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        )}
      </div>

      <div className="hl-timeline-card" data-disabled={isActive ? "false" : "true"}>
        <div className="hl-timeline-tabs">
          <span className="hl-timeline-tab active">Timeline</span>
        </div>

        <TimelineRow
          name="Kostiantyn Halynskyi"
          stats="43%, 1m 58s"
          ticks={[3, 5, 7, 9, 11, 13, 15, 18, 30, 32, 34, 36, 38, 40, 42, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82]}
          color="var(--hl-speaker-purple)"
          showCursor={isActive}
        />

        <TimelineRow
          name="Vadym Grosko"
          stats="7%, 17s"
          ticks={[23, 25, 27, 50, 52, 54, 88, 90, 92]}
          color="var(--hl-accent)"
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
}: {
  name: string;
  stats: string;
  ticks: number[];
  color: string;
  showCursor?: boolean;
}) {
  return (
    <div className="hl-tl-row">
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

function GlobeIcon() {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function CopyIcon() {
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
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function TrashIcon() {
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
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function SpeakersIcon() {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
