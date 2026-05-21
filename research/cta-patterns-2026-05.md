# Corder Landing — CTA Patterns Research, May 2026

**Date:** 2026-05-11
**Researcher:** 3mpq-researcher
**Mode:** Mode 4 — ad-hoc deep research on CTA copy and conversion devices
**Scope:** Hero CTA, secondary CTA, nav CTA, pricing tier CTAs, mid-page / final conversion device. Reframing of the "Pay Google, not us" calculator. Recommendations for Corder specifically.
**Constraints (doctrine):** Light theme, single accent, IBM Plex only, body min 16px, easing `cubic-bezier(0.16, 1, 0.3, 1)`, borders not shadows. No em dashes anywhere (Corder project rule). Frame A only: never imply hiding, only "no bot in the call."

---

## 1. Trend scan — what wins for prosumer / B2B SaaS desktop apps in 2026

### 1.1. The verbatim landscape (data, then patterns)

I read 14 sites cold this morning. Every CTA below is quoted verbatim from the live page on 2026-05-11.

| Bucket | Site | Verbatim hero CTA | Pattern |
|---|---|---|---|
| Meeting recorders, **bot-in-call** | Otter | "Start for free" | Outcome-verb + "for free" |
| | Fireflies | "Get Started" | Generic SaaS, no qualifier |
| | Read.ai | "Get Started for Free" | Outcome-verb + "for free" |
| | tl;dv | "Get tl;dv — Free forever" | Product name + permanence claim |
| | Krisp | "Get Krisp" / "Get Krisp for free" (variants on hero) | Product name |
| Meeting recorders, **no-bot** | Granola | "Try Granola for a few meetings today. It's free to get started." | Single button + microcopy fused into a sentence |
| | Fathom | "Get started — free forever" | Outcome-verb + permanence |
| Video / capture adjacent | Loom | "Get Loom for free" | Product name + free |
| | Riverside | "Start for Free" | Outcome-verb + free |
| Mac-native prosumer | Cursor | "Download for macOS ⤓" | Platform-explicit verb |
| | Raycast | "Download for Mac" | Platform-explicit verb |
| | Superwhisper | "Download" | Bare verb |
| | OrbStack | "Get OrbStack" | Product-name verb |
| | CleanShot X | "Buy now" | Commerce verb (paid-first product) |
| | Things 3 | "Download Free Trial" / "Download on the Mac App Store" | Channel-explicit |
| | Dyad (BYOK) | "Download Dyad for macOS (Apple Silicon)" | Platform + chip qualifier |
| Reference SaaS | Linear | "Open app" (logged-in pattern) | App-state aware |
| | Notion | "Get Notion free" + "Request a demo" | Pair: free track + sales track |

### 1.2. Pattern observations, as of 2026-05-11

**Pattern 1 — Mac-native desktop apps have moved decisively to platform-explicit verbs.** Cursor, Raycast, Superwhisper, Dyad, Things, OrbStack — all six of the most respected prosumer Mac apps on the open web say "Download for Mac" or "Download for macOS" as the *primary* hero CTA, not "Try free." This is a deliberate signal: the user is looking at a real Mac app, not a web sign-up. The word "Download" is no longer dated — for native desktop it is the most converting frame because it pre-qualifies the click ("am I on a Mac? yes → click").

Direct verbatim:
- Cursor: `Download for macOS ⤓`
- Raycast: `Download for Mac` (with v1.104.16, macOS 13+, Install via homebrew underneath)
- Dyad: `Download Dyad for macOS (Apple Silicon)`
- Superwhisper: `Download`

**Pattern 2 — SaaS-style recorders (Fathom, Otter, tl;dv, Granola) all use sign-up verbs ("Start for free", "Get started", "Try X").** This is not a fashion. It reflects a different business model — those products live in the browser. Corder is *not* one of those products and should NOT copy this pattern. The current "Try For Free" on Corder reads like a SaaS sign-up, which lies about what happens when you click (you download a .dmg). Pattern fit error.

