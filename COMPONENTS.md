# corder-landing — Components Inventory

> Reconciled with code 2026-06-09. Tables below match `src/components/**`
> and the live `app/page.tsx` render order. Deleted in the dead-code pass
> (removed everywhere): `HeroBeams`, `AudienceLine`, `How`, `Privacy`,
> `FinalCta`, `LenisProvider`.

## Home page sections (in `app/page.tsx` render order)

| # | Component | Path | Notes |
|---|---|---|---|
| 0 | `Nav` | `sections/Nav.tsx` | Sticky header. `data-scrolled="true"` after scrollY > 8 → backdrop-blur(12px) + 1px hairline. Inlined SVG brand mark. Mobile collapses to a single Download CTA (full nav at `md:`). "Contact Us" scrolls to `#site-footer-bottom`. |
| 1 | `Hero` | `sections/Hero.tsx` | Editorial copy (eyebrow → display headline → subhead → two CTAs → qualifier) over a faded dot-grid, with `HeroLibraryDemo` below. Framer Motion entry: opacity + y + blur staggered 0–320ms. CTAs use `AppleIcon`. |
| 1 | `HeroLibraryDemo` | `hero/HeroLibraryDemo.tsx` + `.css` | React port of the macOS Library window. **Tabs refreshed to v0.13.x on 2026-06-09:** left tab strip is now **Transcript / Summary / Chapters** (app added auto-Summary 0.13.15 + Chapters 0.13.17); header toolbar = theme-moon, **Settings gear** (opens the right Settings pane), archive, profile (language Globe removed, matching the app). Right column = Recording / Settings. Video preview + scrubber + per-speaker Timeline bars. Pointer 3D tilt via vanilla rAF; Play toggles `data-playing` CSS scrub; moon click = radial View-Transition theme flip. **Deliberate deviation:** the app moved theme into Settings, but the header theme-moon is kept here as an interactive demo affordance (per maker, 2026-06-09). CSS is a manual port of the app's `styles.css` (no auto-sync). |
| 1 | `HeroRecordingProvider` / `useHeroRecording` | `hero/HeroRecordingContext.tsx` | Shared recording state so the headline "Record" widget + the demo banner stay in lockstep. One auto-cycle (5s warm → 3s record → 7s rest → loop); click anywhere calls `toggle()`. |
| 2 | `HowItWorks` | `sections/HowItWorks.tsx` | Three rows with one shared window block that snaps between slots on scroll. Target top/left are step functions of `scrollYProgress` fed through `useSpring` (lift-glide-land, no overshoot). Hosts `CorderPresenceSentinel`. |
| 2 | `HowItWorksMockups` (`ChapterMockup`) | `sections/HowItWorksMockups.tsx` | Three full-fidelity Corder UI mockups swapped inside the sticky window per chapter. `ChapterMockup({chapter:1\|2\|3})` → internal `DashboardMock` / `LibraryMeetingMock` / `SettingsMock` (not exported; reuse the `.hl-*` tokens from HeroLibraryDemo.css). |
| 3 | `YoursPrivacy` | `sections/YoursPrivacy.tsx` | "Your meetings stay yours" — three trust cards, each with a coloured shape (organic blob = accent green, star = speaker purple `#5a3aa6`, diamond = amber `#a16207`). Replaced the old 2-card `Privacy`. |
| 4 | `Fit` | `sections/Fit.tsx` | "Is Corder for you?" — two-card yes/no with hairline rows; leading accent check (yes) / neutral minus (no). Reuses the Privacy card visual language. |
| 5 | `WorksWith` | `sections/WorksWith.tsx` | Three marquee rows of brand pills (rows 1/3 →, row 2 ←). Logos served from `public/logos/*.svg`. Granola/Cursor "wall of integrations" pattern. |
| 6 | `Features` | `sections/Features.tsx` | 6-cell hairline grid (3/2/1 cols). Each cell renders an inline-SVG mock per `visualHint` in copy.json (`mini-timeline-fragment`, `screen-video-frame`, `menu-bar-capsule`, `drag-out-gesture`, `audio-sound-row`, `version-sequence`). One accent role per illustration; hover bg-shift. |
| 7 | `Pricing` | `sections/Pricing.tsx` | 3-tier grid (Free / Pro / Max), monthly/annual `useState` toggle (+ launch pricing). Pro/Max CTAs → `/checkout/?tier=&billing=`; Free → `/install`. Feature markers are **inlined SVG** `CheckIcon` / `PlusIcon` (lucide-react removed 2026-06-09). |
| 7 | `PricingBillingToggle` | `sections/PricingBillingToggle.tsx` | Monthly/Yearly pill switch beside the Pricing heading; active segment accent fill. Split out so the heading row stays a clean flex container. |
| 8 | `Faq` | `sections/Faq.tsx` | Wraps kit `FAQAccordion` (`mode="multi"`), maps `copy.faq.items` `{q,a}` → `{question,answer}`, fires `faq_open` analytics via `onItemToggle`. |
| 9 | `Footer` | `sections/Footer.tsx` | 3-col grid at md+: oversized Plex Serif wordmark, Product + Resources columns. Hairline divider above © + back-to-top baseline row (`#site-footer-bottom`). |

