# corder-landing — Changelog

Dated log of changes to this project. Write an entry every session, even short ones.

Format:
```
## YYYY-MM-DD — Session N
- {what changed}
- {what was decided}
- {what's next}
```

---

## 2026-05-21 -- Features section: AUTO-DETECT redrawn, AUDIO + RE-RUN replaced (branch `feat/hero-v090`)

Single follow-up commit on `feat/hero-v090`. User flagged that the previous
AUDIO ("No driver install required") and RE-RUN ("Re-run for free") cells
didn't matter to the target audience, and that the AUTO-DETECT illustration
looked invented. Three cell swaps in one atomic commit:

- **Cell 03 AUTO-DETECT (visual redrawn).** Heading kept ("Catches the
  meeting first"). `visualHint` changed from `menu-bar-capsule` to
  `popover-widget`. Body changed from "Menu bar asks when Zoom opens. One
  tap to start." to "Menu bar widget, always one click away." -- now
  describes what the picture actually shows (the real popover, not a
  hypothetical notification). New `PopoverWidget` SVG is a faithful mock
  of the IDLE state of `Sources/Corder/UI/PopoverContentView.swift`:
  dark 280x240 card, IdleStatus row (10px grey dot + "Not recording" +
  monospaced "00:00"), light "Start recording" primary button with a
  red 8x8 dot, hairline separator, outlined "Open library" secondary
  with a `rectangle.stack`-style two-squircle icon, and a small grey
  "Quit" link at the bottom. Geometry follows the Swift source
  (`.padding(20)`, `.frame(width: 320)`, spacing 18, radius 8 on inner
  rows, radius 14 on the card).
- **Cell 05 was AUDIO, now NO-BOT.** Heading: "No bot joins the call".
  Body empty (the heading carries the whole message). `visualHint`:
  `no-bot-grid`. New `NoBotGrid` SVG: 320x200 dark canvas with a
  14px menu-bar strip on top, two participant tiles ("V" purple, "Y"
  amber), "2 in this call" caption, and an off-grid accent annotation
  with a hairline elbow pointing from the menu-bar status area to a
  label reading "CORDER LIVES HERE". The annotation teaches the absence
  -- Corder is not in the call, it lives in the menu bar.
- **Cell 06 was RE-RUN, now TRANSCRIPT.** Heading: "Transcript next
  to audio". Body: "Scrub the audio. The line follows." `visualHint`:
  `transcript-fragment`. New `TranscriptFragment` SVG: 320x160 light
  card. Audio scrubber on top (208px track, accent fill at ~58%, accent
  playhead handle, monospaced `02:14` and `06:48` time labels). One
  transcript line beneath with a purple "KH" speaker badge, speaker
  name + monospaced timestamp, and snippet "We can ship the cache by
  Friday." with two faint placeholder lines.

Single accent role per cell (the spotlight):
- Timeline -- the playhead dot
- Screen frame -- the centre play button
- AUTO-DETECT popover -- the dropdown caret anchor at the top (signals
  "this widget lives in the menu bar"). Decision logged in DECISIONS.md
  2026-05-21: the Start-recording dot stays RED (product fidelity, red
  = recording state in the real app); accent green would mislead.
- Drag gesture -- the dashed curve + arrowhead
- NO-BOT -- the annotation hairline + "CORDER LIVES HERE" label
- TRANSCRIPT -- the scrubber's accent progress fill + playhead handle

INTEGRATIONS was considered for the second open slot but skipped: per
`research/corder-feature-inventory-2026-05.md` section 10, the in-app
Integrations card currently says "Soon" and points users at the profile
menu. Promising integrations as a feature would risk vapour, and the
DRAG cell at position 4 already carries the integrations story for
v0.9.0 (drag transcripts out to Notion / Obsidian / Apple Notes).
Documented in DECISIONS.md.

Three new `visualHint` keys: `popover-widget`, `no-bot-grid`,
`transcript-fragment`. Three old keys retired: `menu-bar-capsule`,
`audio-sound-row`, `version-sequence`. Three old SVG components removed
from `Features.tsx`: `MenuBarCapsule`, `AudioSoundRow`, `VersionSequence`.
Three new SVG components added: `PopoverWidget`, `NoBotGrid`,
`TranscriptFragment`. The `versionSequence` JSON field is no longer
referenced by any cell but the type stays optional in `copy.ts` to keep
the diff surgical -- editorial cleanup pass can remove it later.

`.ftr-svg--menubar` and `.ftr-svg--versions` rules removed from
`globals.css`; replaced with `.ftr-svg--popover` and `.ftr-svg--nobot`
(both pinned to transparent background since they paint their own
dark fill).

Files in the diff:
- `src/components/sections/Features.tsx` (rewrite of three visual
  components + three new switch cases, three cases removed)
- `src/app/globals.css` (4 line delta in the `.ftr-svg--*` block)
- `content/copy.json` (three cell entries updated)
- `CHANGELOG.md` (this entry)
- `DECISIONS.md` (red-dot fidelity, integrations-skip, popover caret as
  spotlight)
- `HANDOFF.md` (Features section table updated)
- `RETRO.md` (soldier entry)

ASCII clean: zero hits across the diff for
`[\x{2010}-\x{2015}\x{2018}-\x{201F}\x{2022}\x{00B7}\x{00A7}]`.

Verification:
- `npm run typecheck` -- exit 0
- Playwright screenshot via CDP: viewport at 1440x900 @ 2x DPR,
  scrolled to `#features`. All 6 cells render, all 6
  `FeatureVisual.*` data-components present in the DOM:
  `MiniTimelineFragment`, `ScreenVideoFrame`, `PopoverWidget`,
  `DragOutGesture`, `NoBotGrid`, `TranscriptFragment`. Screenshots
  saved at:
  `screenshots/features-popover-nobot-transcript.png` (viewport)
  `screenshots/features-popover-nobot-transcript-full.png` (full
  Features section)

Awaiting judge review.

---

## 2026-05-21 — Features cells get inline-SVG illustrations (branch `feat/hero-v090`)

Single follow-up commit on `feat/hero-v090`. Six cells in the Features section
now render proper SVG mocks instead of typographic gestures. Style follows the
hero's `GoogleMeetMock` (commit `6d358fd`): inline `<svg>` per case, viewBox
driven, ASCII text only, project tokens via CSS variables so the mocks track
theme without hard-coded greys.

Files in the diff:
- `src/components/sections/Features.tsx` (full rewrite of `FeatureVisual`)
- `src/app/globals.css` (`.ftr-svg` wrapper rules, 8 lines added)
- `content/copy.json` (visualHint values for cells 02 -- 05 updated)

Six visualHint cases:
- `mini-timeline-fragment` (polished): two horizontal speaker rows; Vadym
  with purple `#5a3aa6` ticks, Kostiantyn with neutral grey ticks; a single
  accent-green playhead dot on the Vadym row. Time scale `00:00 -- 12:40`.
- `screen-video-frame` (new): 16:9 dark `#202124` frame with mock window
  chrome (traffic-light dots, code-line stripes); centred accent-green play
  button overlay. No microphone glyph anywhere.
- `menu-bar-capsule` (new): macOS top strip + a notification card reading
  `CORDER / Zoom is open. Record?`. Outlined neutral `Skip` pill + solid
  accent-green `Record` pill with a small white indicator dot.
- `drag-out-gesture` (new): transcript card titled `Investor call` with 4
  truncated lines, rotated -4 degrees as if mid-drag, connected by an
  accent-green dashed curve to a dashed `Notion / Drop here` target.
- `audio-sound-row` (new): macOS-Sound-preferences row list. Two inactive
  rows (`MacBook microphone` with a `BUILT-IN` tag, `External display`);
  the selected `Corder` row carries an accent-green left border, accent-tint
  background wash, filled accent radio dot, and a `CoreAudio process tap`
  caption beneath.
- `version-sequence` (polished): `Flash 2.5 -> Flash 3 -> Pro 4`. The middle
  chip ("current model") carries the accent outline + accent-subtle fill.
  Chip widths now computed from label length so the row stays balanced.

Single accent role per cell (the spotlight, mapped per the brief):
- Timeline -- the playhead dot
- Screen frame -- the centre play button
- Menu bar -- the `Record` pill
- Drag gesture -- the dashed curve + arrowhead
- Audio list -- the selected `Corder` row's left border + radio dot
- Version sequence -- the middle chip's outline + fill

ASCII clean: zero hits across the diff for
`[\x{2010}-\x{2015}\x{2018}-\x{201F}\x{2022}\x{00B7}\x{00A7}]`. ASCII `->`
used inside the version row, never the typographic arrow.

Verification:
- `npm run typecheck` exit 0.
- Headless Chrome 1440x900 dpr=2 screenshot at
  `screenshots/features-svg-illustrations.png` (viewport) +
  `screenshots/features-svg-full.png` (full Features section). DOM
  introspection: 6 `.feature-cell` nodes, 6 distinct `FeatureVisual.*`
  data-components present.

Decisions:
- `monoPath` field on cells 02 and 05 is now unused. Left it in `copy.json`
  as-is on the cell shape (we removed cell-level usage by switching their
  visualHint), but the only cells that still carry it are gone -- a future
  cleanup pass can drop the field from the cell type. Kept this session
  surgically scoped.
- `feature-mark` / `feature-pro-pill` / `feature-mono` / `feature-version-row`
  CSS classes are now unused by the rewritten `FeatureVisual`. Left in
  `globals.css` for one session in case judge wants a side-by-side compare;
  delete in the next housekeeping pass.

Next: judge review on `feat/hero-v090`.

---

## 2026-05-20 — Hero `HeroLibraryDemo` polish pass (branch `feat/hero-v090`)

Single follow-up commit on `feat/hero-v090` (parent `48e8902`) addressing six
issues the user flagged on the v0.9.0 demo. All changes scoped to
`src/components/hero/HeroLibraryDemo.{tsx,css}`; no new dependencies.

- **Theme toggle.** Moon icon in the window header is now a real toggle.
  Click flips a demo-local `theme: "light" | "dark"` state. Applied as
  `data-theme` on `.hero-library-demo` root; every painted surface inside
  the demo crossfades via a universal `*` rule (240 ms doctrine easing,
  properties: bg-color / color / border-color / fill / stroke /
  box-shadow / opacity). Sun icon swaps in for the moon via paired
  opacity. Dark token palette mirrors the real macOS Corder
  `.dark` block from `~/Corder/Web/src/styles.css`. Reduced motion /
  `?motion=0` reduces all transitions to 0 ms — theme still flips,
  just instantly.
- **Settings tab.** Tabs in the right column are real buttons. Clicking
  `Settings` swaps the right panel from the Recording content (audio
  scrubber + Timeline) to a `SettingsPane`: six framed `SoloCard`s
  matching the inventory dossier (System notifications OFF, Screen
  video recording ON, Auto-transcribe OFF, Auto-title ON, Start/stop
  recording hotkey pill `⇧⌘F`, Always offer to record). Toggles are
  decorative — `tabIndex={-1}`, no state. Stacks vertically, scrolls if
  the panel overflows.
- **Breadcrumb font.** 13 px -> 15 px with line-height 1.3. Header
  strip `min-height: 64px` unchanged so the lift comes purely from
  font size + tighter leading.
- **Taller window.** Aspect ratio 1180/620 -> 1180/720 so the full
  Timeline section (label + three speaker rows) is visible without
  scrolling the Recording pane. Tablet collapse 16/11 -> 4/3 to mirror.
- **Scrollable transcript.** `.hl-transcript` flipped to
  `overflow-y: auto` with a thin webkit/firefox scrollbar. Dialog
  expanded from 4 turns to 8 (KH / VG / I alternating). Stagger reveal
  delays extended through child 8.
- **Restored blob animation.** Added `IDLE_FLOOR = 0.35` so the blob's
  shape morph + breathing wobble play continuously even when not
  speaking (previously activity decayed to 0 and the green idle blob
  read as frozen). Colour mix split off (`colorMix`) so red only kicks
  in while actually recording. Initial `activityRef` 0.38 so the very
  first painted frame is already mid-breath, not a cold circle.
- **Token hygiene.** Replaced 6 hardcoded hex values
  (`#b8b8b4`, `#ececea`, `#dcdcd9`, `#e8e8e5`, `#e8e8e6`, `#dff1e5`,
  `#cfe7da`, `#d8d8d4`) with `--hl-*` tokens so dark theme paints
  correctly. Hover borders use `--hl-fg-dim`; active line uses
  `color-mix(in srgb, var(--hl-accent), transparent)`. Audio scrub
  track gets a dark-only override to `--hl-bg-active` for sufficient
  contrast under dark.

JS gzip (page chunk only): 11253 -> 12254 bytes (+1001 bytes). First
Load JS gzip total: 112222 -> 113223 bytes (+1001). Framework + shared
chunks unchanged at 100969 bytes — the page-local cost of the theme
state + SettingsPane + extra dialogue is the +1 kB.

## 2026-05-20 — Hero `HeroLibraryDemo` updated to Corder v0.9.0 (branch `feat/hero-v090`)

Same screen, just updated to match the live macOS app v0.9.0 shipped on
2026-05-17. Sourced exclusively from §0.5 of
`research/corder-feature-inventory-2026-05.md` (the canonical diff table
of v0.9.0 vs the landing). No layout redesign — every change is an
addition or in-place replacement inside the existing window chrome.

**Header chrome.** Removed the `hl-boost-switch` block (Boost was retired
in 0.9.0 — `text_boost` / `btn_boost` i18n keys are dead) and the three
text-labelled `EN` / `Copy` / `Delete` buttons. Replaced with a strip of
four icon-only round buttons:
1. Theme toggle (moon glyph — the current light theme means the icon is
   the "switch to dark" affordance).
2. Language picker (globe glyph).
3. Archive (file-box glyph).
4. 1px vertical hairline divider.
5. Profile avatar — circular 28px, neutral fill, single-letter `K`.

All four are `aria-hidden="true"` + `tabIndex={-1}` — this is a static
demo, not real controls.

**Breadcrumb + sidebar.** Static date-stamp `Today, 17:09` replaced with
the Gemini-style auto-title `Investor sync - Vadym + Paul`. Sidebar
meeting titles auto-titled (`Investor sync - Vadym + Paul`, `Pricing
strategy review`, `Customer call: Ana W.`, `Q3 roadmap, eng all-hands`)
with **one date-stamp fallback** kept (`Yesterday, 15:28`) to demonstrate
the unnamed-recording case.

**Transcript toolbar.** Replaced the single text-labelled `Speakers`
button with two icon-only circular buttons: people-filter (single-person
glyph) + copy-all (overlapping-squares glyph). Both 32x32 hairline-bordered,
sit to the right of the search field.

**Right-panel tabs.** Added a `Settings` tab next to the existing
`Recording` tab. Active state still on `Recording`; `Settings` is rendered
but inactive (clicking it does nothing — decoration only). Matches the
0.9.0 two-tab strip in the real app.

**Recording tab content additions.**
- **Timeline demoted from a top-level tab to a section label** inside the
  Recording tab, sitting between the audio scrubber and the per-speaker
  bars. CSS class `.hl-timeline-section-label` replaces the old
  `.hl-timeline-tabs` / `.hl-timeline-tab.active` pair.
- **Video preview card** added ABOVE the audio scrubber when the demo is
  in `transcript` mode. 16:9 dark rectangle with a centred white play
  overlay button (~44px round). Pure static — no actual video element,
  no source loading, no decode hit.
- **Download icon-button** now visible in all states (was previously only
  shown when `!isActive`). Sits to the right of the scrubber, aligned
  with the play button. Still `tabIndex={-1}`, decorative.
- **Per-speaker bars** kept the striped temporal-activity visual (not the
  solid-bar variant — the inventory notes both exist, the striped one
  reads richer in a hero demo).

**Self-speaker entry.** Added one transcript group labelled `I` with a
single-letter amber avatar (`--hl-speaker-self: #a16207`), demonstrating
the first-person-self speaker recognition from 0.9.0. The other speakers
(Kostiantyn Halynskyi, Vadym Grosko) keep their two-letter avatars in
the existing speaker-colour palette. Amber `#a16207` is documented in
`DECISIONS.md` as a **speaker-colour token, NOT a brand accent** — same
pattern as the existing purple `--hl-speaker-purple` used inside the
demo without leaking into landing tokens.

**What's preserved unchanged:**
- 3D pointer-driven tilt on the window.
- Recording blob (free-floating canvas, bottom-right of the window).
- All three demo modes (recording / transcribing / transcript) and the
  transitions between them.
- Elapsed-time counter, auto-stop at 2min, restart-from-transcript flow.
- Reduced-motion handling.
- Traffic lights, base window styling, dimensions.
- `data-component` / `data-source` / `data-tokens` triple on every
  existing element. New elements all carry the triple.

**Constraints honoured:**
- ASCII only — separator is `-`, not em-dash.
- Single brand accent `#217a50`.
- No microphone icons.
- No new dependencies.

**Build:**
- `npm run typecheck` exit 0.
- `npm run build` exit 0. Route `/` 23.7 kB (parsed), First Load JS
  178 kB gzip total (vs ~175 kB prior — +3 kB for the new icons + video
  card markup + CSS, well under the 80 kB-per-page-chunk ceiling and a
  rounding-error change at total-bundle level).
- Visual acceptance verified on `/?motion=0`, 1440px desktop, 375px
  mobile. Zero console errors. Video preview card only renders when
  `mode === "transcript"`, hidden during recording / transcribing as
  intended.

**Next:** judge review. After PASSED, branch merges into
`feat/background-decor` (or wherever the merge gate is). Commit only on
this branch; no push, no deploy.

---

## 2026-05-20 — CorderPresence: third state (form) + Newsletter section removed

- **Third morph state** added to `CorderPresence.tsx`. The orb (state B) now
  expands into a contact card (state C) when the user reaches a new
  `CorderPresenceFormSentinel` placed where the Newsletter section used to
  sit (between Faq and Footer). All three states share
  `layoutId="corder-presence"`; framer-motion interpolates width, height,
  border-radius, and position automatically.
- Form: 380x440 desktop, `min(92vw, 360px)` mobile. Same neutral bg,
  hairline border, 12px radius. Heading/subhead/email input/Subscribe
  button, all sourced from `copy.json#newsletter`. Submits to a local
  success state (no backend yet — matches old Newsletter behaviour).
- **Newsletter section removed.** `src/components/sections/Newsletter.tsx`
  deleted. `import` + render in `src/app/page.tsx` removed along with the
  adjacent `<hr className="section-divider" />`. 14 `.newsletter*` rules
  stripped from `src/app/globals.css` and replaced with a `.presence-static`
  block of the same shape — used only by the reduced-motion fallback section.
- **Reduced-motion path:** when `prefers-reduced-motion: reduce` OR
  `?motion=0` is set, the orb/form chain is suppressed (a fixed-corner
  morph without animation is intrusive and pointless). Instead,
  `CorderPresenceStaticSection` mounts inline between Faq and Footer with
  the same form content, so the subscribe affordance is preserved.
- `copy.json#newsletter` block kept with a `_note` field documenting that
  it now powers `CorderPresenceForm` + `CorderPresenceStaticSection`.
- `npm run typecheck` exit 0. `npm run build` exit 0, page First Load JS
  23.3 kB (was 31.2 kB before this iter, ceiling 80 kB). Section count
  dropped by one, hence the size dip.
- ASCII audit on all touched files: zero new violations of the typographic
  dash/bullet/middle-dot character class.
- Decision: in reduced-motion mode we render an inline section rather than
  a corner-pinned static card. A non-animated fixed-position card with no
  scroll relationship is pure visual noise. See `DECISIONS.md` for the full
  rationale.
- Next: judge reviews via CDP harness on `localhost:3050`. Single atomic
  commit on `feat/background-decor`.

---

## 2026-05-10 — How section: false-alarm CSS verification

- Parent agent forwarded user report: «How sticky panel рендерит Corder UI без стилей, всё в одну колонку голым текстом, sticky не реагирует на скролл».
- **No code changes made.** Verified empirically via CDP probe + headless screenshots that current `How.tsx` and `globals.css` render correctly:
  - `.how-window` already carries `hero-library-demo` class → all `--hl-*` CSS variables resolve.
  - `.how-app` is `display: grid; grid-template-columns: 200px 1fr` → sidebar + main pane laid out properly.
  - `.hl-sidebar`, `.hl-meeting-item`, `.hl-search-field`, `.hl-speaker-avatar`, `.hl-tl-bar` all render with intended styling.
  - `.how-sticky` computed `position: sticky; top: 96px` ✓.
  - IntersectionObserver flips `data-active-step` correctly 01 → 02 → 03 → 04 as we scroll through chapters.
- Root cause of user's broken screenshot: stale HMR cache on dev server after large `globals.css` edits in prior session (this is the third instance of the same Tailwind-v4 + symlinked-kit footgun documented in `RETRO.md` — needs hard `rm -rf .next` + restart).
- Screenshots saved: `screenshots/how-fixed-pillar-{01,02,03,04}.png` + `screenshots/how-fixed-scroll-state.png`.
- `npm run typecheck` and `npm run build` both pass clean (build: 175 kB First Load JS, no new errors).
- See `RETRO.md` 2026-05-10 «Verification of "How section CSS broken" report (false alarm)» for analysis and process improvements.

---

## 2026-05-10 — How section: real Corder UI + Comparison: full 9×9 matrix

User flagged the previous How panels as invented mocks (Zoom-call dark UI, platform halo, status-cycle, drag-out ghost) and asked for the **real Corder app components** to be ported and shown in the same sticky panel. Same direction for Comparison: brief now contains a full 9-products × 9-features matrix that needs to land verbatim.

### Изменения

1. **`how.steps` rewritten** to the 4 pillars from `Corder Differentiation Brief.md` §"The 4 things that actually matter":
   - 01 — No bot in your call
   - 02 — Granola-grade transcript, with playback
   - 03 — Re-transcribe is free
   - 04 — No subscription. BYO Gemini key
   `liveDemo` union narrowed to `"no-bot" | "transcript" | "clarify" | "byok"`.
2. **How.tsx panels rewired to real Corder UI** (no mocks). Each panel composes existing `.hl-*` primitives (Sidebar, Transcript, RightPanel, SegmentGroup) ported from `~/Corder/Web/src/components/`:
   - **NoBotPanel** — full Library window: meeting sidebar (Today / Yesterday sections, 4 entries) + main pane (breadcrumb, EN/Copy toolbar, Transcript / Recording tabs, transcript with KH/VG speakers, audio scrubber + per-speaker timeline). Same UI a real user sees on screen.
   - **TranscriptDualTrackPanel** — same window without the sidebar; header replaces toolbar with a compact `mic.wav → system.wav → Gemini · merged` pipeline tag (purple/green chips for each track, neutral for the merged output). Right panel shows audio scrubber playing (12% fill) and per-speaker timeline with `hl-tl-row--glow` pulse on the active speaker (CSS `how-tl-pulse` 2.4s, halted by `data-motion="off"` and `prefers-reduced-motion`).
   - **ClarifyPanel** — real `SpeakersClarifyBanner` ported 1:1 from `~/Corder/Web/src/components/SpeakersClarifyBanner.tsx` and `styles.css:602-687`. Question "How many people were on the call?" + four pills (`Just me / 2 / 3 / 4+`), with the "2" pill in `.active` filled accent-pressed green. Header carries a "CACHED LOCALLY · 0 API CALLS" tag tied to the brief's reason-to-believe ("we cache the raw Gemini turns by audio hash in your local SQLite").
   - **ByokPanel** — macOS menu-bar fragment (apple, Library, Edit; Corder icon + dot at the right) + popover with red `Stop recording` button + Gemini 2.5 Flash · Your API key meta line. Below: typographic cost-math block — `$0.30 / hour × 30 hours of meetings = $9.00 / month` (numbers oversize, total in accent), with footnote `Granola charges $14–35. Otter, $17–30. Read.ai, $15–40.`
3. **`globals.css` — old How panel CSS deleted** (~700 lines: `.how-nobot__*`, `.how-platforms__*`, `.how-archive__*`, `.how-menubarpane__*`, plus their keyframes `how-platform-pulse / how-archive-cycle / how-archive-spin / how-drag-loop / how-pulse`). Replaced with `.how-app` layout glue that mounts the `.hl-*` primitives at compressed sizes appropriate to a sticky-panel viewport (~410-500px wide), plus `.how-pipeline`, `.how-cache-tag`, `.hl-clarify-*`, `.how-byok__*` rules. The `.how-window--app` override neutralises the hero's 3D reveal transform so the How window stays flat.
4. **`how-grid` rebalanced** to `1.15fr 0.85fr` (was 1fr/1fr) so the sticky panel gets more horizontal real estate; window aspect `1180/760` (was 4/3) accommodates Library + RightPanel side-by-side.
5. **Comparison: 9×9 matrix.** `copy.json.comparison` rewritten verbatim from the brief's Differentiation matrix — 10 column headers (`""`, Corder, Granola, Otter, Grain, Fireflies, Fathom, tl;dv, Read.ai, MacWhisper) and 9 feature rows. Cells are `Yes / No / Partial` strings; `Comparison.tsx` translates each via a `<CellGlyph>` component into typography (✓ / em-style dash / italic "Partial") — **no emojis** per project doctrine.
6. **Comparison desktop styles overhauled** for narrower 84px columns, table `min-width: 980px`, and a horizontal `comparison-scroll` wrapper for narrow viewports (replaces the old card-stack mobile fallback per user direction). New `.comparison-glyph--yes / --yes-win / --no / --partial / __check / __suffix` rules carry the visual hierarchy: bold accent for Corder wins, muted neutral for non-wins, italic muted for Partial.
7. **Verification.** `npm run typecheck` and `npm run build` both exit 0. CDP probe confirms 10 header cells, 9 rows, 7 Corder column wins, 6 Partial cells, 4 sidebar items in pillar 01, 2 transcript groups in pillar 02, 4 clarify buttons in pillar 03, "= $9.00/ month" total in pillar 04. Old mock counts (`how-nobot__avatar`, `how-platforms__halo`, `how-archive__status-pill`, `how-menubarpane__ghost`) all 0 — clean removal. `?motion=0` cycle: `<html data-motion="off">`, glow tick `animation-name: none`, opacity 1 (final state, no flash).

### Decisions

- **Real-Corder-UI policy.** When a section needs to demonstrate product UX, the default is to port real components from `~/Corder/Web/src/components/` (1:1 styles, scoped under `.hl-*` namespace). Invented mocks (Zoom-call placeholders, platform halos, drag-out ghosts) are a code smell unless the message is structurally about the *competitor's* UI, not Corder's.
- **Comparison mobile fallback.** The card-stack (`.comparison-stack`, `.comparison-card__*`) is removed permanently; horizontal-scroll wrapper with a "Scroll to compare →" hint replaces it. User-confirmed direction.
- **Partial / Yes-suffix typography.** Lowercase italic muted "Partial" reads as a hedged neutral; "Yes (one-time)" wraps the suffix in `comparison-glyph__suffix` 12px muted so the ✓ stays the primary signal.

### Next

- Judge review of the full How section with new real-UI panels (focus: confirm none of the bare `.hl-*` primitives leak hero behaviour into How, e.g. unexpected cursor states or focusable elements that shouldn't be reachable in the static panel).
- Update `HANDOFF.md` to note that `.hero-library-demo` class is now used twice (Hero + How) and the Webflow developer should treat the namespace as shared.
- Pricing changes flagged for a later session (user mentioned Pricing may change today).

---

## 2026-05-10 — How sticky live-UI refactor + Comparison + FinalCta WOW

Three-task pass on advantage messaging and skeptic-mode visuals.

### Изменения

1. **How section refactor (full).** Replaced the 4-step click-flow narrative ("Click Start → Have meeting → Read it back → Drag it out") with the 4 user-facing advantages: 01 No bot in the call · 02 Works with any sound source · 03 Free recording, always · 04 Menu-bar interface with quick export. Sticky live-UI panel pattern stays (1fr/1fr grid, IntersectionObserver picks the most-visible chapter, `data-active-step` cross-fades the four panels) — the 4 internal panels are entirely new:
   - **NoBotPanel** — mock dark Zoom call with macOS menu bar pinned at the top showing the Corder pulse + 04:17 timer; 3 real participant tiles (You / Kira / Andre); accent-coloured "NO THIRD PARTICIPANT" annotation in the corner. Ties Frame A discipline ("no bot in the call", never "covert / invisible") to a single visual.
   - **PlatformsPanel** — radial halo: Corder dark core in centre with green dot + serif name, 6 platform glyphs (Z M D T F R) orbit on a 9s `how-platform-pulse` keyframe with 1.5s staggered delays. Each tile lights up in its native colour for ~1.6s before relaxing back to muted. No microphone icon (decoration ban). Caption "Captures any sound your Mac plays."
   - **ArchivePanel** — small Library sidebar (3 sessions) + main row showing "Investor sync" with status pill cycling Failed → Re-transcribing (with spinning ring) → Ready on a 9s loop. Solid audio bar + Re-transcribe button stay visible throughout to communicate "the recording is always safe". Cycles use opacity-only animation on stacked absolute pills so layout doesn't shift.
   - **MenuBarPanel** — macOS menu bar at top with Corder icon (rounded square + accent dot) + Library text; popover below with red "Stop recording" button + 04:17. At the bottom, a Library "Investor sync" card and a dashed-border "Notion" target window. A green-tinted ghost duplicate animates from source to target on a 4.5s loop (`how-drag-loop`), conveying drag-out export.
2. **content/copy.json — `how.steps`** rewritten to 4 advantages with `liveDemo` keys (`"no-bot" | "platforms" | "archive" | "menu-bar"`). Heading still empty per project decision (no eyebrow, no section heading — just sticky panel + 4 chapters).
3. **Typed `Copy`** tightened in `src/content/copy.ts`: added `HowLiveDemo` union and narrowed `how.steps[].liveDemo` from `string` to the union. `next build` strict still passes; soldier RETRO 2026-05-09 (iter-3) lesson honoured (typecheck + build, not just dev).
4. **Comparison section (new).** `src/components/sections/Comparison.tsx` — visual matrix table comparing Corder to Granola / Otter / Fathom / Fireflies on 7 dimensions (Bot in your call? · Where audio lives · Mac-native app · Records without transcribing · Drag-out export · Free tier · Lowest paid tier). Desktop: hairline-bordered table, Corder column tinted `--color-accent-subtle`, header in serif 18px, wins in accent green 600. Mobile (<768px): table hidden, replaced by card stack — 7 cards, one per feature, with 5 product rows each (Corder row in accent green bold). All values pulled from `copy.comparison` matching `research/economics/corder-pricing-strategy.md` §4 competitor data. Heading "How Corder is different.", subhead "Other meeting tools join your call as a bot. Corder doesn't." No eyebrow per global ruling.
5. **page.tsx wiring.** New section order: Privacy → How → Features → **Comparison** → Pricing → FAQ → FinalCta → Footer. One `<hr className="section-divider" />` between Features and Comparison, another between Comparison and Pricing.
6. **FinalCta WOW redesign.** Replaced "single 80px serif heading + button" with editorial layered composition:
   - Rotating prompt above heading: "Record:" + 4-word rotation cycle ("your meetings / your customer calls / your design reviews / your thinking aloud") with mono accent type, dashed accent underline, 600ms typewriter clip-path animation, 2.6s interval.
   - Heading at `clamp(28px, 3.6vw, 44px)` (was `clamp(40px, 6vw, 80px)`) — Plex Serif weight 400, more editorial, less poster.
   - Inline CTA pill ("Click Start.") sits IN the heading line on desktop (`flex-direction: row`, wrap, justify-center), stacks below the heading on mobile.
   - Accent-coloured blinking cursor + microcopy "macOS 14+ · Free to download" beneath. Cursor 1s steps blink, halted on `?motion=0` and `prefers-reduced-motion`.
   - `copy.finalCta` extended with `rotatingPrompt`, `rotatingWords[]`, `before`, `ctaInline`, `after`, `microcopy`, `ctaHref`. Old `heading / subhead / cta` kept as deprecated for any future fallback consumers.

### Verification

- `npm run typecheck` exit 0
- `npm run build` exit 0 — 173 kB First Load JS, 102 kB shared (no regression vs prior).
- CDP probe (`/tmp/aisoldier-judge/corder-section-0/cdp-section-3-soldier.mjs`):
  - **How**: 4 chapters / 4 panes / sticky window present. IntersectionObserver scrolls to step 01 → 02 → 03 → 04 each transition `activeStep` correctly.
  - **Comparison**: heading `"How Corder is different."`, 7 rows × 6 cols, Corder column bg `rgba(33,122,80,0.08)`, win cells `rgb(33,122,80)`.
  - **FinalCta**: rotator visible, inline pill text "Click Start.", microcopy correct, heading computed font-size **44px** (vs prior 64-80px), pill bg `rgb(33,122,80)`.
  - **Doctrine**: 0 forbidden words, 0 em dashes.
  - **Mobile (390×844)**: Comparison table `display: none`, 7 cards rendered with 35 items total (5 per card).
- CDP probe `motion=0` (`cdp-section-3-motion-off.mjs`):
  - `html[data-motion="off"]` set pre-paint.
  - Rotator word static across 3s window (no cycling).
  - Archive cycle settles on Ready pill (failed/retry opacity 0; ready opacity 1).
  - Drag-out ghost `display: none`.
  - Microcopy cursor visible (opacity 1) but animation halted.

### Screenshots

- `screenshots/how-step-01-no-bot.png` — Frame A panel: dark Zoom call, 3 real participants, menu-bar Corder pulse + timer, "NO THIRD PARTICIPANT" annotation.
- `screenshots/how-step-02-platforms.png` — orbiting platform halo, two tiles lit (purple D, indigo T) at the moment of capture.
- `screenshots/how-step-03-archive.png` — Library sidebar + main row with READY status (cycle phase 3), audio bar saved.
- `screenshots/how-step-04-menu-bar.png` — menu bar + popover Stop button + Investor sync card → Notion dashed target.
- `screenshots/comparison.png` — 7×5 hairline matrix, Corder column tinted accent-subtle, 5 wins in accent green.
- `screenshots/comparison-mobile.png` — 7-card stack, "Bot in your call?" first card with Corder · No row in accent green.
- `screenshots/final-cta-wow.png` — "RECORD: your thinking aloud" rotator (mono), "Open the menu bar." serif heading + inline "Click Start." pill, accent cursor + microcopy.

### Что дальше

- Awaiting judge review on this pass before showing to user.
- Potential follow-ups (deferred unless judge flags): finer-tune NoBotPanel tile area filling (currently the dark area below the participant strip is empty — could add a transcript preview ribbon), tune halo radius on small-laptop breakpoint, A/B short vs longer inline CTA pill copy ("Click Start." vs "Start recording").

---

## 2026-05-10 — hero recording state + toolbar hover + alignment

Live-iteration fixes on Hero demo. User direction.

### Изменения
1. **HeroLibraryDemo state machine.** Three modes: `recording` → `transcribing` → `transcript`. Initial = `recording` (live timer ticking 00:00, red Stop button). Click Stop → 1.2s `transcribing` (green dot, "Transcribing…", no button) → fade-up reveal of 3 SegmentGroups with 0/80/160ms staggered delay. Recording banner adapted 1:1 from `Corder/Web/src/components/RecordingBanner.tsx` + `styles.css:175-303`. Lives inside `.hl-transcript-wrap` below the search/clarify toolbar — same slot as the eventual transcript.
2. **Recording banner styles** ported into `HeroLibraryDemo.css` under `.hl-rec-*` namespace, scoped under `.hero-library-demo`. Pulse animation 1s on the red dot (and on the green transcribing dot). 13/500 label, 18/300 tabular-nums timer, 14/500 stop button at 13×16 padding, `#B7443C` red bg with `#9e3a32` hover. Respects `prefers-reduced-motion`.
3. **Segment reveal animation.** `.hl-transcript[data-revealing="true"] .hl-segment-group` keyframe `hl-segment-reveal` translates from `{opacity 0, y 8px}` to rest over 400ms with doctrine easing. Three `:nth-child` delays. Suppressed under `prefers-reduced-motion` and `html[data-motion="off"]`.
4. **Toolbar hover state (EN / Copy / Delete).** `.hl-toolbar button` was `cursor: default` with no hover. Now `cursor: pointer` + hover bg `var(--hl-bg-hover)` + border `#b8b8b4` + active bg `var(--hl-bg-active)`. Pattern matches Corder app `button:hover` rule (styles.css:56). 80ms transition, no overshoot.
5. **Alignment fix — search / clarify / play.** All three controls now `height: 36px` (search input was padding-driven ~32px → fixed via `height: 36px; padding: 0 14px 0 34px`; clarify icon-btn 34→36; audio play btn 32→36). Audio panel `padding-top` matches transcript-toolbar. CDP-verified: `searchTop = clarifyTop = playTop = 569px` (pixel-perfect, 0px diff).
6. **Clarify / play `cursor: default` → `cursor: pointer`** for consistency. Clarify gets the same hover treatment.

### Verification
- `npm run typecheck` exit 0
- `npm run build` exit 0 (171 kB First Load JS, 102 kB shared — no regression vs prior build).
- CDP probe (`/tmp/aisoldier-judge/corder-section-0/cdp-hero-recording-probe.mjs`):
  - State 1 (initial): banner+stop+dot rendered, timer "00:01" tick, all 3 controls 36×36px at top=569px.
  - State 2 (post-click +200ms): transcribing banner visible with "Transcribing…" label, red Stop hidden.
  - State 3 (post-click +1.5s): banner gone, 3 segment groups rendered & visible (opacity > 0.5).
  - EN button hover via `CSS.forcePseudoState`: `rgba(0,0,0,0)` → `rgb(250,250,248)` (= `--hl-bg-hover` `#fafaf8`). Hover working.
- Screenshots: `screenshots/hero-recording-state.png`, `screenshots/hero-transcript-state.png`.

### Files touched
- `src/components/hero/HeroLibraryDemo.tsx` — `mode` state, `elapsed` timer, `handleStopRecording`, conditional render in `Transcript`, prop drilling through `Main`.
- `src/components/hero/HeroLibraryDemo.css` — search input height 36, toolbar btn hover, clarify btn 36 + hover, audio btn 32→36 + padding-top 8→10, recording banner block (~90 lines), reveal keyframes.

---

## 2026-05-09 — fix-pass-2 — user feedback after first live review

После того как юзер посмотрел live на :3050 после iter-2 PASSED, прилетел пакет правок. Все локальные, без переписи секций.

### Изменения

1. **Inspector overlay удалён.** `import { Inspector }` и `{NODE_ENV === 'development' && <Inspector />}` выпилены из `src/app/layout.tsx`. Юзер: «выпили встроенный редактор и перестань его делать». Это явное direction для проекта — Inspector больше не нужен в corder-landing. `data-component`/`data-source`/`data-tokens` атрибуты оставлены: они documenting structure для Webflow handoff (доктрина), и удаление их потеряло бы handoff-mapping.

2. **Логотип Corder в Nav заменён.** Старый bars-graph (8 rect bars в круге) → 2-bar AppIcon из `/Users/3mpq/Corder/Resources/icons/AppIcon.svg`. На белом фоне nav сплошной 2-bar logo из исходника читался бы как sticker (он там нарисован full-bleed с warm-white подложкой и Liquid Glass-bevel под Tahoe squircle). Решение: оставлены только 2 чёрных rect bars без подложки/cast-shadow/glossy gradients, fill через `currentColor` (наследует `--color-text`), 24×24px square. Без обвязки — сама форма уже distinctive.

3. **Hero eyebrow pill удалён.** В `Hero.tsx` убрана `<motion.span>` с pill chrome ("Mac meeting recorder" 12px uppercase). Теперь H1 — первый элемент в hero copy. `data-component="HeroEyebrow"` ушёл вместе с элементом (CDP probe `heroEyebrowPresent: false`).

4. **Все CTA → green pill.** Юзер: «черных кнопок не должно быть». В `globals.css` добавлены **base styles** для `.cta-pill--primary` (раньше всё bg-color жил inline через `style={{background: var(--color-text)}}` на каждом use site), теперь:
   ```
   .cta-pill--primary {
     background-color: var(--color-accent) !important;
     border: 1px solid var(--color-accent) !important;
     color: var(--color-bg) !important;
   }
   ```
   Inline `style={{background:..., color:...}}` пропсы убраны из `Hero.tsx`, `Pricing.tsx`, `FinalCta.tsx` — CTA теперь полностью style'd классом. Trailing accent dot тоже убран (на зелёном бг зелёный dot невидим, никакого визуального contribution).
   
   `.nav-cta` теперь fill, не outline: `background: var(--color-accent)`, `border: 1px solid var(--color-accent)`, `color: var(--color-bg)`. Hover → `--color-accent-deep` + translateY(-1px), как у `.cta-pill--primary`. Trailing accent dot тоже убран.
   
   `.pricing-toggle__btn[aria-pressed="true"]` (active state pricing toggle) перекрашен с `var(--color-text)` на `var(--color-accent)` — единственный другой dark-bg control в проекте.

5. **Accent token rebased: `#1f7a4f` → `#217a50`.** Юзер прямо указал hex `#217A50`. Старое значение `#1f7a4f` было pulled из app's status-ready dot, разница 2 unit visually neutral, но раз юзер сказал — обновляем authoritative ссылку. `--color-accent`, `--color-accent-subtle` (rgb 33,122,80), `--color-accent-soft`, `::selection` rgba — все обновлены. `--color-accent-deep #0e3d28` оставлен (deep variant для hover, сохраняет depth ratio).

6. **Hero copy → center alignment.** `.mx-auto.max-w-[860px]` получил `text-center`, CTAs row — `justify-center` (было `flex-wrap items-center gap-3`, добавлено `justify-center`), subhead — `mx-auto` чтобы max-w-[640px] не прижимался к левому краю. Eyebrow удалён (см. #3) → headline теперь первый. Qualifier унаследовал `text-center` от родителя.

7. **Section composition order changed.** В `page.tsx` AudienceLine перенесён ПОСЛЕ Privacy: `Nav → Hero → Privacy → AudienceLine → How → Features → Pricing → Faq → FinalCta → Footer`. Раньше AudienceLine шёл сразу после Hero. Юзер увидел live и сказал «помести под privacy».

8. **Hairline dividers между секциями.** Новый `.section-divider` utility class в `globals.css` (`border-top: 1px solid var(--color-border); margin: 0; height: 0`). 8 `<hr className="section-divider" />` элементов в `page.tsx` между всеми соседними секциями: Hero↔Privacy, Privacy↔AudienceLine, AudienceLine↔How, How↔Features, Features↔Pricing, Pricing↔Faq, Faq↔FinalCta, FinalCta↔Footer. Юзер сказал что точечно потом будет убирать — отдельные `<hr>` (а не `border-top` per section) даёт легчайшее точечное управление: убрать одну строку из page.tsx.

### Verification

- `npm run typecheck` — exit 0.
- `npm run build` — exit 0, Route `/` 68.1 kB / 170 kB First Load JS. Pre-existing CSS optimizer warning о `var(...)` parsing — не относится к fix-pass-2, был и до.
- CDP probe на :3050 (после `rm -rf .next` + restart, см. RETRO):
  - `inspectorByDataAttr: false`, `inspectorByText: false` — Inspector отсутствует.
  - `navLogoRectCount: 2` — 2-bar logo.
  - `heroEyebrowPresent: false` — eyebrow pill отсутствует.
  - `heroTextAlign: "center"` — Hero текст центрирован.
  - `heroCtaBg`, `navCtaBg`, `finalCtaBg`, `pricingPrimaryBg` все `rgb(33, 122, 80)` = `#217a50` — single-accent verified.
  - `order: [Nav, Hero, Privacy, AudienceLine, How, Features, Pricing, Faq, FinalCta, Footer]` — порядок правильный.
  - `dividerCount: 8` — 8 разделителей между парами секций.
  - `accentValue: "#217a50"` — token обновлён.
- Screenshots:
  - `screenshots/fullpage-fix2.png` (full-page, 1440×deviceScaleFactor 2)
  - `screenshots/hero-fix2.png` (hero scrolled to top)
  - `screenshots/nav-fix2.png` (nav viewport)
  - `screenshots/pricing-fix2.png` (pricing scrolled into view)

### Что НЕ трогалось

- Header (Nav) layout — юзер сказал «слегка хочется необычного», но это отдельный творческий вопрос вне scope этого fix-pass.
- copy.json — без изменений.
- Внутренняя структура секций (Privacy, How, Features, Pricing, FAQ, FinalCta, Footer) — без изменений.
- Brand-doc, copywriter brief, research — не трогалось.

### Что дальше

Юзер видит правки, потом обсудим nav layout.

---

## 2026-05-09 — Session 1 (sections 3-9 in one pass)

### Sections built — 7 in a single pass

Per user request, all remaining sections built in one go (no per-section judge gate). Quality compensated for via stricter self-checks: smoke harness run after build, every section snapshotted on desktop+mobile, full-page + motion=0 captures, typecheck+build both required green before moving on.

#### Section 3 — Privacy / Trust (`src/components/sections/Privacy.tsx`)

- Asymmetric anchor: heading + subhead in left 8 of 12 grid columns; cards full-width below in 2-col grid (md+).
- Two cards. Card 1 ("Default") carries the forest-green `Default` tag — represents cloud transcription. Card 2 ("Local storage") is neutral.
- Each card: 1px border, 12px radius, no shadow. Eyebrow tag → H3 (Plex Serif) → body 18px → spec list.
- Spec list rows: small-caps key (12px) + value. Mono values (paths, hostnames) auto-detected via regex and rendered in IBM Plex Mono 14px. Heuristic catches `~/...`, `/...`, `*.googleapis.com`, `HTTPS to ...`, file extensions.
- Zero icons. Layout doctrine: hairlines only, no decorative chrome.

#### Section 4 — How it works (`src/components/sections/How.tsx`)

- **Scroll-pinned narrative with sticky live-UI.** Decision: use the recommended pattern from `research/corder-how-features-deep-dive.md` §7.1, not the simpler 2×2 fallback.
- Layout: 12-col grid; left column `position: sticky; top: 96px` holds a compact macOS app reproduction (`HowWindow`); right column scrolls 4 chapter blocks.
- IntersectionObserver with `rootMargin: -35% 0px -35% 0px` tracks which chapter is centred → switches `data-active-step` on the sticky panel → CSS selectors cross-fade between four step panes (350ms doctrine easing).
- Four step panes inside `HowWindow`:
  - 01: idle menu bar with `Start` button, accent-green status dot
  - 02: Recording bar with pulsing dot + animated waveform (12 bars, staggered scale animation)
  - 03: Transcript with KH/VG avatars + `<mark>`-highlighted active line
  - 04: Drag illustration — Transcript pane → `→` → Notion target pane
- Mobile (<lg): sticky disabled. Window renders inline once before the chapters; each chapter still fires `data-active-step` so the inline window animates as the user scrolls.
- Chapter typography: oversize Plex Serif accent-green numeral (clamp 72-128px) + H2 (clamp 24-32px) + body 18px.
- `?motion=0` and `prefers-reduced-motion` halt the recording-pulse and waveform animations via `:root[data-motion="off"]` short-circuit in globals.css. Sticky behaviour itself is unaffected (no JS-driven motion to cancel).

#### Section 5 — Features (`src/components/sections/Features.tsx`)

- 6-cell hairline-bordered grid: 3 cols at lg, 2 at sm, 1 at base. External 12px radius, internal 1px hairlines (no card chrome).
- Hover on cell: `bg-color → --color-surface-2` over 200ms doctrine easing. No translate, no shadow.
- Six unique typographic gestures, no icons:
  - **TIMELINE** — mini timeline UI fragment (KH purple + VG green rows with ticks)
  - **SEARCH** — typographic-mark over the word `phrase` in body (accent-soft 18% bg + hairline)
  - **OUTPUT** — split-cell illustration: Corder pane | `→` | Notion pane
  - **MAC NATIVE** — `<kbd>` glyph rendering ⌘W as a macOS keyboard cap (Plex Sans 14px, 6px radius, 2px bottom-border for cap depth)
  - **ARCHIVE** — monospace path display (`~/Dropbox/Corder/2026-05-09 17:09.txt`)
  - **UPDATES** — version sequence as monospace chips: `v1.4.2 → v1.4.3 → v1.5.0` (latest chip in accent-soft tint)
- Search cell uses inline-mark via JSX string-split, preserving `<mark>` as visual hint without breaking copy authoring.

#### Section 6 — Pricing (`src/components/sections/Pricing.tsx`)

- 3-tier cards (Free / Personal / Pro) in equal columns at md+, stack at base. Lifetime — separate full-width plank below the grid, not a fourth column (`pricing.lifetime` keyed in copy.json signals this).
- Annual toggle: vanilla useState in React, swaps `tier.price.monthly` ↔ `tier.price.annual`. CDP-verified: `$0/$9/$14` → `$0/$6.75/$10.50`.
- Toggle UX: minimal segmented pill, dark `--color-text` background on the active option (no slider, no rail). "Pay annually, get 3 months free" badge sits beside the toggle in `accent-subtle` background — never the words "Save 25%".
- Tier card layout: name + (optional Recommended badge) → big Plex Serif price (clamp 40-56px) + `/forever`/`/per month` suffix (14px) → optional `$XXX billed annually` annual note → 1-line subline → hairline → bullet list (typographic middle-dot `·` markers, accent-coloured) → CTA pill at the bottom.
- Pro card highlighted via `--color-text` border + `--color-surface-2` background tint. Not a coloured shadow, not an accent fill.
- Lifetime plank: 12-col split (1.2fr | 1fr) with text + price on the left, features + secondary CTA on the right. "Launch offer" badge in accent.
- Microcopy line below: 14px `--color-text-subtle`, max 64ch.
- Bullet markers: typographic `·` middle-dot in accent. No SVG checkmarks. Frame A holds.

#### Section 7 — FAQ (`src/components/sections/Faq.tsx`)

- Reuses kit `FAQAccordion` (multi-open by default per kit doctrine — readers compare answers side by side in long Q-list).
- Mapped 10 items from `copy.faq.items` (`{q,a}` → `{question,answer}`).
- Promotion side-effect: `FAQAccordion` kit FAQItem internal didn't carry `data-tokens`. Added in the kit (`color-border,color-text,color-text-muted,font-serif,ease-out`) so every FAQItem is now Inspector-handoff complete. Kit edit + clean `.next` rebuild required to pick up.

#### Section 8 — Final CTA (`src/components/sections/FinalCta.tsx`)

- Centered editorial closing. Heading `clamp(40px, 6vw, 80px)` IBM Plex Serif, max-width 14ch so the two-step imperative reads on two lines.
- Single Download CTA pill in primary style (matches Hero CTA). 16px qualifier line below.
- Subtle dot-grid surface behind the heading, mask-faded top/bottom 30%/70%.
- `id="download"` so all `#download` CTAs across the page land here.

#### Section 9 — Footer (`src/components/sections/Footer.tsx`)

- 3-col grid at md+ (2fr brand | 1fr Product | 1fr Resources), single col at mobile.
- Brand wordmark: oversize Plex Serif `clamp(40px, 6vw, 72px)`.
- Column heading: 12px small-caps eyebrow. Column items: 16px sans links with hover `→ --color-text`.
- Hairline divider above the baseline row. Baseline carries © + back-to-top.
- Bespoke (not kit FooterEditorial) — three rigid columns + product-marketing structure differs from the kit's editorial-studio footer.

### Token + style additions (globals.css)

Added section-specific styles: `.privacy-card`, `.how-grid`, `.how-window`, `.how-step-pane[data-step]` cross-fade selectors, `.how-rec-waveform`, `.how-chapter`, `.features-grid`, `.feature-cell`, `.feature-mark`, `.kbd-cap`, `.feature-mono`, `.feature-version-row`, `.feature-timeline`, `.feature-split`, `.pricing-toggle`, `.pricing-grid`, `.pricing-card`, `.pricing-lifetime`, `.final-cta`, `.site-footer`, `.section-eyebrow`, `.section-heading`, `.section-subhead`. Doctrine-clean: only `cubic-bezier(0.16, 1, 0.3, 1)` easing, hairlines only, no shadows, accent token usage.

### Kit promotion / edit

- `FAQAccordion.tsx` (in kit) — added `data-tokens` to FAQItem root. Required `rm -rf .next` + dev restart per RETRO note about Tailwind v4 + symlinked kit.

### Verified

| Check | Result |
|---|---|
| typecheck (`tsc --noEmit`) | exit 0 |
| build (`next build`) | exit 0 — 13.1 kB / 202 kB First Load JS |
| Em-dashes in DOM | 0 |
| En-dashes in DOM | 0 |
| Forbidden words | 0 hits |
| Body-text size violations (<16px outside eyebrow / live UI / specially-allowed small chrome) | 0 |
| `data-component` triple coverage (component+source+tokens) | 68 / 68 |
| Section presence (`top, audience, privacy, how, features, pricing, faq, download`) | 8/8 |
| Pricing cards | 3 |
| Privacy cards | 2 |
| Feature cells | 6 |
| FAQ items | 10 |
| How chapters (×2 — sticky panes + scroll chapters) | 8 |
| Pricing toggle interaction (CDP click → re-renders prices) | $0/$9/$14 → $0/$6.75/$10.50 ✓ |
| How sticky-window state cycle (CDP scroll to each chapter → activeStep matches) | 01/02/03/04 — all match ✓ |
| `?motion=0` motion gate (`<html data-motion="off">`, accent word in final state) | gate set, accent in `rgb(31, 122, 79) blur(0)` ✓ |
| Console errors / warnings / exceptions | 0 / 0 / 0 |

### Screenshots (all in `screenshots/section-3-9/`)

Per-section desktop 1440 + per-section mobile 375; full-page desktop default; full-page desktop motion=0; full-page mobile; per-step How (01/02/03/04) with sticky window in correct state.

### Files touched

- `src/app/page.tsx` (added 7 section imports + JSX)
- `src/app/globals.css` (added all section CSS)
- `src/components/sections/Privacy.tsx` (new)
- `src/components/sections/How.tsx` (new)
- `src/components/sections/Features.tsx` (new)
- `src/components/sections/Pricing.tsx` (new)
- `src/components/sections/Faq.tsx` (new)
- `src/components/sections/FinalCta.tsx` (new)
- `src/components/sections/Footer.tsx` (new)
- `ui-kit/components/section/FAQAccordion.tsx` (added data-tokens to FAQItem)

### Awaiting

- Judge review (no localhost share to user yet — awaiting REVIEW.md PASSED verdict).

---

## 2026-05-09 — Session 0 (kickoff + Hero)

### Scaffold

- Created Next.js 15 + Tailwind CSS v4 + Framer Motion 12 + Lenis 1.x project at `projects/corder-landing/`.
- Wired the symlinked `@aisoldier/ui-kit` via `transpilePackages: ['@aisoldier/ui-kit']` and `experimental.externalDir: true` per the booquarium pattern. `webpack.resolve.symlinks = false` to keep HMR working across the symlink.
- IBM Plex Sans + Serif + Mono via `next/font/google` (`--font-plex-sans/serif/mono` CSS variables wired into Tailwind v4 `@theme`).
- `globals.css` imports kit tokens, project tokens, declares the `[data-motion="blur-reveal"]` contract, the audience-line scroll-fill keyframes, the `.dot-grid-surface` helper, and the `.page-container` utility.
- `tokens.css` declares forest green `#1f7a4f` accent, warm-paper neutrals aligned with the macOS app, fluid display scale.
- Path aliases: `@/*`, `@kit/*`, `@content/*`, `@assets/*`.

### Providers + dev tooling

- `LenisProvider` wraps the root layout in `<ReactLenis root>`, intercepts `a[href^="#"]` for damped scroll. **Important:** does NOT bridge Lenis ticks to a `scroll` event — that caused infinite recursion in Lenis 1.3+. Smoke test caught it; see `DECISIONS.md`.
- `MotionProvider` reads `?motion=0` and `prefers-reduced-motion`, sets `data-motion-state` on `[data-motion="blur-reveal"]` elements via IntersectionObserver. Currently no consumers, but ready for downstream sections.
- `Inspector` from the kit is mounted in `app/layout.tsx` behind `process.env.NODE_ENV === 'development'`.

### Section 0 — Nav

- Sticky header with brand mark (inline SVG of the Corder waveform), three nav links (Features / Privacy / Pricing), primary "Download for macOS" pill CTA with trailing accent dot.
- `data-scrolled="true"` after scrollY > 8 → backdrop-blur(12px) + 1px hairline bottom border.
- Mobile collapses links to a single Download CTA at `< md`.

### Section 1 — Hero

- Editorial copy block: eyebrow pill (12px uppercase) → display-lg headline ("Record what was said.") → 39-word subhead → primary + secondary CTAs → 16px qualifier line.
- Framer Motion 12 entry animation: `opacity 0 → 1, y 18 → 0, blur 8 → 0` over 600ms with `cubic-bezier(0.16, 1, 0.3, 1)`, staggered 80ms per block. `prefers-reduced-motion` skips entirely.
- Below copy: live macOS Library window demo (`HeroLibraryDemo`).

### HeroLibraryDemo

- Full DOM port of the macOS Corder app's library window (`assets/screen-library.png` was the reference).
- Window chrome: traffic lights, sidebar with search + meeting list, main pane with breadcrumb + Boost switch + toolbar, transcript with per-speaker labels and one active-line highlight, audio scrubber, per-speaker timeline card with ticks and cursor.
- 3D tilt on pointermove: vanilla JS rAF loop, `MAX_X = 3°, MAX_Y = 4°, LIFT = 4px`. Falls back to no-op on `prefers-reduced-motion`.
- Click on Play button toggles `data-playing="true"` → CSS keyframe scrub-fill + cursor walk run.
- Ambient cursor walk runs on the timeline while idle (12s loop, native CSS only) — gives "the app is alive" without aggression.
- Reveal: `data-reveal="initial" → "visible"` via rAF; CSS keyframe scales + de-blurs the card on mount.

### Section 2 — AudienceLine

- Single editorial sentence, IBM Plex Serif `clamp(28px, 4vw, 56px)`.
- Each word wrapped in a `<span class="audience-line__word">`. Three accent ranges get `--accent` modifier class.
- Scroll-driven word fill via native CSS `animation-timeline: view()` + `animation-range: cover 25% cover 75%`. No JS, no GSAP, no framer-motion scroll bridge.
- `@supports not (animation-timeline: view())` and `prefers-reduced-motion` fallbacks render the final state immediately.

### CDP smoke checks (final, post-Lenis-fix)

| Check | Result |
|---|---|
| Headline font-size | 86.4px ≥ doctrine `display-lg` minimum |
| Subhead font-size | 18px |
| Qualifier font-size | 16px (doctrine min) |
| Eyebrow font-size | 12px (only sanctioned 12px usage) |
| Audience-line font-size | 56px |
| `<16px` body text outside live demo | 0 |
| Em-dashes in rendered DOM | 0 |
| `data-component` attributes | 11 |
| `data-source` attributes | 5 |
| Hero demo `data-reveal` after mount | `visible` |
| Audience-line word count | 20 (matches copy split) |
| Audience-line accent words | 13 (matches `[1,5) + [5,9) + [10,15)`) |
| Play button click toggles `data-playing` | `false → true` ✓ |
| Headline font-family | `IBM Plex Serif` ✓ |
| Console errors | 0 |

### Files touched

- Created: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `next-env.d.ts`, `.gitignore`, `tokens.css`
- Created: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- Created: `src/lib/cn.ts`, `src/lib/motion.ts`
- Created: `src/components/providers/LenisProvider.tsx`, `MotionProvider.tsx`
- Created: `src/components/sections/Nav.tsx`, `Hero.tsx`, `AudienceLine.tsx`
- Created: `src/components/hero/HeroLibraryDemo.tsx`, `HeroLibraryDemo.css`
- Created: `screenshots/hero-section-0.png`, `hero-fullpage.png`, `hero-motion0.png`, `hero-tablet.png`, `hero-mobile.png`
- Created: docs — `CLAUDE.md`, `BRIEF.md`, `DESIGN_SYSTEM.md`, `ARCHITECTURE.md`, `COMPONENTS.md`, `INTEGRATIONS.md`, `DECISIONS.md`, `HANDOFF.md`, `RETRO.md`

### Awaiting

- judge review of section 0 (Nav + Hero + AudienceLine).
- Subsequent sections (Privacy, How, Features, Pricing, FAQ, Final CTA, Footer) are out of scope for this session per the task brief.

---

## 2026-05-09 — Session 0 — Fix pass 1 (post-judge-review)

Addressed every issue from `REVIEW.md` (2 blockers, 4 major, 4 minor). Re-ran CDP smoke checks; all blockers and majors verified clean. Awaiting judge re-review.

### Blockers

- **`?motion=0` now also halts AudienceLine scroll-driven fill.** Added a synchronous pre-hydration script in `layout.tsx` that sets `<html data-motion="off">` if `?motion=0` query OR `prefers-reduced-motion: reduce`. New CSS rule in `globals.css` mirrors the existing `prefers-reduced-motion` block on `:root[data-motion="off"] .audience-line__word`. CDP probe at `?motion=0`: first word `rgb(14,14,13)` no blur; first accent word `rgb(31,122,79)` no blur; html `dataset.motion === "off"`. `MotionProvider` also writes the attribute post-hydration as a redundant safety net.
- **Qualifier text contrast.** `Hero.tsx` HeroQualifier color switched from `--color-text-subtle` (`#a0a09c`, 2.62:1) to `--color-text-muted` (`#6b6b68`, 5.35:1). Existing subtle variable preserved for placeholder/tertiary use elsewhere.

### Major

- **`:focus-visible` policy.** Global rule added to `globals.css`: 2px solid `--color-accent` outline, 2px offset, `border-radius: inherit` so pill CTAs get a pill ring. Applies to `a, button, input, textarea, select, [role="button"]`. Verified by focusing hero CTA via `el.focus()` — computed outline `rgb(31, 122, 79) solid 2px`.
- **Hover states.** New `.cta-pill`, `.cta-pill--primary`, `.cta-pill--ghost`, `.nav-link`, `.nav-cta` rules in `globals.css`. Primary CTA on hover: `bg-color → --color-accent-deep #0e3d28` + `transform: translateY(-1px)`; ghost CTA on hover: `border → --color-text` + `bg → --color-surface`; nav links on hover: `color → --color-text`. Active feedback: `transform: scale(0.98)` on press. Verified via `Input.dispatchMouseEvent mouseMoved`: hero primary CTA bg becomes `rgb(14, 61, 40)`, transform `matrix(1, 0, 0, 1, 0, -1)`.
- **`data-source` and `data-tokens` on every `data-component` element.** Added to NavCta (×2 — desktop + mobile), HeroEyebrow, HeroHeadline, HeroSubhead, HeroCtas, HeroQualifier, HeroArt. CDP audit: 12/12 elements carry all three attributes.
- **`accentRanges` source-of-truth.** Synced `copy.json.audienceLine.accentRanges` to the editorially-correct `[[1,5],[5,9],[10,15]]` (was `[[1,4],[6,9],[11,16]]` which neither inclusive- nor exclusive-end interpretation matched the rendered three pillars). Removed the hardcoded `ACCENT_RANGES` constant from `AudienceLine.tsx` — component now reads `audienceLine.accentRanges` directly. Added `_accentRangesNote` field to copy.json documenting the half-open `[start, end)` convention.

### Minor

- **Mobile NavCta touch comfort.** `.nav-cta` rule at `@media (max-width: 640px)` bumps height to 44px and pads to 18px. CDP probe at 375×812: visible NavCta height = 44px exactly.
- **Tablet-edge breakpoint.** `HeroLibraryDemo.css` mobile-collapse media query moved from `(max-width: 900px)` to `(max-width: 879px)` so 880-and-up keeps the desktop split (8px-grid value).
- **Press feedback.** `:active { transform: scale(0.98); }` on `.cta-pill--primary`, `.cta-pill--ghost`, and `.nav-cta`. Easing inherited from doctrine 150ms transition.
- **LCP in production.** Dev mode 2176ms is informational; will measure via `npm run build && npm start` before launch sign-off. Not blocking section 0.

### Files touched

- `src/app/layout.tsx` — pre-hydration motion bootstrap script in `<head>`.
- `src/app/globals.css` — `data-motion="off"` rule, global `:focus-visible`, `.cta-pill`/`.nav-cta`/`.nav-link` hover/active/focus rules, mobile 44px override.
- `src/components/providers/MotionProvider.tsx` — sets `<html data-motion="off">` post-hydration as redundant safety net.
- `src/components/sections/Hero.tsx` — qualifier color, full data-attrs on every motion child, `cta-pill` classes on the two CTAs.
- `src/components/sections/Nav.tsx` — `nav-link`/`nav-cta` classes, full data-attrs on both NavCta instances.
- `src/components/sections/AudienceLine.tsx` — reads `audienceLine.accentRanges` from copy.json.
- `src/components/hero/HeroLibraryDemo.tsx` — `data-tokens` added to HeroArt root.
- `src/components/hero/HeroLibraryDemo.css` — collapse media query 900 → 879.
- `content/copy.json` — `audienceLine.accentRanges` synced to `[[1,5],[5,9],[10,15]]` + `_accentRangesNote`.
- `screenshots/` — added `hero-section-0-fix-1.png`, `hero-motion0-fix-1.png`, `hero-focus-fix-1.png`.

### Awaiting

- judge re-review of section 0.

---

## 2026-05-09 — Session 0 — Fix pass 2 (iter-3 — TS build fix)

Re-review iteration 2 was visually green on every count, but flagged one BLOCKER (NEW-1): `next build` failed at `AudienceLine.tsx:23` with TS2352 — direct cast `audienceLine.accentRanges as ReadonlyArray<readonly [number, number]>` rejected by TS strict because JSON imports widen `[[1,5],[5,9],[10,15]]` to `number[][]`, not `[number, number][]`. Dev was lenient, prod build was strict.

### Fix — option (c): typed JSON wrapper

Created `src/content/copy.ts` — single typed entry point for `content/copy.json`:

```ts
import raw from "@content/copy.json";
export type Copy = typeof raw & {
  audienceLine: {
    accentRanges: ReadonlyArray<readonly [number, number]>;
  };
};
export const copy = raw as Copy;
```

Switched all four direct readers from `import copy from "@content/copy.json"` to `import { copy } from "@/content/copy"`:

- `src/components/sections/AudienceLine.tsx` — also dropped the unsafe `as ReadonlyArray<...>` and now destructures `{ accentRanges }` cleanly. Tuple shape comes from the wrapper.
- `src/components/sections/Hero.tsx` — pure import swap.
- `src/components/sections/Nav.tsx` — pure import swap.
- `src/app/layout.tsx` — pure import swap (metadata + lang).

### Verification

| Check | Result |
|---|---|
| `npm run typecheck` | exit 0 |
| `npm run build` | exit 0 (one pre-existing Lightning CSS warning re `&:hover { @media (hover) }` — NEW-2, non-blocker) |
| Prod server `npm run start -- -p 3051` | 200 OK |
| Accent indices on prod (`?motion=0`) | `[1,2,3,4,5,6,7,8,10,11,12,13,14]` — exact match |
| First word computed style at `?motion=0` | `color rgb(14,14,13)`, `filter blur(0px)`, `animationName none` |
| First accent word computed style at `?motion=0` | `color rgb(31,122,79)`, `filter blur(0px)`, `animationName none` |
| `data-component` / `data-source` / `data-tokens` | 12 / 12 / 12 (unchanged) |
| Em-dashes in DOM | 0 |
| En-dashes in DOM | 0 |
| Forbidden marketing words | 0 |
| Console errors / warnings on prod | 0 / 0 |
| Production LCP (untrottled, local) | 820 ms — element = `H1.mt-6` (hero headline). FCP 68 ms, TTFB 4.9 ms. Note: not 4G-simulated; judge will re-measure under throttling at launch sign-off. Below 1500 ms target on raw localhost, well below the dev-mode 2176 ms baseline. |

### Files touched

- Created: `src/content/copy.ts` (new typed wrapper)
- Modified: `src/components/sections/AudienceLine.tsx` (drop cast, destructure)
- Modified: `src/components/sections/Hero.tsx` (import path)
- Modified: `src/components/sections/Nav.tsx` (import path)
- Modified: `src/app/layout.tsx` (import path)
- Updated: `DECISIONS.md`, `RETRO.md`

### Awaiting

- judge re-review iteration 3 (anticipated fast: typecheck + build + accent regression — all already verified by soldier).
