# corder-landing — Project Rules

Inherits from `~/Aisoldier/CLAUDE.md`. Project-specific overrides only.

## Project identity

- **Product:** Corder — a macOS meeting recorder. Status-bar app, captures system audio, no bot in the call, sends audio to Gemini 2.5 Flash for transcription.
- **Audience:** Founders, indie makers, freelance designers/developers/consultants, coaches, solo thinkers. People who do not want a third-party SaaS bot in their meetings.
- **Source dossier:** `assets/CORDER-BRAND.md` is the authoritative product brief. Read it before any decision about copy, layout, or art direction.

## Accent

- **Hex:** `#217a50` (forest green). *Updated 2026-05-10: was `#1f7a4f` from app status-ready dot, user authoritative override to `#217a50`.*
- **Hover/pressed:** `#0a5e34`.
- **Deep (dark hover for filled CTAs):** `#0e3d28`.
- **Subtle:** `rgba(33, 122, 80, 0.08)`.
- **Soft (highlight):** `rgba(33, 122, 80, 0.18)`.
- **Why this color:** Pulled from the macOS app and locked by the user. Reads as trust, archive, completed-and-stored. The other speaker color, purple `#5a3aa6`, lives only inside the live UI demo — it is *not* a second brand accent.

## Theme

- **Default:** light, near-white (`#ffffff` page, `#f7f7f6` for elevated surfaces). Aligned with the macOS app's `--bg-elev` token.
- **Dark theme:** **not built**. Phase 2 only.

## Stop-words and constraints

- **Forbidden words:** seamless, powerful, robust, cutting-edge, supercharge, unlock, leverage, next-gen, redefine, revolutionary, magical, AI-powered, premium, enterprise-grade, industry-leading, best-in-class, save 25%, free trial (for Free tier).
- **No em dashes, ever.** Comma, colon or full stop instead. Hyphens in compound modifiers (full-text, menu-bar, colour-coded) are fine.
- **Frame A only.** Never describe Corder as "covert", "invisible", "stealth", "no one knows", or in any way that implies the user is hiding from the other side. The frame is **"no bot in the call"**: the other side sees nothing different in their participant list.
- **No microphone icons** anywhere as decoration.
- **No fake gradients or glassmorphism** behind the live UI demo.
- **No GSAP, no Babel-standalone, no React UMD, no Rive** in production.

## Stack overrides from the global doctrine

- **Next.js 15** (App Router, React 19, TypeScript strict). The brief proposed Next.js 16 with Cache Components; we deliberately stay on 15 for stack stability — booquarium and template-design are both 15 and the symlinked `@aisoldier/ui-kit` integration pattern is debugged there. Move to 16 in a separate, scoped session, not as part of section work.
- **Tailwind CSS v4** with `@theme` blocks for tokens. `@source` directive points back to the kit.
- **Framer Motion 12** for entry animations only (hero copy reveal). Scroll-linked work is **native CSS** `animation-timeline: view()`.
- **No JS smooth-scroll library.** Lenis was removed 2026-05-22 on user-reported lag. Use native `scroll-behavior: smooth` + `scroll-padding-top: 88px` on `<html>` for anchor jumps. Honours `prefers-reduced-motion` automatically. If a future requirement asks for finer scroll control (e.g. scroll-linked timeline scrubbing past what `useScroll` already gives you), discuss before re-adding any rAF-driven smoothing -- it adds latency to a DOM this heavy.
- **IBM Plex Sans + IBM Plex Serif + IBM Plex Mono** from Google Fonts, all `display: swap`, `--font-plex-*` CSS variables wired into `@theme`.

## Performance budget (hard, driven by paid traffic)

| Metric | Target |
|---|---|
| LCP | < 1.5s on 4G |
| INP | < 100ms |
| CLS | 0 (no scroll-driven shifts) |
| Total JS gzipped | ≤ 80KB |

## Section pattern shortlist (F.A — "Skeptic" structure)

From `research/corder-landing-research-2026-05.md` §F.A. Order:

0. Nav (sticky, scroll-state border)
1. **Hero** (live UI demo + editorial copy) — built session 0
2. **Audience-line** (scroll-fill word-by-word, native CSS) — built session 0
3. Privacy / two-card trust block
4. How it works (4 steps)
5. Features grid (6 cells, hairline grid, no pictograms)
6. Pricing (3 tiers + Lifetime)
7. FAQ
8. Final CTA
9. Footer

## Inspector

**Removed for this project.** Per user request (2026-05-10), `Inspector` is NOT mounted in `app/layout.tsx`. The `data-component`, `data-source`, `data-tokens` attributes are still present on every section root for Webflow handoff documentation — they're zero-cost passive metadata that survives without Inspector. If a Webflow developer wants Cmd+click overlay, they re-add `<Inspector />` locally on their checkout. See `DECISIONS.md` 2026-05-10.
