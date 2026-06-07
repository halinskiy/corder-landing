# Product Audit — Corder (getcorder.com)

**Date:** 2026-06-01
**Auditor:** 3mpq-inquisitor
**Target:** https://getcorder.com/ (live production), driven with Playwright at 1440x900, 768x1024, 390x844
**Verdict:** SHIP-BLOCKED
**Composite:** 80 / 100

Drove the full funnel live: home, all sections, pricing monthly/yearly toggle, FAQ accordion, signup form (valid + junk email), login, verify (redirects to account), account, contact, install (real DMG downloaded and verified 10.2MB / HTTP 200), 404 (intentional), privacy, terms, refunds. Measured CWV, WCAG AA contrast (computed), font sizes, touch targets, console, network. No prior AUDIT.md existed, so no escalation applied.

## Scorecard

| Front | Weight | Score | Band | One-line |
|---|---|---|---|---|
| A. Visual & UX | 30% | 84 | Excellent | Strong hero, one-accent discipline, consistent focus system, CLS 0, no overflow; held back by missing mobile nav, sub-44px mobile targets, low-contrast support copy |
| B. Copy & messaging | 25% | 80 | Good | Zero banned typographic chars, specific falsifiable value prop; but `--` dash-surrogate on auth pages (the user's own AI-slop tell), odd "Transcript" caps, a fragment on /install |
| C. Conversion / CRO | 25% | 78 | Good | Funnel works end to end with a real download; no recommended-tier marker, no social proof anywhere, key pricing detail fails contrast, contact has no form |
| D. Tech perf/a11y/SEO | 20% | 74 | Good | Elite perf (FCP 196ms, CLS 0) and SEO (single H1, JSON-LD, all alt present); dragged down by AA contrast failures on real copy and 14px-floor violations on landing chrome |
| **Composite** | | **80** | | |

Composite math: 84x0.30 + 80x0.25 + 78x0.25 + 74x0.20 = 25.2 + 20.0 + 19.5 + 14.8 = 79.5, rounds to 80.

## Gate

**Rule fired: SHIP-BLOCKED due to hard-FAIL items.** No single front scored below 60, and the composite (80) clears the 75 SHIP-READY threshold, but the gate is worst-of and binding: the presence of any hard-FAIL blocks the ship regardless of composite. Three classes of hard-FAIL fired, all measured against the user's established ground truth (not re-litigated doctrine):

1. **14px font floor violated on genuine landing chrome** (mandated rule: all Corder text >= 14px strictly).
2. **Standalone-page shell rule violated** on /thanks, /contact, /install (mandated rule: these use the .legal-page shell, left-aligned, no min-height vh centring).
3. **WCAG AA contrast failures on real, conversion-critical landing copy** (accessibility blocker on text a paying customer must read).

A high composite does not override these. SHIP-READY cannot be issued while any hard-FAIL exists.

## Hard FAILs (ship-blockers)

| # | Front | What | Evidence (measured) | Fix |
|---|---|---|---|---|
| H1 | D / A | Landing chrome below the mandated 14px floor | `.pricing-card__plan-label` (Free/Pro/Max) = **12px**; `.pricing-card__badge` ("Launch offer") = **11px**; `.site-footer__col-heading` (Product/Developers/Legal) = **12px**. These are landing-page chrome, not simulated app screenshot UI. | Raise all to >= 14px. Keep uppercase + letter-spacing on the plan label / col heading to preserve visual weight at 14px (the doctrine pattern for bumped eyebrows). |
| H2 | D / A | Standalone-page contrast: pricing billed-amount, the single most decision-relevant pricing line, fails AA | `.pricing-card__annual-note` "$99 billed yearly" = **2.51:1**, "$239 billed yearly" = **2.62:1** (AA needs 4.5:1). Same gray fails on `.pricing-microcopy`, `.hero-cta-hint` "Requires macOS 14" (2.62:1), `.site-footer__copy` (2.62:1), `.site-footer__consent-link` (2.62:1). | Darken the muted gray token used for these classes from its current value to at least a 4.5:1 ratio on white. One token change cascades to all of them. |
| H3 | A | /thanks violates the mandated standalone shell | `legalPage:false`, h1 **center-aligned** (h1left 617 in a 1440 viewport), `main` has **min-height:900px + display:flex** = the exact 100vh-centred treatment the user has repeatedly banned. Heading "You're in." centred. | Rebuild on the `.legal-page` shell used by /privacy-policy: `.legal-page > .page-container.py-16.md:py-24 > .mx-auto.max-w-[...]`, left-aligned, no min-height vh, top offset 96px to match the main page. |
| H4 | A | /contact violates the mandated standalone shell | `legalPage:false`, h1 **center-aligned**, `main` **min-height:730px** (vh-centred). | Same fix as H3. Reuse the legal shell, left-align, drop the min-height centring. |
| H5 | A | /install violates the mandated standalone shell | `legalPage:false`, h1 "Thanks for downloading." **center-aligned**, `main` **min-height:730px**. | Same fix as H3/H4. |

## Prioritized fixes (sorted by impact)

| # | Front | Severity | What | Expected | Actual | Fix (class / selector) |
|---|---|---|---|---|---|---|
| 1 | D/A | HARD | Pricing billed-amount fails AA contrast | >= 4.5:1 | 2.51-2.62:1 | Darken `.pricing-card__annual-note`, `.pricing-microcopy`, `.hero-cta-hint`, `.site-footer__copy`, `.site-footer__consent-link` muted-gray token to >= 4.5:1 on white |
| 2 | D/A | HARD | 14px floor broken on chrome | >= 14px | 11-12px | `.pricing-card__plan-label` 12->14, `.pricing-card__badge` 11->14, `.site-footer__col-heading` 12->14 |
| 3 | A | HARD | 3 standalone pages centred + min-height vh | legal shell, left-aligned, top 96px | /thanks, /contact, /install centred with min-height 730-900px | Port all three onto the `.legal-page` shell verbatim |
| 4 | B | MAJOR | `--` dash-surrogate in auth copy (the user's own AI-slop tell, rendered in ASCII) | comma / period punctuation | signup: "Enter your email -- we send you a one-time link"; login: "We send a one-time link -- click it and you're in" | Rewrite to "Enter your email and we send you a one-time sign-in link." / "We send a one-time link, click it and you are in." No dash glyph and no `--` stand-in |
| 5 | D | MAJOR | account-page user-facing labels below 14px floor | >= 14px | `.account-plan-badge` "Pro Annual" 12px; "Qualified referrals" / "Free months earned" stat labels 12px; `.account-sub-status`, `.account-ref-link`, `.account-name-edit__edit` 13px | Raise to >= 14px |
| 6 | C/A | MAJOR | Mobile (390px) has no in-page navigation | tappable nav to Pricing/Features/FAQ | top `nav` is `display:none` and there is no hamburger; only logo + Download remain | Add a mobile menu (hamburger) reusing the existing nav links, or anchor-pill row, so mobile users can reach Pricing without scrolling the whole page |
| 7 | C | MAJOR | No recommended-tier marker; Pro vs Max decision unanchored | one tier visually anchored as "Most popular" | three tiers, no anchor; user cannot tell why to pick Pro over Max | Mark one paid tier "Most popular" and reduce its feature list to its 3 real differentiators |
| 8 | C | MAJOR | Zero social proof anywhere on the page | at least one credibility signal | no testimonials, no user count, no logos-of-users, no maker face | Add one honest proof element (real quote, download count, or "built by [maker], here is why") above or near pricing |
| 9 | A/C | MODERATE | Mobile touch targets below 44px | >= 44px tappable | footer links 21px tall, footer social 36px, pricing toggle segs 38px, cookie-preferences 22px (all at 390px) | Increase tap area (padding) to 44px min height on touch breakpoints |
| 10 | D | MODERATE | FAQ accordion missing `aria-controls` | button references its panel | `aria-expanded` toggles correctly but `aria-controls` is null | Add `aria-controls` pointing at each answer panel id, and `id` + `role=region` on the panel |
| 11 | D | MODERATE | Form-input focus ring is faint | clearly visible focus indicator | `.account-auth-input` / `.contact-form__input` set `outline:none` and rely on a 3px box-shadow at only 15% accent alpha | Strengthen the focus box-shadow alpha or add a visible border-color change on focus; the rest of the site uses a solid 2px accent outline, reuse that pattern |
| 12 | B | MINOR | Copy nits | clean prose | hero subhead "Keeps the **Transcript** on your Mac" (common noun title-cased); /install "If it did not start." (fragment before the manual link) | Lowercase "transcript"; finish the install sentence ("If it did not start, download manually below.") |
| 13 | C | MINOR | /contact has no form, only a mailto | low-friction contact | mailto link + two info cards; the contact-worker scaffold is not wired to a visible form | Optional: surface a 2-field form (email + message) posting to the existing worker; mailto is a friction step on mobile |
| 14 | A | MINOR | Pricing wraps 2+1 at 768px | balanced layout | Free+Pro on row 1, Max alone on row 2 | Either single-column stack at 768 or keep 3-up with reduced padding |

## What is genuinely good

- **Performance is elite.** TTFB 36ms, FCP 196ms, **CLS 0.0000**, total transfer 367KB, no oversized images (the hero is an animated DOM mockup, not a heavy raster), zero console errors or warnings on the home page. This is Vercel/Linear-tier loading.
- **SEO and semantics are essentially complete.** Single H1, clean h1>h2>h3 order across 22 headings, meta description, full OG set + twitter:summary_large_image, canonical, one JSON-LD block, `lang=en`, all four landmarks (main/nav/header/footer), and **all 90 images carry alt text**. Nothing to fix here.
- **The funnel actually works.** Download for Mac -> /install auto-fires the real signed DMG (Corder-0.13.31.dmg, 10.2MB, HTTP 200 from GitHub releases) with a manual fallback and numbered install steps. Magic-link signup is genuinely low-friction and its junk-email validation is clean ("That doesn't look like a valid email.") with native validity backing it.
- **Copy is specific and honest, not AI-slop.** "No bot joins the call", "Keeps the transcript on your Mac", the "Probably not, if you: are on Windows, want live captions, need team-shared transcripts" anti-persona card, and the privacy answer naming Gemini + Sparkle explicitly. No vague "streamline your workflow" filler. **Zero banned typographic characters** (em/en-dash, bullet, middle-dot) anywhere across every page checked.
- **The interactive-state system is consistent**, satisfying the strict-consistency rule: one global `a/button/input/[role=button]:focus-visible { outline: 2px solid var(--color-accent) }` plus component rings reusing the same token. No one-off `!important` overrides found.
- **Motion is responsibly gated**: 14 `prefers-reduced-motion` media rules, so the looping marquee and entry animations are disabled for vestibular-sensitive users.
- **The legal pages (/privacy-policy, /terms, /refunds) and /404, /account are textbook against ground truth**: `.legal-page` (+ `.legal-body` for prose), left-aligned, top offset 96px, no vh-centring, no centred brand mark. The 404 is exactly to spec: single-line heading "This page took a detour.", no "Error 404" eyebrow, honest body, one CTA.
- **The hero mockup is a standout craft piece** — a realistic, detailed simulated app window with transcript, per-speaker timeline, and recording state, all in one accent. It sells the product better than a static screenshot.

Note on the sub-14px text inside the hero mockup and the feature illustrations (hl-* classes, SVG labels at 8-13px): these are the *rendered app UI inside a simulated screenshot*, which legitimately renders at its own scale exactly as a real screenshot would. They are explicitly NOT counted as 14px-floor violations. The floor was enforced only against genuine landing-page chrome (nav, pricing, footer, account, auth fineprint), where the violations in H1/H5/fix-2/fix-5 are real.

## Evidence

- Screenshots: `/tmp/aisoldier-inquisitor/corder/` (also mirrored in `.playwright-mcp/corder/`): `desktop-1440-full.png`, `desktop-1440-hero.png`, `tablet-768-hero.png`, `mobile-390-full.png`, `mobile-390-hero.png`
- CWV: TTFB 36ms, FCP 196ms, DOMContentLoaded 157ms, load 245ms, CLS 0.0000, 28 requests / 367KB total, heaviest asset 53.9KB JS chunk; no LCP image (DOM hero)
- Contrast AA failures (computed, white bg): annual-note 2.51-2.62:1, hero-cta-hint 2.62:1, pricing-microcopy 2.62:1, footer copy/consent-link 2.62:1
- 14px-floor violations (computed font-size on landing chrome): plan-label 12px, badge 11px, footer col-heading 12px, account-plan-badge 12px, account stat labels 12px, auth fineprint/links 13px
- Standalone shells: /privacy /terms /refunds /404 /account = `.legal-page` left-aligned top:96px PASS; /thanks min-h 900px centred, /contact min-h 730px centred, /install min-h 730px centred = FAIL
- Pricing (live): Free $0 forever; Monthly Pro $14 (intro $10/mo first 3 months), Max $29 (intro $24/mo first 3 months); Yearly Pro $8.25/mo = $99/yr, Max $19.92/mo = $239/yr. Consistent with the $10/$14 monthly anchor from recent commits.
- Install asset: https://github.com/halinskiy/corder-updates/releases/download/v0.13.31/Corder-0.13.31.dmg -> HTTP 200, 10,201,228 bytes, application/octet-stream (app is at v0.13.31, ahead of the v0.9.0 inventory snapshot)
- Console: 0 errors / 0 warnings on home; the only "error" is the expected HTTP 404 status on the intentional not-found URL (correct behavior)