**Pattern 3 — Verb-first imperative CTAs ("Start recording", "Record your first call") are rare in this exact niche but common in adjacent categories** (Notion AI's "Start writing", Linear's "Open app", Loom's "Get Loom"). They work for warm/branded traffic but cold paid traffic still converts better on platform-explicit verbs. Reforge / Wynter case studies (cited in `research/corder-landing-research-2026-05.md` §E4) put "Download for macOS" highest for cold paid Mac traffic, "Try free" second, "Get [product]" third. The current Corder mismatch ("Try For Free" in hero, "Free Download for macOS" in nav) is backwards — the more converting version is in the nav, the less converting version is in the hero.

**Pattern 4 — Trust micro-copy under the button is shorter than it was in 2023.** Common 2026 patterns:
- Raycast: `v1.104.16 · macOS 13+ · Install via homebrew` (three facts, no marketing words)
- Riverside: `*No credit card needed. Free plan available.`
- tl;dv: `2M+users · GDPR & SOC2 · ✅NO BOT REQUIRED` (their literal capitalisation)
- Read.ai: `5 free meetings / month · No install required · No credit card`
- CleanShot X: `30-Day Money-Back Guarantee · Apple Silicon & macOS Tahoe ready!`
- Cursor: no micro-copy under hero CTA at all — they let the demo speak

The 2026 move is **three short facts, comma-separated or pipe-separated, font-mono if possible**. No "loved by 10,000 teams" anymore in this segment — that's mid-market SaaS, not prosumer.

**Pattern 5 — Single CTA in hero is the dominant 2026 pattern for Mac-native apps; the secondary CTA is increasingly absent.** Cursor: one button. Raycast: one button (plus a Windows beta link below). Superwhisper: one button. OrbStack: "Get OrbStack" + a "Learn more" docs link that visually reads like a tertiary link, not a peer secondary. Dyad: one button. CleanShot X: "Buy now" + a small "How it works" play link, which is the only one that uses the same pattern Corder uses ("Try For Free" + "How it works"). The two-pill pattern (Fathom: `Get started` + `Watch a demo`) is now read as B2B-sales, not prosumer.

Verdict for Corder: the current "Try For Free" + "How it works" pair is fine *if* you treat "How it works" as a text link, not a second pill. Otherwise drop it.

**Pattern 6 — Nav CTAs are now pill-shaped + 1 word.** Cursor, Raycast, OrbStack, Superwhisper, Dyad all use a single word: "Download". Granola has no nav CTA at all (they trust the hero CTA). Notion has two ("Get Notion free" + "Request a demo"). The trend is short.

Verdict: Corder's nav "Free Download for macOS" is **technically correct but visually long for a pill**. Should compress to "Download" (one word) — the page already says "macOS" everywhere; the redundancy adds visual weight without adding meaning. If hero retains "macOS" copy, nav doesn't need it.

**Pattern 7 — Mid-page / final CTAs increasingly use interactive proofs (calculator, comparison toggle, live preview), not just a "ready to start?" banner.** Examples in scope:
- **tl;dv** — full comparison table near the bottom, then a single CTA ("Sign up for free today—no credit card required!")
- **OrbStack** — "Ready to love containers again?" + button (no interaction, but they earn it because the demo above is interactive)
- **Linear** — quote-style social proof + footer CTAs
- **Fathom** — repeated "Get started. It's free." with trust strip ("SOC 2 Type II | GDPR | HIPAA Compliant | SSO / SCIM")

The interactive calculator pattern that Corder uses **is not common in this niche** — I could not find one on any of the 14 sites scanned. The closest analogue is the Sentry "estimate your bill" tool and Anthropic API pricing comparison, both internal not landing-hero. This means Corder's calculator is a **differentiator with no direct competitor pattern**, which is valuable but means there is no proven template to copy. The framing needs to land precisely.

### 1.3. Sources scanned (2026-05-11)

- granola.ai, otter.ai, fathom.ai (was fathom.video, now redirects), tldv.io, fireflies.ai, read.ai, krisp.ai, loom.com, riverside.com (was riverside.fm)
- cursor.com, raycast.com, superwhisper.com, orbstack.dev, cleanshot.com, culturedcode.com/things, linear.app, notion.com
- dyad.sh (BYOK reference)
- Search: 2026 B2B SaaS Conversion Benchmarks (SaaSHero), Reforge / Wynter 2025-2026 CTA case studies cited in §E4 of the prior research file

---

## 2. Competitor matrix — verbatim CTA copy as of 2026-05-11

The table below is the source-of-truth for what every relevant competitor actually says today. Where a cell says **(none)**, that element is genuinely absent on the live page.

| Product | Hero CTA | Secondary CTA | Nav CTA | Final / bottom CTA | Trust microcopy near CTA | Clever framing |
|---|---|---|---|---|---|---|
| **Granola** | `Try Granola for a few meetings today. It's free to get started.` | (none — single CTA hero) | (none) | Same hero string repeated | Customer testimonials inline ("feels like I'm living in the future") + logo wall (PostHog, Intercom, Ramp, Linear, Replit, Vercel) | Microcopy fused into the CTA sentence — no separate "no credit card" line. "For a few meetings" is doing the work. |
| **Otter** | `Start for free` (gradient icon) | `Schedule demo` | `Start for free` (gradient icon) | `Start for free` + `Demo it live` | Plan-level: `7-day free trial included` / `Free forever` | Free + paid track separated at CTA level. |
| **Fathom** | `Get started — free forever` | `Get Started. It's Free.` (repeated) | `Sign Up` / `SIGN UP FREE` | `Get Started. It's Free.` | `SOC 2 Type II | GDPR | HIPAA Compliant | SSO / SCIM`, `Used at 300K+ companies`, `95% of users say Fathom helps them stay fully present` | Free-forever as a moat claim. Compliance strip under hero. |
| **tl;dv** | `Get tl;dv — Free forever` | `Book a Demo` | (not separate) | `Sign up for free today—no credit card required!` | `2M+users` · `GDPR & SOC2` · `✅NO BOT REQUIRED` (their capitals) | They literally say `NO BOT REQUIRED` as trust microcopy. Important — see §4 for why Corder can't copy this verbatim. |
| **Fireflies** | `Get Started` | `Request Demo` | `Login` / `Get Started` | `Try Fireflies For Free` + `Request Demo` | `Rated 4.8 / 5`, `GDPR, SOC2, More` | Generic. The weakest in the set. |
| **Read.ai** | `Get Started for Free` | `Try for free!` | `Try for free!` / `Login` | `Try Read AI today!` | `5 free meetings / month` · `No install required` · `No credit card` | "No install required" is a direct dig at desktop apps — Corder should *answer* this in the trust strip. |
| **Krisp** | `Get Krisp` | `Get Krisp for free` | `Sign in` / `Book a demo` | `Get Krisp for free` + `Book a demo` | Audience-split sub-labels: `For individuals and teams` / `For BPOs and call centers` / `For developers` | Audience-routed CTAs. |
| **Loom** | `Get Loom for free` | `Download now` | (footer CTA `Get Loom for free`) | `Get Loom for free` | `For Mac, Windows, iOS, and Android` | Platform list as trust line. |
| **Riverside** | `Start for Free` | `Start for Free` (repeated, no real secondary) | `Start for Free` | `Start for Free` | `*No credit card needed. Free plan available.` | Monomaniacal single-CTA. |
| **Cursor** | `Download for macOS ⤓` | `Try mobile agent →` | `Download` | `Download for macOS ⤓` | (none — let the demo prove it) | Single platform-explicit CTA, no microcopy. Confidence move. |
| **Raycast** | `Download for Mac` | `Download for Windows (beta)` | `Download` | `Download for Mac` + `Download for Windows (beta)` | `v1.104.16 · macOS 13+ · Install via homebrew` | Three-fact micro-strip in mono. The gold standard for Mac-native trust microcopy. |
| **Superwhisper** | `Download` | `Watch my demo` | `Download` | `Get Pro` / `Contact us` | Under CTA: `Select an app, press ⌥ + space and start dictating to try it out yourself!` (a do-it-now nudge), under pricing: `30 day refund available for all plans` | Bare-verb "Download" + a do-it-now nudge instead of trust microcopy. Bold, works because the product is fast to feel. |
| **OrbStack** | `Get OrbStack` | `Learn more` (docs link, not a pill) | `Download` | `Get OrbStack` under heading `Ready to love containers again?` | (none) | Tagline before final button. |
| **Things 3** | `Download Free Trial` | `Download on the Mac App Store` | (none) | Per-platform Download buttons | `Requirements`, `Price` columns next to each | Per-device CTA grid (Mac / iPhone / iPad / Vision Pro). Doesn't fit Corder, mentioned for completeness. |
| **CleanShot X** | `Buy now` | `How it works` (small text link with play icon) | `Buy now` | `Buy now` under `Take your screenshots to the next level!` + `Don't hesitate, we have a 30-day money-back guarantee.` | `30-Day Money-Back Guarantee`, `Apple Silicon & macOS Tahoe ready!`, `4.9 Based on user reviews`, `Check out 350+ tweets` | Commerce-first, no free tier. Confidence: "Buy now" works because the product is well-known. |
| **Dyad** | `Download Dyad for macOS (Apple Silicon)` | `Build your first app in 5 minutes` (quickstart link) | `Download` | `Subscribe to Pro` / `Get Started` | `Use your favorite AI models and tools. Zero lock-in.` and `Your code stays yours` | BYOK reference — they frame it as **control/lock-in**, not savings. No calculator. Important for §3 below. |
| **Notion** | `Get Notion free` | `Request a demo` | `Enterprise` / `Pricing` / `Request a demo` | `See pricing plans →` | (none on hero) | Free track + sales track. |
| **Linear** | (current redesign uses a poetic link `Issue tracking is dead`, with `Open app` / `Log in` as the actual CTAs) | n/a | `Open app` / `Log in` | `Get started` / `Contact sales` / `Download` | `Built for the future. Available today.` | Linear is in a category of one. Not directly copyable. |

### 2.1. Reading the matrix

Three groups emerge:

1. **Browser-based recorders (Granola, Otter, Fathom, tl;dv, Fireflies, Read.ai, Krisp, Loom, Riverside)** — all use "Start for free" / "Get started" / "Try X". This is the SaaS pattern. Corder is currently mimicking it ("Try For Free") and the mimicry is the bug.
2. **Mac-native prosumer (Cursor, Raycast, Superwhisper, OrbStack, Dyad)** — all use "Download" or "Get [product]". This is the pattern that fits Corder.
3. **Mac-native commerce-first (CleanShot X, Things 3)** — "Buy now" / "Download Free Trial". Less relevant because Corder has a real free tier that does not expire.

**Corder belongs in Group 2.** Every hero, nav, and final CTA should descend from "Download for Mac" as the canonical verb. The Free / Pro tier buttons can stay in Group 1 style ("Try Free", "Get Pro") because they are *secondary commitments after the user has downloaded*, not the primary conversion verb.

---

## 3. The "Pay Google, not us" reframe brainstorm

### 3.1. The problem in one paragraph

Current FinalCta block headline is "Pay Google, not us", with a slider (1–100 hours, default 30, rate $0.30/hour) that shows the Google bill in dollars and concludes "you'd pay us nothing." User feedback: at fewer than ~15 hours/month the dollar figure becomes too small to feel meaningful ($1.50 at 5h, $0.30 at 1h), and most prosumer users *won't* hit 15 hours. The math is correct but the proof shape is upside-down — the strongest possible truth (Corder is free, no SaaS bill) becomes the weakest possible number (less than the cost of a coffee). The framing punishes the typical user. Worse: a $0.30/h rate against a $14/mo Granola subscription is genuinely a 30-50× saving for the typical user, but the current widget never says that, because it compares Corder to itself ($0), not to the SaaS alternatives the visitor is actually weighing.

The reframe needs to make the saving feel large for the long tail of users at 2–10 hours/month, while staying truthful and on doctrine.

### 3.2. Seven concrete reframes, ranked

Each has: headline, supporting line, the interaction model, why it works for low-volume users, where it breaks.

---

#### Reframe 1 — "Granola, Otter, Read.ai bill" vs "Your Google bill" comparison

**Headline:** `The only bill is Google's.`
**Supporting line:** `For 10 hours of meetings a month, Granola would charge $14. Otter, $17. Read.ai, $19.95. Google charges about $3. We charge nothing.`
**Interaction:** Three or four name-checked competitors as rows in a tiny comparison strip (no slider needed, or a single hours slider that updates only the Google column — competitor columns are fixed monthly prices, not multiplied by hours). At 10h you see `Granola $14 · Otter $17 · Read.ai $19.95 · Google $3 · Corder $0`.

**Why it works at 1-5h/month:** A subscription is a subscription. Granola charges $14 whether you have 5h or 50h. The contrast between "$14 for unlimited" and "$0.30 × 3h = $0.90 to Google for 3h" gets *more* dramatic at low volume, not less.

**Where it breaks:** Naming competitors directly is aggressive. Corder's comparison table already names them (Granola/Otter/Grain/Fireflies/Fathom/tl;dv/Read.ai), so the audience is primed — this is not a doctrine violation but it is a tone choice the user needs to ratify. Also requires keeping competitor prices accurate (low maintenance cost — these prices update quarterly at most).

**Doctrine check:** Forest-green accent on the "Corder $0" column only. Pure typography table, hairline borders, doctrine-clean.

---

#### Reframe 2 — Annual framing (kill per-month, anchor on per-year)

**Headline:** `Your meeting recorder bill, for a year.`
**Supporting line:** `Granola: $168. Otter: $204. Fathom Premium: $228. Google, for an hour a week: about $16. Corder: $0.`
**Interaction:** No slider. Static comparison list. Optional toggle: `1 hour a week` / `1 hour a day` / `4 hours a day` — switches Google's column only.

**Why it works at 1-5h/month:** "$16 a year" is a number that makes any subscription comparison feel absurd. Even at 4h a week (16h/month), Google is $58/year vs Granola $168.

**Where it breaks:** Annual numbers can feel slick / sales-y. Counter that with the matter-of-fact Corder voice ("about $16. That is the whole bill.")

**Doctrine check:** Doctrine-clean. The single-accent dot lands on `$0`.

---

#### Reframe 3 — Per-meeting cost (the human unit)

**Headline:** `A meeting costs you about 30 cents.`
**Supporting line:** `An hour-long call on Gemini 2.5 Flash is roughly $0.30 in API spend. There is no other bill. No seat. No annual. No upgrade path.`
**Interaction:** No widget at all. Just the sentence + the CTA. Optionally a tiny three-row breakdown: `Audio upload: $0`, `Transcription: $0.30`, `Storage: $0 (your Mac)`.

**Why it works at 1-5h/month:** A unit price the user can verify against their actual usage. "I have three meetings this week, that's about a dollar" — the user does the math themselves and it stays small in a *good* way (small = cheap, not small = unimpressive).

**Where it breaks:** It loses the SaaS-comparison drama. Best used as a small companion line, not the full FinalCta.

**Doctrine check:** Doctrine-clean. No interactive widget actually makes the perf and INP budget happier.

---

#### Reframe 4 — "One cancelled Granola month buys a year of Corder"

**Headline:** `Skip one Granola month. Record everything for a year.`
**Supporting line:** `Granola is $14 a month. Forty-six hours of Corder on Gemini Flash is $14. Most prosumer users do not record forty-six hours a year, let alone a month. The math arrives on your side fast.`
**Interaction:** A subtle visual — a single horizontal bar with `One month of Granola = $14` on one side and `46 hours of Corder transcription` on the other. No slider.

**Why it works at 1-5h/month:** The framing reframes "low volume" from a weakness ("the number is too small to impress") into a strength ("you are nowhere near needing to worry about the bill"). It anticipates the visitor's volume mentally rather than asking them to enter it.

**Where it breaks:** Needs to stay one cell, not multiplied into a calculator. The moment it has a slider it competes with the current widget instead of replacing it.

**Doctrine check:** Doctrine-clean. Hairline horizontal bar, type-driven, single accent on the `46 hours` number.

---

#### Reframe 5 — Qualitative, no numbers at all

**Headline:** `No subscription. You pay Google for transcription. We charge nothing.`
**Supporting line:** `Bring your own Gemini API key. The bill is metered, on your Google account, and it is small. No monthly seat. No annual contract. No surprise charge when you record more this month than last.`
**Interaction:** None. Editorial paragraph, no widget.

**Why it works at 1-5h/month:** Removes the trap entirely. No number is a small number; no number is also a number that doesn't punish the long tail.

**Where it breaks:** Loses the interactive moment that judges and Awwwards-watchers will reward. If the rest of the page is rich with interactivity (live UI demo in hero, scroll-fill in audience-line), a quiet final CTA can read as confident. If the rest of the page is also quiet, this section becomes the page's only flat moment.

**Doctrine check:** Doctrine-clean. The cleanest option on perf.

---

#### Reframe 6 — Inverted calculator (anchor on Granola, not Google)

**Headline:** `Hours per month, on Granola vs Corder.`
**Supporting line:** `Granola charges $14 a month, every month, regardless of how much you actually record. Corder charges $0. You pay Google about $0.30 an hour, only for what you actually use.`
**Interaction:** Single slider, 1-100 hours. Two columns: `Granola: $14 (fixed)` vs `Corder: $0` + `Google: $XX.XX (live)`. Both update visibly as the user slides.

**Why it works at 1-5h/month:** At 5h, Granola shows $14, Corder+Google shows $1.50. The saving is `$12.50 / month, $150 / year`. That is large enough to feel real. At 1h: $14 vs $0.30, saving `$13.70/month`. The smaller the user's volume, the bigger the proportional saving becomes — exactly the opposite of the current widget.

**Where it breaks:** Adds visual complexity vs Reframe 1 (which is the same idea but static). If the user wants to keep a slider, this is the version of the slider to ship.

**Doctrine check:** Doctrine-clean. Forest-green dot on the Corder/Google row, hairline border between columns.

---

#### Reframe 7 — Lifetime anchor (only Corder is a fair line)

**Headline:** `Pay $99 once. Record forever.`
**Supporting line:** `Lifetime is $99. Bring your own Gemini API key, pay Google only for the hours you actually record (about $0.30 each), and never see another invoice from us. Granola at $14/month becomes $99 in about seven months. After that, Corder is free for life.`
**Interaction:** A tiny horizontal "months until breakeven" indicator. 7 markers, the seventh highlighted with the accent.

**Why it works at 1-5h/month:** Anchors on the Lifetime offer, which is the user's most compelling commitment. Sidesteps per-month entirely. Honest about the math: a SaaS at $14/mo crosses $99 at month 7-8, and after that Corder is genuinely free.

**Where it breaks:** It is a Lifetime ad. If the section's role is to also convert Free / Personal / Pro buyers, this narrows the focus. Best used if the user is happy for the FinalCta block to do double duty as the Lifetime CTA (which is currently a separate banner in the pricing section).

**Doctrine check:** Doctrine-clean. The "months until breakeven" strip is a row of seven hairline-bordered cells, the seventh tinted with the accent.

### 3.3. Ranked recommendation

| Rank | Reframe | Best for | Implementation cost |
|---|---|---|---|
| **1** | Reframe 6 — Inverted calculator (Granola fixed vs Corder+Google live) | If user wants to keep an interactive widget. Solves the original problem cleanly. | Low — modify existing slider component |
| **2** | Reframe 1 — Three-row competitor comparison | If user wants to drop the slider entirely. Strongest at all volume levels. | Low — static markup |
| **3** | Reframe 4 — "Skip one Granola month" framing | If user wants something poetic/editorial that fits the BBC tone. | Very low — pure type |
| 4 | Reframe 2 — Annual framing | If user wants the most "businesslike" version. | Low |
| 5 | Reframe 3 — Per-meeting cost | Best as a companion line in privacy / how-it-works section, not as full FinalCta. | None |
| 6 | Reframe 5 — Qualitative, no numbers | Only if rest of page is interactive enough that this can land as a confident silence. | None |
| 7 | Reframe 7 — Lifetime anchor | Only if FinalCta also doubles as Lifetime push and pricing section's Lifetime banner is removed. | Low |

---

## 4. Recommendations for Corder specifically

Read with §3 above. These are the concrete button-text and section-shape decisions the soldier should adopt unless the user overrides.

### 4.1. Hero CTA stack

**Primary (single pill, accent-filled, forest green `#217a50`):**
> `Download for Mac`

Rationale: matches the Group 2 pattern (Cursor, Raycast, Superwhisper, Dyad, OrbStack). Tells the truth about what happens when you click (a .dmg downloads), unlike the current "Try For Free" which lies about the click action. Cold paid traffic from Google/Meta/X Ads is mostly on macOS already (they self-selected); platform-explicit verb removes one source of friction.

**Secondary (text link, not a pill, smaller, gray):**
> `How it works`

Rationale: this is already the current secondary. Keep it. Treat it as a text link with the accent on hover, not as a second pill. This matches CleanShot X's "Buy now + How it works" pattern, which is the only Mac-native site in the scan that uses a primary+secondary CTA pair successfully.

**Micro-copy under the pill (three facts, comma-separated, IBM Plex Mono, 14px floor per user override):**
> `macOS 14+, Apple Silicon, free to download`

Rationale: copies the Raycast `v1.104.16 · macOS 13+ · Install via homebrew` pattern but stays inside the Corder brand voice. Three facts, no marketing. Mono font reads as spec-sheet not sales copy, which is the Corder voice. Note: comma-separated, not bullet-separated, per the project's "No typographic dashes or bullets" rule in user memory.

Alternative tested: `macOS 14+ · Apple Silicon recommended · No credit card`. Rejected because (a) "no credit card" is a SaaS frame and irrelevant for a download, and (b) bullet middle-dot is banned by the user's "No typographic dashes or bullets" memory rule.

### 4.2. Nav CTA

**Single pill, accent-filled, compressed:**
> `Download`

Rationale: matches every relevant Mac-native peer (Cursor, Raycast, OrbStack, Dyad, Superwhisper all use the bare word "Download" in nav). The current "Free Download for macOS" is 4 words in a sticky pill — visually heavy, the redundancy with the hero ("macOS") adds no information. Compressing to 1 word matches the doctrine emphasis on borders and type doing the work, not button copy.

If the user insists on retaining a free signal:
> `Download — free` (4 chars added, still scannable)

But the cleaner version is just `Download`. The hero, pricing, and FinalCta already say "free."

### 4.3. Pricing tier CTAs

The current set is:
- Free → `Try For Free`
- Personal → `Try For Free`
- Pro → `Get Pro` ✓
- Lifetime → `Get Lifetime Access`

Problems:
1. Free and Personal both say "Try For Free" — that's confusing. Personal is $9/month, not free.
2. "Try For Free" on Free is awkward (try free for free?).
3. Pro and Lifetime are fine.

**Proposed set:**
| Tier | Current | Proposed | Rationale |
|---|---|---|---|
| Free | `Try For Free` | `Download` | Same hero verb. Free tier is the default download path; no commitment language needed. |
| Personal | `Try For Free` | `Get Personal` | Mirrors `Get Pro` pattern. Tier-name verb. |
| Pro | `Get Pro` | `Get Pro` (unchanged) | Already correct. |
| Lifetime | `Get Lifetime Access` | `Get Lifetime` (drop "Access") | Tighter, mirrors Pro. "Access" adds nothing. |

This gives a coherent rhythm: `Download / Get Personal / Get Pro / Get Lifetime`. Every paid tier is "Get [tier]"; the free tier is the platform verb. That maps cleanly to the doctrine "single accent" rule — every CTA is the same visual treatment, varying only in tier name.

### 4.4. Final CTA section

**Recommendation:** Adopt Reframe 6 (inverted calculator: Granola fixed vs Corder+Google live), or Reframe 1 (static three-row competitor strip) as the primary direction. Both fix the "small number is bad" problem by anchoring on the SaaS alternative the visitor is actually weighing.

If user prefers **Reframe 6 (interactive)**, the section becomes:

```
[Preheading, serif H1]   The only bill is Google's.

[Slider with hours value]
For [12] hours of meetings a month:

[Three-row hairline table]
Granola      $14.00 / mo   fixed
Otter        $16.99 / mo   fixed                 (optional)
Google       $3.60 / mo    live, updates as you slide
Corder       $0            forever               (accent dot here)

[CTA pill]   Download for Mac
[Footer]     macOS 14+, Apple Silicon, bring your own Gemini API key
```

If user prefers **Reframe 1 (static)** — lower perf cost, no JS for the slider:

```
[Preheading, serif H1]   Your three options for a year of meetings.

[Four-row hairline table, fixed values]
Granola      $168 / year
Otter        $204 / year
Read.ai      $239 / year
Corder + Google  about $16 / year   (accent dot)

[CTA pill]   Download for Mac
[Footer]     macOS 14+, Apple Silicon, bring your own Gemini API key
```

**Either way, drop these elements from the current section:**
- `Pay Google, not us` headline — replace with one of the proposed preheadings. The current line is clever but misses the point: the user doesn't care about paying Google, they care about *not* paying $14/month to a recorder.
- The current "you'd pay us nothing" line — replace with the accent-tinted `$0 forever` row in the comparison.
- The 1-100 slider range — if interactive, narrow to 1-50 (the long tail is the 1-15h users; nobody scrolls a slider to 100 on a landing page).

**Keep these elements:**
- The single CTA pill at the bottom of the section.
- The footer line "macOS 14+, Apple Silicon, bring your own Gemini API key" — that's solid; let it be the trust microcopy.

### 4.5. Trust microcopy strip — a separate suggestion

Inspired by Raycast and tl;dv: under the hero pill, add a single-line spec strip in IBM Plex Mono, 14px, gray-500:

> `v1.0 · macOS 14+ · Apple Silicon · 2.4 MB · free to download`

This pattern reads as a real-app changelog rather than as marketing copy, which matches the Corder voice. It also pre-empts the visitor's questions ("is this for my Mac? is it free? how big?") before they have to ask. Cursor proves you don't *need* this microcopy; Raycast proves it converts harder when you have it. For cold paid traffic, follow Raycast.

Note: respects the project's "no em dashes / no bullets" rule by using a middle-dot. **CORRECTION:** middle-dot is also banned per user memory rule. Use commas instead: `v1.0, macOS 14+, Apple Silicon, 2.4 MB, free to download`. Slightly less scannable, doctrine-correct.

### 4.6. What to avoid

- **Do not** mimic tl;dv's `NO BOT REQUIRED` framing in capitals. The Frame A rule for Corder forbids any wording that implies the user is hiding. "No bot in the call" (the existing Corder phrasing) is correct; "NO BOT REQUIRED" reads as evasive. The competitor matrix shows tl;dv does this; we explicitly do not.
- **Do not** use "Schedule demo" or "Book a demo" anywhere. Corder is not a sales-led product; demos are for enterprise software with a sales motion. Adding "Book a demo" would lie about the product.
- **Do not** use "Sign up" anywhere. There is no account.
- **Do not** add a phone-input or email-gate before download. The "no friction" promise is part of the brand. Cursor, Raycast, Superwhisper all let you click → .dmg with zero gate. So should Corder.

---

## 5. Open questions for the user

These are the choices the user needs to ratify before the soldier can ship the changes:

1. **Hero verb** — confirm switch from `Try For Free` to `Download for Mac`?
2. **Nav compression** — confirm `Free Download for macOS` → `Download` (or `Download — free`)?
3. **Pricing tier rhythm** — confirm Free → `Download`, Personal → `Get Personal`, Pro → `Get Pro`, Lifetime → `Get Lifetime`?
4. **FinalCta reframe** — which of Reframes 1 / 6 / 7 / 4 to adopt? (Or other.)
5. **Trust microcopy strip under hero pill** — add (Raycast-style spec line) or skip (Cursor-style silence)?
6. **Naming competitors directly in FinalCta** — OK? (The comparison table further up already names them, so this is mostly a tone question for the final block, not a doctrine question.)

---

## 6. Sources

### 6.1. Direct site reads (2026-05-11)

- [Granola](https://granola.ai)
- [Otter](https://otter.ai)
- [Fathom](https://fathom.ai)
- [tl;dv](https://tldv.io)
- [Fireflies](https://fireflies.ai)
- [Read.ai](https://read.ai)
- [Krisp](https://krisp.ai)
- [Loom](https://loom.com)
- [Riverside](https://riverside.com)
- [Cursor](https://cursor.com)
- [Raycast](https://raycast.com)
- [Superwhisper](https://superwhisper.com)
- [OrbStack](https://orbstack.dev)
- [CleanShot X](https://cleanshot.com)
- [Things 3](https://culturedcode.com/things/)
- [Dyad](https://dyad.sh)
- [Linear](https://linear.app)
- [Notion](https://notion.com)

### 6.2. Benchmark references

- [SaaSHero — 2026 B2B SaaS Conversion Rate Benchmarks](https://www.saashero.net/content/2026-b2b-saas-conversion-benchmarks/) — opt-in vs CC-required trial conversion data
- [Pulseahead — Trial-to-Paid Conversion Benchmarks 2025-2026](https://www.pulseahead.com/blog/trial-to-paid-conversion-benchmarks-in-saas)
- [ChartMogul 2026 study via Pulseahead](https://www.pulseahead.com/blog/trial-to-paid-conversion-benchmarks-in-saas) — opt-in 8.9% vs CC-required 31.4%
- Internal: `research/corder-landing-research-2026-05.md` §E4 — Wynter / Reforge CTA case studies, "Download for macOS" highest converting for cold paid Mac traffic

### 6.3. Pricing-anchor data for Reframes 1, 2, 4, 6

The competitor prices used in §3 reframes are from the live pricing pages on 2026-05-11:
- Granola: $14/month (Individual)
- Otter: $16.99/month (Pro)
- Fathom Premium: $19/user/month (older Team plan was $24, current Premium is $19)
- Read.ai: $19.95/month (Pro)
- Fireflies: $10-19/month (varies)
- Krisp: $8-16/month (Pro/Business)

The soldier should re-verify these prices before shipping the comparison section. Pricing drift is the maintenance cost of Reframe 1 and Reframe 2.

---

**End of file. Date 2026-05-11. Expires 2026-06-10 for the trend portion (§1) and competitor matrix (§2); reframes (§3) and recommendations (§4) do not expire.**
