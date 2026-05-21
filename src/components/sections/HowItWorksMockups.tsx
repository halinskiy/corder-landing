"use client";

/**
 * HowItWorksMockups -- three full-fidelity Corder UI mockups that swap
 * inside the desktop `.hiw-window-wrap` sticky window as the user
 * scrolls through HowItWorks chapters.
 *
 *  01 Record from anywhere   → <DashboardMock />
 *  02 Have your meeting      → <LibraryMeetingMock />
 *  03 Tune it to your workflow → <SettingsMock />
 *
 * All three reuse the `.hl-*` token base from HeroLibraryDemo.css (so a
 * single `--hl-accent` flip would re-skin them) and the `.how-app` box
 * shell from globals.css. Each mockup adds a narrow set of additional
 * class names under the `.hl-*` prefix:
 *
 *  .hl-dash-*       -- Dashboard column shells + stats card
 *  .hl-set-*        -- Settings right-rail toggle / hotkey rows
 *
 * Every component carries the inspector triple (data-component /
 * data-source / data-tokens) and stays inert (no real handlers -- these
 * are decorative product UI demos).
 */

import type { ReactNode } from "react";

const DATA_SOURCE =
  "projects/corder-landing/src/components/sections/HowItWorksMockups.tsx";

/* ────────────────────────────────────────────────────────────────────
 *  Shared shell -- chrome stays constant, only the inside swaps. The
 *  parent `WindowFrame` paints the macOS titlebar (3 traffic dots) and
 *  this component fills the rest of the .how-window--app box.
 * ──────────────────────────────────────────────────────────────────── */