## Global / layout-level (mounted in `app/layout.tsx`, not a section)

| Component | Path | Notes |
|---|---|---|
| `CorderPresenceProvider` | `presence/CorderPresence.tsx` | Wraps the app in a framer `LayoutGroup` (`layoutId="corder-presence"`) so the in-section window, corner orb and form morph share layout. Owns `pastHowItWorks` / `pastFormZone` / `motionDisabled` flags; mounts the corner orb/form switch (`CorderPresenceCorner`, internal). |
| `CorderPresenceSentinel` | `presence/CorderPresence.tsx` | 1px scroll anchor inside `HowItWorks`; rAF-throttled rect check flips `pastHowItWorks` at the upper-40% line. |
| `CorderPresenceFormSentinel` | `presence/CorderPresence.tsx` | Zero-height anchor in `page.tsx` between Faq and Footer; flips `pastFormZone` → triggers the orb-to-form morph. |
| `CorderPresenceStaticSection` | `presence/CorderPresence.tsx` | Reduced-motion fallback: when `motionDisabled`, renders the subscribe form inline; else null. |
| `MotionProvider` | `providers/MotionProvider.tsx` | IO-driven blur-reveal trigger. Reads `?motion=0` + `prefers-reduced-motion`; sets `data-motion-state` on `[data-motion="blur-reveal"]`. |
| `PauseOffscreen` | `providers/PauseOffscreen.tsx` | Single global IO that sets `data-anim-paused` on `[data-pauseable]` roots offscreen; CSS pauses all animations in that subtree. |
| `ConsentProvider` | `consent/ConsentProvider.tsx` | GDPR banner; injects Clarity/Plausible/X pixel only after Accept. `openConsentBanner()` re-shows it (footer "Cookie preferences"). Renders nothing until the post-mount storage read resolves (no flash). |
| `CookieConsentButton` | `consent/CookieConsentButton.tsx` | Persistent bottom-left ghost trigger (56/48px), mirrors the CorderPresence orb footprint; hidden while the banner is on screen. |
| `BackToHomeBtn` | `ui/BackToHomeBtn.tsx` | Top-left back arrow on every non-home page (HIDE_ON list opts some out). `router.back()` when `history.length > 1` (restores scroll / `#pricing`), else falls back to `<a href="/">`. |

## Standalone-page components

| Component | Path | Page | Notes |
|---|---|---|---|
| `MagicLinkForm` | `account/MagicLinkForm.tsx` | /signup, /login | Shared magic-link form. Phase-1 mock submit → "Check your inbox". |
| `VerifyClient` | `account/VerifyClient.tsx` | /verify | Phase-1 stub: spinner + 800ms `replace("/account")`. |
| `AccountView` | `account/AccountView.tsx` | /account | Profile / Subscription / Notifications / Referrals / Danger zone. Seeded from `lib/account-mock.ts` (Phase 1). |
| `CheckoutClient` | `checkout/CheckoutClient.tsx` | /checkout | Inline Paddle embed. Reads `?tier=&billing=`, resolves priceId, opens `Paddle.Checkout` with `customData.tier` (consumed by the activation webhook). |
| `InstallClient` | `install/InstallClient.tsx` | /install | Resolves `releases/latest` at runtime (prefers `.dmg`), hardcoded fallback DMG (currently 0.13.37). |
| `ActivationStatus` | `thanks/ActivationStatus.tsx` | /thanks | Status pill reading Paddle's `?_ptxn`. loading / confirmed / no-token. (Client-only; no server call today.) |
| `ContactForm` | `contact/ContactForm.tsx` | /contact | POSTs to the contact Worker (`NEXT_PUBLIC_CONTACT_ENDPOINT`); `mailto:` fallback when unset. |
| `AppleIcon` | `icons/AppleIcon.tsx` | Nav, Hero, Pricing/Install CTAs | Apple silhouette, `currentColor`, 14px default. |

## Admin panel components (operator-only, /admin/**)

