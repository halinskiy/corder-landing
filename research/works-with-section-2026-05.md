# Corder Landing — "Works With" Section + Audience Stack Research

**Date:** 2026-05-11
**Researcher:** 3mpq-researcher
**Mode:** Mode 4 — ad-hoc deep research, two linked tasks
**Scope:** (1) Realistic 2026 buyer stack for Corder, by audience segment. (2) Section pattern audit for "works with X" / "fits your stack" compatibility strips, 14 sites scanned. (3) Concrete design directions and one recommendation.
**Constraints (doctrine):** Light theme, single accent `#217a50`, IBM Plex only, ≥16px body, 14px floor for footnotes, easing `cubic-bezier(0.16, 1, 0.3, 1)`, borders not shadows. No em dashes, no middle-dots, no bullets (per user memory). Frame A only — never imply hiding.
**Source pointer:** Add reference to `CORRECTIONS.md` so the soldier reads this before building any compatibility section.

---

## 0. Why this research exists, in one paragraph

Corder records OS-level audio. It does not "integrate" with Zoom in the API sense — it just records whatever plays through CoreAudio. That is a *stronger* truth than "we integrate with 7 platforms," but it does not visualise itself. A logo strip is how every other prosumer Mac app converts that truth into something a scanning visitor can absorb in 1.2 seconds. The job of this section is not to *list* integrations; it is to **let the visitor see their own existing stack on the page and feel "this fits."** That's a different design problem than Otter's "integrations" page, which is a feature checklist. We are building a recognition device, not a feature wall.

---

## 1. Task 1 — Audience stack matrix (who they are, what they use)

### 1.1. The five segments, ranked by Corder fit

I scored each segment on three factors: (a) probability they have a Gemini API key already, (b) probability the meeting frequency hits Corder's sweet spot (3-30h/month), (c) probability they reject SaaS bots on principle. The order below is the order to optimise the logo strip and audience-line for.

| Rank | Segment | Has Gemini key? | Meeting volume | Anti-bot tendency | Notes |
|---|---|---|---|---|---|
| 1 | Indie founder / solo SaaS maker | High — building with Gemini already plausible | Medium (5-15h/mo) | High — small-co culture, no IT mandate | Strongest fit. Most likely to already pay for Cursor, ChatGPT, Claude — comfortable with BYOK. |
| 2 | Technical consultant | Medium | High (15-40h/mo) | Very high — confidentiality with clients | Highest meeting volume, highest privacy stakes. They take the deepest notes. |
| 3 | Freelance dev / designer | Medium | Medium (5-15h/mo) | High | Tighter on tool budget than #1. May resist a $14/mo subscription that an indie founder would shrug at. |
| 4 | PM in a small company | Low — corporate Gemini access blocked or via IT | High | Medium — they have a Notion or Granola workspace already | Often *most* meetings, but the team already has a recorder. Hard sell unless they're solo PM. |
| 5 | Executive / technical coach | Low — non-technical buyer | Medium (8-20h/mo) | Very high — coaching ethics demand it | Smallest segment, but the bot-free framing matches their ethics literally. |

### 1.2. The stack matrix — what each segment actually uses in 2026

