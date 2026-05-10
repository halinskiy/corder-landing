# corder-landing — Researcher Corrections

This file is written by the researcher and read by the soldier before building. Empty for session 0 — research has not yet flagged corrections beyond what is already in `assets/CORDER-BRAND.md` and `research/corder-landing-research-2026-05.md`.

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
