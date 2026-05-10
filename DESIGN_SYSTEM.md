# corder-landing — Design System Snapshot

**Lives at `tokens.css` (project) on top of `ui-kit/tokens.css`.** This file documents what differs from the kit and why.

## Accent

| Token | Value |
|---|---|
| `--color-accent` | `#1f7a4f` |
| `--color-accent-hover` | `#0a5e34` |
| `--color-accent-subtle` | `rgba(31, 122, 79, 0.08)` |
| `--color-accent-soft` | `rgba(31, 122, 79, 0.18)` |
| `--color-accent-deep` | `#0e3d28` |

`accent-soft` is reserved for the audience-line accent ranges and the search-match highlight in the live UI demo. `accent-subtle` is for hover backgrounds. `accent-deep` is for occasional gradients (none yet).

## Neutrals (deltas from kit)

The kit's neutrals are pure-white-edge (`#fafafa` surface). Corder's surface palette shifts slightly warm to match the macOS app:

| Kit | Corder | Reason |
|---|---|---|
| `--color-surface: #fafafa` | `#f7f7f6` | Matches macOS app's `--bg-elev` |
| `--color-surface-2: #f5f5f5` | `#fafaf8` | Aligned with app's `--bg-hover` |
| `--color-border: #e5e5e5` | `#ececea` | Aligned with app's `--border` |
| `--color-border-strong: #d4d4d4` | `#d8d8d4` | Aligned with app's `--border-strong` |
| `--color-text: #212121` | `#0e0e0d` | Aligned with app's `--fg` (deeper, more institutional) |
| `--color-text-muted: #525252` | `#6b6b68` | Aligned with app's `--fg-muted` |
| `--color-text-subtle: #a3a3a3` | `#a0a09c` | Aligned with app's `--fg-dim` |

## Typography

| Token | Value | Notes |
|---|---|---|
| `--font-sans` | IBM Plex Sans (Google Fonts) | Body, UI |
| `--font-serif` | IBM Plex Serif | Display + headings + audience-line |
| `--font-mono` | IBM Plex Mono | File paths, version sequences, transcript timestamps |
| `--text-display-xl` | `clamp(48px, 7.5vw, 112px)` | reserved for future final-CTA |
| `--text-display-lg` | `clamp(40px, 6vw, 88px)` | hero headline |
| `--text-display-md` | `clamp(32px, 4.5vw, 64px)` | section headers |
| `--text-h1` | `clamp(28px, 3.5vw, 48px)` | sub-section titles |
| `--text-body-xl` | `22px` | reserved |
| `--text-body-lg` | `18px` | hero subhead, editorial intros |
| `--text-body` | `16px` | default body. **Never lower.** |
| `--text-eyebrow` | `12px` | uppercase, `letter-spacing: 0.062em`, weight 600 |

The audience-line uses `clamp(28px, 4vw, 56px)` directly — it is editorial display, not a kit token.

## Radii (kit values, no change)

- `--radius-window: 12px` — cards, modals, large surfaces, the hero demo card.
- `--radius-button: 8px` — buttons, inputs, small cards.
- `--radius-pill: 9999px` — badges, dots, avatars, nav pill, hero CTAs.

## Easing (kit values, no change)

- Default entry: `cubic-bezier(0.16, 1, 0.3, 1)`. Used in all framer-motion transitions and the demo reveal.
- Decelerate/exit: `cubic-bezier(0.4, 0, 0.2, 1)`. Reserved for future use.

## Hero-demo internal tokens (scoped)

The macOS Library window demo uses its own scoped tokens, isolated under `.hero-library-demo` so it does not bleed into the page. These are 1:1 copies of the real macOS app `:root`:

```css
--hl-bg: #ffffff;
--hl-bg-elev: #f7f7f6;
--hl-bg-hover: #fafaf8;
--hl-bg-active: #f3f3f1;
--hl-border: #ececea;
--hl-border-strong: #d8d8d4;
--hl-fg: #0e0e0d;
--hl-fg-muted: #6b6b68;
--hl-fg-dim: #a0a09c;
--hl-accent: #1f7a4f;
--hl-accent-pressed: #0a5e34;
--hl-status-ready: #1f7a4f;
--hl-speaker-purple: #5a3aa6;
```

Speaker purple `#5a3aa6` is **not** a brand accent. It exists only inside the demo as the second speaker's avatar / timeline tick colour. Outside the demo, the only accent is forest green.

## Audience-line scroll-fill contract

`/src/components/sections/AudienceLine.tsx` splits its sentence into per-word `<span>` elements. Three accent ranges drive the editorial highlight pattern:

| Range (zero-indexed, end-exclusive) | Words | Colour |
|---|---|---|
| `[1, 5)` | "founders taking investor calls," | accent green |
| `[5, 9)` | "consultants on client kickoffs," | accent green |
| `[10, 15)` | "anyone who thinks out loud" | accent green |

Words in those ranges get class `audience-line__word--accent`; everything else gets `audience-line__word`. Both classes use `animation-timeline: view()` to scroll-fill colour from `--color-text-faint` to either `--color-text` (default) or `--color-accent` (accent). Browser support: Baseline 2026 (Chrome 115+, Edge, Opera, Safari 18+). `@supports not (animation-timeline: view())` and `@media (prefers-reduced-motion: reduce)` both render words in their final state with no animation.