Verified against: Granola integrations guide ([granola.ai/blog](https://www.granola.ai/blog/granola-integrations-complete-guide-connecting-meeting-tools)), 2026 indie hacker stack roundups ([tldl.io](https://www.tldl.io/resources/indie-hacker-saas-stack-2026), [indieis.land](https://indieis.land/blog/indie-hacker-tools-trends-2026)), freelancer toolkit guides ([solo-port.com](https://www.solo-port.com/post/freelancer-tools-guide-2026), [sidehustlehackers.com](https://sidehustlehackers.com/freelancing/tools/10-essential-tools-for-freelancers-2026/)), PM stack reviews ([harshal-patil.com](https://www.harshal-patil.com/post/ai-native-product-manager-2026q1), [techstackdaily.com](https://techstackdaily.com/comparison/notion-vs-linear-product-teams-2026/)), executive coach reviews ([feisworld.com](https://www.feisworld.com/blog/granola-ai-review), [tldv.io](https://tldv.io/blog/granola-review/)).

Bold = "logo I would put on the strip." Italic = "common but probably too niche for the strip." Plain = mentioned but not strip-worthy.

| Segment | Meeting platform | Note destination | Storage | Project / CRM | AI tools already paid |
|---|---|---|---|---|---|
| **Indie founder** | **Zoom**, **Google Meet**, *Discord*, **Slack huddle**, *FaceTime* | **Notion**, **Obsidian**, **Apple Notes**, *Bear*, *Craft* | **iCloud Drive**, **Dropbox**, *Google Drive* | **Linear**, *Things*, *Height*, **GitHub Issues** | **ChatGPT**, **Claude.ai**, **Cursor**, **Raycast AI**, *Perplexity* |
| **Technical consultant** | **Zoom**, **Google Meet**, **Microsoft Teams** (client-side), *Webex* | **Notion**, **Obsidian**, **Apple Notes**, *Logseq* | **Dropbox**, **Google Drive**, *iCloud Drive* | *Notion DB*, **Linear**, *Things*, *Pipedrive*, *HubSpot* | **ChatGPT**, **Claude.ai**, *Perplexity* |
| **Freelance dev / designer** | **Zoom**, **Google Meet**, *Discord*, **Slack huddle** | **Notion**, **Apple Notes**, *Linear comments*, *Figma comments* | **iCloud Drive**, *Dropbox* | **Linear**, **GitHub Issues**, *Things*, *Figma* | **ChatGPT**, **Claude.ai**, **Cursor**, **Raycast AI** |
| **PM (small company)** | **Zoom**, **Google Meet**, **Microsoft Teams** | **Notion**, *Linear docs*, *Dovetail* | *Google Drive*, *Notion files* | **Linear**, *Jira*, *Productboard*, *Dovetail* | **ChatGPT**, *Claude.ai*, *Perplexity*, *Dovetail AI* |
| **Executive / technical coach** | **Zoom**, **Google Meet**, *FaceTime* | **Notion**, **Apple Notes**, *Day One*, *Bear* | **iCloud Drive**, **Dropbox** | *Notion DB*, *Reflect*, *Things* | **ChatGPT**, *Claude.ai* |

### 1.3. Cross-segment frequency — which logos actually belong on the strip

Counting "bold" appearances across all five segments. This is the score that decides the strip.

| Logo | Bold count (out of 5) | Tier |
|---|---|---|
| Zoom | 5 | Must |
| Google Meet | 5 | Must |
| Notion | 5 | Must |
| ChatGPT | 5 | Must |
| Apple Notes | 4 | Must |
| Claude (Claude.ai) | 4 | Must |
| Obsidian | 3 | Strong |
| Microsoft Teams | 2 | Strong but caveated (see §1.5) |
| Linear | 4 | Strong |
| Cursor | 2 | Strong |
| Dropbox | 4 | Strong |
| Slack (huddle) | 3 | Strong |
| iCloud Drive | 4 | Useful but no recognisable logo file (Apple icon only) |
| Raycast AI | 2 | Optional — flexes Mac-native cred |
| Discord | 2 | Optional |
| Things | 2 | Optional — strong Mac-native signal, weak meeting-recorder relevance |
| GitHub Issues | 2 | Skip — not a meeting/notes destination |
| FaceTime | 2 | Useful framing, no Apple-permitted third-party logo use |
| Webex / Whereby / Around | <2 | Skip |
| Pipedrive / HubSpot / Attio | <2 | Skip on prosumer strip (CRM is a Granola differentiator, not Corder) |

### 1.4. Recommended logo list — 14 logos, 3 clusters

For Corder specifically, with the doctrine constraint that everything is type and hairlines, **14 logos in 3 named clusters** is the cap. More than ~15 reads as "we partner with everyone," which is the wrong signal for a privacy-first BYOK app. Fewer than ~10 reads as "early-stage, not ready." 14 sits in the prosumer Mac sweet spot (Raycast's hero shows ~17, Granola shows 5, Read.ai shows ~20).

**Cluster 1 — Records what you call from (meeting platforms): 5 logos**
- Zoom
- Google Meet
- Microsoft Teams (with footnote, see §1.5)
- Slack huddle
- Discord

**Cluster 2 — Drops into where you write (note destinations): 5 logos**
- Notion
- Obsidian
- Apple Notes
- Bear (or Craft as alternate — pick one of the two prosumer Mac note apps)
- Linear

**Cluster 3 — Lives where your files live (storage / archive): 4 logos**
- iCloud Drive (Finder logo — Apple's marks usage permits this for product compatibility statements)
- Dropbox (already a real integration via the Dropbox archive feature, this row is *not* a claim, it's a fact)
- Google Drive (via drag-out)
- (room for one more — see §1.6 honesty caveat)

### 1.5. The Microsoft Teams problem — honesty footnote required

Microsoft is rolling out bot detection in Teams meetings in mid-May 2026 (general availability early June 2026), per [office365itpros.com](https://office365itpros.com/2026/03/16/third-party-recording-bots/) and [Microsoft Learn](https://learn.microsoft.com/en-us/microsoftteams/platform/bots/calls-and-meetings/calls-meetings-bots-overview). **This is great news for Corder** — every bot-based recorder (Otter, Fathom, tl;dv, Fireflies, Read.ai) is about to start failing on Teams calls. Corder, recording at the OS level, is unaffected.

But there is a real limitation that Corder needs to be honest about: when Teams is run inside the **Teams web app in a browser**, system audio capture works perfectly (audio goes through CoreAudio). When run inside the **native Teams Mac app**, some users have reported intermittent audio routing issues (per [Atlassian Loom support docs](https://support.atlassian.com/loom/kb/system-audio-not-captured-in-microsoft-teams-recordings-mac/)) where Teams routes audio in ways that interact with macOS audio drivers. This is not a Corder bug — it is a Teams quirk that every system-audio recorder faces.

**Honesty microcopy suggestion under Cluster 1:**
> `Microsoft Teams works through the browser version. Native Teams audio capture depends on your macOS audio driver setup.`

Or, simpler and more in-voice:
> `Anything that plays through your Mac's speakers, Corder records.`

This second line is the master-key framing for the whole section — see §3 recommendation.

### 1.6. The honesty advantage — Corder is not "Connects to". Corder is "Records anything"

This is the single most important framing decision for the section. Every competitor in the scan (§2.1) presents integrations as a list of *named* platforms because they have to — they're using vendor APIs and meeting-platform SDKs. Corder records at the OS level. The list of "things Corder works with" is the list of "things that play sound on your Mac." The strip should make that point.

The pattern to copy is **Superwhisper's "Works anywhere you can type"** ([superwhisper.com](https://superwhisper.com)) — they show a keyboard-layout grid of 35+ app icons, but the heading is the killshot. The promise is universal capture; the logos are starting points, not a closed list.

For Corder the equivalent heading is something like:
> `Records anything that plays through your Mac.`

Then the logos beneath are not a contract, they are the most common starting points.

### 1.7. The AI-tools row — separate, named, honest

The Cluster 3 above is storage. There is a fourth potential cluster — AI tools the user already pays for, which matters because of the BYOK friction the brief identifies. **Most prosumer ChatGPT Plus / Claude Pro / Cursor users do NOT have a Gemini API key.** Showing ChatGPT, Claude, Cursor in a "works with" strip without context would imply Corder uses *those* providers — which it doesn't. Corder uses Gemini specifically because of pricing.

Three options for handling this:

1. **Don't show AI tool logos at all.** Cleanest. Keeps the section focused on meeting → notes → storage.
2. **Show them in a separate cluster labelled "Drops transcripts into" with ChatGPT/Claude/Cursor as paste destinations.** This is true — you can drag a transcript into any text field, including ChatGPT/Claude/Cursor. Adds prosumer-Mac cred (Raycast/Cursor logos signal "real Mac stack" not "B2B SaaS"). Risk: visually suggests integration we don't have.
3. **Mention BYO Gemini key in microcopy under the strip**, with the Google AI Studio logo only. Honest about the friction but doesn't pretend to integrate with ChatGPT.

**Recommendation: option 1 for the strip, option 3 as a one-line footnote below the CTA pill, not in the strip itself.** Adding more clusters to the strip dilutes the "fits your stack" recognition moment. The BYOK conversation belongs in §6 of the page (FAQ + pricing), not at the moment of stack-recognition.

---

## 2. Task 2 — Section pattern audit: how 2026 apps present "works with X"

### 2.1. The audit table (14 sites scanned 2026-05-11, verbatim where quoted)

| Product | Section heading (verbatim) | Placement | Animation | Logo count | Clustered? | Logos link? | Source |
|---|---|---|---|---|---|---|---|
| **Granola** | `Works on all platforms, no meeting bots` | Mid-page, post how-it-works | Repeats — implied marquee/carousel | 5 (Zoom, Meet, Webex, Slack, Teams) | No, one row | Decorative | [granola.ai](https://granola.ai) |
| **Granola** (secondary) | `Share your notes with one click` | Mid-to-lower | Animated carousel, 3 cycles | 8 destinations w/ context labels | Yes — by destination (#user-feedback, CRM Affinity, Notion Project Updates) | Decorative | [granola.ai](https://granola.ai) |
| **Otter** | `Connect to your favorite apps` | Lower-middle, pre-pricing | Static grid w/ icon + name + body + link | 11 (Zoom, Dropbox, GCal, GDocs, GMeet, HubSpot, Jira, Notion, Salesforce, Slack, Asana) | No, one wall | "Learn more" link per row + "View integrations" CTA | [otter.ai](https://otter.ai) |
| **Fathom** | `Works where you meet` | Mid-page | Circular cluster with triangle graphic | 11 (Meet, Zoom, Teams, Gmail, Slack, Asana, Salesforce, HubSpot, Zapier, ChatGPT, Claude) | Yes — implied (Meeting / Comms / Work mgmt / AI partners) | Dropdown in nav | [fathom.ai](https://fathom.ai) |
| **tl;dv** | (no dedicated heading; logos appear inside action-item demo) | Inside product demo block | Static | 6 (Zoom, Meet, Teams, Slack, HubSpot, Notion) | Paired w/ meeting-type metadata | No | [tldv.io](https://tldv.io) |
| **Fireflies** | `Integrate Fireflies with your favorite Work Tools` | Mid-page | Static cards | Categorical w/ +X overflow ("5+", "9+") | Yes — CRM / Project Mgmt / ATS / Slack | Card links | [fireflies.ai](https://fireflies.ai) |
| **Read.ai** | `Works with your favorite tools` | Mid-page post features | Horizontal scrolling grid | ~20 (Meet, Zoom, Teams, Gmail, Outlook, Slack, GCal, SF, HS, Webex, Asana, Linear, Jira, Conf, GDrive, GDocs, OneNote, Zapier, Webhooks, Apple) | No, one wall | "Connect Your Tools" CTA + "View all integrations" link | [read.ai](https://read.ai) |
| **Krisp** | `Works with any calling app & integrates to your workflow` | Mid-to-lower | Static logo row | ~9 + secondary CRM cluster | Yes — Calling / CRM-automation | None | [krisp.ai](https://krisp.ai) |
| **Meetily** | `Works with Any Platform` | Mid-page | Text-only, no logos | 6 named in text | Yes — current vs planned | None | [meetily.ai](https://meetily.ai) |
| **Raycast** | `There's an extension for that.` / sub `Use your favorite tools without even opening them.` | Mid-page | Tabbed (Productivity / Engineering / Design / Writing) — cards with app icon + screenshot per tab. Footer link "Browse the store" + "Plus thousands more..." | ~17 visible | Yes — by job-to-be-done tabs | Each card links to extension page | [raycast.com](https://www.raycast.com) |
| **Linear** (homepage) | (no dedicated section on homepage — agent avatars only) | n/a | n/a | n/a | n/a | n/a | [linear.app](https://linear.app) |
| **Linear** (/integrations) | `Integrations` | Dedicated page | Static | ~60 across 12 categories | Yes — 12 named clusters incl. Essentials / Agents / AI clients / Engineering / Linear crafted / Bug Reporting / Automations / Customer Experience / Security & Compliance / Analytics / Collaboration / Media & Design | Each links to integration page | [linear.app/integrations](https://linear.app/integrations) |
| **Notion** | `Bring all your tools and teams under one roof.` | Mid-page | Static calculator (replaces tools rather than connects to them) | 12+ alternative tools w/ prices | No (different pattern — replacement, not integration) | None | [notion.com](https://www.notion.com) |
| **Cursor** | (no dedicated section — model selector dropdown shows providers) | Inside feature block | Dropdown | 5 (OpenAI, Anthropic, Gemini, xAI, Cursor) | n/a | None | [cursor.com](https://cursor.com) |
| **Reflect** | `Use Reflect with other apps` | Mid-page post features | Static grid | 4 (Zapier, Readwise, Google/Outlook, Chrome/Safari) | Implied (sync / read / browser) | Each links to docs | [reflect.app](https://reflect.app) |
| **Superwhisper** | `Works anywhere you can type` | Mid-page | Keyboard grid layout (35+ icons in keyboard-key pattern) | ~35 (Slack, Cursor, Notion, Telegram, WhatsApp, Gmail, etc.) | No — universal cloud | None | [superwhisper.com](https://superwhisper.com) |
| **Zapier** (reference for canonical grid) | `Trusted by the world's best companies` (this is logo *bar*, not integrations — separate pattern) | Hero-adjacent | Infinite scrolling marquee | ~10 unique, repeating | No | None | [zapier.com](https://zapier.com) |
| **Stripe** | `Choose an integration path.` | Mid-page | Three big cards, no logo carousel | 0 logos in this section | n/a | Each card links to docs | [stripe.com](https://stripe.com) |
| **Vercel** | `Deploy your first app in seconds.` | Mid-page | Grid of framework logos | 6 frameworks (Next, React, Astro, Svelte, Nuxt, Python) | Yes — frameworks | Each links to template | [vercel.com](https://vercel.com) |
| **Figma** | (no dedicated heading — customer logos at top, MCP mentioned separately) | Hero-adjacent | Carousel/slider, grayscale | 12 customers (Airbnb, Atlassian, Dropbox, Duolingo, GitHub, Microsoft, Netflix, NYT, Pentagram, Slack, Stripe, Zoom) | No — flat customer wall | None | [figma.com](https://www.figma.com) |
| **Craft** | `Imagine the possibilities when everything's connected to Craft` | Dedicated section | Static lists | ~14 across two groups | Yes — MCP / API | Lists | [craft.do](https://craft.do) |
| **Clay** | `Data marketplace` | Feature card | Card icon | "150+" (not shown) | No (different pattern — provider count claim) | Card | [clay.com](https://www.clay.com) |

### 2.2. Patterns extracted from the audit

**Pattern A — Single-row marquee, 5-9 logos, no copy beyond the heading.**
Granola, Krisp, Zapier (different use though). Best for fast hero-adjacent strips. Animation gives "many platforms" feel without scrolling. Doctrine note: marquee uses `transform: translateX()` with `animation-timeline: scroll(self block)` (CSS-native) — Lenis-safe, INP-clean, no overshoot. Granola's verbatim `Works on all platforms, no meeting bots` is the closest competitor framing to what Corder should do.

**Pattern B — Categorical grid, 9-15 logos in 3-4 named clusters.**
Fathom, Fireflies, Krisp, Linear (in dedicated page). Each cluster has a one-line caption. Trade-off: more honest, more scannable, but heavier visually. Fits long-form editorial pages, less hero-adjacent.

**Pattern C — Job-to-be-done tabs.**
Raycast's `There's an extension for that.` with Productivity / Engineering / Design / Writing tabs. Most ambitious of all the patterns. Lets the visitor self-select. Heavy implementation cost. Visually beautiful — sample-of-the-extension-UI per card, not just a logo.

**Pattern D — Spatial / metaphor layout.**
Superwhisper's keyboard-grid. Most creative direction in the entire audit. Compresses "universal capture" into a geometric metaphor (every key = an app it works in). For Corder this could become a **menu-bar dropdown** layout where the logos are listed as if they were items inside the Corder menu — or a **macOS Finder window layout** where each cluster is a "folder" of apps. See §3 design directions.

**Pattern E — Quote-the-promise, list the proof.**
Meetily, Reflect, Read.ai — heading does the heavy lifting, logos are confirmation. Read.ai's `Works with your favorite tools` + 20 logos is the gold standard for "lots of logos, calm framing." But 20 is too many for Corder's prosumer voice.

**Pattern F — Replacement framing, not integration.**
Notion's `Bring all your tools and teams under one roof.` Inverts the entire pattern — instead of "we work with these tools," it says "we replace these tools." Not a Corder move (we are explicit about being one job done well, not a workspace).

### 2.3. Animation patterns observed

| Pattern | Used by | Doctrine fit | Implementation |
|---|---|---|---|
| Infinite marquee (left → right scroll) | Zapier, Granola (implied) | Yes if speed slow (≥30s/loop) and `prefers-reduced-motion` respected | Pure CSS, `animation: marquee 40s linear infinite` |
| Stagger fade-in on scroll | Otter, Fireflies | Yes — doctrine easing | CSS `animation-timeline: view()` or single Framer Motion variant |
| Hover-to-pause carousel | Figma (customer logos), Raycast (extension carousel internal) | Yes | `&:hover { animation-play-state: paused }` |
| Tabbed reveal (instant) | Raycast | Yes | React state + opacity transition |
| Static grid | Otter, Read.ai, Fathom | Yes — cheapest perf | None |
| Hover tilt / mouse-following | None of the 14 sites | n/a | Off-doctrine (would compete with hero) |
| Keyboard-grid spatial layout | Superwhisper | Yes if static, animate on hover only | CSS Grid with named areas |

### 2.4. Copy framing — verbatim headings ranked by Corder-fit

From most to least fit for Corder's voice and product truth.

1. **`Records anything that plays through your Mac.`** — Corder-original. Strongest because it tells the OS-level truth.
2. **`Works on all platforms, no meeting bots`** — Granola verbatim. Strong, but mimics competitor and the "no meeting bots" half is doing aggressive comparison work that doesn't need to be here (we have the privacy section for that).
3. **`Works anywhere you can type`** → adapted as **`Records anywhere sound plays`** — Superwhisper voice transposed to Corder. Crisp.
4. **`Fits where you already work.`** — neutral, prosumer, no metaphor. Solid backup.
5. **`Works with your favorite tools`** — Read.ai verbatim. Generic. Skip.
6. **`Connect to your favorite apps`** — Otter verbatim. SaaS-coded. Skip.
7. **`Drops into your stack`** — recent prosumer pattern (not in audit but common in 2026 dev tools). Works for Cursor/Linear vibe but reads slightly "indie-bro."
8. **`Integrate Corder with your favorite Work Tools`** — Fireflies verbatim. Off-voice, off-product. Skip.

---

## 3. Design directions for the Corder version

Six concrete directions described in words. Each is doctrine-compatible. Each lists trade-offs.

### Direction 1 — Single-row marquee, three logo clusters separated by hairlines

```
                        Records anything that plays through your Mac.

  [Cluster A: Records what you call from]  |  [Cluster B: Drops into where you write]  |  [Cluster C: Lives where your files live]
     Zoom · Meet · Teams · Slack · Discord    Notion · Obsidian · Apple Notes · Bear · Linear    iCloud · Dropbox · Google Drive
                                          all sliding left at 40s/loop, hover pauses

         Anything that plays through your Mac, recorded at the OS level. The list below is starting points, not a closed list.
```

- **Pros:** Hero-adjacent placement viable, low perf cost, the marquee gives "many platforms" energy without inflating the count. Three clusters break the visual into legible chunks.
- **Cons:** Three rows of marquee is visually heavy; might need to drop to one row with all 14 logos and let the cluster labels sit above as a single H3-style row.
- **Doctrine:** Pure CSS animation, no JS. `prefers-reduced-motion` snaps to static. Single accent on cluster headers only.

### Direction 2 — Static three-column grid, hairline-separated, no animation

```
  +-------------------------------------------------+-------------------------------------------------+-------------------------------------------------+
  | RECORDS                                         | DROPS INTO                                      | ARCHIVES TO                                     |
  | What you call from                              | Where you write                                 | Where your files live                           |
  +-------------------------------------------------+-------------------------------------------------+-------------------------------------------------+
  |  [Zoom]  [Meet]  [Teams]                        |  [Notion]  [Obsidian]  [Apple Notes]            |  [iCloud]  [Dropbox]  [Google Drive]            |
  |  [Slack huddle]  [Discord]                      |  [Bear]    [Linear]                             |                                                 |
  +-------------------------------------------------+-------------------------------------------------+-------------------------------------------------+

  Records anything that plays through your Mac. The list above is the most common starting points, not a closed list.
```

- **Pros:** Cheapest perf (no JS, no animation, no scroll-driven). Easiest to inspect/test for the Webflow handoff. Hairline grid is doctrine-native.
- **Cons:** No motion. If the rest of the page is animated (hero live UI, audience-line scroll-fill), this section becomes a flat moment. Could be the right *kind* of flat (a confident pause) or the wrong kind (a flat thing in a sea of motion).
- **Doctrine:** Strongest fit. Eyebrow labels in 12px uppercase, body 16px, single accent on column headings.

### Direction 3 — Menu-bar metaphor (the Corder-original)

```
                            Records anything that plays through your Mac.

                       +---------------------------------------------------------------+
                       |  ● Corder                                            14:32   |
                       +---------------------------------------------------------------+
                       |  Status            Listening to system audio                  |
                       |  ───────────────────────────────────────────────────────────  |
                       |  Recording from:                                              |
                       |    Zoom              Google Meet         Microsoft Teams      |
                       |    Slack huddle      Discord                                  |
                       |  ───────────────────────────────────────────────────────────  |
                       |  Send transcript to:                                          |
                       |    Notion            Obsidian            Apple Notes          |
                       |    Bear              Linear                                   |
                       |  ───────────────────────────────────────────────────────────  |
                       |  Archive to:                                                  |
                       |    iCloud Drive      Dropbox             Google Drive         |
                       +---------------------------------------------------------------+
                       |  ⌘Q  Quit                                                     |
                       +---------------------------------------------------------------+

           The list above is the most common starting points. Corder records anything that plays through your Mac.
```

The compatibility list is rendered *as if it were a menu-bar dropdown from the Corder app itself.* This is the Awwwards-bait move that fits the brand harder than any of the conventional patterns. The Mac-native voice ("Status: Listening to system audio") is also brand microcopy in the right register.

- **Pros:** Unique, on-brand, extends the "live UI in page" pattern that the hero already uses (per `corder-landing-research-2026-05.md` §B). Differentiates from every competitor. Visually exactly what the user is buying.
- **Cons:** Higher implementation cost. Risks looking like a screenshot (it must be DOM, selectable, hover-respondent, per §B.summary rule "selectable text"). Won't work as a hero-adjacent compact strip — needs ~600px tall section.
- **Doctrine:** Hairline borders are the menu separators. IBM Plex Mono for the menu-bar status line. Single accent on the green ● status dot — that's already the app's status colour, so it's literally the brand mark in context. Animation: on hover, the section under cursor gets a subtle 0.08-opacity accent background (like a real menu hover). On `prefers-reduced-motion`, static.

### Direction 4 — Superwhisper-inspired grid (universal-capture metaphor)

```
                       Records anything that plays through your Mac.

                            +-----+-----+-----+-----+-----+-----+-----+
                            |Zoom |Meet |Tea- |Slk  |Disc |Webx |Wbrb |
                            |     |     |ms   |huddl|ord  |     |     |
                            +-----+-----+-----+-----+-----+-----+-----+
                            |Ntn  |Obsdn|Apple|Bear |Linr |Craft|Lgsq |
                            |     |     |Notes|     |     |     |     |
                            +-----+-----+-----+-----+-----+-----+-----+
                            |iCld |Drpbx|GDrv |     |     |     |     |
                            +-----+-----+-----+-----+-----+-----+-----+

                            ...and anything else that plays through your Mac.
```

A grid of small hairline-bordered cells (50×50px or 64×64px), each containing one logo. The visual signal is "lots, but ordered." Beneath: a short typographic phrase trailing off `…and anything else that plays through your Mac.`

- **Pros:** "Lots of logos but calm" — high cognitive recognition speed. The empty cells in row 3 are honest about the count and visually break the "we partner with everyone" lie. The trailing phrase does the universal-capture work.
- **Cons:** Same risk as Direction 2 — flat. The trailing ellipsis phrase is the only motion. Logos need to be uniform-style or it looks ragged (mixed full-color vs monochrome).
- **Doctrine:** All logos monochrome (so no second accent leaks in). Cells aligned to 8px grid. Hover state: cell border thickens from 1px to accent green at 1.5px, no fill.

### Direction 5 — Scroll-fill cluster reveal (matches audience-line technique)

```
  step 1 (default, top of viewport):
                       Records anything that plays through your Mac.

                       [all 14 logos dimmed to 30% opacity, single row]

  step 2 (viewport 50%):
                       [Cluster A logos at 100%, others 30%]   ← What you call from highlighted

  step 3 (viewport 75%):
                       [Cluster B logos at 100%, others 30%]   ← Where you write highlighted

  step 4 (viewport 100% / past):
                       [Cluster C logos at 100%, others 30%]   ← Where files live highlighted

  end state (all visible):
                       [all 14 logos at 100% opacity]
                       The list above is the most common starting points, not a closed list.
```

Uses the same native CSS `animation-timeline: view()` technique already in use for the audience-line scroll-fill. As the section scrolls past, the three clusters illuminate in sequence — each pause is gentle, doctrine easing.

- **Pros:** Mirrors a technique already in the codebase, zero new dependencies. The pacing teaches the visitor that there are three categories, not one big logo soup. Reading the strip *takes time* — the visitor remembers it.
- **Cons:** Highest complexity. Requires precise scroll math. On mobile with fast flick scrolls, the reveal sequence is invisible. CLS risk if the slot height isn't reserved.
- **Doctrine:** Native CSS scroll-driven only. No JS. Reserve fixed `aspect-ratio` slot. `prefers-reduced-motion` → all at 100% from start.

### Direction 6 — Folder metaphor (Finder window)

```
  Records anything that plays through your Mac.

  +----------------------------------------------------------------------+
  | < >   ☰   ⊞                                  ~/Corder/works-with    |
  +----------------------------------------------------------------------+
  | Name                            Kind                Records?         |
  | ─────────────────────────────── ─────────────────── ──────────────── |
  | ▸ Meeting apps                  3 items             Yes              |
  |    Zoom                         Calling app         Yes              |
  |    Google Meet                  Calling app         Yes              |
  |    Microsoft Teams              Calling app         Yes (browser)    |
  |    Slack huddle                 Calling app         Yes              |
  |    Discord                      Calling app         Yes              |
  | ▸ Notes & writing               5 items             Drops in         |
  |    Notion                       Note app            Drops in         |
  |    Obsidian                     Note app            Drops in         |
  |    Apple Notes                  Note app            Drops in         |
  |    Bear                         Note app            Drops in         |
  |    Linear                       Issue tracker       Drops in         |
  | ▸ Storage                       3 items             Archives         |
  |    iCloud Drive                 Storage             Lives here       |
  |    Dropbox                      Storage             Lives here       |
  |    Google Drive                 Storage             Drops in         |
  +----------------------------------------------------------------------+
  | 14 items, 3 categories                                                |
  +----------------------------------------------------------------------+
```

Renders the compatibility list **as a macOS Finder file-list window.** Same DNA as Direction 3 (Mac-native metaphor) but more information-dense — gets the honesty caveat about Teams (`Yes (browser)`) into the table without footnotes. Strongest editorial fit if the rest of the page is going IBM-editorial.

- **Pros:** The "Records?" column does honesty work that the other directions need a footnote for. Visually unique. Pure typography (IBM Plex Mono). The Finder framing extends the "real Mac app" voice that's already in the brand.
- **Cons:** Heaviest visually. Possibly redundant with Direction 3 — pick one Mac-native metaphor or it gets too cute. Needs more vertical real-estate than a strip.
- **Doctrine:** Pure type and hairlines. The accent green can land on the `▸` disclosure triangles (a Mac native UI affordance that matches the brand mark).

---

## 4. Recommendation

### 4.1. Primary direction — **Direction 3 (Menu-bar dropdown metaphor)**

This is the direction I would ship if I were building it. Reasons in priority order:

1. **It is the only direction that compounds with the rest of the page.** The hero is a live Mac app interface. The audience-line is editorial typography. The privacy section is a spec list with hairlines. A menu-bar dropdown for the compatibility section continues the "you are looking at a real Mac product, rendered on the page itself" through-line. The other five directions are competent but generic.

2. **It carries the honesty caveat naturally.** The Teams footnote, the "starting points not a closed list" line, the BYO Gemini key footer — all of these slot into a menu-bar dropdown layout without feeling tacked on. A flat logo grid forces the caveat into a separate line that reads as fine print; the menu metaphor folds it into the UI.

3. **It cannot be copied easily by competitors.** Granola, Otter, Fathom, tl;dv cannot use this metaphor because their products are not menu-bar apps. The metaphor only works for an app that *is* a menu-bar dropdown. That's a moat.

4. **It is doctrine-clean.** Single accent on the status dot, IBM Plex Mono for the menu chrome, hairline borders everywhere, single column, no second color, no shadow, no gradient.

5. **Implementation cost is bounded.** The hero already has a render of the library window. This is the second render — the menu-bar dropdown — which the soldier has built once already in `assets/CORDER-BRAND.md` reference visuals.

### 4.2. Backup direction — **Direction 1 (single-row marquee, three clusters)**

If Direction 3 is judged too ambitious or too tall for the section's spot in the page flow, fall back to Direction 1. It is the most conventional, lowest-risk option that still reads as competent prosumer Mac. It is what Granola does (with one row); Corder's version adds the three-cluster framing, which makes the breadth claim more legible.

### 4.3. Exact copy proposal

**Section heading (H2, Plex Sans Semi-Bold, 32-40px, single line):**
> `Records anything that plays through your Mac.`

This is the killshot — it reframes the entire compatibility question. It is also (a) literally true at the OS level, (b) impossible for any bot-based competitor to claim, (c) on-voice for the matter-of-fact Corder register.

**Sub-head (Plex Sans Regular, 18-20px, gray-700, max 2 lines):**
> `Corder captures audio at the OS level, so it works with any app that plays sound. The list below is where most people start.`

(Note: avoids em dashes, avoids middle-dots, avoids "seamless," avoids any of the project stopwords.)

**Cluster labels (eyebrow, 12px Plex Sans Bold uppercase, letter-spacing 0.04em, gray-500):**
1. `RECORDS WHAT YOU CALL FROM` — or shorter, `CALLING APPS`
2. `DROPS INTO WHERE YOU WRITE` — or shorter, `NOTES & WRITING`
3. `ARCHIVES TO WHERE YOUR FILES LIVE` — or shorter, `STORAGE`

The shorter versions match the Finder-column tradition (Direction 6) and the menu-bar voice (Direction 3) better. Recommend shorter.

**Microcopy under the dropdown (14px Plex Sans Regular, gray-500, single line):**
> `Anything else that plays through your Mac works too. The list above is starting points, not a closed list.`

**Optional BYOK footnote (14px Plex Mono, gray-500, two lines max — only if AI tools were going to be added):**
> `Corder uses Gemini for transcription, on your own API key. ChatGPT, Claude, and Cursor are paste destinations, not integrations.`

**Reject this copy line outright:**
> ~~`Seamlessly integrates with your favorite tools`~~ (uses "seamlessly", a stop-word; reads as SaaS)
> ~~`Works with everything`~~ (overclaim, unfounded)
> ~~`No meeting bots required`~~ (Frame A violation — implies hiding rather than "no bot in the call")

### 4.4. Animation behaviour

For Direction 3 (menu-bar metaphor):
1. **Idle state:** the dropdown is rendered as if just clicked open. No motion, no marquee.
2. **Section entry (when section enters viewport):** the dropdown items fade in top-down at 40ms stagger per item, easing `cubic-bezier(0.16, 1, 0.3, 1)`, total reveal 480ms. Native CSS `animation-timeline: view()`.
3. **Hover state:** on hover of any row, that row's background fills to `rgba(33, 122, 80, 0.08)` (the accent-subtle token already in the project), no border change. Mimics a real macOS menu hover. `transition: background 120ms` (doctrine minimum).
4. **Status dot:** the green ● next to "Status: Listening to system audio" pulses at 4s/loop. Single accent, scale 1.0 → 1.0 with opacity 1.0 → 0.6 → 1.0. Native CSS keyframes. `prefers-reduced-motion` → no pulse.
5. **Reduced motion:** all entry animations off. Static dropdown, static dot.

For Direction 1 (fallback marquee):
- 40s/loop linear marquee. Hover anywhere on row pauses entire row. `prefers-reduced-motion` → static, all logos visible.

### 4.5. Logos — final list (14 logos, 3 clusters)

| Cluster | Logo | Source for marks |
|---|---|---|
| Calling apps | Zoom | Zoom brand resources |
| Calling apps | Google Meet | Google brand assets (Meet) |
| Calling apps | Microsoft Teams | Microsoft brand assets — with browser-caveat |
| Calling apps | Slack | Slack brand kit |
| Calling apps | Discord | Discord brand kit |
| Notes & writing | Notion | Notion brand kit |
| Notes & writing | Obsidian | Obsidian brand assets |
| Notes & writing | Apple Notes | Apple system icon — use under Apple's compatibility-statement allowance |
| Notes & writing | Bear | Bear (Shiny Frog) press kit |
| Notes & writing | Linear | Linear brand kit |
| Storage | iCloud Drive | Apple Finder icon — under same allowance |
| Storage | Dropbox | Dropbox brand assets |
| Storage | Google Drive | Google brand assets (Drive) |
| (one slot reserved) | — | Keep for honesty: the section reads as 14 items in the dropdown but actually shows 13 + one ellipsis row `… anything else` to back the universal-capture claim. |

### 4.6. Where in the page flow

Per the current section order in `CLAUDE.md` (lines 51-65), the page is:
0. Nav
1. Hero
2. Audience-line
3. Privacy / two-card trust block
4. How it works (4 steps)
5. Features grid (6 cells)
6. Pricing (3 tiers + Lifetime)
7. FAQ
8. Final CTA
9. Footer

**Recommended insertion point: between section 4 (How it works) and section 5 (Features grid), as a new section 4.5.**

Rationale: at this point in the scroll, the visitor has just learned the four mechanics (no bot, dual-track transcript, free re-transcribe, BYOK). The natural next question is "does it work with my stack?" The compatibility section answers exactly that, before the visitor moves on to the more general feature grid. Putting it before How-it-works would interrupt the mechanics narrative; putting it after the features grid is too late (the visitor may have decided already).

Secondary option: hero-adjacent (between hero and audience-line), but only if Direction 1 (marquee) is chosen. The menu-bar dropdown of Direction 3 is too tall for hero-adjacent.

### 4.7. Honesty caveats — what we explicitly do NOT claim

1. We do not claim **API integration** with Notion, Obsidian, Apple Notes, etc. We claim drag-out. This must be clear in any tooltip or microcopy.
2. We do not claim **bidirectional sync** with Dropbox/Google Drive. The Dropbox archive is one-way; Google Drive is via Finder drag, no API.
3. We do not claim **always-works on Teams native.** The browser version is what we honestly support. The native Teams Mac app has audio routing variance.
4. We do not claim **ChatGPT/Claude/Cursor integration.** They are paste destinations, not integrations. If we mention them at all, it is in a separate sentence outside the strip.
5. We do not claim **CRM integration** (HubSpot, Salesforce, Attio, Affinity, Pipedrive). Granola does. We do not. This is a deliberate scope choice — Corder is not a CRM-feeder, it is a recorder.

---

## 5. Open questions for the user

1. **Direction choice — confirm Direction 3 (menu-bar metaphor) or fall back to Direction 1 (marquee)?**
   The bolder direction is the right one if you trust the implementation cost; the marquee is the safe play.

2. **Cluster naming — short ("CALLING APPS / NOTES & WRITING / STORAGE") or long ("RECORDS WHAT YOU CALL FROM / DROPS INTO WHERE YOU WRITE / ARCHIVES TO WHERE YOUR FILES LIVE")?**
   Short matches Mac UI conventions. Long has stronger voice but takes more horizontal room.

3. **Bear vs Craft — pick one prosumer Mac note app for the third logo in the Notes & writing cluster?**
   Bear has more Mac-native cred. Craft has stronger 2026 momentum (recently shipped MCP). Bear is the safer pick; Craft is the prosumer-trendy pick.

4. **Include Linear in Notes & writing cluster, or skip?**
   Linear is more "issue tracker" than "writing destination" — but the multi-project audience persona explicitly uses Linear for project notes. Recommend including; flag if your audience instinct disagrees.

5. **Honesty footnote for Microsoft Teams — separate single line beneath the cluster, tooltip on the Teams logo, or a `(browser)` qualifier in the row?**
   Direction 6 (Finder window) has a "Records?" column that handles this elegantly. Direction 3 (menu-bar) has less room. I'd put it as small italic text inside the row: `Microsoft Teams         (browser version)`.

6. **Should AI tools (ChatGPT, Claude, Cursor) appear anywhere on the page?**
   Strong recommendation: no logos on the strip; one-line BYOK reminder under the CTA pill in the FinalCta section. Mentioning ChatGPT/Claude on the compatibility strip implies API integration we don't have.

7. **Should we include FaceTime?**
   Technically yes, it plays through CoreAudio. But Apple's brand-usage rules around FaceTime logos are restrictive. Easier to omit and let "Anything that plays through your Mac" do the work.

8. **Marquee speed (if Direction 1) — 30s, 40s, or 60s per loop?**
   40s is the prosumer Mac default (Zapier ~30s reads frantic). For an "we work with everything you already use" tone, 40-50s lets the logos breathe.

---

## 6. Sources (all read 2026-05-11)

### Direct competitor reads

- [Granola](https://granola.ai)
- [Granola integrations guide](https://www.granola.ai/blog/granola-integrations-complete-guide-connecting-meeting-tools)
- [Otter](https://otter.ai)
- [Fathom](https://fathom.ai)
- [tl;dv](https://tldv.io)
- [Fireflies](https://fireflies.ai)
- [Read.ai](https://read.ai)
- [Krisp](https://krisp.ai)
- [Meetily](https://meetily.ai) (bot-free Mac competitor — closest peer)

### Prosumer Mac / dev tool references

- [Raycast](https://www.raycast.com)
- [Linear homepage](https://linear.app)
- [Linear integrations](https://linear.app/integrations)
- [Notion](https://www.notion.com)
- [Cursor](https://cursor.com)
- [Reflect](https://reflect.app)
- [Superhuman](https://superhuman.com)
- [Superwhisper](https://superwhisper.com)
- [Bear](https://bear.app)
- [Craft](https://craft.do)
- [Anytype](https://anytype.io) (only metadata fetched)
- [Things 3](https://culturedcode.com/things/)
- [Obsidian](https://obsidian.md)
- [Dia browser (Sapphire)](https://www.diabrowser.com) — note Arc browser sunset; browser.company redirects to sapphire.tv

### Canonical / SaaS reference

- [Zapier](https://zapier.com)
- [Stripe](https://stripe.com)
- [Vercel](https://vercel.com)
- [Figma](https://www.figma.com)
- [Attio](https://attio.com)
- [Clay](https://www.clay.com)
- [Setapp](https://setapp.com)

### Audience stack and trend research

- [Indie Hacker SaaS Stack 2026 — TLDL](https://www.tldl.io/resources/indie-hacker-saas-stack-2026)
- [Indie Hacker Tools Trends 2026 — indieis](https://indieis.land/blog/indie-hacker-tools-trends-2026)
- [Notion vs Obsidian vs Anytype for Indie Hackers 2026 — devtoolpicks](https://devtoolpicks.com/blog/notion-vs-obsidian-vs-anytype-indie-hackers-2026)
- [Solo Founder's Content Stack 2026 — startup.info](https://startup.info/the-solo-founders-content-stack/)
- [Complete Freelancer Tools Guide 2026 — solo-port](https://www.solo-port.com/post/freelancer-tools-guide-2026)
- [10 Essential Tools for Freelancers 2026 — sidehustlehackers](https://sidehustlehackers.com/freelancing/tools/10-essential-tools-for-freelancers-2026/)
- [AI-native Product Manager Stack 2026 — Harshal Patil](https://www.harshal-patil.com/post/ai-native-product-manager-2026q1)
- [Notion vs Linear for Product Teams 2026 — Tech Stack Daily](https://techstackdaily.com/comparison/notion-vs-linear-product-teams-2026/)
- [Granola review for executive coaches — Feisworld](https://www.feisworld.com/blog/granola-ai-review)
- [Granola review 2026 — tl;dv blog](https://tldv.io/blog/granola-review/)
- [Best Meeting Recorder 2026 — Meetily](https://meetily.ai/blog/best-free-meeting-recorder-2026)
- [Third-Party Recording Bots Blocked by Teams Meetings — office365itpros](https://office365itpros.com/2026/03/16/third-party-recording-bots/)
- [System Audio not captured in Teams (Mac) — Atlassian Loom Support](https://support.atlassian.com/loom/kb/system-audio-not-captured-in-microsoft-teams-recordings-mac/)
- [Bots for Teams Calls and Online Meetings — Microsoft Learn](https://learn.microsoft.com/en-us/microsoftteams/platform/bots/calls-and-meetings/calls-meetings-bots-overview)
- [Notion MCP — Notion Help Center](https://www.notion.com/help/notion-mcp)
- [ChatGPT Pro vs Claude Max vs Cursor for Indie Hackers 2026 — devtoolpicks](https://devtoolpicks.com/blog/chatgpt-pro-100-vs-claude-max-vs-cursor-indie-hackers-2026)

### Internal references

- `/Users/3mpq/Aisoldier/projects/corder-landing/research/cta-patterns-2026-05.md` — CTA patterns research, same date
- `/Users/3mpq/Aisoldier/research/corder-landing-research-2026-05.md` — base landing research, especially §B "Live UI in page" prior art (informs Direction 3 and 6 here)
- `/Users/3mpq/Aisoldier/projects/corder-landing/CLAUDE.md` — accent, doctrine, section order, no-em-dash rule
- `/Users/3mpq/Aisoldier/projects/corder-landing/content/copy.json` — `fit.yes.items` persona, `audienceLine.text`
- `/Users/3mpq/Aisoldier/projects/corder-landing/assets/CORDER-BRAND.md` — brand source of truth, menu-bar UI reference for Direction 3

---

**End of file. Date 2026-05-11.**
**Expires:** 2026-06-10 for the audit table (§2.1) and audience stack (§1.2) — Q2 2026 saw Microsoft Teams bot detection rollout, Notion adding meeting transcription, and Cursor surpassing Linear in AI-coding-stack mindshare; all three shift mid-year. Section pattern recommendations (§3) and copy proposals (§4) do not expire.
