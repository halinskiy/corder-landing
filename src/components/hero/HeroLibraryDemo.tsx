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
            <span className="hl-segment-line">I will write that up.</span>
          </SegmentGroup>

          <SegmentGroup
            initials="KH"
            color="var(--hl-speaker-purple)"
            name="Kostiantyn Halynskyi"
          >
            <span className="hl-segment-line">What about the timeline?</span>{" "}
            <span className="hl-segment-line">
              We can re-scope and follow up.
            </span>
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

            {/* Single cursor spanning every row. Uses mix-blend-mode:
              * difference so it stays contrasted against the white card,
              * the purple/green/amber segments, and any in-between. */}
            <div className="hl-tl-shared-cursor" aria-hidden="true" />
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
  const activityRef = useRef(0);
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

    const draw = () => {
      const t = (performance.now() - start) / 1000;

      // Smoothly ramp activity toward target (0 or 1) so silent ↔
      // speaking transitions are gradual.
      const target = speakingRef.current ? 1 : 0;
      activityRef.current += (target - activityRef.current) * 0.045;
      const activity = Math.max(0, Math.min(1, activityRef.current));

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

      // Activity-mixed palette (green ↔ red).
      const r = Math.round(lerp(31, 185, activity));   // 0x1f -> 0xb9
      const g = Math.round(lerp(122, 73, activity));   // 0x7a -> 0x49
      const b = Math.round(lerp(80, 65, activity));    // 0x50 -> 0x41
      const haloAlphaOuter = 0.32 + 0.18 * activity;
      const haloAlphaMid   = 0.18 + 0.12 * activity;

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
      const brightR = Math.round(lerp(40, 211, activity));
      const brightG = Math.round(lerp(165, 90, activity));
      const brightB = Math.round(lerp(96, 82, activity));
      grad.addColorStop(0, `rgb(${brightR},${brightG},${brightB})`);
      grad.addColorStop(0.65, `rgb(${r},${g},${b})`);
      const darkR = Math.round(lerp(8, 168, activity));
      const darkG = Math.round(lerp(77, 54, activity));
      const darkB = Math.round(lerp(41, 60, activity));
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
