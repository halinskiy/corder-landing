# corder-landing — Integrations

## External services in use

| Service | What for | Where wired |
|---|---|---|
| Google Fonts (IBM Plex Sans / Serif / Mono) | Typography, all three weights/styles | `app/layout.tsx` via `next/font/google` |

## External services planned but not wired yet

| Service | What for | Required env var | Phase |
|---|---|---|---|
| Plausible / Fathom (analytics) | Cold-traffic conversion measurement on Download CTA | `NEXT_PUBLIC_ANALYTICS_DOMAIN` | After section 8 (final CTA) |
| Vercel | Hosting + edge CDN | none (Vercel project link) | After full landing passes judge |
| Sparkle release feed | Linked from "Download" CTA | static URL in `copy.json` | After section 6 (pricing) |

## Env vars

None required for the Hero section as built today. The `Inspector` is gated by `process.env.NODE_ENV === 'development'` only.

## Dependencies on the macOS app codebase

The hero demo's CSS tokens and DOM structure are a **manual port** of the macOS Corder app's `styles.css`. There is no automated sync. When the app's chrome changes (border colours, sidebar widths, segment paragraph spacing), the demo's CSS in `src/components/hero/HeroLibraryDemo.css` must be hand-updated to match. The reference screenshots in `assets/screen-*.png` are the visual baseline.
