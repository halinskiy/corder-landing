# corder-landing — Integrations

## External services in use

| Service | What for | Where wired |
|---|---|---|
| Google Fonts (IBM Plex Sans / Serif / Mono) | Typography, all three weights/styles | `app/layout.tsx` via `next/font/google` |
| GitHub Releases | Notarized Mac app DMG download | `/install` page (`InstallClient.tsx`) resolves `releases/latest` at runtime (prefers `.dmg` over `.zip`); hardcoded fallback `…/v0.13.37/Corder-0.13.37.dmg`. Structured-data `softwareVersion` in `layout.tsx`. |
| Paddle (**production**) | Pro + Max checkout (monthly / annual / launch), inline embed | `src/lib/paddle.ts` (live `live_` token + 6 price IDs), init in `layout.tsx`, mounted on `/checkout` by `CheckoutClient.tsx`. `customData.tier` carries the tier to the activation webhook. |
| Microsoft Clarity | Heatmaps + session replay | Static script in `layout.tsx` |
| Plausible | Privacy-first analytics + custom events | Static script + manual API in `layout.tsx`; events via `src/lib/track.ts` |
| Twitter Pixel | Ad attribution | Static script in `layout.tsx` when `NEXT_PUBLIC_TWQ_ID` is set |
| Google Search Console | Indexing + Performance | Verification file `public/google6657f24bde52d2b3.html`, sitemap submitted |
| **Supabase Auth** (admin panel) | Operator sign-in (magic link) + admin JWT for /admin/** | `src/lib/supabase.ts`, browser client, `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (both public) |
| **corder-api Worker** (admin panel) | `/admin/users`, `/admin/users/:id/tier`, `/admin/users/:id/role`, `/admin/news` CRUD, `/admin/logs` + public `/news`. Also Mac-app endpoints (transcribe proxies, /telemetry, /submit-logs). | `src/lib/admin-api.ts`, live at `corder-api.empqwork.workers.dev` (override via `NEXT_PUBLIC_CORDER_API`). Verifies admin JWT server-side. `/admin/*` CORS preflight pinned to an origin allowlist (2026-06-09). |
| **corder-contact Worker** | `/contact` form → Resend email | `src/components/contact/ContactForm.tsx` POSTs to `corder-contact.empqwork.workers.dev` via `NEXT_PUBLIC_CONTACT_ENDPOINT`. CORS pinned to `ALLOWED_ORIGIN`. |
| **corder-activation Worker** | Paddle webhook → grant/revoke Supabase tier | `corder-activation.empqwork.workers.dev/paddle-webhook`. Verifies HMAC, resolves tier + buyer email, sets `app_metadata.tier`. See "Backend workers" below. |

## Backend workers (live — separate repos, deployed via `wrangler`)

Source: `apps/contact-worker`, `apps/activation-worker` (in the Aisoldier
monorepo); `corder-api` is a standalone non-git folder at
`/Users/3mpq/corder-api`, deploy-only.

**corder-activation** (`apps/activation-worker`) — Paddle webhook → tier grant.
- Destination URL to register in Paddle → Notifications:
  `https://corder-activation.empqwork.workers.dev/paddle-webhook`
- Events handled: activate on `subscription.activated/created/resumed`,
  `transaction.completed/paid`; downgrade to free on
  `subscription.canceled/paused`.
- Tier source: checkout `custom_data.tier`, else the price-id catalogue
  (mirrors `src/lib/paddle.ts`). Buyer email resolved from `customer_id`
  via the Paddle API, then matched to a Supabase user by email.
- **Buyer-email caveat:** if the Paddle email ≠ the app sign-up email, no
  match — the worker logs it; set the tier manually via the admin Users
  panel.
- **Secrets (set via `wrangler secret put`):**
  `PADDLE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE`, `PADDLE_API_KEY`.
  `SUPABASE_URL` is a `[vars]` entry (public). **Until the two latter
  secrets are set the worker verifies + logs + returns 200 but writes
  nothing** (safe degradation — cannot grant a wrong tier).

**corder-contact** (`apps/contact-worker`) — `POST /` → Resend. Secrets:
`RESEND_API_KEY`, `TO_ADDRESS`, `FROM_ADDRESS`, `ALLOWED_ORIGIN`.

**corder-api** — main API (admin + Mac-app). Service-role-backed; admin
JWT gate on `/admin/*`; CORS preflight pinned 2026-06-09.

## Historical: account infrastructure plan (superseded where noted)

| Service | What for | Required env var | Phase |
|---|---|---|---|
| **Supabase Postgres** | Users / magic_links / subscriptions / referrals / notifications | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (Worker only) | 2-3 |
| **Resend** | Magic-link emails + receipts + opt-in product updates | `RESEND_API_KEY` (Worker only), verified `getcorder.com` sender + DKIM/SPF DNS | 2-3 |
| **Cloudflare Worker** at `api.getcorder.com` | Auth endpoints + Paddle webhook + `/check` for Mac app | `JWT_SECRET`, `PADDLE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` | 3 |
| **Paddle webhooks** | `subscription.created / updated / canceled` -> Worker -> Supabase | Set webhook URL `https://api.getcorder.com/paddle/webhook` in Paddle dashboard + copy webhook secret | 4 |
| **Mac app `/check?email=…`** | Daily cached Pro-status check from the menu bar | `getcorder.com` URL in `AppSettings`; the Mac app caches the response in `AppSettings.isPro` for 24h | 4 |

## Env vars

| Var | Where read | Public? |
|---|---|---|
| `NEXT_PUBLIC_PADDLE_ENV` | `src/lib/paddle.ts` | yes |
| `NEXT_PUBLIC_PADDLE_TOKEN` | `src/lib/paddle.ts` | yes (sandbox public token) |
| `NEXT_PUBLIC_PADDLE_PRICE_{PRO,MAX}_{MONTHLY,LAUNCH_MONTHLY,ANNUAL}` (6) | `src/lib/paddle.ts` | yes (all baked defaults; public price IDs) |
| `NEXT_PUBLIC_TWQ_ID` | `src/app/layout.tsx` (Twitter pixel) | yes |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | `src/app/layout.tsx` | yes |
| `NEXT_PUBLIC_SUPABASE_URL` (admin) | `src/lib/supabase.ts` | yes (has baked default) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` (admin) | `src/lib/supabase.ts` | yes (public anon key; default empty, must be set) |
| `NEXT_PUBLIC_CORDER_API` (admin) | `src/lib/admin-api.ts` | yes (has baked default) |
| `NEXT_PUBLIC_SUPABASE_URL` (Phase 3) | Worker | yes |
| `SUPABASE_SERVICE_ROLE_KEY` (Phase 3) | Worker only | NO |
| `RESEND_API_KEY` (Phase 3) | Worker only | NO |
| `JWT_SECRET` (Phase 3) | Worker only | NO |
| `PADDLE_WEBHOOK_SECRET` (Phase 4) | Worker only | NO |

## Env vars

None required for the Hero section as built today. The `Inspector` is gated by `process.env.NODE_ENV === 'development'` only.

## Dependencies on the macOS app codebase

The hero demo's CSS tokens and DOM structure are a **manual port** of the macOS Corder app's `styles.css`. There is no automated sync. When the app's chrome changes (border colours, sidebar widths, segment paragraph spacing), the demo's CSS in `src/components/hero/HeroLibraryDemo.css` must be hand-updated to match. The reference screenshots in `assets/screen-*.png` are the visual baseline.
