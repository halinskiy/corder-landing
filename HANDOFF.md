# corder-landing — Webflow Handoff Notes

This file is for the developer rebuilding the landing in Webflow. Read it section by section. Native = Webflow IX2 / built-in features can do this. Custom = embed code or external tooling required.

---

## Section 0 — Nav (`src/components/sections/Nav.tsx`)

**Behaviour:**
- `position: fixed; top: 0`. Transparent at scrollY ≤ 8. At scrollY > 8: `background: rgba(255,255,255,0.78)`, `backdrop-filter: saturate(180%) blur(12px)`, 1px hairline bottom border in `--color-border`.
- All transitions 150ms `cubic-bezier(0.16, 1, 0.3, 1)`.
- Brand mark: inline SVG (the Corder waveform mark — see `assets/corder-mark-waveform.svg`). 24×24 in nav, fills `currentColor` (deepens to `--color-text` on the dark disc) with white waveform bars.

**Webflow path:** Native. Use a Symbol nav element. IX2 scroll trigger → swap classes at scrollY 8.

**Custom code required:** None.

---

## Section 1 — Hero (`src/components/sections/Hero.tsx`)

### 1a. Editorial copy block

- Eyebrow pill (12px, uppercase, `letter-spacing: 0.062em`, `--radius-pill`, 1px border in `--color-border-strong`).
- Display-lg headline (`clamp(40px, 6vw, 88px)` IBM Plex Serif weight 500). Letter-spacing `-0.018em`, line-height 1.05.
- Subhead (18px IBM Plex Sans, `--color-text-muted`, max-width 640px).
- CTAs:
  - Primary: dark pill, height 48px, `background: var(--color-text)`, white text, trailing 6px accent dot.
  - Secondary: outline pill, 1px `--color-border-strong`.
- Qualifier: 16px `--color-text-subtle`.

**Entry animation:** Each block fades in over 600ms with `cubic-bezier(0.16, 1, 0.3, 1)`. Stagger: 80ms between blocks (eyebrow → headline → subhead → CTAs → qualifier). `prefers-reduced-motion` skips entirely.

**Webflow path:** Native. Use page-load IX2 trigger with stagger.

### 1b. Live UI demo (`HeroLibraryDemo`) — Corder v0.9.0

This is the most distinctive piece on the landing. **It is not a screenshot.** It is a real DOM rendering of the macOS Library window with selectable text and three live behaviours. **Updated 2026-05-20 to match Corder v0.9.0** (released 2026-05-17), polish-pass 2026-05-20: theme toggle, Settings tab content, taller window, scrollable transcript, idle-blob morph restored.

**Anatomy (left to right):**
1. **Sidebar.** Search field at top, 5 meeting cards in two date buckets (`Today`, `Yesterday`) + one in `This week`. Titles are Gemini-style auto-titles (e.g. `Investor sync - Vadym + Paul`); one fallback entry kept as a date stamp (`Yesterday, 15:28`) to show the unnamed-recording case.
2. **Main column header.** Breadcrumb `Recordings › Investor sync - Vadym + Paul` at 15 px. Right-aligned strip of 4 icon-only round buttons: theme toggle (moon -> sun crossfade), language (globe, decorative), archive (decorative), then 1px vertical hairline divider, then circular profile avatar with letter `K`. Header strip locked at `min-height: 64px` — breadcrumb font bumped to 15 px but the strip height does not change.
3. **Detail tabs.** Left column: single `Transcript` tab. Right column: two real tab buttons `Recording` | `Settings`. Click swaps the right-panel content; both states are wired.
4. **Transcript pane.** Toolbar = search field + two icon-only circular buttons (people-filter, copy-all). Body switches between three demo modes (recording → transcribing → transcript). The transcript pane scrolls vertically (custom thin webkit / firefox scrollbar). Default dialog runs 8 speaker turns.
5. **Right panel (Recording tab, transcript mode).** Top-to-bottom: video preview card (16:9 dark rectangle with centred play overlay), audio scrubber row (play button + time + scrub bar + download icon), Timeline section label, three per-speaker bars (Kostiantyn Halynskyi purple, Vadym Grosko accent green, Paul Turner amber). Window aspect-ratio 1180/720 guarantees all three speaker rows are visible without scroll.
6. **Right panel (Settings tab).** Stack of six framed cards: System notifications OFF, Screen video recording ON, Auto-transcribe OFF, Auto-title ON, hairline divider, Start/stop recording hotkey card with a pill showing `⇧⌘F`, Always offer to record with an Add button. Toggles are decorative (no real state, `tabIndex={-1}`). Each card is `border-radius: 10px`, hairline border `--hl-border`. The pill switch is `--hl-accent` when ON, `--hl-border-strong` when OFF.
7. **Recording blob.** Free-floating canvas in the bottom-right of the window, morphs shape and palette between green (idle) and red (recording). Click to stop / restart. Idle state still breathes and morphs through the four shape templates — `IDLE_FLOOR = 0.35` keeps the shape alive when not speaking.
8. **Theme.** Demo-local `data-theme="light" | "dark"`. Moon-icon click flips. Dark token palette mirrors the real macOS Corder `.dark` block: `--hl-bg #161615`, `--hl-fg #f2f2f0`, `--hl-accent #1f9d59`, plus speaker colours rebalanced for dark luminance. The landing's own theme is NOT affected.