function MockShell({
  variant,
  children,
  ariaLabel,
}: {
  variant: "dashboard" | "library" | "settings";
  children: ReactNode;
  ariaLabel: string;
}) {
  return (
    <div
      className={`hl-app hl-mock-shell hl-mock-shell--${variant}`}
      data-component={`HowItWorksMockup.${variant}`}
      data-source={DATA_SOURCE}
      data-tokens="hl-bg,hl-border,hl-fg,hl-accent"
      role="img"
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
 *  Shared atoms -- copied 1:1 from HeroLibraryDemo so the mockups paint
 *  exactly the same shape (no double-source-of-truth, just a few small
 *  SVGs that aren't worth exporting from a 1500-line file).
 * ──────────────────────────────────────────────────────────────────── */

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

function DownloadIcon() {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

/* Header strip -- 4 monochrome circular icon pills + hairline + profile
 * avatar. Identical pattern to the hero demo. */
function HeaderActions({ initial }: { initial: string }) {
  return (
    <div className="hl-header-actions" aria-hidden="true">
      <span className="hl-icon-pill">
        <span className="hl-theme-icon-wrap">
          <MoonIcon />
        </span>
      </span>
      <span className="hl-icon-pill">
        <GlobeIcon />
      </span>
      <span className="hl-icon-pill">
        <ArchiveIcon />
      </span>
      <span className="hl-header-divider" />
      <span className="hl-profile-avatar">{initial}</span>
    </div>
  );
}

/* Sidebar meeting card -- keyboard-inert decorative row. */
function MeetingItem({
  title,
  duration,
  preview,
  people,
  active = false,
  failed = false,
}: {
  title: string;
  duration: string;
  preview?: string;
  people?: number;
  active?: boolean;
  failed?: boolean;
}) {
  const cls = ["hl-meeting-item"];
  if (active) cls.push("active");
  if (failed) cls.push("hl-meeting-item--failed");
  return (
    <div className={cls.join(" ")}>
      <div className="hl-meeting-row">
        <div className="hl-meeting-title">{title}</div>
        {people !== undefined && people > 0 && (
          <span className="hl-meeting-people">
            <span>{people}</span>
            <PeopleIcon />
          </span>
        )}
      </div>
      <div className="hl-meeting-meta">
        <span
          className={`hl-status-dot ${failed ? "hl-status-dot--failed" : "ready"}`}
        />
        <span>{duration}</span>
        {failed && <span className="hl-meeting-failed-label">failed</span>}
      </div>
      {preview && <div className="hl-meeting-preview">{preview}</div>}
    </div>
  );
}

/* Quiet recording-indicator blob -- static green orb, no canvas, no
 * animation. Sits in the bottom-right corner of mocks 1 and 3 the same
 * way the real HUD does in the macOS app. */
function StaticBlob() {
  return (
    <span
      className="hl-mock-blob"
      aria-hidden="true"
      data-component="HowItWorksMockup.StaticBlob"
      data-source={DATA_SOURCE}
      data-tokens="hl-accent"
    />
  );
}

/* ════════════════════════════════════════════════════════════════════
 *  01 -- Dashboard mock
 * ════════════════════════════════════════════════════════════════════ */

export function DashboardMock() {
  return (
    <MockShell
      variant="dashboard"
      ariaLabel="Corder Dashboard. Sidebar with recent meetings, Stats with a Ready when you are start card and recording totals, and a Recent rail."
    >
      {/* Sidebar */}
      <aside className="hl-sidebar hl-dash-sidebar" aria-hidden="true">
        <div className="hl-sidebar-titlebar-pad" />
        <div className="hl-sidebar-search">
          <div className="hl-search-field">
            <SearchIcon />
            <input
              type="search"
              placeholder="Search recordings"
              readOnly
              tabIndex={-1}
            />
          </div>
        </div>
        <div className="hl-sidebar-list">
          <div className="hl-sidebar-section-label">Today</div>
          <MeetingItem title="Today, 19:46" duration="16s" active />
          <MeetingItem title="Today, 13:58" duration="5s" />
          <MeetingItem
            title="Testing Corder X100"
            duration="42s"
            people={2}
            preview="Thanks."
          />
          <div className="hl-sidebar-section-label">This week</div>
          <MeetingItem title="May 19, 15:28" duration="30s" />
          <MeetingItem
            title="Postmodernism discussion"
            duration="56s"
            people={2}
            preview="Let us check how it holds up."
          />
          <MeetingItem title="May 19, 14:34" duration="46s" />
          <MeetingItem
            title="Outreach system optimisation"
            duration="6m 31s"
            people={1}
            preview="Right, the question is whether we sell Bosch or"
          />
        </div>
      </aside>

      {/* Main pane -- Dashboard breadcrumb + Stats tab + start card + stats rows */}
      <div className="hl-main hl-dash-main">
        <div className="hl-main-header">
          <div className="hl-breadcrumb">
            <span className="hl-breadcrumb-current">Dashboard</span>
          </div>
          <div className="hl-spacer" />
          <HeaderActions initial="K" />
        </div>

        <div className="hl-dash-detail">
          {/* Tab strip -- Stats active (left), Longest active (right)
             with a small dropdown selector for the sort mode. */}
          <div className="hl-dash-tabs">
            <div className="hl-dash-tab-col hl-dash-tab-col-left">
              <span className="hl-tab active">Stats</span>
            </div>
            <div className="hl-dash-tab-col hl-dash-tab-col-right">
              <span className="hl-tab active">Longest</span>
              <span className="hl-dash-tab-picker" aria-hidden="true">
                <span>All time</span>
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 4.5l3 3 3-3" />
                </svg>
              </span>
            </div>
          </div>

          <div className="hl-dash-body">
            {/* Left column: start card + stats */}
            <div className="hl-dash-left">
              <div className="hl-dash-start-card">
                <div className="hl-dash-start-text">
                  <div className="hl-dash-start-title">Ready when you are.</div>
                  <div className="hl-dash-start-sub">
                    Hit Start in the menu bar, the shortcut, or let Corder catch
                    the call automatically.
                  </div>
                </div>
                <button
                  type="button"
                  className="hl-dash-start-btn"
                  tabIndex={-1}
                >
                  Start recording
                </button>
                <div className="hl-dash-start-hint">
                  or press{" "}
                  <span className="hl-dash-kbd">{"⇧⌘F"}</span>
                </div>
              </div>

              <div className="hl-dash-stats-card">
                <div className="hl-dash-stat-row">
                  <span className="hl-dash-stat-label">Recordings</span>
                  <span className="hl-dash-stat-value">66</span>
                </div>
                <div className="hl-dash-stat-row">
                  <span className="hl-dash-stat-label">Total recorded</span>
                  <span className="hl-dash-stat-value">3h 21m</span>
                </div>
                <div className="hl-dash-stat-row">
                  <span className="hl-dash-stat-label">This week</span>
                  <span className="hl-dash-stat-value">14</span>
                </div>
              </div>
            </div>

            {/* Right column: Recent rail */}
            <div className="hl-dash-recent">
              <RecentCard title="Today, 19:46" duration="16s" />
              <RecentCard title="Today, 13:58" duration="5s" />
              <RecentCard
                title="Testing Corder X100"
                duration="42s, Today, 12:50"
                people={2}
              />
              <RecentCard title="May 19, 15:28" duration="30s" />
              <RecentCard
                title="Postmodernism discussion"
                duration="56s, May 19, 15:14"
                people={2}
              />
              <RecentCard title="May 19, 14:34" duration="46s" />
              <RecentCard
                title="Outreach system optimisation"
                duration="6m 31s, May 15, 14:09"
                people={1}
              />
            </div>
          </div>
        </div>
        <StaticBlob />
      </div>
    </MockShell>
  );
}

function RecentCard({
  title,
  duration,
  people,
}: {
  title: string;
  duration: string;
  people?: number;
}) {
  return (
    <div className="hl-dash-recent-card">
      <div className="hl-dash-recent-title-row">
        <div className="hl-dash-recent-title">{title}</div>
        {people !== undefined && people > 0 && (
          <span className="hl-meeting-people">
            <span>{people}</span>
            <PeopleIcon />
          </span>
        )}
      </div>
      <div className="hl-dash-recent-meta">{duration}</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 *  02 -- Library + Transcript mock
 * ════════════════════════════════════════════════════════════════════ */

export function LibraryMeetingMock() {
  return (
    <MockShell
      variant="library"
      ariaLabel="Corder Library showing the Quarterly review transcript with Anna and Marc, a video preview, audio scrubber, and per-speaker timeline."
    >
      {/* Sidebar */}
      <aside className="hl-sidebar hl-lib-sidebar" aria-hidden="true">
        <div className="hl-sidebar-titlebar-pad" />
        <div className="hl-sidebar-search">
          <div className="hl-search-field">
            <SearchIcon />
            <input
              type="search"
              placeholder="Search recordings"
              readOnly
              tabIndex={-1}
            />
          </div>
        </div>
        <div className="hl-sidebar-list">
          <div className="hl-sidebar-section-label">Today</div>
          <MeetingItem
            title="Quarterly review with Anna and Marc"
            duration="14m 45s"
            people={3}
            preview="Right, let us walk through the numbers from this quarter."
            active
          />
          <MeetingItem
            title="Pricing checkpoint"
            duration="4m 12s"
            people={3}
            preview="The 49 dollar tier still converts above plan."
          />
          <div className="hl-sidebar-section-label">This week</div>
          <MeetingItem
            title="Test audio recording"
            duration="15s"
            failed
          />
          <MeetingItem
            title="Customer interview, J. Patel"
            duration="22m 03s"
            people={2}
            preview="So what made you try Corder in the first place?"
          />
          <MeetingItem
            title="May 14, 14:33"
            duration="6m 44s"
            failed
          />
        </div>
      </aside>

      <div className="hl-main">
        <div className="hl-main-header">
          <div className="hl-breadcrumb">
            <span>Dashboard</span>
            <span aria-hidden>{"›"}</span>
            <span className="hl-breadcrumb-current">
              Quarterly review with Anna and Marc
            </span>
          </div>
          <div className="hl-spacer" />
          <HeaderActions initial="K" />
        </div>

        <div className="hl-detail">
          <div className="hl-detail-tabs">
            <div className="hl-detail-tab-col hl-detail-tab-col-left">
              <span className="hl-tab active">Transcript</span>
              <span className="hl-tab">Summary</span>
            </div>
            <div className="hl-detail-tab-col hl-detail-tab-col-right">
              <span className="hl-tab active">Recording</span>
              <span className="hl-tab">Settings</span>
            </div>
          </div>

          <div className="hl-detail-body">
            <div className="hl-transcript-wrap">
              <div className="hl-transcript-toolbar">
                <div className="hl-search-field">
                  <SearchIcon />
                  <input
                    type="search"
                    placeholder="Search the transcript"
                    readOnly
                    tabIndex={-1}
                  />
                </div>
                <span
                  className="hl-toolbar-icon-btn"
                  aria-hidden="true"
                  data-component="HowItWorksMockup.PeopleFilterButton"
                  data-source={DATA_SOURCE}
                  data-tokens="hl-border-strong,hl-fg-muted"
                >
                  <PersonFilterIcon />
                </span>
                <span
                  className="hl-toolbar-icon-btn"
                  aria-hidden="true"
                  data-component="HowItWorksMockup.CopyAllButton"
                  data-source={DATA_SOURCE}
                  data-tokens="hl-border-strong,hl-fg-muted"
                >
                  <CopyAllIcon />
                </span>
              </div>

              <div className="hl-transcript">
                <SegmentGroup
                  initials="AH"
                  color="var(--hl-speaker-purple)"
                  name="Anna H."
                >
                  Right, let us walk through the numbers from this quarter. We
                  closed twenty-eight new accounts, mostly mid-market.
                </SegmentGroup>
                <SegmentGroup
                  initials="MS"
                  color="var(--hl-speaker-amber)"
                  name="Marc S."
                >
                  That tracks with the pipeline we built in March. Are we still
                  on the forty-nine dollar tier for the smaller teams?
                </SegmentGroup>
                <SegmentGroup
                  initials="I"
                  color="var(--hl-speaker-self)"
                  name="I"
                  isSelf
                >
                  Yes, and conversion on it stayed above plan. I will share the
                  pricing draft right after the call so we can decide on the
                  next round.
                </SegmentGroup>
                <SegmentGroup
                  initials="AH"
                  color="var(--hl-speaker-purple)"
                  name="Anna H."
                >
                  Sounds good. Let us also pin down the next steps for the
                  enterprise pilot before we wrap.
                </SegmentGroup>
              </div>
            </div>

            <div className="hl-right-panel">
              <div
                className="hl-video-card"
                aria-hidden="true"
                data-component="HowItWorksMockup.VideoPreview"
                data-source={DATA_SOURCE}
                data-tokens="hl-border,radius-button"
              >
                <div className="hl-video-frame">
                  <ZoomCallMock />
                  <span className="hl-video-play" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5.5v13c0 .6.7 1 1.2.6l10.4-6.5a.7.7 0 0 0 0-1.2L9.2 4.9C8.7 4.5 8 4.9 8 5.5z" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="hl-audio-controls">
                <span className="hl-audio-btn-primary" aria-hidden="true">
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4 2.5v11c0 .6.7 1 1.2.6l8.4-5.5a.7.7 0 0 0 0-1.2L5.2 1.9C4.7 1.5 4 1.9 4 2.5z" />
                  </svg>
                </span>
                <div className="hl-audio-time">0:00 / 14:45</div>
                <div className="hl-audio-scrub">
                  <div className="hl-audio-scrub-fill hl-audio-scrub-fill--static" />
                </div>
                <span className="hl-audio-download" aria-hidden="true">
                  <DownloadIcon />
                </span>
              </div>

              <div className="hl-timeline-card">
                <div className="hl-timeline-section-label">Timeline</div>
                <div className="hl-tl-bars">
                  <TimelineRow
                    name="Anna H."
                    stats="46%, 6m 47s"
                    color="var(--hl-speaker-purple)"
                    segments={[
                      { left: 4, width: 7 },
                      { left: 13, width: 5 },
                      { left: 20, width: 9 },
                      { left: 32, width: 4 },
                      { left: 38, width: 11 },
                      { left: 56, width: 6 },
                      { left: 70, width: 8 },
                      { left: 82, width: 9 },
                    ]}
                  />
                  <TimelineRow
                    name="Marc S."
                    stats="38%, 5m 36s"
                    color="var(--hl-speaker-amber)"
                    segments={[
                      { left: 6, width: 5 },
                      { left: 14, width: 7 },
                      { left: 24, width: 4 },
                      { left: 36, width: 9 },
                      { left: 50, width: 5 },
                      { left: 60, width: 8 },
                      { left: 74, width: 6 },
                      { left: 88, width: 5 },
                    ]}
                  />
                  <TimelineRow
                    name="I"
                    stats="16%, 2m 22s"
                    color="var(--hl-speaker-self)"
                    segments={[
                      { left: 11, width: 4 },
                      { left: 28, width: 3 },
                      { left: 47, width: 5 },
                      { left: 66, width: 4 },
                      { left: 84, width: 3 },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <StaticBlob />
      </div>
    </MockShell>
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
  children: ReactNode;
  isSelf?: boolean;
}) {
  return (
    <div className="hl-segment-group">
      <div className="hl-segment-head">
        <div
          className={`hl-speaker-avatar${isSelf ? " is-self" : ""}`}
          style={{ background: color }}
        >
          {initials}
        </div>
        <div className="hl-speaker-name">{name}</div>
      </div>
      <div className="hl-segment-paragraph">
        <span className="hl-segment-line">{children}</span>
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

/* ════════════════════════════════════════════════════════════════════
 *  03 -- Settings mock
 * ════════════════════════════════════════════════════════════════════ */

export function SettingsMock() {
  return (
    <MockShell
      variant="settings"
      ariaLabel="Corder transcript with the Settings tab open. System notifications, screen video, auto-transcribe, auto-title, the global hotkey, and Always offer to record."
    >
      {/* Sidebar */}
      <aside className="hl-sidebar hl-set-sidebar" aria-hidden="true">
        <div className="hl-sidebar-titlebar-pad" />
        <div className="hl-sidebar-search">
          <div className="hl-search-field">
            <SearchIcon />
            <input
              type="search"
              placeholder="Search recordings"
              readOnly
              tabIndex={-1}
            />
          </div>
        </div>
        <div className="hl-sidebar-list">
          <MeetingItem title="May 19, 14:34" duration="46s" />
          <MeetingItem
            title="Outreach system optimisation"
            duration="6m 31s"
            people={1}
            preview="Right, the question is whether we sell Bosch or"
          />
          <MeetingItem
            title="Transcription tuning notes"
            duration="38s"
            preview="Auto-transcribe is off by default."
          />
          <MeetingItem
            title="Screen video and call recording"
            duration="2m 04s"
            people={2}
            preview="So we want a video on top of the audio, that is the gist."
            active
          />
          <MeetingItem
            title="Screen recording playback"
            duration="11m 11s"
            failed
          />
          <MeetingItem
            title="Quick audio test"
            duration="1m 32s"
            failed
          />
        </div>
      </aside>

      <div className="hl-main">
        <div className="hl-main-header">
          <div className="hl-breadcrumb">
            <span>Dashboard</span>
            <span aria-hidden>{"›"}</span>
            <span className="hl-breadcrumb-current">
              Screen video and call recording
            </span>
          </div>
          <div className="hl-spacer" />
          <HeaderActions initial="K" />
        </div>

        <div className="hl-detail">
          <div className="hl-detail-tabs">
            <div className="hl-detail-tab-col hl-detail-tab-col-left">
              <span className="hl-tab active">Transcript</span>
              <span className="hl-tab">Summary</span>
            </div>
            <div className="hl-detail-tab-col hl-detail-tab-col-right">
              <span className="hl-tab">Recording</span>
              <span className="hl-tab active">Settings</span>
            </div>
          </div>

          <div className="hl-detail-body">
            <div className="hl-transcript-wrap">
              <div className="hl-transcript-toolbar">
                <div className="hl-search-field">
                  <SearchIcon />
                  <input
                    type="search"
                    placeholder="Search the transcript"
                    readOnly
                    tabIndex={-1}
                  />
                </div>
                <span className="hl-toolbar-icon-btn" aria-hidden="true">
                  <PersonFilterIcon />
                </span>
                <span className="hl-toolbar-icon-btn" aria-hidden="true">
                  <CopyAllIcon />
                </span>
              </div>

              <div className="hl-transcript">
                <SegmentGroup
                  initials="S1"
                  color="var(--hl-speaker-purple)"
                  name="Speaker 1"
                >
                  So we want a video on top of the audio, that is the gist. The
                  question is whether we keep it on by default.
                </SegmentGroup>
                <SegmentGroup
                  initials="S2"
                  color="var(--hl-speaker-amber)"
                  name="Speaker 2"
                >
                  Right, and what about the storage cost. Are we still capping
                  the file at fifteen frames per second.
                </SegmentGroup>
                <SegmentGroup
                  initials="S1"
                  color="var(--hl-speaker-purple)"
                  name="Speaker 1"
                >
                  Yes, fifteen, with HEVC. About one and a half megabits per
                  second, so an hour of meeting sits well under a gigabyte.
                </SegmentGroup>
                <SegmentGroup
                  initials="S2"
                  color="var(--hl-speaker-amber)"
                  name="Speaker 2"
                >
                  Then leave it on by default and let the user switch it off if
                  the laptop drive is tight. That is the right trade.
                </SegmentGroup>
              </div>
            </div>

            {/* Settings rail */}
            <div className="hl-settings-pane hl-set-rail">
              <div className="hl-settings-card">
                <SettingsToggleRow
                  label="System notifications"
                  desc="Notify on recording start, transcript ready, and network loss."
                  on={false}
                />
              </div>
              <div className="hl-settings-card">
                <SettingsToggleRow
                  label="Screen video recording"
                  desc="Save a video of what was on screen during the meeting."
                  on={true}
                />
              </div>
              <div className="hl-settings-card">
                <SettingsToggleRow
                  label="Auto-transcribe"
                  desc="Transcribe the recording automatically after you stop."
                  on={false}
                />
              </div>
              <div className="hl-settings-card">
                <SettingsToggleRow
                  label="Auto-title"
                  desc="Generate a short meeting title from the transcript."
                  on={true}
                />
              </div>
              <div className="hl-settings-card">
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
              </div>
              <div className="hl-settings-card hl-set-card--clipped">
                <div className="hl-settings-applist">
                  <div className="hl-settings-row-label">Always offer to record</div>
                  <div className="hl-settings-row-desc">
                    Apps Corder always offers to record when they take the
                    microphone.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <StaticBlob />
      </div>
    </MockShell>
  );
}

function SettingsToggleRow({
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

/* ════════════════════════════════════════════════════════════════════
 *  Zoom-style call mock -- for the video preview card. Different from
 *  the hero's GoogleMeetMock: two participants (Anna + Marc), darker
 *  blue strip, the user's own tile in the bottom-right.
 * ════════════════════════════════════════════════════════════════════ */

function ZoomCallMock() {
  return (
    <svg
      className="hl-video-mock"
      viewBox="0 0 320 180"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      data-component="HowItWorksMockup.ZoomCallMock"
      data-source={DATA_SOURCE}
      data-tokens="hl-meet-bg,hl-meet-tile"
    >
      <rect width="320" height="180" fill="#1a1a1a" />

      {/* Top-left tile - Anna H. */}
      <rect x="6" y="6" width="151" height="71" rx="6" fill="#2d2d33" />
      <circle cx="81" cy="34" r="14" fill="#5a3aa6" />
      <text
        x="81"
        y="38"
        fontFamily="-apple-system, system-ui, sans-serif"
        fontSize="11"
        fontWeight="600"
        fill="#ffffff"
        textAnchor="middle"
      >
        A
      </text>
      <text
        x="12"
        y="71"
        fontFamily="-apple-system, system-ui, sans-serif"
        fontSize="7"
        fill="#ffffff"
        opacity="0.92"
      >
        Anna H.
      </text>

      {/* Top-right tile - Marc S. */}
      <rect x="163" y="6" width="151" height="71" rx="6" fill="#26262c" />
      <circle cx="238" cy="34" r="14" fill="#a16207" />
      <text
        x="238"
        y="38"
        fontFamily="-apple-system, system-ui, sans-serif"
        fontSize="11"
        fontWeight="600"
        fill="#ffffff"
        textAnchor="middle"
      >
        M
      </text>
      <text
        x="169"
        y="71"
        fontFamily="-apple-system, system-ui, sans-serif"
        fontSize="7"
        fill="#ffffff"
        opacity="0.92"
      >
        Marc S.
      </text>

      {/* Bottom-left tile - presentation share placeholder */}
      <rect x="6" y="83" width="151" height="71" rx="6" fill="#1f1f24" />
      <rect x="20" y="100" width="80" height="6" rx="2" fill="#3a3a40" />
      <rect x="20" y="112" width="120" height="4" rx="2" fill="#3a3a40" />
      <rect x="20" y="122" width="60" height="4" rx="2" fill="#3a3a40" />

      {/* Bottom-right tile - You, with speaker outline */}
      <rect
        x="163"
        y="83"
        width="151"
        height="71"
        rx="6"
        fill="#26262c"
        stroke="#217a50"
        strokeWidth="1.6"
      />
      <circle cx="238" cy="111" r="14" fill="#217a50" />
      <text
        x="238"
        y="115"
        fontFamily="-apple-system, system-ui, sans-serif"
        fontSize="11"
        fontWeight="600"
        fill="#ffffff"
        textAnchor="middle"
      >
        I
      </text>
      <text
        x="169"
        y="148"
        fontFamily="-apple-system, system-ui, sans-serif"
        fontSize="7"
        fill="#ffffff"
        opacity="0.92"
      >
        You
      </text>

      {/* Bottom control strip */}
      <rect x="0" y="160" width="320" height="20" fill="#141414" />
      <circle cx="129" cy="170" r="6" fill="#3f3f44" />
      <circle cx="147" cy="170" r="6" fill="#3f3f44" />
      <circle cx="165" cy="170" r="6" fill="#3f3f44" />
      <circle cx="183" cy="170" r="6" fill="#3f3f44" />
      <rect x="194" y="164" width="18" height="12" rx="6" fill="#b9433a" />
    </svg>
  );
}

/* Dispatcher -- render the correct mockup for a 1-indexed chapter. */
export function ChapterMockup({ chapter }: { chapter: 1 | 2 | 3 }) {
  if (chapter === 1) return <DashboardMock />;
  if (chapter === 2) return <LibraryMeetingMock />;
  return <SettingsMock />;
}
