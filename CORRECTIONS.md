# corder-landing — Researcher Corrections

This file is written by the researcher and read by the soldier before building. Empty for session 0 — research has not yet flagged corrections beyond what is already in `assets/CORDER-BRAND.md` and `research/corder-landing-research-2026-05.md`.

---

## 2026-05-11 — "Works with" section + audience stack research (read before building any compatibility / logo strip section)

A full audit of compatibility strip patterns across 14 sites, plus a 5-segment audience stack matrix, lives in `research/works-with-section-2026-05.md`. Soldier must read it before designing or building any "works with X" / integrations / logo strip section.

Highlights the soldier needs to apply (full reasoning in the research file):

1. **The killshot heading.** The section is NOT about integrations. It is about OS-level capture. The recommended H2 is `Records anything that plays through your Mac.` Strong because (a) literally true, (b) impossible for bot-based competitors to claim, (c) reframes the entire compatibility question.

2. **14 logos, 3 named clusters, in this order:**
   - **Calling apps:** Zoom, Google Meet, Microsoft Teams (browser-caveat), Slack huddle, Discord
   - **Notes & writing:** Notion, Obsidian, Apple Notes, Bear, Linear
   - **Storage:** iCloud Drive, Dropbox, Google Drive
   - Plus one ellipsis row `… anything else that plays through your Mac` to make the universal-capture claim explicit.

3. **No CRM, no AI tool logos.** Do not put ChatGPT, Claude, Cursor, HubSpot, Salesforce, Attio, Affinity on the strip. They are either paste destinations (not integrations) or not Corder's scope. Granola does CRM; Corder does not. This is a deliberate honesty boundary.

4. **Microsoft Teams honesty caveat.** Teams browser version works perfectly; native Teams Mac app has occasional audio routing variance. Surface as italic `(browser version)` next to the Teams logo, or as a "Records?" column if using the Finder direction (D6). Microsoft is also rolling out bot detection in May/June 2026 — which kills bot-based competitors but does not affect Corder. Useful flex, but stay subtle.

5. **Six design directions, recommended in priority:**
   - **D3 — Menu-bar dropdown metaphor (RECOMMENDED).** Render the compatibility list AS IF it were a Corder menu-bar dropdown. Extends the "live Mac app on the page" through-line, on-brand, doctrine-clean, cannot be copied by SaaS competitors.
   - **D1 — Single-row marquee, 3 clusters (FALLBACK).** Granola-style but with three named clusters. Lowest risk if D3 is judged too ambitious.
   - D2 — Static three-column grid (cheapest perf).
   - D4 — Superwhisper-inspired keyboard grid (universal-capture metaphor).
   - D5 — Scroll-fill cluster reveal (matches audience-line technique already in code).
   - D6 — Finder window metaphor (most editorial, best honesty caveat handling, but heaviest).

6. **Placement in page flow:** insert as a new section **4.5, between How it works and Features grid**. The natural visitor question after the four mechanics ("no bot, dual track, free re-transcribe, BYOK") is "does it work with my stack?" — answer it there, before the more general feature grid.

7. **Animation:** for D3, native CSS `animation-timeline: view()` for top-down item reveal at 40ms stagger, accent green pulse on the status dot (4s/loop), hover state fills row with `rgba(33, 122, 80, 0.08)` (accent-subtle). `prefers-reduced-motion` → all motion off. No JS required.

8. **Stop-words and Frame A:** do NOT use `seamlessly`, `connects to your favorite apps`, `no meeting bots required` (Frame A violation — implies hiding), `integrates with everything`. The voice is matter-of-fact: "Records X. Drops into Y. Lives in Z."

9. **Open questions for user (eight, in §5 of the research file).** Soldier must NOT pick direction, cluster names, Bear-vs-Craft, marquee speed, AI-tool inclusion, or Microsoft Teams caveat treatment without one of those signoffs.

Source: `research/works-with-section-2026-05.md` (14-site verbatim audit, audience stack matrix for 5 segments, six design directions described in words, one recommendation).

---

## 2026-05-11 — CTA patterns research (read before any CTA edit)

A full CTA audit for hero, nav, pricing tiers, and FinalCta lives in
`research/cta-patterns-2026-05.md`. Soldier must read it before touching
any button text in `content/copy.json` or any CTA component
(`Hero`, `Nav`, `Pricing`, `FinalCta`).

Highlights the soldier needs to apply (full reasoning in the research file):

1. **Hero primary CTA**: switch from `Try For Free` to `Download for Mac`.
   Matches every relevant Mac-native peer (Cursor, Raycast, Superwhisper,
   Dyad, OrbStack). Tells the truth about what the click does (a .dmg
   downloads). Cold paid traffic converts higher on platform-explicit verbs.
2. **Hero secondary**: keep `How it works` as a text link, not a second pill.
   Doctrine-clean and matches CleanShot X — the only Mac-native peer that
   ships a successful primary+secondary pair.
3. **Hero trust microcopy under the pill**: add a Raycast-style spec strip
   in IBM Plex Mono, 14px, comma-separated (no middle-dots, banned by user
   memory). Suggested: `v1.0, macOS 14+, Apple Silicon, 2.4 MB, free to download`.
4. **Nav CTA**: compress `Free Download for macOS` to `Download`. One word
   in a pill is the 2026 prosumer Mac standard.
5. **Pricing tiers**: harmonise to `Download / Get Personal / Get Pro / Get Lifetime`.
   Current state has `Try For Free` on both Free and Personal which is confusing
   (Personal is $9/mo, not free) and reads as SaaS sign-up not Mac download.
6. **FinalCta reframe**: the current "Pay Google, not us" calculator punishes
   the long tail (the $0.30 figure at 1-5h looks unimpressive). Replace with
   one of the seven reframes in §3 of the research file. Recommended order:
   Reframe 6 (inverted slider: Granola fixed vs Corder+Google live) or
   Reframe 1 (static three-row competitor comparison). Both reframe the
   strongest truth — "no SaaS bill" — into a number that scales the *right*
   way (the smaller your usage, the larger the proportional saving).
7. **Frame A intact**: do NOT mimic tl;dv's `NO BOT REQUIRED` framing.
   Corder phrasing is `no bot in the call`; never imply the user is hiding.
8. **Open questions for user**: the research file §5 lists six choices the
   user needs to ratify before the soldier can ship. Do NOT change copy
   without one of those signoffs.

Source: `research/cta-patterns-2026-05.md` (full 14-site verbatim audit,
seven reframe brainstorm, tier-by-tier rewrites).

---

## Session 0 (2026-05-09) — Pre-build creative notes

These notes were assembled by the soldier from existing research (no separate researcher pass for session 0 — the brand doc + landing research + hero deep-dive together cover everything for the Hero):

- **Frame A is mandatory.** No language anywhere in the build (UI text, alt-text, aria-labels, code comments) may imply the user is hiding from the other side. Frame is "no bot in the call". Other side sees nothing different in their participant list.
- **Speaker purple `#5a3aa6` is scoped, not a brand accent.** Stays inside `.hero-library-demo`.
- **Native CSS scroll-driven only.** No GSAP, no framer-motion `useScroll` for the audience-line.
- **No microphone iconography** anywhere.
- **No Babel-standalone, no React UMD, no GSAP CDN.** All three are in the legacy HTML; first thing to drop on the rebuild.
- **Hero state machine S2/S5/S6** (active-line jump, sidebar arrival, hover focus on tick) deferred to session 2 to keep first iteration scope tight.

---
