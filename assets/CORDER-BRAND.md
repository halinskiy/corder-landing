# Corder — Brand & Design System

This file is bundled with the logos and screenshots so Claude has the full
context for designing a marketing landing page for Corder.

> **Last revised: 2026-05-09.** Earlier versions positioned Corder as
> on-device-only via Whisper large-v3 + FluidAudio. The shipping product
> uses cloud Gemini 2.5 Flash/Pro for transcription. This document
> reflects shipping reality, not the early architecture. Do not revert
> to the on-device framing without checking with the maker first.

---

## What Corder is

Corder is a **macOS meeting recorder for people who do not want a bot in
their call**. It is a status-bar app (no dock icon, no main window in
your way) that captures system audio and your microphone on separate
tracks, sends the audio to Google's Gemini 2.5 Flash (or 2.5 Pro on the
Pro tier) for transcription with built-in speaker labels, and gives you
a searchable transcript with an audio scrubber lined up to the second.

The defining structural fact: **Corder records the audio that is already
playing on your Mac**. It does not join the meeting. There is no third
participant on the call. The other side never sees a "Corder Bot" in
the participant list, never gets a recording-disclosure prompt from a
SaaS, never wonders who that fourth person is.

Audio leaves the machine only for the transcription step. Google
discards the audio after the call finishes; the transcript and the
local audio file live in `~/Library/Application Support/Corder/` until
the user deletes them. Optional Dropbox archive uploads to the user's
own Dropbox app folder, off by default.

| Attribute | Value |
|---|---|
| Platform | macOS 14+ (Sonoma); Apple Silicon recommended, works on Intel |
| Distribution | Direct download (DMG / app bundle); not on the Mac App Store; signed updates via Sparkle |
| Pricing | Free tier (Gemini 2.5 Flash, unlimited length, all features) — $0 forever. Pro tier (Gemini 2.5 Pro for tougher audio, priority support, early access) — $30 / month. |
| Status | Public beta, paid Pro tier active |

## Audience

The landing speaks first to **individuals whose calls are part of how
they make a living**, working alone or in small teams:

1. **Founders and indie makers** — customer interviews, design reviews,
   investor calls, co-founder syncs. They want a transcript without
   sending a bot into a sensitive conversation.
2. **Freelance designers, developers, consultants** — discovery calls,
   client kickoffs, quote conversations. They cannot show up to a
   client call with a third-party AI assistant in the room.
3. **Coaches, therapists, advisors** (where local law allows
   recording) — 1-on-1 calls where the client should not have to
   "approve a SaaS recorder" before talking.
4. **Solo thinkers** — people who talk-to-think, dictate notes, walk
   and record. They want fast, accurate transcription, not a
   collaboration platform.

Tertiary audience: developers and Mac power users who simply prefer
native tools over Electron and would rather hit a menu-bar shortcut
than open a web app.

What this audience does **not** want to see:

- Hero shots of multi-person video meetings with floating notification cards.
- "Magic AI" copy that promises to do their job for them.
- Pricing tiers labelled Starter / Team / Enterprise.
- Logos of Fortune 500 customers.
- Anything that looks like a generic Series B SaaS landing.
- Bot-in-the-call screenshots from competitor products.

## Competitors and how Corder differs

| Competitor | Their angle | What Corder does differently |
|---|---|---|
| Granola | A bot joins your meeting and writes structured notes; cloud-stored | No bot — captures system audio at the OS level, the other side sees nothing; transcript only, no opinionated note structure |
| Otter.ai | Real-time cloud transcription, team workspaces, bot in-call | No bot, no team layer, no "Otter joined the meeting" prompt for your guest |
| Fathom | Sales-first, bot joins the call, AI summary shared by URL | No bot; no shared dashboards; the transcript is yours and lives on your Mac |
| Fireflies.ai | Bot joins, cloud-recorded, CRM integrations | No bot; no CRM lock-in; no SaaS dependency to drag a transcript into your notes |
| MeetMemo | "100% on-device" privacy claim | Honest: Corder is cloud-transcription. Audio goes to Gemini for the transcription step and Google deletes it after. Nothing sneaky, nothing claimed that is not true. |
| MacWhisper | Local Whisper transcription of files you already have | Records and transcribes in one tool; system audio capture is the hard part Corder solves; speaker labels included |