| Component | Path | When used | Notes |
|---|---|---|---|
| `AdminGuard` | `admin/AdminGuard.tsx` | wraps all /admin/** via `app/admin/layout.tsx` | Client gate. Reads Supabase session, checks `app_metadata.role === "admin"`. States: loading / signin (inline magic-link, reuses `.account-auth-*`) / denied / ok / unconfigured. UX gate only — Worker re-verifies the JWT. |
| `AdminShell` | `admin/AdminShell.tsx` | inside AdminGuard | Chrome: serif "Admin" title, operator email + sign out, Users/News/Logs tabs (`usePathname`). `.legal-page` shell. |
| `UsersTable` | `admin/UsersTable.tsx` | /admin | Search + tier filter, inline Plan `<select>` (Free/Pro/Max + **Admin**), tier change = optimistic `POST /admin/users/:id/tier`; Admin grant/revoke via `POST /admin/users/:id/role` behind an inline confirm; inline-confirm delete. |
| `NewsList` | `admin/NewsList.tsx` | /admin/news | Rows sorted created_at desc, status = dot + word (`newsStatus()`), edit / duplicate / inline-confirm delete. |
| `NewsForm` | `admin/NewsForm.tsx` | /admin/news/new + /edit | Shared create/edit. Title/subtitle/body, primary+secondary CTA, audience, dismissible + draft toggles, react-day-picker `mode="range"` (accent-themed `.admin-rdp`). |
| `NewsEditLoader` | `admin/NewsEditLoader.tsx` | /admin/news/edit (Suspense) | Reads `?id=` (static-export-safe), loads the row, renders NewsForm in edit mode. |
| `LogsList` | `admin/LogsList.tsx` | /admin/logs | Bug reports as cards (title + summary + meta + severity), newest first. `title === null` → "Summarizing…" shimmer; re-polls every 5s while any row is un-triaged. Active/Archived toggle; hover-reveal Archive pill → `archiveLog` (optimistic). Card is `role="button"` so the pill can nest. Click → LogDetailModal. |
| `LogDetailModal` | `admin/LogDetailModal.tsx` | from LogsList | Full report + monospace scrollable `log_tail` (GET /admin/logs/:id), Copy log + Re-summarize. Esc/backdrop close, body-scroll lock. |
| `SeverityChip` | `admin/SeverityChip.tsx` | LogsList + modal | Severity pill (low grey / medium amber / high orange / critical red) + `relativeTime()`. Status colours, not brand accents. |

Lib: `lib/supabase.ts` (browser client), `lib/admin-api.ts` (typed bearer fetch + `newsStatus`, `listLogs`/`getLog`/`summarizeLog`, `setUserTier`/`setUserRole`, `archiveLog`).

## Kit components imported from `@aisoldier/ui-kit`

| Kit component | Where used | Why |
|---|---|---|
| `Inspector` | `app/layout.tsx` (dev only) | Cmd+click overlay for handoff inspection. |
| `FAQAccordion` | `sections/Faq.tsx` | Multi-open accordion (10 items from `copy.faq.items`). 2026-06-09: kit trigger gained `cursor-pointer` (native `<button>` + Tailwind v4 Preflight don't set it). NOTE: the project uses a vendored copy at `lib/ui-vendor/FAQAccordion.tsx` (carries the extra `onItemToggle` analytics prop the kit version lacks); promote that prop to the kit before consolidating. |

## Kit-promotion candidates (rule: 2+ uses across projects before promoting)

1. **`AppWindowDemo`** — macOS app frame with traffic lights + sidebar slot (the `BrowserFrame` kit covers only the browser flavour). Two uses in Corder (`HeroLibraryDemo`, `HowItWorksMockups`) but single-project; wait for a second project.
2. **`StickyScrollNarrative`** — left-sticky-visual + right-scroll-chapters with a spring-snapped shared window. `HowItWorks`'s `scrollYProgress` step-function + `useSpring` mechanism is reusable. Promote after a second project uses it.
3. **`PricingCardGrid` + `PricingTierCard` + billing toggle** — 3-tier + launch/annual pattern. Validate per-project price-shape variance first.
4. **`TrustCardTrio`** — `YoursPrivacy`'s three-card block with per-card coloured shapes. Wait for a second project.
5. **`MarqueeLogoWall`** — `WorksWith`'s bidirectional brand-pill marquee. Wait for a second project.

## Local-only note

Every section + page component above is project-local: they reference
`copy.json` directly via the typed wrapper `@/content/copy`, so none are
reusable as-is. Reusable *patterns* are the promotion candidates above.
The only genuinely shared primitive is `lib/ui-vendor/cn.ts`
(`clsx` + `tailwind-merge`).
