# corder-landing — Components Inventory

| Component | Path | Source | When used | Notes |
|---|---|---|---|---|
| `Nav` | `src/components/sections/Nav.tsx` | local | Section 0 (sticky header) | Bespoke. `data-scrolled="true"` after scrollY > 8 → backdrop-blur(12px) + 1px hairline. SVG brand mark inlined. Mobile collapses links to a single Download CTA (full nav reappears at `md:`). |
| `Hero` | `src/components/sections/Hero.tsx` | local | Section 1 | Editorial copy (eyebrow → display-lg headline → body-lg subhead → two CTAs → qualifier) over a faded dot-grid surface, with `HeroLibraryDemo` below. Framer Motion 12 entry animation — opacity + y + blur staggered 0–320ms. |
| `HeroLibraryDemo` | `src/components/hero/HeroLibraryDemo.tsx` + `.css` | local | Inside Hero | Port of `hero-app.css` to React. Renders the macOS Library window 1:1 with traffic lights, sidebar, transcript, audio scrubber, per-speaker timeline. Pointer-driven 3D tilt (`MAX_X=3°, MAX_Y=4°, LIFT=4px`) via vanilla rAF. Click on Play toggles `data-playing="true"` → CSS scrub + cursor animation. Ambient cursor walk runs while idle. |
| `AudienceLine` | `src/components/sections/AudienceLine.tsx` | local | Section 2 | Per-word `<span>` editorial sentence. CSS `animation-timeline: view()` fills colour and removes blur as the section scrolls past. Three accent ranges keyed in source. `@supports`/`prefers-reduced-motion` fallbacks render the final state immediately. |
| `Privacy` | `src/components/sections/Privacy.tsx` | local | Section 3 | Asymmetric anchor heading + 2-card grid below. Card 1 carries forest-green `Default` tag, Card 2 neutral `Local Storage`. Spec list keys 12px small-caps, values 16px sans, monospace auto-detection (paths/hostnames render in Plex Mono). 1px borders, 12px radius, no shadows. Zero icons. |
| `How` | `src/components/sections/How.tsx` | local | Section 4 | Scroll-pinned narrative with sticky live-UI on the left + 4 scroll chapters on the right. IntersectionObserver tracks the centred chapter and switches `data-active-step` on `<HowWindow>`; CSS selectors cross-fade between four panes (idle Start, Recording wave, Transcript with mark, Drag illustration). Mobile: sticky disabled, window inline above chapters. |
| `Features` | `src/components/sections/Features.tsx` | local | Section 5 | 6-cell hairline-bordered grid (3 cols at lg, 2 at sm, 1 at base). External 12px radius, internal 1px hairlines, no shadows. Six unique typographic gestures per `visualHint` in copy.json: mini-timeline, typographic-mark on `phrase`, split-cell, kbd cap, monospace path, version-sequence chips. Zero icons. Hover bg-shift on cells. |
| `Pricing` | `src/components/sections/Pricing.tsx` | local | Section 6 | 3-tier card grid (Free/Personal/Pro) at equal columns + Lifetime full-width plank below. Annual toggle vanilla useState swaps prices. Pro highlighted via `--color-text` border + `--color-surface-2` tint, NOT shadow/colour. Bullet markers typographic `·` middle-dot in accent. Microcopy 14px subtle below. |
| `Faq` | `src/components/sections/Faq.tsx` | local (uses kit) | Section 7 | Wraps kit `FAQAccordion` with `mode="multi"`. Maps `copy.faq.items` from `{q,a}` → `{question,answer}`. Section header (eyebrow + H2) above accordion. |
| `FinalCta` | `src/components/sections/FinalCta.tsx` | local | Section 8 | Centered editorial closing. Heading `clamp(40-80px)` Plex Serif, single Download primary pill, qualifier 16px subtle. Subtle masked dot-grid behind. `id="download"` is the page-wide CTA target. |
| `Footer` | `src/components/sections/Footer.tsx` | local | Section 9 | 3-col grid at md+: oversized Plex Serif brand wordmark, Product + Resources columns. Hairline divider above © + back-to-top baseline row. Bespoke (kit's FooterEditorial is the studio's editorial closing — different shape). |
| `LenisProvider` | `src/components/providers/LenisProvider.tsx` | local | Root layout | Wraps app in `<ReactLenis root>`. Intercepts `a[href^="#"]` clicks for damped programmatic scroll with -88px offset for the sticky nav. **Does NOT bridge Lenis ticks to a synthetic `scroll` event** — that causes infinite recursion in Lenis 1.3+. |
| `MotionProvider` | `src/components/providers/MotionProvider.tsx` | local | Root layout | IntersectionObserver-driven blur-reveal trigger. Reads `?motion=0` and `prefers-reduced-motion`. Sets `data-motion-state` on every `[data-motion="blur-reveal"]` element. Also writes `<html data-motion="off">` redundantly (the pre-hydration script in `layout.tsx` is the primary writer). |
| `CorderPresenceProvider` | `src/components/presence/CorderPresence.tsx` | local | Root layout | Wraps the app in a framer `LayoutGroup` so the in-section window, orb and form share `layoutId="corder-presence"`. Owns the `pastHowItWorks` + `pastFormZone` scroll flags and the `motionDisabled` flag. Mounts the corner orb/form switch at the page root via `CorderPresenceCorner` (internal). |
| `CorderPresenceSentinel` | `src/components/presence/CorderPresence.tsx` | local | Inside `HowItWorks` | 1px scroll anchor. rAF-throttled `getBoundingClientRect`; flips `pastHowItWorks` true when the sentinel enters the upper 40% of the viewport. |
| `CorderPresenceFormSentinel` | `src/components/presence/CorderPresence.tsx` | local | `page.tsx`, between Faq and Footer | Zero-height scroll anchor at the place where the old Newsletter section used to sit. Flips `pastFormZone` true when it enters the upper 40% of the viewport, triggering the orb-to-form morph. |
| `CorderPresenceStaticSection` | `src/components/presence/CorderPresence.tsx` | local | `page.tsx`, between Faq and Footer | Reduced-motion fallback: when `motionDisabled === true`, this section renders the subscribe form inline in normal page flow (`.presence-static`). Returns null when motion is enabled. |