**Webflow path:** **Custom embed required.** The entire `HeroLibraryDemo.tsx` + `HeroLibraryDemo.css` should be embedded as a single HTML/CSS/JS block:
- Hand-port the JSX to HTML (it's all static markup except for the play button event handler, the blob canvas, and the four buttons that drive theme / right-tab state).
- Hand-port the `.css` file (drop into a `<style>` block or Webflow-side stylesheet — beware that Webflow's class compiler does not respect scoped tokens, so prefix all internal classes with `hl-` as already done).
- Implement five small JS pieces inline:
  1. **3D tilt** (~30 lines): rAF loop on pointermove inside the `.hero-library-demo` container. `MAX_X = 3°, MAX_Y = 4°, LIFT = 4px`.
  2. **Play toggle** (~5 lines): click `.hl-audio-btn-primary` → toggle `data-playing="true"` on `.hero-library-demo`.
  3. **Mode state machine** (~40 lines): recording → click blob → transcribing (1.2s) → transcript. State drives which content appears in the transcript pane and whether the video preview + scrubber are armed.
  4. **Recording blob canvas** (~200 lines): port from `RecBlobCanvas` in the React file. Note `IDLE_FLOOR = 0.35` and the `colorActivityFor` split. This is the only piece that genuinely needs canvas; everything else is plain DOM.
  5. **Theme toggle + tab swap** (~15 lines): click moon -> flip `data-theme` on the demo root; click `.hl-tab-btn[data-tab="settings"]` -> swap visible right-panel block. Universal 240 ms CSS transition already handles the crossfade.

**Note:** The reveal animation (`data-reveal="initial" → "visible"`) can be replaced by a Webflow IX2 page-load animation that toggles a class on the card with the same transform values. Don't reimplement it in custom code — let IX2 do it.

**Reduced motion:** Both `@media (prefers-reduced-motion: reduce)` and `html[data-motion="off"]` blocks in the CSS zero every transition duration to 0 ms. Theme toggle still works under reduced motion — it just flips instantly with no crossfade.

**Speaker-colour tokens (scoped to `.hero-library-demo`, NOT brand accents):**
- `--hl-speaker-purple: #5a3aa6` — Kostiantyn Halynskyi (other speaker, two-letter avatar)
- `--hl-accent: #1f7a4f` — Vadym Grosko (other speaker, two-letter avatar; same hex family as brand but scoped local)
- `--hl-speaker-amber: #c7741b` — Paul Turner (other speaker, two-letter avatar)
- `--hl-speaker-self: #a16207` — first-person `I` (self speaker, single-letter avatar). **Speaker colour only — never use for landing CTAs or section accents.**

### 1c. Dot-grid surface

`background-image: radial-gradient(circle, #ececea 1px, transparent 1px); background-size: 24px 24px;` with a `mask-image: linear-gradient(to bottom, transparent 0, rgba(0,0,0,0.6) 18%, rgba(0,0,0,0.6) 82%, transparent 100%);` for top/bottom fade.

**Webflow path:** Native. Use a Div Block with custom CSS (Webflow now supports `mask-image` in style panel as of mid-2025).

---

## Section 2 — AudienceLine (`src/components/sections/AudienceLine.tsx`)

The most subtle technical thing on the page. A single editorial sentence whose colour and blur fill word-by-word as the user scrolls past it.

**How it works:**
- The sentence is split into per-word `<span class="audience-line__word">`.
- Three of those ranges get an additional `--accent` class.
- Native CSS `@keyframes audience-word-fill` animates `color` from `--color-text-faint` to `--color-text` (or `--color-accent`) and `filter: blur(2px) → blur(0)`.
- Animation is driven by `animation-timeline: view()` with `animation-range: cover 25% cover 75%` — no JavaScript, no scroll listener.

**Webflow path:** **Custom embed required.** Webflow IX2 scroll triggers cannot do per-word stagger off scroll progress in the way native `animation-timeline: view()` does. Two options:

1. **Recommended:** Embed the entire HTML + CSS as a custom code block. The CSS is the whole trick; the HTML is plain `<span>` tags. Webflow will pass through `animation-timeline` as unknown but valid CSS. Browser support is Baseline 2026 (Chrome 115+, Safari 18+) and the `@supports` fallback already renders the words in their final state for older browsers.

2. **Fallback:** Drop the scroll-driven part entirely in the Webflow rebuild and use a single IX2 stagger on scroll-into-view that reveals all words at once over 1.2s. Less editorial but Webflow-native.

**Accent ranges (zero-indexed, end-exclusive) for the current copy:**
- "founders taking investor calls," → `[1, 5)`
- "consultants on client kickoffs," → `[5, 9)`
- "anyone who thinks out loud" → `[10, 15)`

If copy changes, recompute these.

**Reduced motion:** Already handled. `@media (prefers-reduced-motion: reduce)` and `@supports not (animation-timeline: view())` both render words in final state.

---

## Inspector contract

Every structural element in this build carries:
- `data-component="<ComponentName>"`
- `data-source="projects/corder-landing/src/components/...."`
- `data-tokens="<comma-list of token names>"`

In dev mode, Cmd+click any element to see these in a floating panel. Webflow rebuild does not need to preserve these attributes — they are a development handoff aid only.

---

## Performance

| Metric | Status |
|---|---|
| Hero card aspect-ratio reserved (CLS=0) | ✓ |
| No JavaScript blocking first paint | ✓ — hero copy and demo render server-side |
| Fonts: `display: swap`, `next/font/google` self-hosts | ✓ |
| No JS smooth-scroll library | ✓ — native `scroll-behavior: smooth` + `scroll-padding-top: 88px` on `<html>` |
| Total framer-motion + project code gzipped | within ≤ 80KB budget |

In Webflow rebuild, prefer self-hosted Plex woff2 files over Google Fonts CDN to keep LCP under 1.5s on cold paid traffic. For anchor scrolling, set `scroll-behavior: smooth` on the html element in Webflow's custom CSS panel; do NOT install a smooth-scroll plugin (Lenis/Locomotive). The site was tested without one and the macOS hardware momentum reads better than any JS smoothing.

---

---

## Section 3 — Privacy / Trust (`src/components/sections/Privacy.tsx`)

Two-card trust block. Asymmetric anchor: heading + subhead in the left 8 of 12 columns; cards full-width below in a 2-col grid (1-col on narrow mobile).

**Card 1 — "Default" (cloud transcription).** Forest-green `Default` tag, H3, body 18px, then a spec list. Spec rows: 12px small-caps key + 16px sans value. Hostnames and HTTPS URLs auto-render in IBM Plex Mono 14px.

**Card 2 — "Local Storage".** Neutral tag, same shape. File paths (`~/Library/Application Support/Corder/`) auto-render in mono.

**Webflow path:** Native. CSS Grid for 2-col layout. Each card is a Div Block with 1px border, 12px radius. Spec rows are nested grids. The mono auto-detection happens client-side (regex matches paths/hostnames/HTTPS) — in Webflow, hand-mark the mono fields manually.

**Custom code:** None.

---

## Section 4 — How it works (`src/components/sections/HowItWorks.tsx` + `HowItWorksMockups.tsx`)

**Updated 2026-05-21 (`feat/hero-v090`):** the section now uses a single shared window that snaps diagonally between three chapter slots (35vh / 105vh / 175vh) as the user scrolls; the INSIDE of the window swaps between three full-fidelity Corder UI mockups — Dashboard, Library + Transcript, Settings — keyed on the active chapter. The previous 4-step `data-active-step` cross-fade has been superseded.

**Layout (desktop, >= 768px):**
- `.hiw-track` is the section's positioning context. Three `.hiw-row` slabs at 70vh each (210vh total) carry the chapter text on alternating sides (right / left / right).
- `.hiw-window-wrap` is `position: absolute` inside the track. Framer-motion springs animate its `top` and `left` from 35vh/0% -> 105vh/52% -> 175vh/0% via `useScroll` step functions + `useSpring` (stiffness 105, damping 24, mass 0.7).
- Inside the window: a constant macOS titlebar (3 traffic-light dots) PLUS a swap layer `.hiw-window-content` filling `inset: 28px 0 0 0`. The swap layer hosts `<ChapterMockup chapter={1|2|3} />`.

**Active chapter tracking:**
- IntersectionObserver on the three `.hiw-row` elements, `rootMargin: -40% 0px -40% 0px`, threshold `[0, 0.25, 0.5, 0.75, 1]`. Picks the most-visible row, lifts its index (1/2/3) to React state.
- `<AnimatePresence mode="wait">` with `key={chapter}` and a 240 ms opacity-only crossfade on doctrine easing handles the swap. Window CHROME stays mounted; only inside swaps.

**Three mockups (`HowItWorksMockups.tsx`):**

| Chapter | Component | Inside the window |
|---|---|---|
| 01 Record from anywhere | `<DashboardMock />` | Sidebar (search + 8 meeting cards across Today / This week) + Stats tab + "Ready when you are." start card + accent-green Start recording pill + "or press ⇧⌘F" hint + RECORDINGS / TOTAL RECORDED / THIS WEEK stats card + Recent rail (7 cards) + static green corner orb. |
| 02 Have your meeting | `<LibraryMeetingMock />` | Sidebar (4 cards, 2 in failed state) + breadcrumb "Dashboard > Quarterly review with Anna and Marc" + Transcript / Summary tabs + Recording / Settings tabs (Recording active) + 4 transcript turns between Anna H. (purple), Marc S. (amber), I (accent) + ZoomCallMock video preview + audio scrubber 0:00 / 14:45 + Timeline with three speaker bars. |
| 03 Tune it to your workflow | `<SettingsMock />` | Sidebar (6 cards, "Screen video and call recording" active) + breadcrumb "Dashboard > Screen video and call recording" + Transcript / Summary tabs + Recording / Settings tabs (Settings ACTIVE) + 4 transcript turns S1/S2 + 6 settings cards: System notifications OFF, Screen video ON, Auto-transcribe OFF, Auto-title ON, ⇧⌘F hotkey pill, Always offer to record (clipped). |

**Speaker palette inside the mockups:** purple `#5a3aa6` + amber `#a16207` + accent `#217a50` for self. These are scoped to product-UI demos and are NOT a second brand accent. The single brand accent stays `#217a50`.

**Recording HUD inside each mockup:** `.hl-mock-blob` — a 22×22 CSS radial-gradient circle with an accent-toned box-shadow halo. Static (no canvas, no animation). The animated `RecBlobCanvas` blob is reserved for the hero demo so it remains a hero signature.

**Reduced motion (`prefers-reduced-motion: reduce`):**
- `.hiw-track` collapses to `.hiw-static`. Each step renders inline above its `<WindowFrame chapter={N} reduced />` — the AnimatePresence wrap is skipped; the mockup paints into a fixed 16/10 box per step.
- The mockups themselves are static product UI by design (no canvas blob, no scrubber animation, no playhead cursor), so reduced-motion users see the same content, just stacked.

**Mobile (<= 767px):**
- `.hiw-window-wrap` is already `display: none`. Numbered step cards (01/02/03 via CSS counter) carry the section on phones, no mockups rendered.
- Reduced-motion fallback also hides the static window-tilt block on phones (`.hiw-static__row .hiw-window-tilt { display: none }`).

**CorderPresence morph chain:** untouched. The shared `layoutId={CORDER_PRESENCE_LAYOUT_ID}` lives on `.hiw-window-inner` (one level above `WindowFrame`), so framer-motion still animates from the last sticky window box to the bottom-right orb when the user crosses the section bottom.

**Webflow path:** **Custom embed required.** Three pieces of custom code:

1. The diagonal-snap + lift-pulse machinery from `HowItWorks.tsx` (Framer Motion `useScroll`/`useSpring`/`useTransform`). Webflow IX2 cannot drive a step-function with a spring-smoothed settle; embed the JSX (transpiled to JS) + the `.hiw-*` CSS.
2. The IntersectionObserver chapter tracker (~30 lines of JS) that lifts `data-active-chapter` onto `.how-window`. Same shape as the previous How section's tracker, just three rows instead of four.
3. The three mockup component trees (`DashboardMock`, `LibraryMeetingMock`, `SettingsMock`) are static JSX with hand-rolled SVGs — they transpile cleanly to plain HTML + CSS. The crossfade between them is a single `AnimatePresence`; Webflow can replicate it with a class-toggle + 240 ms opacity transition.

**Inspector triple:** every new component carries `data-component` / `data-source` / `data-tokens`. The mockups are tagged `HowItWorksMockup.dashboard / library / settings`.

---

## Section 4 (legacy) — How it works (`src/components/sections/How.tsx`) — superseded

Scroll-pinned narrative. **The most technically distinctive section after the hero.** Implementation: 2-col grid at lg+, sticky live-UI panel on the left, scrolling chapter list on the right. IntersectionObserver tracks the centred chapter and switches a `data-active-step` attribute on the sticky panel; CSS selectors cross-fade between four step panes.

**Layout (lg+):**
- Grid `1fr 1fr`, 64px gap.
- Left column: `position: sticky; top: 96px;` (offset matches the 64px nav + 32px breathing).
- Left content: `<HowWindow data-active-step="01|02|03|04">` — 4:3 panel with macOS-style title bar (3 traffic-light dots), then four absolutely-positioned panes that cross-fade based on `data-active-step`.
- Right column: 4 chapter blocks. Each chapter has `min-height: clamp(360px, 60vh, 720px)` so it claims a viewport-ish band as the user scrolls. Hairline divider between chapters.
- Each chapter: oversize Plex Serif accent-green numeral (clamp 72-128px) + H2 (clamp 24-32px) + body 18px max-width 48ch.

**Layout (< lg):**
- Sticky disabled. The window renders inline above the chapters list.
- Chapters have `min-height: 320px` instead of `60vh` to keep the page readable on small screens.

**State sync mechanism:**
- IntersectionObserver with `rootMargin: -35% 0px -35% 0px` — produces a 30%-tall middle band; chapters claim active state when their bounding-box centre is closest to viewport centre.
- On every entry change, the React component setState updates `<HowWindow>'s data-active-step`. CSS selectors `[data-active-step="0X"] [data-step="0X"]` use opacity + 8px translateY transition over 350ms doctrine easing.

**Four step panes:**
- 01 Idle: menu-bar pill with accent dot + `Corder` + timer `0:00`; rounded "Start" button with trailing accent dot; two empty content-line placeholders.
- 02 Recording: pulsing red dot + `Recording` label + ticking timer `04:17`; 12-bar animated waveform (each bar scales 1↔0.55 over 1.6s, staggered).
- 03 Transcript: KH avatar (purple) + "Right, so the next step is to validate it. <mark>Let us circle back on Thursday.</mark>"; VG avatar (green) + "Hmm, let me think about that for a second. Good point."
- 04 Drag: TRANSCRIPT pane → `→` accent arrow → NOTION pane (with target-tinted background).

**Webflow path:** **Custom embed required.** Webflow IX2 cannot drive a state-machine `data-active-step` from "which item is most-centred" out of the box. Two recipes:

1. **Recommended:** Embed the JSX (transpiled to plain JS) + the relevant CSS as a custom code block. The mechanism is ~40 lines of JS:
   ```js
   const root = document.querySelector('.how-grid');
   const chapters = [...root.querySelectorAll('[data-step]')];
   const window = root.querySelector('.how-window');
   const io = new IntersectionObserver((entries) => {
     const visible = entries.filter(e => e.isIntersecting);
     if (!visible.length) return;
     const vc = window.innerHeight / 2;
     visible.sort((a,b) => Math.abs(a.boundingClientRect.top + a.boundingClientRect.height/2 - vc)
                        - Math.abs(b.boundingClientRect.top + b.boundingClientRect.height/2 - vc));
     window.dataset.activeStep = visible[0].target.dataset.step;
   }, { rootMargin: '-35% 0px -35% 0px', threshold: [0, 0.5, 1] });
   chapters.forEach(c => io.observe(c));
   ```
2. **Fallback:** Use 4 separate IX2 scroll-into-view triggers, each toggling a class on the sticky panel. Less precise (no centre-point logic) but Webflow-native.

**Reduced motion:** Recording-pulse and waveform animations halt via `:root[data-motion="off"]` and `prefers-reduced-motion: reduce` in CSS. The sticky behaviour itself is JS-free transformation of CSS positioning so doesn't need a kill-switch.

---

## Section 5 — Features (`src/components/sections/Features.tsx`)

6-cell hairline-bordered grid. 3×2 at lg, 2×3 at sm, 1×6 at base. **Zero pictograms in cell chrome.** Each cell renders an inline-SVG mock per `visualHint` in copy.json. **Updated 2026-05-21 (second pass)** on `feat/hero-v090`: AUDIO and RE-RUN cells removed (user feedback: those features don't matter to the target audience). AUTO-DETECT illustration redrawn from the real Corder popover (`Sources/Corder/UI/PopoverContentView.swift`). Two new cells added: NO-BOT and TRANSCRIPT.

| Eyebrow | visualHint | Inline-SVG mock |
|---|---|---|
| TIMELINE | `mini-timeline-fragment` | 320×120 card. Two horizontal rows. Row 1 `Vadym` (purple `#5a3aa6` ticks). Row 2 `Kostiantyn` (neutral `--color-text-subtle` ticks). Accent-green playhead dot on row 1 with vertical line. ASCII time scale `00:00` -- `12:40`. |
| SCREEN | `screen-video-frame` | 320×180 dark `#202124` frame. Inner mock window: traffic lights + 9 code-line stripes. Centred accent-green play button (22px radius circle + white triangle). |
| AUTO-DETECT | `popover-widget` | 320×260. Dark `#1c1c1e` 280x240 card with 14px corner radius and an accent dropdown caret at top-center. Inside: IdleStatus row (10px grey 45% dot + "Not recording" + monospaced "00:00" in light weight, all in 55% white). Primary button: light `#f5f5f7` rounded rect, 240x44, with red `#dc2626` 8px dot + "Start recording" near-black label. Hairline separator (white 8%). Secondary button: outlined transparent rect with a `rectangle.stack` two-squircle icon + "Open library" 85%-white label. Bottom: small centered grey "Quit" link at 12pt. Geometry follows the Swift `PopoverContentView` source: `.padding(20)`, `.frame(width: 320)`, spacing 18, radii 8 inner / 14 outer. The accent caret is the spotlight; the red dot stays red for product fidelity (see DECISIONS.md 2026-05-21). |
| DRAG | `drag-out-gesture` | 320×160. Transcript card (`TRANSCRIPT` eyebrow + `Investor call` title + 4 truncated lines) rotated -4 degrees as if mid-drag. Accent-green dashed quadratic curve + arrowhead pointing at a dashed `Notion / Drop here` target. |
| NO-BOT | `no-bot-grid` | 320×200. 14px dark menu-bar strip at the top with a tiny white-65% status dot. Below: dark `#101112` call canvas with two 142×120 participant tiles. Tile 1 = "V" on a purple `#5a3aa6` 22px avatar + caption "Vadym". Tile 2 = "Y" on an amber `#a16207` avatar + caption "You". Centered caption "2 in this call" at the bottom. Accent annotation: 1px elbow path from the menu-bar status dot down-right with a small accent dot at the elbow, plus an accent right-anchored label "CORDER LIVES HERE" in 10px small-caps. The annotation teaches the absence: Corder is not in the call, it lives in the menu bar. |
| TRANSCRIPT | `transcript-fragment` | 320×160. Light card with neutral border. Top row: monospaced `02:14` left, 208px scrubber track (neutral grey), accent fill at ~58% of the track, accent playhead handle (6px circle + 2.5px white inner), monospaced `06:48` right. Hairline divider. Bottom row: 32×32 purple `#5a3aa6` speaker badge with white "KH" initials, "Kostiantyn" + monospaced `02:14`, snippet "We can ship the cache by Friday.", plus two faint placeholder lines. The scrubber accent fill + handle is the spotlight. |

**Grid borders:** External 12px radius via `border-radius: 12px; overflow: hidden;` on the grid wrapper. Internal hairlines via `:nth-child` selectors so `gap: 0` plus borders give a Pentagram-style grid without doubled lines.

**Hover:** cell `bg -> --color-surface-2` over 200ms doctrine easing. No translate, no shadow.

**SVG sizing:** every mock declares `viewBox="0 0 320 ${h}"` and stretches to 100% cell width via `.ftr-svg { width: 100%; height: auto; }`. Heights vary: timeline 120, video frame 180, menu bar / drag / audio 160, version row 56. All SVG fills/strokes use `var(--color-*)` so theme/accent flips are zero-cost.

**Webflow path:** All six mocks are pure inline SVG. In Webflow each cell's visual is an Embed element holding the SVG string verbatim (no JS needed). Replace `var(--color-accent)` etc. with literal hex values inside the Embed, since Webflow's Embed doesn't see CSS custom properties from the surrounding page chrome. Recommended: store the literal hex strings in the Webflow project's "Style guide" page as native colour swatches, then paste them into each Embed. Single accent per cell, one role per mock -- if a colleague edits the SVG, ASCII text only, no microphone glyphs.

**ASCII note:** the version row uses literal `->` (hyphen-greater) instead of the typographic arrow. Don't substitute -- the page-wide doctrine bans typographic dashes/arrows.

---

## Section 6 — Pricing (`src/components/sections/Pricing.tsx`)

Three tier cards (Free / Personal / Pro) at equal columns at md+, stack at base. Lifetime sits below as a separate full-width plank.

**Annual toggle:** Two-button segmented pill above the grid. Active option: `--color-text` background, white text. Inactive: transparent + muted text. Beside the toggle: an accent-subtle "PAY ANNUALLY, GET 3 MONTHS FREE" pill (never `Save 25%`, doctrine).

**Tier card structure:**
1. Header: tier name (Plex Serif 22px) + optional `Recommended` badge (accent fill).
2. Price row: big serif price (clamp 40-56px) + `/forever` or `/per month` suffix (14px).
3. (Annual mode only) `$XXX billed annually` annual note in 14px subtle.
4. Subline (1-2 lines, body 16px muted).
5. 1px hairline divider.
6. Features list: typographic `·` middle-dot in accent + label.
7. CTA pill at the bottom (primary on Personal/Pro, secondary outline on Free).

**Pro highlight:** `border-color: var(--color-text)` (darker hairline) + `background: var(--color-surface-2)` (subtle warm tint). No shadow, no accent fill.

**Lifetime plank:** Full-width 12px-radius card. Two-column at lg+ (1.2fr | 1fr): name + Launch-offer badge + big price + subline on the left, features list + secondary CTA on the right.

**Microcopy:** below the grid + plank, 14px subtle, max 64ch.

**Webflow path:** Native. The toggle is a 2-state visual swap — implementable with IX2 (`Hide / Show` actions on monthly vs annual price spans, `Active` class swap on the toggle pill). For the rebuild, render BOTH price spans inside each card and toggle visibility via IX2 click.

---

## Section 7 — FAQ (`src/components/sections/Faq.tsx`)

Wraps the kit `FAQAccordion` with `mode="multi"` (every panel toggles independently — readers compare answers side-by-side in long Q lists).

**FAQItem:** Top hairline + bottom hairline (last item only). Trigger: full-width button with question (clamp 17-20px Plex Serif) on the left, +/− glyph on the right (rotates 45° on open via 300ms transition).

**Panel:** `framer-motion` `AnimatePresence` + height/opacity exit, 350ms doctrine easing. Body: 16px muted, max-width 640px.

**a11y:** `aria-expanded` on the button. Focus-visible ring on the button. Keyboard: Enter / Space toggles.

**Webflow path:** Native IX2 accordion. Use the dropdown / accordion symbol with custom icon = `+` rotating to `×` on open.

---

## Section 8 — Final CTA (`src/components/sections/FinalCta.tsx`)

Centered editorial closing. Heading clamp(40-80px) Plex Serif, max-width 14ch (forces a 2-line break on the imperative "Open the menu bar. Click Start."). Single primary Download CTA pill. 16px qualifier line below.

Behind: subtle dot-grid surface (`#ececea` 1px dots on 24×24 grid), mask-faded top/bottom 30%/70%.

`id="download"` is the canonical CTA target across the whole page. All `#download` anchors land here.

**Webflow path:** Native. Hero-style layout, single CTA button.

---

## Section 9 — Footer (`src/components/sections/Footer.tsx`)

3-col grid at md+: `2fr | 1fr | 1fr`. Single col at mobile.

- Brand wordmark `Corder` in Plex Serif clamp(40-72px) — oversize editorial mark.
- Product column: Features / Privacy / Pricing / Changelog.
- Resources column: Source / Brand kit / Contact.

Column heading: 12px small-caps eyebrow. Items: 16px sans links with `→ --color-text` hover.

Hairline divider above the baseline row. Baseline: © 2026 Corder + back-to-top link aligned right. 14px subtle.

Top border on the footer is the only divider between Final CTA and Footer.

**Webflow path:** Native. Standard footer block with grid.

---

## Inspector contract (page-wide)

Every structural element carries:
- `data-component="<ComponentName>"`
- `data-source="projects/corder-landing/src/components/...."`
- `data-tokens="<comma-list of token names>"`

Verified in this build: 68 / 68 elements have all three attributes (CDP smoke harness, 2026-05-09).

---

## Sectioned-CSS provenance

All sections (3–9) added their styles to `src/app/globals.css` rather than per-component `.css` files. Rationale: most styles are short structural rules (grids, hairlines, type) reusable as Webflow class names; consolidating in one stylesheet matches Webflow's flat class system. The Hero `HeroLibraryDemo.css` remains separate because it's a self-contained app reproduction.

---

## Performance final (this session)

| Metric | Status |
|---|---|
| Hero card aspect-ratio reserved (CLS=0) | ✓ |
| No JavaScript blocking first paint | ✓ — sections render server-side, hydrate client-side |
| Fonts: `display: swap`, `next/font/google` self-hosts | ✓ |
| No JS smooth-scroll library | ✓ — native `scroll-behavior` only (Lenis removed 2026-05-22, see DECISIONS.md / CHANGELOG.md) |
| Total framer-motion + project code | ~7 KB gzip saved by dropping Lenis + react-icons; rerun `next build` after the next push to recompute first-load. |
| typecheck (`tsc --noEmit`) | exit 0 ✓ |
| build (`next build`) | exit 0 ✓ |
| Em-dashes / en-dashes / forbidden words in DOM | 0 / 0 / 0 ✓ |
| Body-text size violations | 0 ✓ |
| Pricing toggle interaction | functional ✓ |
| How sticky-window state cycle | functional ✓ |
| `?motion=0` motion gate | functional ✓ |
| Console errors / warnings / exceptions | 0 / 0 / 0 ✓ |

---

## CorderPresence — scroll-anchored morph chain (`src/components/presence/CorderPresence.tsx`)

A single visual element occupies three states tied to scroll position, all
sharing framer-motion `layoutId="corder-presence"`:

| State | Trigger | Surface |
|---|---|---|
| A — window | User above HowItWorks bottom | Sticky live-Library window inline in HowItWorks |
| B — orb | User has scrolled past HowItWorks (upper-40% threshold of its bottom sentinel) AND has NOT yet entered the form zone | 56x56 desktop / 48x48 mobile circle, fixed bottom-right (right: 32px desktop / 28px mobile, bottom: max(28-32px, safe-area-inset-bottom + 28px)). Decorative — `pointer-events: none`. Accent dot inside. |
| C — form | User has reached the form-zone sentinel (upper-40% threshold of the zero-height anchor between Faq and Footer) | 380x440 desktop / `min(92vw, 360px)` mobile contact card, fixed bottom-right at the same inset. Interactive — `pointer-events: auto`. Email input + Subscribe button using `copy.json#newsletter`. |

**Sentinels:**
- `corder-presence-sentinel` — 1px anchor at the bottom of HowItWorks (state A → B trigger).
- `corder-presence-form-sentinel` — zero-height anchor between Faq and Footer (state B → C trigger).

**Morph transition:** `{ duration: 0.6, ease: cubic-bezier(0.16, 1, 0.3, 1) }`. Width/height/border-radius/position all interpolate via shared layoutId.

**Reduced motion path:** `prefers-reduced-motion: reduce` OR `?motion=0` suppresses orb + form (corner-pinned non-animated card would be intrusive). Instead, `CorderPresenceStaticSection` renders an inline subscribe section between Faq and Footer (`.presence-static` CSS class, full-width centred form strip). Mounts via React state post-hydration; not in SSR HTML.

**Z-index:** orb z-30, form z-31, below Nav (z-40).

**Webflow path:** **Custom code required.** Webflow IX2 cannot reproduce the shared-layout interpolation between three differently-shaped elements. Options for handoff:
1. Keep a Webflow-native sticky Library window (state A) and a Webflow-native subscribe form section (state C). Drop state B (orb) — it's purely transitional and a non-morphing dot floating in the corner is just visual noise. Loses the "presence" narrative but ships in pure Webflow.
2. Embed `<CorderPresence>` from this React file as a custom code embed at the page root. Webflow page exposes a `<div id="corder-presence-mount">` and an init script bundles the React tree. Most fidelity, most maintenance.

If option 1 is taken, document the loss in the project README so the Webflow site is understood as a v0 of what this React landing demonstrates.

**Files touched by this affordance:** `src/components/presence/CorderPresence.tsx`, `src/app/page.tsx` (sentinel + static section placement), `src/app/globals.css` (`.presence-static` block), `src/components/sections/HowItWorks.tsx` (consumes `useCorderPresenceMode` to decide window mount), `content/copy.json` (`newsletter` block powers both form variants).

---

## Known follow-ups for next session

- [ ] Hero state machine S2/S5/S6 (active-line jump, sidebar new arrival, hover focus on timeline tick)
- [ ] Mobile fallback variant for Hero — currently the demo collapses to full-width at `<= 900px` viewport. Research recommends Phase 1 PNG fallback. Decision deferred to session 2.
- [ ] How sticky-window: optionally add a 5th step "Search" if copywriter expands flow. Current 4-step matches copy.json.
- [ ] Pricing: server-state for billing cookie if A/B testing reveals conversion impact of sticky-monthly default.
- [ ] Real Lighthouse measurement on prod-on-Vercel after deploy (4G throttled). Section 0 iter-3 LCP measurement was 820ms on raw localhost — well under 1500ms target but not the regulated test condition.

---

## Account infrastructure handoff (2026-05-25, Phase 1 only)

The four account routes (`/signup`, `/login`, `/verify`, `/account`)
are scaffolded as static-export React pages. Webflow developer
notes:

- Pages are CLIENT-INTERACTIVE only. They do not call any backend
  yet -- forms submit to mock state, /account renders `MOCK_USER`.
  Worker code lands in Phase 3 and the existing component code in
  `MagicLinkForm.tsx`, `VerifyClient.tsx`, `AccountView.tsx` is the
  CONTRACT for the Phase 3 fetch calls. Don't reimplement those in
  Webflow; they're React-only by design.

- The four routes ARE part of the static export and CAN be served
  through GitHub Pages / Cloudflare Pages as-is. The Phase 3
  backend lives at `api.getcorder.com` (separate Cloudflare Worker
  subdomain) so the landing host doesn't need any server runtime.

- Privacy Policy + Terms have a new Account-data section. These
  will need to be flagged for the maker's lawyer review before any
  EU-region paid traffic.

- Memory: every standalone page (legal, account, 404, thanks) uses
  the SAME `.legal-page + .legal-body` shell. Don't introduce
  decorative brand marks, min-height: 100vh centring, or new outer
  containers on new pages -- this was confirmed multiple times
  with the maker. See `feedback_corder_standalone_page_offsets`.
