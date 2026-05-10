# corder-landing — Architecture

## Stack

- **Next.js 15.x** (App Router, React 19, TypeScript strict).
- **Tailwind CSS v4** via `@tailwindcss/postcss`. Tokens declared in `@theme` blocks.
- **Framer Motion 12** for entry animations only.
- **Lenis 1.x** in the root layout for smooth scroll.
- **IBM Plex Sans / Serif / Mono** from Google Fonts via `next/font/google`.
- **`@aisoldier/ui-kit`** linked from the repo root via `file:../../ui-kit` and resolved with `transpilePackages` + `experimental.externalDir` per the booquarium pattern.

## Folder layout

```
projects/corder-landing/
├── assets/                    Brand bundle from the maker
│   ├── CORDER-BRAND.md        Authoritative product brief
│   ├── corder-app-icon.svg
│   ├── corder-mark-waveform.svg
│   ├── corder-portfolio-icon.svg
│   ├── screen-library.png     macOS reference (development only)
│   ├── screen-popover.png
│   └── screen-recording.png
├── content/
│   ├── copy.json              All landing copy, audited 2026-05-09
│   └── pricing-brief.md       Economist's pricing brief for copywriter
├── public/                    static assets — empty for now
├── screenshots/               session screenshots (dev artefacts, gitignored)
├── src/
│   ├── app/
│   │   ├── layout.tsx         Root layout: fonts + Lenis + Motion + Inspector
│   │   ├── page.tsx           Renders Nav, Hero, AudienceLine
│   │   └── globals.css        Imports kit tokens + project tokens; defines blur-reveal contract; defines audience-line scroll-fill keyframes; defines `.dot-grid-surface` and `.page-container` helpers
│   ├── components/
│   │   ├── hero/
│   │   │   ├── HeroLibraryDemo.tsx    Live macOS Library window — port of hero-app.css to React
│   │   │   └── HeroLibraryDemo.css    Scoped under .hero-library-demo
│   │   ├── providers/
│   │   │   ├── LenisProvider.tsx      Wraps app in <ReactLenis root>; anchor-scroll handler
│   │   │   └── MotionProvider.tsx     Reads ?motion=0 + prefers-reduced-motion; runs IntersectionObserver for [data-motion="blur-reveal"]
│   │   └── sections/
│   │       ├── AudienceLine.tsx       Native CSS scroll-driven word fill
│   │       ├── Hero.tsx               Editorial hero copy + library demo
│   │       └── Nav.tsx                Sticky header, scroll-state border, brand mark, CTA
│   └── lib/
│       ├── cn.ts              clsx + tailwind-merge
│       └── motion.ts          EASE_OUT, enterFromBelow, blurReveal helpers
├── next-env.d.ts              Next-managed
├── next.config.ts             transpilePackages: ['@aisoldier/ui-kit'], experimental.externalDir, webpack.resolve.symlinks=false
├── package.json
├── postcss.config.mjs         '@tailwindcss/postcss'
├── tokens.css                 Project token override block
└── tsconfig.json              strict, paths { @/*, @kit/*, @content/*, @assets/* }
```

## Path aliases

| Alias | Resolves to |
|---|---|
| `@/*` | `./src/*` |
| `@kit/*` | `./node_modules/@aisoldier/ui-kit/*` (symlinked to `../../ui-kit`) |
| `@content/*` | `./content/*` |
| `@assets/*` | `./assets/*` |

## Tailwind v4 / kit integration

`src/app/globals.css` does the kit handshake the same way booquarium does:

```css
@import "tailwindcss";
@import "../../../../ui-kit/tokens.css";   /* base tokens */
@import "../../tokens.css";                 /* project override */

@source "../../../../ui-kit/components/**/*.{ts,tsx}";
@source "../../../../ui-kit/patterns/**/*.{ts,tsx}";
```

The `@source` directive tells Tailwind v4 to scan kit components for class names so utilities used in the kit are emitted in the project bundle. Without it, kit-only classes get tree-shaken out.

## Routing

App Router only, single page at `/`. No dynamic routes yet.

## Build pipeline

`npm run dev` → `next dev` (port 3050 in development).
`npm run build` → `next build`.
`npm run typecheck` → `tsc --noEmit`.

## Dev tooling

- `Inspector` from `@aisoldier/ui-kit` is mounted in `app/layout.tsx` behind `process.env.NODE_ENV === 'development'`. Cmd+click any element to see its `data-component`, `data-source`, `data-tokens`.
- All structural elements carry these three attributes.
