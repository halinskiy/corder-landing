"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import "./HeroLibraryDemo.css";

const DATA_SOURCE = "projects/corder-landing/src/components/hero/HeroLibraryDemo.tsx";

const TILT_MAX_X = 3;
const TILT_MAX_Y = 4;
const TILT_LIFT = 4;

const TRANSCRIBING_DURATION_MS = 1200;

type DemoMode = "recording" | "transcribing" | "transcript";
type RightTab = "recording" | "settings";
type Theme = "light" | "dark";

export function HeroLibraryDemo() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [reveal, setReveal] = useState<"initial" | "visible" | "reduced">("initial");
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState<DemoMode>("recording");
  const [elapsed, setElapsed] = useState(0);
  // Right-panel tab — Recording (default) shows the audio scrubber +
  // Timeline; Settings shows a stack of decorative setting cards.
  const [rightTab, setRightTab] = useState<RightTab>("recording");
  // Demo-scoped theme. Flips on moon-icon click; never touches the
  // landing's global theme. Applied as `data-theme` on the demo root;
  // every painted surface inside transitions via the universal rule
  // in HeroLibraryDemo.css.
  const [theme, setTheme] = useState<Theme>("light");
  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }, []);

  // Blob "speaking" state is simply derived from mode: red and morphing
  // while recording, green and idle otherwise.
  const isSpeaking = mode === "recording";

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

  // Restart recording from the transcript view: reset elapsed, drop the
  // transcript, kick the blob back into its red speaking state.
  const handleRestartRecording = useCallback(() => {
    if (transcribingTimerRef.current !== null) {
      window.clearTimeout(transcribingTimerRef.current);
      transcribingTimerRef.current = null;
    }
    setElapsed(0);
    setPlaying(false);
    setMode("recording");
  }, []);

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
        data-theme={theme}
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
            rightTab={rightTab}
            onRightTabChange={setRightTab}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        </div>

        {/* Recording-indicator blob — bottom-right corner of the window
          * during recording. Morphs shape, breathes red glow, mirrors the
          * real macOS app's capture indicator. */}
        {/* Always-visible capture indicator. Red + morphing while
          * recording (click stops). Green + idle while a take is being
          * transcribed or already on screen (click starts a new take). */}
        {mode !== "transcribing" && (
          <button
            type="button"
            className="hl-rec-blob"
            aria-label={mode === "recording" ? "Stop recording" : "Start a new recording"}
            onClick={mode === "recording" ? handleStopRecording : handleRestartRecording}
            tabIndex={-1}
          >
            <RecBlobCanvas isSpeaking={isSpeaking} />
          </button>
        )}
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
          title="Investor sync - Vadym + Paul"
          people={3}
          duration="28s"
          preview="He says it is almost there, just a few days left."
          active
        />
        <MeetingItem
          title="Pricing strategy review"
          people={3}
          duration="12m 04s"
          preview="Right, so the next step is to validate it."
        />

        <div className="hl-sidebar-section-label">Yesterday</div>

        <MeetingItem
          title="Customer call: Ana W."
          people={2}
          duration="23s"
          preview="You start recording, say something."
        />
        <MeetingItem
          title="Yesterday, 15:28"
          people={1}
          duration="11s"
          preview="The only problem is that, well, like."
        />

        <div className="hl-sidebar-section-label">This week</div>

        <MeetingItem
          title="Q3 roadmap, eng all-hands"
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
  rightTab,
  onRightTabChange,
  theme,
  onToggleTheme,
}: {
  playing: boolean;
  onTogglePlay: () => void;
  mode: DemoMode;
  elapsedSeconds: number;
  onStopRecording: () => void;
  rightTab: RightTab;
  onRightTabChange: (next: RightTab) => void;
  theme: Theme;
  onToggleTheme: () => void;
}) {
  return (
    <div className="hl-main">
      <div className="hl-main-header">
        <div className="hl-breadcrumb">
          <span>Recordings</span>
          <span aria-hidden>›</span>
          <span className="hl-breadcrumb-current">Investor sync - Vadym + Paul</span>
        </div>

        <div className="hl-spacer" />

        <div
          className="hl-header-actions"
          data-component="HeroLibraryDemo.HeaderActions"
          data-source={DATA_SOURCE}
          data-tokens="hl-border-strong,hl-fg-muted,radius-pill"
        >
          <button
            type="button"
            className="hl-icon-pill"
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            aria-pressed={theme === "dark"}
            onClick={onToggleTheme}
            data-component="HeroLibraryDemo.ThemeToggle"
            data-source={DATA_SOURCE}
            data-tokens="hl-border-strong,hl-fg-muted"
          >
            <span className="hl-theme-icon-wrap" aria-hidden="true">
              <span className="hl-theme-moon"><MoonIcon /></span>
              <span className="hl-theme-sun"><SunIcon /></span>
            </span>
          </button>
          <button
            type="button"
            className="hl-icon-pill"
            aria-label="Language"
            tabIndex={-1}
            data-component="HeroLibraryDemo.LangSwitch"
            data-source={DATA_SOURCE}
            data-tokens="hl-border-strong,hl-fg-muted"
          >
            <GlobeIcon />
          </button>
          <button
            type="button"
            className="hl-icon-pill"
            aria-label="Archive"
            tabIndex={-1}
            data-component="HeroLibraryDemo.ArchiveButton"
            data-source={DATA_SOURCE}
            data-tokens="hl-border-strong,hl-fg-muted"
          >
            <ArchiveIcon />
          </button>
          <span
            className="hl-header-divider"
            aria-hidden="true"
            data-component="HeroLibraryDemo.HeaderDivider"
            data-source={DATA_SOURCE}
            data-tokens="hl-border"
          />
          <span
            className="hl-profile-avatar"
            aria-label="Profile"
            data-component="HeroLibraryDemo.ProfileAvatar"
            data-source={DATA_SOURCE}
            data-tokens="hl-border-strong,hl-fg"
          >
            K
          </span>
        </div>
      </div>

      <div className="hl-detail">
        <div className="hl-detail-tabs">
          <div className="hl-detail-tab-col hl-detail-tab-col-left">
            <span className="hl-tab active">Transcript</span>
          </div>
          <div className="hl-detail-tab-col hl-detail-tab-col-right">
            <button
              type="button"
              className={`hl-tab-btn${rightTab === "recording" ? " active" : ""}`}
              onClick={() => onRightTabChange("recording")}
              aria-pressed={rightTab === "recording"}
              data-component="HeroLibraryDemo.RecordingTab"
              data-source={DATA_SOURCE}
              data-tokens="hl-fg,hl-fg-muted"
            >
              Recording
            </button>
            <button
              type="button"
              className={`hl-tab-btn${rightTab === "settings" ? " active" : ""}`}
              onClick={() => onRightTabChange("settings")}
              aria-pressed={rightTab === "settings"}
              data-component="HeroLibraryDemo.SettingsTab"
              data-source={DATA_SOURCE}
              data-tokens="hl-fg,hl-fg-muted"
            >
              Settings
            </button>
          </div>
        </div>

        <div className="hl-detail-body">
          <Transcript
            mode={mode}
            elapsedSeconds={elapsedSeconds}
            onStopRecording={onStopRecording}
          />
          {rightTab === "recording" ? (
            <RightPanel
              playing={playing}
              onTogglePlay={onTogglePlay}
              mode={mode}
            />
          ) : (
            <SettingsPane />
          )}
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
        <button
          className="hl-toolbar-icon-btn"
          type="button"
          aria-label="Filter by speaker"
          tabIndex={-1}
          data-component="HeroLibraryDemo.PeopleFilterButton"
          data-source={DATA_SOURCE}
          data-tokens="hl-border-strong,hl-fg-muted"
        >
          <PersonFilterIcon />
        </button>
        <button
          className="hl-toolbar-icon-btn"
          type="button"
          aria-label="Copy transcript"
          tabIndex={-1}
          data-component="HeroLibraryDemo.CopyAllButton"
          data-source={DATA_SOURCE}
          data-tokens="hl-border-strong,hl-fg-muted"
        >
          <CopyAllIcon />
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
            <span className="hl-segment-line">
              Right, so the next step is to validate it.
            </span>{" "}
            <span className="hl-segment-line active">
              Let us circle back on Thursday.
            </span>{" "}
            <span className="hl-segment-line">Sounds reasonable.</span>
          </SegmentGroup>

          <SegmentGroup initials="VG" color="var(--hl-accent)" name="Vadym Grosko">
            <span className="hl-segment-line">
              Hmm, let me think about that for a second.
            </span>{" "}
            <span className="hl-segment-line">Good point.</span>{" "}
            <span className="hl-segment-line">
              I will write that up before end of day.
            </span>
          </SegmentGroup>

          <SegmentGroup
            initials="I"
            color="var(--hl-speaker-self)"
            name="I"
            isSelf
          >
            <span className="hl-segment-line">
              Agreed, let me share the pricing draft after the call.
            </span>{" "}
            <span className="hl-segment-line">
              I will keep the plan tight on scope.
            </span>
          </SegmentGroup>

          <SegmentGroup
            initials="KH"
            color="var(--hl-speaker-purple)"
            name="Kostiantyn Halynskyi"
          >
            <span className="hl-segment-line">What about the timeline?</span>{" "}
            <span className="hl-segment-line">
              We can re-scope and follow up next week.
            </span>
          </SegmentGroup>

          <SegmentGroup initials="VG" color="var(--hl-accent)" name="Vadym Grosko">
            <span className="hl-segment-line">
              Let us also document the open questions in the brief.
            </span>{" "}
            <span className="hl-segment-line">
              Otherwise we will keep re-litigating the same points.
            </span>
          </SegmentGroup>

          <SegmentGroup
            initials="I"
            color="var(--hl-speaker-self)"
            name="I"
            isSelf
          >
            <span className="hl-segment-line">
              Fair. I will put the doc in the shared folder tonight.
            </span>{" "}
            <span className="hl-segment-line">
              Should we loop in design before Thursday?
            </span>
          </SegmentGroup>

          <SegmentGroup
            initials="KH"
            color="var(--hl-speaker-purple)"
            name="Kostiantyn Halynskyi"
          >
            <span className="hl-segment-line">
              Yes, send them a heads-up tomorrow morning.
            </span>{" "}
            <span className="hl-segment-line">
              A 30 minute walkthrough should be enough.
            </span>
          </SegmentGroup>

          <SegmentGroup initials="VG" color="var(--hl-accent)" name="Vadym Grosko">
            <span className="hl-segment-line">
              Sounds good. Anything else before we wrap?
            </span>{" "}
            <span className="hl-segment-line">All right, talk Thursday.</span>
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
  isSelf = false,
}: {
  initials: string;
  color: string;
  name: string;
  children: React.ReactNode;
  isSelf?: boolean;
}) {
  return (
    <div className="hl-segment-group">
      <div className="hl-segment-head">
        <div
          className={`hl-speaker-avatar${isSelf ? " is-self" : ""}`}
          style={{ background: color }}
          data-component="HeroLibraryDemo.SpeakerAvatar"
          data-source={DATA_SOURCE}
          data-tokens={isSelf ? "hl-speaker-self" : "hl-speaker-purple,hl-accent"}
        >
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
      {isActive && (
        <div
          className="hl-video-card"
          aria-hidden="true"
          data-component="HeroLibraryDemo.VideoPreview"
          data-source={DATA_SOURCE}
          data-tokens="hl-border,radius-card"
        >
          <div className="hl-video-frame">
            <button
              type="button"
              className="hl-video-play"
              aria-label="Play recording"
              tabIndex={-1}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5.5v13c0 .6.7 1 1.2.6l10.4-6.5a.7.7 0 0 0 0-1.2L9.2 4.9C8.7 4.5 8 4.9 8 5.5z" />
              </svg>
            </button>
          </div>
        </div>
      )}

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
        <button
          className="hl-audio-download"
          type="button"
          aria-label="Download recording"
          tabIndex={-1}
          data-component="HeroLibraryDemo.DownloadButton"
          data-source={DATA_SOURCE}
          data-tokens="hl-border-strong,hl-fg-muted"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      </div>

      <div className="hl-timeline-card" data-disabled={isActive ? "false" : "true"}>
        <div
          className="hl-timeline-section-label"
          data-component="HeroLibraryDemo.TimelineLabel"
          data-source={DATA_SOURCE}
          data-tokens="hl-fg,hl-border"
        >
          Timeline
        </div>

        {isActive ? (
          <div className="hl-tl-bars">
            <TimelineRow
              name="Kostiantyn Halynskyi"
              stats="43%, 1m 58s"
              segments={[
                { left: 5, width: 6 },
                { left: 12, width: 4 },
                { left: 17, width: 9 },
                { left: 27, width: 3 },
                { left: 31, width: 8 },
                { left: 40, width: 5 },
                { left: 58, width: 7 },
                { left: 66, width: 11 },
                { left: 78, width: 5 },
                { left: 84, width: 9 },
              ]}
              color="var(--hl-speaker-purple)"
            />

            <TimelineRow
              name="Vadym Grosko"
              stats="30%, 1m 22s"
              segments={[
                { left: 5, width: 4 },
                { left: 10, width: 8 },
                { left: 19, width: 5 },
                { left: 36, width: 4 },
                { left: 41, width: 10 },
                { left: 52, width: 6 },
                { left: 70, width: 5 },
                { left: 76, width: 7 },
                { left: 90, width: 4 },
              ]}
              color="var(--hl-accent)"
            />

            <TimelineRow
              name="Paul Turner"
              stats="7%, 19s"
              segments={[
                { left: 5, width: 3 },
                { left: 9, width: 2 },
                { left: 46, width: 4 },
                { left: 81, width: 3 },
              ]}
              color="var(--hl-speaker-amber)"
            />
          </div>
        ) : (
          <p className="hl-timeline-empty" aria-hidden="true">
            Speakers appear once transcription finishes.
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Settings pane — right-panel content when the Settings tab is
 * active. Mirrors the real macOS app's SettingsPane (Notifications,
 * Screen video, Auto-transcribe, Auto-title, hotkey, Always offer to
 * record). All toggles are decorative: tabIndex={-1}, no real handler,
 * the visible on/off state is hard-coded per the inventory dossier. */
function SettingsPane() {
  return (
    <div
      className="hl-settings-pane"
      data-component="HeroLibraryDemo.SettingsPane"
      data-source={DATA_SOURCE}
      data-tokens="hl-bg,hl-border,hl-accent,hl-fg,hl-fg-muted"
    >
      <SettingsCard>
        <SettingsToggle
          label="System notifications"
          desc="Notify on recording start, transcript ready, and network loss."
          on={false}
        />
      </SettingsCard>
      <SettingsCard>
        <SettingsToggle
          label="Screen video recording"
          desc="Save a video of what was on screen during the meeting."
          on={true}
        />
      </SettingsCard>
      <SettingsCard>
        <SettingsToggle
          label="Auto-transcribe"
          desc="Transcribe the recording automatically after you stop."
          on={false}
        />
      </SettingsCard>
      <SettingsCard>
        <SettingsToggle
          label="Auto-title"
          desc="Generate a short meeting title from the transcript."
          on={true}
        />
      </SettingsCard>

      <div className="hl-settings-divider" aria-hidden="true" />

      <SettingsCard>
        <div className="hl-settings-hotkey">
          <div className="hl-settings-row-label">Start/stop recording</div>
          <div className="hl-settings-row-desc">
            A global shortcut to quickly start Corder.
          </div>
          <span
            className="hl-settings-hotkey-pill"
            aria-label="Shortcut: Shift Command F"
          >
            {"⇧⌘F"}
          </span>
        </div>
      </SettingsCard>

      <SettingsCard>
        <div className="hl-settings-applist">
          <div className="hl-settings-row-label">Always offer to record</div>
          <div className="hl-settings-row-desc">
            Apps Corder always offers to record when they take the microphone.
          </div>
          <span className="hl-settings-applist-add">Add</span>
        </div>
      </SettingsCard>
    </div>
  );
}

function SettingsCard({ children }: { children: React.ReactNode }) {
  return <div className="hl-settings-card">{children}</div>;
}

function SettingsToggle({
  label,
  desc,
  on,
}: {
  label: string;
  desc: string;
  on: boolean;
}) {
  return (
    <div
      className="hl-settings-row"
      role="switch"
      aria-checked={on}
      aria-label={label}
      tabIndex={-1}
    >
      <div className="hl-settings-row-text">
        <div className="hl-settings-row-label">{label}</div>
        <div className="hl-settings-row-desc">{desc}</div>
      </div>
      <span className={`hl-set-switch${on ? " on" : ""}`} aria-hidden="true">
        <span className="hl-set-switch-thumb" />
      </span>
    </div>
  );
}

function TimelineRow({
  name,
  stats,
  segments,
  color,
}: {
  name: string;
  stats: string;
  segments: ReadonlyArray<{ left: number; width: number }>;
  color: string;
}) {
  return (
    <div className="hl-tl-row">
      <div className="hl-tl-row-head">
        <span className="hl-tl-name">{name}</span>
        <span className="hl-tl-stats">{stats}</span>
      </div>
      <div className="hl-tl-bar">
        {segments.map((s, i) => (
          <div
            key={i}
            className="hl-tl-bar-seg"
            style={{ left: `${s.left}%`, width: `${s.width}%`, background: color }}
          />
        ))}
        {/* Per-row playhead. All three rows share the same animation
          * (same keyframe, same duration, same delay) so they march in
          * lockstep, but the cursor doesn't cross the row-head labels. */}
        <span className="hl-tl-bar-cursor" aria-hidden="true" />
      </div>
    </div>
  );
}

/* ── Recording blob — canvas port of the macOS app's BlobShape ───────
 *
 * 12 polar points; for each frame we lerp between two of four templates
 * (blob → star → hexagon → squircle), add a low-frequency breathing
 * wobble, a high-frequency jitter that fades in with `activity`, and an
 * audio-level boost that rotates around the perimeter so loud frames
 * bulge different sides rather than uniformly inflating. The path is
 * built from quadratic curves through midpoints of consecutive points
 * — gives continuous tangents at every joint. Halo is layered drop
 * shadows on the same context. Identical maths to the Swift version
 * in /Users/3mpq/Corder/Sources/Corder/UI/RecordingHUDPanel.swift. */

const BLOB_POINTS = 12;

const TPL_BLOB     = [1.05, 0.92, 1.02, 0.95, 1.08, 0.94, 0.98, 1.06, 0.92, 1.04, 0.96, 1.00];
const TPL_STAR     = [1.18, 0.62, 1.18, 0.62, 1.18, 0.62, 1.18, 0.62, 1.18, 0.62, 1.18, 0.62];
const TPL_HEXAGON  = [1.05, 0.93, 1.05, 0.93, 1.05, 0.93, 1.05, 0.93, 1.05, 0.93, 1.05, 0.93];
const TPL_SQUIRCLE = [1.10, 0.92, 0.85, 0.92, 1.10, 0.92, 0.85, 0.92, 1.10, 0.92, 0.85, 0.92];

const CYCLE: ReadonlyArray<{ points: number[]; wobbleScale: number }> = [
  { points: TPL_BLOB,     wobbleScale: 1.00 },
  { points: TPL_STAR,     wobbleScale: 0.30 },
  { points: TPL_HEXAGON,  wobbleScale: 0.45 },
  { points: TPL_SQUIRCLE, wobbleScale: 0.45 },
];
const CYCLE_DURATION_SEC = 4.0;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function RecBlobCanvas({ isSpeaking }: { isSpeaking: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Start at the idle floor so the very first frame after mount is
  // already a breathing green blob, not a static circle that "wakes
  // up" over the first few hundred ms.
  const activityRef = useRef(0.38);
  const speakingRef = useRef(isSpeaking);
  speakingRef.current = isSpeaking;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cssSize = 110;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = cssSize * dpr;
    canvas.height = cssSize * dpr;
    canvas.style.width = `${cssSize}px`;
    canvas.style.height = `${cssSize}px`;
    ctx.scale(dpr, dpr);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const cx = cssSize / 2;
    const cy = cssSize / 2;
    const baseRadius = (43 / 2) * 0.78;

    let raf = 0;
    const start = performance.now();

    // Activity drives both shape-morphing strength and the green ->
    // red colour mix. The "activity" axis is independent of the
    // "vitality" axis: even at activity 0 (idle green) the blob still
    // breathes and slowly morphs through templates. Without this floor
    // the idle blob reads as frozen (the user reported "застыл").
    const IDLE_FLOOR = 0.35;
    // Colour mix is what flips green<->red. Keep it sharp so red only
    // shows up while recording.
    const colorActivityFor = (a: number) => {
      // Subtract the floor and renormalise so colour stays in [0,1]
      // mapped to "not speaking" -> "speaking".
      return Math.max(0, Math.min(1, (a - IDLE_FLOOR) / (1 - IDLE_FLOOR)));
    };

    const draw = () => {
      const t = (performance.now() - start) / 1000;

      // Smoothly ramp activity toward target. Target lands at the idle
      // floor when not speaking so morph and breathing never freeze.
      const target = speakingRef.current ? 1 : IDLE_FLOOR;
      activityRef.current += (target - activityRef.current) * 0.045;
      const activity = Math.max(0, Math.min(1, activityRef.current));
      const colorMix = colorActivityFor(activity);

      // Simulated audio level: a slow sine + a higher-frequency
      // micro-burst, gated by activity. Mirrors real meter readings.
      const simLevel = activity * (
        0.18 +
        0.16 * (0.5 + 0.5 * Math.sin(t * 5.7)) +
        0.10 * Math.abs(Math.sin(t * 13.1))
      );

      // Where in the cycle are we?
      const phase = (t % CYCLE_DURATION_SEC) / CYCLE_DURATION_SEC;
      const scaled = phase * CYCLE.length;
      const idx = Math.floor(scaled) % CYCLE.length;
      const nextIdx = (idx + 1) % CYCLE.length;
      let local = scaled - Math.floor(scaled);
      local = local * local * (3 - 2 * local); // smoothstep

      const from = CYCLE[idx];
      const to = CYCLE[nextIdx];
      const wobbleScaleMorphed = lerp(from.wobbleScale, to.wobbleScale, local);
      const wobbleAmplitude = 0.2 + 0.8 * activity;

      const points: Array<[number, number]> = [];
      for (let i = 0; i < BLOB_POINTS; i++) {
        const angle = (i / BLOB_POINTS) * 2 * Math.PI - Math.PI / 2;
        const morphedR = lerp(from.points[i], to.points[i], local);
        const staticR = TPL_BLOB[i];
        const baseR = lerp(staticR, morphedR, activity);

        const phase1 = t * 1.6 + i * 0.71;
        const phase2 = t * 2.7 + i * 1.23;
        const baseWobble = (Math.sin(phase1) * 0.05 + Math.sin(phase2) * 0.03)
          * wobbleScaleMorphed * wobbleAmplitude;

        const jitterPhase1 = t * 7.5 + i * 1.13;
        const jitterPhase2 = t * 13.1 + i * 2.37;
        const jitter = (Math.sin(jitterPhase1) * 0.07 + Math.sin(jitterPhase2) * 0.05) * activity;
        const wobble = baseWobble + jitter;

        const levelPhase = Math.sin(t * 2.1 + i * 1.2);
        const levelBoost = simLevel * 0.55 * (0.5 + 0.5 * levelPhase);

        const r = baseRadius * (baseR + wobble + levelBoost);
        points.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]);
      }

      // Build the quadratic-through-midpoints path.
      const buildPath = () => {
        ctx.beginPath();
        const last = points[BLOB_POINTS - 1];
        const first = points[0];
        ctx.moveTo((last[0] + first[0]) / 2, (last[1] + first[1]) / 2);
        for (let i = 0; i < BLOB_POINTS; i++) {
          const p = points[i];
          const n = points[(i + 1) % BLOB_POINTS];
          const mid: [number, number] = [(p[0] + n[0]) / 2, (p[1] + n[1]) / 2];
          ctx.quadraticCurveTo(p[0], p[1], mid[0], mid[1]);
        }
        ctx.closePath();
      };

      // Palette mixes green -> red using colorMix (gated by "really
      // speaking", not the baseline idle activity). This keeps the
      // green idle state from drifting toward red just because the
      // shape is morphing in place.
      const r = Math.round(lerp(31, 185, colorMix));   // 0x1f -> 0xb9
      const g = Math.round(lerp(122, 73, colorMix));   // 0x7a -> 0x49
      const b = Math.round(lerp(80, 65, colorMix));    // 0x50 -> 0x41
      const haloAlphaOuter = 0.32 + 0.18 * colorMix;
      const haloAlphaMid   = 0.18 + 0.12 * colorMix;

      ctx.clearRect(0, 0, cssSize, cssSize);

      // Halo layers via blurred shadow draws of the same path.
      buildPath();
      ctx.save();
      ctx.shadowColor = `rgba(${r},${g},${b},${haloAlphaOuter})`;
      ctx.shadowBlur = 32 + 8 * simLevel;
      ctx.fillStyle = `rgba(${r},${g},${b},1)`;
      ctx.fill();
      ctx.restore();

      buildPath();
      ctx.save();
      ctx.shadowColor = `rgba(${r},${g},${b},${haloAlphaMid})`;
      ctx.shadowBlur = 14 + 4 * simLevel;
      ctx.fillStyle = `rgba(${r},${g},${b},1)`;
      ctx.fill();
      ctx.restore();

      // Main fill — radial gradient with a slight off-centre highlight.
      buildPath();
      const grad = ctx.createRadialGradient(cx - 4, cy - 6, 4, cx, cy, baseRadius * 1.4);
      const brightR = Math.round(lerp(40, 211, colorMix));
      const brightG = Math.round(lerp(165, 90, colorMix));
      const brightB = Math.round(lerp(96, 82, colorMix));
      grad.addColorStop(0, `rgb(${brightR},${brightG},${brightB})`);
      grad.addColorStop(0.65, `rgb(${r},${g},${b})`);
      const darkR = Math.round(lerp(8, 168, colorMix));
      const darkG = Math.round(lerp(77, 54, colorMix));
      const darkB = Math.round(lerp(41, 60, colorMix));
      grad.addColorStop(1, `rgb(${darkR},${darkG},${darkB})`);
      ctx.fillStyle = grad;
      ctx.fill();

      // Subtle top-down white highlight stroke.
      buildPath();
      const strokeGrad = ctx.createLinearGradient(cx, cy - baseRadius, cx, cy + baseRadius);
      strokeGrad.addColorStop(0, "rgba(255,255,255,0.32)");
      strokeGrad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = strokeGrad;
      ctx.lineWidth = 1;
      ctx.stroke();

      if (!reduced) {
        raf = requestAnimationFrame(draw);
      }
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} className="hl-rec-blob__canvas" aria-hidden="true" />;
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

function MoonIcon() {
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
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
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
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m4.93 19.07 1.41-1.41" />
      <path d="m17.66 6.34 1.41-1.41" />
    </svg>
  );
}

function ArchiveIcon() {
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
      <rect x="2" y="4" width="20" height="5" rx="1" />
      <path d="M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9" />
      <line x1="10" y1="13" x2="14" y2="13" />
    </svg>
  );
}

function PersonFilterIcon() {
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
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
    </svg>
  );
}

function CopyAllIcon() {
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
