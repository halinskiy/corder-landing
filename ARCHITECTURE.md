# corder-landing — Architecture

## Stack

- **Next.js 15.x** (App Router, React 19, TypeScript strict).
- **Tailwind CSS v4** via `@tailwindcss/postcss`. Tokens declared in `@theme` blocks.
- **Framer Motion 12** for entry animations + the HowItWorks scroll-linked window morph + the CorderPresence orb/form morph chain.
- **No JS smooth-scroll library.** Native `scroll-behavior: smooth` on `<html>` with `scroll-padding-top: 88px` for the sticky nav. Lenis removed 2026-05-22, see DECISIONS.md.
- **IBM Plex Sans / Serif / Mono** from Google Fonts via `next/font/google`.
- **`@aisoldier/ui-kit`** linked from the repo root via `file:../../ui-kit` and resolved with `transpilePackages` + `experimental.externalDir` per the booquarium pattern.

**Dependencies (2026-06-09 dead-code pass):** removed `lucide-react` (the
two icons used in Pricing are now inlined SVG) and dropped `date-fns`
from direct deps (still transitive via the admin-only `react-day-picker`).
`clsx` + `tailwind-merge` remain (used by `lib/ui-vendor/cn.ts`). The
build script `scripts/generate-seo-assets.mjs` (`sharp` + `png-to-ico`)
is exposed as the `seo:assets` npm script. Deleted dead files: `HeroBeams`,
`AudienceLine`, `How`, `Privacy`, `FinalCta`, `lib/newsletter.ts`,
`lib/cn.ts`, `lib/motion.ts`.

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
│   │   ├── layout.tsx         Root layout: fonts + Motion + CorderPresence provider + Clarity
│   │   ├── page.tsx           Renders Nav, Hero, AudienceLine
│   │   └── globals.css        Imports kit tokens + project tokens; defines blur-reveal contract; defines audience-line scroll-fill keyframes; defines `.dot-grid-surface` and `.page-container` helpers
│   ├── components/
│   │   ├── hero/
│   │   │   ├── HeroLibraryDemo.tsx    Live macOS Library window — port of hero-app.css to React
│   │   │   └── HeroLibraryDemo.css    Scoped under .hero-library-demo
│   │   ├── providers/
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

## Account infrastructure (2026-05-25)

Magic-link authentication added as a strategic pivot — accounts give
us an email base for future products and reactivation even if Pro
doesn't take off. Phase 1 (frontend scaffold) shipped; Phases 2-5
(Supabase + Resend + Worker + Paddle webhook + Mac app `/check`)
land once the backend services are provisioned.

### Routes

| Path | Component | Phase 1 state |
|---|---|---|
| `/signup` | `MagicLinkForm` (mode="signup") | Mock submit -> "Check your inbox" |
| `/login`  | `MagicLinkForm` (mode="login")  | Same form, different copy |
| `/verify?token=…` | `VerifyClient` | 800ms spinner -> redirect `/account` |
| `/account` | `AccountView` | Renders `MOCK_USER`, all writes local |

All four reuse the `.legal-page + .legal-body` shell -- top offset
matches `/privacy-policy`, `/terms`, `/refunds`, `/thanks`.

### Files

```
src/lib/
├── account-types.ts          UserAccount / Subscription / Notifications / Referral
└── account-mock.ts           MOCK_USER + formatBillingDate

src/components/account/
├── MagicLinkForm.tsx         Shared email -> magic-link form for /signup + /login
├── VerifyClient.tsx          Phase-1 mock redirector
└── AccountView.tsx           Five-section client component for /account
                              (Profile, Subscription, Notifications, Referrals,
                              Danger zone with DELETE-typed confirm)

src/app/signup/page.tsx
src/app/login/page.tsx
src/app/verify/page.tsx       robots: noindex
src/app/account/page.tsx      robots: noindex
```

### Phase 3 backend (planned, blocked on user actions)

- **Cloudflare Worker** at `api.getcorder.com` exposing:
  - `POST /auth/magic-link { email }` -> 200 + Resend email
  - `GET /auth/verify?token=…` -> 302 redirect with set-cookie JWT
  - `GET /me`, `PATCH /me`, `DELETE /me`
  - `GET /me/subscription`
  - `POST /auth/logout`
  - `GET /check?email=…` -> { pro, status, expires_at } for Mac app
  - `POST /paddle/webhook` -> mirror subscription.created/updated/canceled
- **Supabase Postgres** for users / magic_links / subscriptions /
  referrals / notifications tables.
- **Resend** for transactional email (magic links + receipts +
  optional product updates).
- **Paddle Customer Portal** linked from Subscription card via
  `customer-portal.paddle.com/<customer-id>` (Worker resolves this
  from the Paddle customer object on `GET /me/subscription`).

### Mac app integration (Phase 4)

- After magic-link sign-in inside the Mac app's onboarding wizard,
  the app calls `GET /check?email=…` once per 24h and caches the
  result in `AppSettings.isPro`.
- A menubar popover row "Open account" launches the system browser
  to `getcorder.com/account`. The user lands logged-in if the
  cookie is alive; otherwise they go through the magic-link flow.

### Privacy / GDPR

- Account deletion has a 30-day grace period before the row is
  permanently removed (standard GDPR erasure pattern). The grace
  window is implemented in the Worker, not the UI.
- Every marketing email carries a one-click unsubscribe footer that
  toggles `notifications.productUpdates / tipsAndTricks /
  newFeatures` off WITHOUT deleting the account.
- Privacy Policy + Terms updated 2026-05-25 with explicit Account
  data and magic-link sign-in sections.