The single positioning sentence: **"The Mac recorder for meetings —
without the bot in the call."**

## Tone of voice

- **Matter-of-fact and technical.** Audience is sceptical of marketing
  prose; they trust specifics. Mention "Gemini 2.5 Flash", "system
  audio capture", "Apple Silicon", "Sparkle auto-updates" by name.
  Acronyms and version numbers are a feature, not a bug.
- **Quietly confident, not boastful.** No "revolutionary", "game-
  changing", "AI-powered". The product is good; let the spec sheet
  say so.
- **Editorial, not ad-copy.** Long lines, em-dash-free clauses (use
  comma or full stop), single-column reading width on hero copy. Read
  like a well-typeset essay, not a Notion announcement.
- **No emoji. No "we" performance.** First-person plural is fine in the
  About section, never in feature copy.
- **No clichés.** Forbidden words: "seamless", "powerful", "robust",
  "cutting-edge", "supercharge", "unlock", "leverage", "next-gen",
  "redefine", "revolutionary", "magical". Use plain English instead.
- **No em dashes.** This is a hard project rule. Every clause that
  wants an em dash gets a comma, a colon, or a full stop instead.
- **Bot-free framing is the lead.** Most landings bury the recording
  mechanism as a footnote. Here, the absence of a bot is the headline.
- **Privacy is honest, not marketed.** Do not call Corder "private" or
  "on-device" — it is not on-device. State the truth: Google transcribes
  the audio and deletes it after the call. That is sufficient for the
  audience without overclaiming.

## Key messages (in priority order)

1. **No bot in the call.** Corder records the system audio on your
   Mac. There is no third participant in the meeting. The other side
   sees nothing different. This is the lead.
2. **Works with anything that plays sound.** Zoom, Meet, Discord, Teams,
   FaceTime, in-person mic recordings — Corder does not care about the
   platform. It captures what your Mac plays.
3. **Speakers labelled, transcript searchable.** Gemini 2.5 Flash
   (Free) or Gemini 2.5 Pro (Pro tier) returns a transcript with
   built-in speaker labels. Search runs across every recording you
   have.
4. **Audio scrubber lined up to the second.** Click any segment in the
   transcript, the audio jumps. Per-speaker timeline on the right pane.
5. **Mac-native craft.** Menu-bar app, real macOS shortcuts, drag-out
   to Notion / Obsidian / Apple Notes, Sparkle signed updates, no Mac
   App Store middleman.
6. **Honest cloud transcription.** Audio uploads to Gemini for
   transcription only. Google deletes it after the call. Local
   transcript and audio stay on your Mac in `~/Library/Application
   Support/Corder/` until you delete them. Optional Dropbox archive,
   off by default, uploads to your own Dropbox.

## Visual direction

### Colour

Light theme is the default state. Dark theme is a secondary toggle, not
a separate skin — and not a priority for the launch landing.

The product palette pulled from the existing app:

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#ffffff` | Surface |
| `--bg-elev` | `#f7f7f6` | Sidebar / elevated card |
| `--bg-hover` | `#fafaf8` | Hover fill |
| `--bg-active` | `#f3f3f1` | Active fill |
| `--border` | `#ececea` | Quiet divider |
| `--border-strong` | `#d8d8d4` | Card / input border |
| `--fg` | `#0e0e0d` | Primary text |
| `--fg-muted` | `#6b6b68` | Secondary text |
| `--fg-dim` | `#a0a09c` | Tertiary / placeholder |
| Speaker green | `#1f7a4f` | Speaker accent / status ready |
| Speaker purple | `#5a3aa6` | Speaker accent |
| Speaker red | `#b03a3a` | Speaker accent |
| Speaker blue | `#1a4f8a` | Speaker accent |
| Recording red | `#c4423a` / `#dd3340` | Live record indicator |
| Status amber | `#b07b1a` | Warning |

**Accent for the landing: deep green `#1f7a4f`** (paired with darker
`#0e3d28` for occasional gradients).

This is the locked accent — borrowed from the portfolio icon and the
"ready" status. Reads as trust, archive, completed-and-stored. Do not
introduce a second accent. Greys, ink and white are not accents.

### Typography

- Headings & display: **IBM Plex Serif** (300, 400, 500). Trim, slightly
  bookish, pairs naturally with the editorial tone.