## Kit components imported from `@aisoldier/ui-kit`

| Kit component | Where used | Why |
|---|---|---|
| `Inspector` | `app/layout.tsx` | Dev-only Cmd+click overlay for handoff inspection. |
| `FAQAccordion` | `src/components/sections/Faq.tsx` | Section 7. Multi-open accordion. Mapped 10 FAQ items from `copy.faq.items`. Edit landed in this session: kit FAQItem now carries `data-tokens` so the Inspector overlay sees the token list — required `rm -rf .next` + dev restart per RETRO. |

After this session, candidates for kit promotion (rule: 2+ uses across projects before promoting):

1. **`AppWindowDemo`** — generic browser/macOS app frame that takes children. The `BrowserFrame` kit component covers the browser-chrome flavour; a macOS variant with traffic lights + sidebar slot is a clear delta. Used in Hero (`HeroLibraryDemo`) and now in How (`HowWindow` mini reproduction). Two uses already in Corder — but they're scoped to one project. Wait for a second project before promoting.
2. **`AudienceLine` (kit pattern)** — editorial scroll-driven word-fill. One use, wait for second project.
3. **`StickyScrollNarrative`** — left-sticky-visual + right-scroll-chapters with IntersectionObserver-driven state on the visual. The `How` section's mechanism (rootMargin -35% top/bottom band + closest-to-centre tiebreak) is reusable. Promote after a second project uses it. (Distinct from kit's `StickyFeatureList`, which is sticky-visual + IO-fade — `StickyScrollNarrative` is sticky-state-machine + IO-active-class.)
4. **`PricingCardGrid` + `PricingTierCard`** — 3-tier + lifetime plank pattern with annual toggle. Probably premature to promote before validating per-project price-shape variance.
5. **`PrivacyTrustCardPair`** — two-card asymmetric trust block with mono spec-list. Wait for second project.

## Local-only components

All section files (Nav, Hero, HeroLibraryDemo, AudienceLine, Privacy, How, Features, Pricing, Faq, FinalCta, Footer) are project-local. None are reusable in their current form because they all reference `copy.json` directly via the typed wrapper `@/content/copy`. Promotion candidates are listed above.
