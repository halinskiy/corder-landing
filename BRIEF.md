# corder-landing — Brief

**Distilled from `assets/CORDER-BRAND.md`, `research/corder-landing-research-2026-05.md`, `research/corder-hero-live-ui-deep-dive.md`, `content/copy.json`, `content/pricing-brief.md`, `COPY_AUDIT.md`. Date: 2026-05-09.**

## What we are selling

Corder is a macOS meeting recorder that does not put a bot in the call. It records system audio, sends it to Google Gemini 2.5 Flash for transcription, returns a labelled transcript with an audio scrubber lined up to the second, and stores everything locally in `~/Library/Application Support/Corder/`. Free for 300 minutes a month, $9 Personal, $14 Pro, $99 Lifetime launch offer.

## Audience

Cold paid traffic from Google Ads, Meta Ads, X Ads, mostly arriving in skeptic mode. They are:

1. Founders / indie makers — investor calls, customer interviews
2. Freelance designers / developers / consultants — discovery + kickoff calls
3. Coaches / therapists / advisors (where local law allows)
4. Solo thinkers who dictate notes

Tertiary: Mac power users who prefer native tools over Electron.

## What this audience refuses

- "Magic AI" copy that promises to do their job for them
- Generic Series B SaaS landings with logo walls
- Pricing tiers labelled Starter / Team / Enterprise
- Bot-in-the-call screenshots

## The single positioning sentence

> "The Mac recorder for meetings — without the bot in the call."

## Section order (F.A "Skeptic")

| # | Section | Purpose |
|---|---|---|
| 0 | Nav | Sticky header with brand mark, three nav links, primary CTA |
| 1 | Hero | Eyebrow + display-lg headline + 39-word subhead + two CTAs + qualifier + live macOS Library window demo with 3D tilt and ambient cursor walk |
| 2 | Audience-line | Single editorial sentence, three accent phrases, scroll-driven word fill via native CSS |
| 3 | Privacy / two cards | What runs in the cloud (Gemini Flash) vs what stays local. Honest, specific |
| 4 | How it works | Four steps — Click Start, Have your meeting, Read it back, Drag it out |
| 5 | Features grid | 6 typographic cells, hairline grid, no pictograms |
| 6 | Pricing | Free / Personal $9 / Pro $14 + Lifetime $99 |
| 7 | FAQ | Privacy questions first, then practical |
| 8 | Final CTA | "Open the menu bar. Click Start." |
| 9 | Footer | Brand mark + Product / Resources columns + back-to-top |

## Visual direction

- **Accent:** forest green `#1f7a4f` only.
- **Theme:** light, warm-paper neutral (`#ffffff` page, `#f7f7f6` elev) tuned to match the macOS app.
- **Type:** IBM Plex Serif (display + headlines + audience-line), IBM Plex Sans (body, UI), IBM Plex Mono (file paths, version sequences, transcript timestamps).
- **Borders, not shadows.** Every card and surface gets a 1px hairline. Shadows only on the hero demo card and only as secondary depth.
- **Hairline grid.** 12-column macro grid + 1px dividers as connective tissue, IBM / Pentagram editorial grammar.
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)`, fast-in gentle-out, nothing bounces.
- **Iconography is restricted** to: traffic lights in window chrome, play / pause glyphs in the audio scrubber, plus / minus in FAQ, search magnifier inside an input. That is the entire allowed list. **No microphone icons. No feature pictograms.**

## Patterns chosen

| Pattern | Source | Used in |
|---|---|---|
| Live UI window in hero | `research/corder-hero-live-ui-deep-dive.md` §3 | Section 1 |
| Editorial hero copy block | `ui-kit/PATTERNS.md` editorial hero | Section 1 |
| Scroll-driven word-fill (native CSS `animation-timeline: view()`) | `research/corder-landing-research-2026-05.md` §D1 | Section 2 |
| Hairline two-card trust block | `research/corder-landing-research-2026-05.md` §H | Section 3 (future) |
| Sticky two-column long-form for "How" | `ui-kit/PATTERNS.md` Sticky feature list | Section 4 (future) |
| Hairline cell grid for features | Section H research | Section 5 (future) |
| Three-tier pricing + Lifetime banner | `content/pricing-brief.md` | Section 6 (future) |
| FAQ accordion | `ui-kit/components/section/FAQAccordion.tsx` | Section 7 (future) |

## Performance budget

| Metric | Target | Hard ceiling |
|---|---|---|
| LCP | < 1.5s | < 2.0s |
| INP | < 100ms | < 200ms |
| CLS | 0 | < 0.05 |
| Total JS gzipped | ≤ 80KB | ≤ 150KB |

Hero image is the live UI window — DOM, not raster. Reserved aspect-ratio container ensures CLS=0. Below-fold sections will use `content-visibility: auto` once they exist.