- Body, UI, captions: **IBM Plex Sans** (400, 500, 600). Geometric but
  warm, readable at small sizes.
- Mono (used in spec lists, version numbers, code-like fragments):
  **IBM Plex Mono** for editorial accent.
- **Minimum body size: 16px.** No exceptions for body copy.
- Eyebrow labels: 12px, uppercase, `letter-spacing: 0.04em`,
  `font-weight: 600`. Only allowed at 12px under those exact constraints.
- Display sizes (suggested fluid scale):
  - Display 64 / 56 / 48 — hero headline
  - H1 40 / 36 — section header
  - H2 28 / 24 — sub-section
  - Body 18 — long-form prose
  - Body 16 — UI / shorter copy
  - Caption 14 — figure captions, footnotes
  - Eyebrow 12 — section labels

### Shape, surface, motion

- **Radii:** 12px for cards, modals, large surfaces. 8px for buttons,
  inputs, small cards. `rounded-full` only on badges, dots, avatars and
  toolbar pills (the existing app's chrome convention — keep it).
- **Borders, not shadows.** Every card, input and surface gets a 1px
  border (`#d8d8d4` light / `#393939` dark). Shadows are secondary depth
  and only in light theme.
- **Hairline grid as connective tissue.** 12-column macro grid with
  1px hairlines acting as section dividers, eyebrow-baseline rules and
  feature-cell separators. IBM / Pentagram editorial style. The grid
  does the work of "structure" so iconography does not have to.
- **Backgrounds:** dot-grid `radial-gradient(circle, #e5e5e5 1px,
  transparent 1px); background-size: 24px 24px` where atmosphere is
  wanted. White or near-white otherwise.
- **Motion easing:** `cubic-bezier(0.16, 1, 0.3, 1)`. Fast-in,
  gentle-out. Nothing bouncy, elastic, or overshooting. Pneumatic, not
  playful.
- **Transitions:** every interactive element has a 150ms minimum
  transition on hover / focus / active. Raw state changes are not
  allowed.
- **Scroll-driven motion uses native CSS** (`animation-timeline:
  scroll()` / `view()`) wherever the browser supports it. No GSAP
  ScrollTrigger, no Framer Motion scroll triggers, no Babel-standalone.
  Motion 12 is reserved for entry animations and stateful interactions.

### Iconography

- **Icons are restricted to where meaning collapses without them.**
  Allowed: logo mark, traffic lights in window chrome, play / pause
  glyphs in the audio scrubber, plus / minus for FAQ accordions, search
  magnifying glass inside an input. That is the full list.
- **Avoid microphone icons.** The product is about the recording
  itself, not the hardware.
- **No feature-card pictograms.** Features are illustrated with
  typography and small UI fragments, not icons.
- Status / inline icons (only where allowed above): 14–16px,
  1.5–2px stroke, rounded caps, no fill.

### Imagery

- **Live UI demo is the hero asset, not screenshots.** The hero renders
  a real, interactive slice of the Corder library window in HTML/CSS,
  with 3D tilt on cursor, a per-speaker timeline that animates on
  scroll, and an audio scrubber that plays. This is the structural
  competitive advantage over Granola, Otter, Fathom — they all use
  static screenshots or MP4.
- **Reference shots in this bundle** (used for development, not
  necessarily on the final page):
  - `screen-library.png` — main library window with sidebar.
  - `screen-popover.png` — menu-bar popover (start / stop control).
  - `screen-recording.png` — active recording state.
- Where a static image is unavoidable (mobile fallback, og:image),
  frame it inside a window chrome at 12px radius with a thin border.
  No fake gradients, no glassmorphism, no isometric tilt.
- Photography is acceptable only if it is editorial-grade and quiet
  (a desk, soft daylight). Avoid stock-shoot meeting scenes and
  microphone hero shots.

## Section pattern shortlist

The landing follows **structure F.A "Skeptic"** from the kickoff
research (`research/corder-landing-research-2026-05.md` §F.A and
`research/corder-fb-enthusiast-mocks.md` for the alternative). Section
order, top to bottom:

1. **Editorial hero with live UI demo.** Large IBM Plex Serif
   headline ("No bot in the call." or copywriter's chosen variant),
   single supporting line, two CTAs (Download for macOS / How it
   works), and a real, interactive slice of the Corder library window
   below the copy. 3D tilt on cursor stays.
2. **Audience-line scroll-fill.** A single editorial sentence that
   fills word-by-word as the user scrolls past it. Native CSS
   scroll-driven, not GSAP.
3. **Privacy / Trust.** Two-card layout: what runs in the cloud
   (Gemini Flash, deleted after) and what stays local (audio,
   transcript). Honest, specific, no marketing softening.
4. **How it works.** Four steps without 01-02-03 boxed-numbers
   cliché. Scroll-pinned narrative with a sticky live UI panel on the
   left and step copy revealing on the right (see
   `research/corder-how-features-deep-dive.md` for the chosen pattern).
5. **Features.** 6 cells in a hairline-bordered grid: 4 typography-
   only cells and 2 small UI-fragment cells. Zero pictograms. Each
   cell has eyebrow + display + body, no card chrome beyond the
   grid hairlines.
6. **Pricing.** Two columns. Free $0 forever (Gemini 2.5 Flash,
   speaker labels, search, drag-out, optional Dropbox archive). Pro
   $30/month (Gemini 2.5 Pro, better cross-talk and accents,
   priority support, early access).
7. **FAQ.** Plus / minus accordions. Lead with "Does it record Zoom,
   Meet, Discord?" and "Where does my audio live?". Privacy
   questions appear early in the list.
8. **Final CTA.** "Open the menu bar. Click Start." — single
   button. No additional visual weight.
9. **Footer.** Studio brand mark, Product / Resources columns, copyright,
   back-to-top.

## Stack the landing will be built on

The marketing site is a separate deliverable from the macOS app:

- Next.js 16 (App Router, React 19, TypeScript strict, Cache Components)
- Tailwind CSS v4 with `@theme` tokens
- Motion 12 for entry animations and stateful interactions
- Native CSS scroll-driven animations (`animation-timeline: scroll()`
  / `view()`) for everything scroll-linked
- Lenis 1.x for smooth scroll
- Deployed to Vercel (Fluid Compute by default)
- Will be rebuilt in Webflow afterwards by the studio's developer, so
  every component carries `data-component`, `data-source`,
  `data-tokens` attributes for handoff.

**Hard performance budget** (driven by paid-traffic LCP requirements):

| Metric | Target |
|---|---|
| LCP | < 1.5s on 4G |
| INP | < 100ms on any interaction |
| CLS | 0 from scroll-driven animations |
| Total JS gzipped | ≤ 80KB (Lenis + Motion 12 + project code) |

No Babel-standalone in production. No React UMD from CDN. No GSAP
ScrollTrigger. No Rive. No magnetic cursor. No Tweaks-panel in
production output (preview-only utility, gated to dev).

## Traffic and audience context

Primary channel for launch: **cold paid advertising** (Google Ads,
Meta Ads, X Ads). The landing is the front door for traffic that has
never heard of Corder before, has not read a tweet about it, and is
in skeptic mode. The sequence above (hero hook → audience → trust →
mechanism → features → price → FAQ → CTA) is built around that
skeptic flow.

Language: **English first**. Russian version is a Phase 2 deliverable,
not blocking the launch.

## What to never do

- Never use two accent colours.
- Never use body text under 16px.
- Never describe Corder as "AI-powered", "magical", "revolutionary",
  or use any forbidden word listed under Tone of voice.
- Never claim "100% on-device" or "your audio never leaves your Mac" —
  it does, for transcription. State the truth.
- Never frame Corder as a covert / stealth recorder. The legal frame
  is "no bot in the call" (professional UX); the user remains
  responsible for their own recording-disclosure obligations.
- Never show fake testimonials or invented logos of customers.
- Never show a microphone icon as decoration.
- Never bury the no-bot story below feature lists.
- Never use bouncy, elastic or overshoot easings.
- Never use em dashes in copy. Comma, colon or full stop instead.
- Never replace IBM Plex with another family without explicit
  approval.
- Never put Babel-standalone, React UMD, or GSAP CDN in production
  output. The current static HTML demo carries all three; they are
  the first things to remove on the rebuild.
- Never display three icon-features-in-a-row. Features are typographic
  and UI-fragment cells, not pictograms.
