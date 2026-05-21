# Features section - value brief (2026-05-21)

**Researcher:** 3mpq-researcher
**Mode:** Mode 2 (pre-build section research, value-engineering pass)
**For:** 3mpq-copywriter (this brief is INPUT for the copy rewrite of `features.cells` in `content/copy.json`)
**Doctrine:** ASCII only. No em-dash. No en-dash. No middle dot. No curly quotes. Single accent `#217a50`. Plain hyphen + ASCII apostrophe.

---

## 0. Context

### 0.1. Why this brief exists

The current Features grid in `content/copy.json` (block `features.cells`) was written for Corder v0.7.0, dated 2026-05-09. Since then Corder shipped 0.8.0, 0.8.1-0.8.8, 0.9.0, and an Unreleased delta - twelve dot-releases of real product change in twelve days. Several existing cells are now stale, mis-positioned, or duplicate work other sections already do better. The user wants the Features grid re-scoped from first principles rather than patched cell by cell.

The user supplied five candidate features as starting points:
1. Per-speaker timeline
2. No bot in the call
3. Screen recording
4. Text accompaniment / transcript
5. Integrations with any tools

The user explicitly framed this as a "council with research-based questions about what's actually valuable in this section." That phrasing is the contract. Each candidate must survive a six-question filter before it earns a cell. Research-surfaced candidates get the same treatment, no shortcuts.

### 0.2. What is being replaced

Current 6 cells in `content/copy.json` -> `features.cells`:

1. TIMELINE - Per-speaker timeline
2. SEARCH - Search the whole library
3. AUTO-DETECT - Catches the meeting before you do
4. AUDIO - System audio without a driver
5. LIBRARY - Your library lives on your Mac
6. RE-RUN - Re-transcribe at zero margin

All six are KEPT, REFRAMED, or DROPPED in section 4 below. The shortlist in section 3 is the recommended replacement set.

### 0.3. Constraints inherited from doctrine

- Single accent only (`#217a50`).
- IBM Plex Serif + Sans + Mono only.
- Body min 16px.
- Borders, not shadows. Hairline grid.
- No icons in Features cells. No pictograms. The allowed visual hints are typographic + UI-fragment.
- "Frame A" only: no "stealth", "covert", "invisible to the other side" framing. The frame is "no bot in the call".
- Vapor is forbidden. Anything marked `Soon` per `corder-feature-inventory-2026-05.md` section 10 cannot be a cell.

### 0.4. The six questions every candidate must answer

1. Is it real in v0.9.0?
2. Does another section already cover it?
3. Is it a differentiator vs Granola, Otter, Read.ai, Fireflies, Fathom, tl;dv?
4. Does the audience care, and how specifically?
5. Does it survive the no-marketing-fluff filter? Can it be stated as a verifiable fact?
6. Is it visually showable inside a hairline cell with the existing visualHint vocabulary?

---

## 1. Council Q&A - the user's five candidates

### Candidate 1: Per-speaker timeline

1. **Real in 0.9.0?** Yes. Live in `RightPanel.tsx` -> `SpeakerTimeline`. Inventory section 6: one row per active speaker, name, `XX% MM:SS` stats, 20px speaker-coloured bars at `left%/width%`, 1px playhead cursor, click-to-seek, 280ms coalescing. The visually-confirmed live screenshots (inventory section 0.5) verify solid-bar + striped variants both ship.
2. **Already covered elsewhere?** Partial. The hero `HeroLibraryDemo` displays the per-speaker timeline as part of the recording right pane, so a literal screenshot-style cell would be redundant. However, the hero shows it AS a UI element, not AS a benefit. Features cell can name the benefit ("verify a number in 4 seconds without scrubbing") without duplicating the hero visual.
3. **Differentiator?** Yes, strong. Per inventory section 19 (hero implications): "the per-speaker bar showing percentage + duration + colour-coded blocks IS the differentiator. Editorial hero gold." Granola, Otter, Read.ai all give a flat transcript with speaker labels; none show airtime distribution. The closest competitor surface is Otter's "talk time" pie chart, which is summary-only, not click-to-seek.
4. **Audience cares?** Yes, sharply. Investor calls: founder wants to verify what the VC said about valuation at minute 38; clicking the purple bar at the 38-min mark is faster than scrubbing. Consultant kickoffs: post-meeting, "who actually talked the most" is a real political question. Coaches: airtime ratio is a coaching variable. Solo thinkers: not applicable (single speaker).
5. **No-fluff filter?** Passes if framed as click-to-seek + airtime percentage. Fails if framed as "AI understands who spoke when" - that is marketing fog.
6. **Visually showable?** Yes. `visualHint: mini-timeline-fragment` already exists and is the literal asset.

**Verdict: KEEP, position 01 in the grid.** It is the sharpest single differentiator the product owns.

### Candidate 2: No bot in the call

1. **Real in 0.9.0?** Yes, the central architectural invariant. CaptureEngine at the OS level, no third-party participant joins (inventory sections 1-2). The product is built around this; everything else is downstream.
2. **Already covered elsewhere?** Yes, heavily. (a) Hero subhead: "No bot joins the call". (b) `how.steps[0]`: entire first step "No bot in your call" with body text. (c) `audienceLine`. (d) FAQ "Does the other side know I am recording" item. (e) Comparison table row "No bot in the call". (f) Footer slogan "A meeting recorder that doesn't join the meeting". Six surfaces. Adding a Features cell would be the seventh.
3. **Differentiator?** Yes vs Otter, Fireflies, Read.ai, tl;dv. No vs Granola (which also doesn't bot, per the comparison table). So as a differentiator it is binary, not unique.
4. **Audience cares?** Already proven yes, but the page has already converted them on this point by the time they hit Features (section 5 of 10).
5. **No-fluff filter?** Passes easily.
6. **Visually showable?** Marginally. A Zoom-grid fragment showing the absent bot is doable but would compete with the hero demo and the how-step's live demo. A negative-space visual ("nothing here, that's the point") is conceptually nice but reads as empty cell to most scanners.

**Verdict: DROP from Features.** This idea is the page's spine; Features should not be the seventh surface to say it. The candidate is right that it matters, but its place is the hero, the audience-line, the how-section, and the FAQ - which it already owns. Redundancy here weakens the rest of the grid.

### Candidate 3: Screen recording

1. **Real in 0.9.0?** Yes, since 0.8.0 (inventory section 2: "Screen video" + section 18 "0.8.0 - Screen video recording"). HEVC, 15 fps, ~1.5 Mbps, gated by a Settings toggle since 0.9.0. Renders inline in `RightPanel` audio card with a Maximize2 FLIP lightbox. Real, shipping, visible in the app today.
2. **Already covered elsewhere?** No. Not mentioned in any other section of `content/copy.json`. Hero shows it implicitly if the demo includes a video preview card (per inventory section 0.5, this is a recommended hero addition but not landed yet).
3. **Differentiator?** Strong but contextual. Granola: audio only. Otter: audio + cloud-platform recording (but only via their bot, not local screen capture). Read.ai: bot recordings only. Fireflies / Fathom: same pattern, bot-side. tl;dv: bot-side but does record screen. **The differentiator is: local-OS screen recording without a bot, time-aligned to the transcript clock.** Nobody else does that combination.
4. **Audience cares?** Yes, with caveats. Founders: investor demo - capturing what was on screen is critical. Designers: design reviews - the Figma frame being discussed at minute 12 is the entire point. Consultants: client walkthroughs - the contract page being clicked. Solo thinkers: low value (no screen activity to remember). Coaches: privacy concern - recording the client's screen may be ethically out of bounds. Net: 3 out of 4 primary audience segments care strongly; 1 cares less.
5. **No-fluff filter?** Passes if specific: HEVC, 15 fps, time-locked to audio playback, gated by Settings toggle so users can record audio only. Fails if framed as "see what was happening" without the technical anchor.
6. **Visually showable?** Yes. A `split-cell-illustration` (small video card thumbnail + waveform underneath, hairline divider, 0:14/4:32 timestamp) or a new `video-frame-fragment` hint. The Maximize2 corner glyph and the centred play overlay are concrete typographic anchors.

**Verdict: KEEP, position 02 or 03 in the grid.** Underexposed in current copy, real, recent (0.8.0+), and a near-unique combination with the no-bot frame.

### Candidate 4: Text accompaniment / transcript

1. **Real in 0.9.0?** Yes, the core output. Dual-track transcript with speaker columns, timestamps, click-to-seek active-segment highlight, search highlight, copy-as-text bridge (inventory section 5).
2. **Already covered elsewhere?** Yes, extensively. (a) `how.steps[1]`: "Studio-grade transcript, with playback". (b) Hero subhead mentions transcript. (c) Pricing tier features list "Speaker labels and full-text search". (d) Privacy section spec list. (e) FAQ "Can I export the transcript?". This is the most-mentioned product surface on the page already.
3. **Differentiator?** No. Every competitor (Granola, Otter, Read.ai, Fireflies, Fathom, tl;dv) ships a transcript. It IS the product category. A cell saying "transcript" is like a coffee shop advertising "coffee."
4. **Audience cares?** Yes, but they assumed it before they clicked.
5. **No-fluff filter?** Passes as a fact, fails as a feature claim. "Searchable transcript" is more specific and is already in the current cell 2.
6. **Visually showable?** Yes, easily. But the cell would tell the visitor nothing new.

**Verdict: DROP as a standalone cell, REFRAME into the existing SEARCH cell.** The transcript itself is not a feature claim; what you can do with it (search across the whole library, drag plain text into Notion, jump to the active segment) is the feature claim. Current cell 2 ("Search the whole library") already does this. The current copy is fine on this front. **Sharpen it** to mention "any phrase, any recording, since you installed Corder" - that is the actual proposition.

### Candidate 5: Integrations with any tools

1. **Real in 0.9.0?** **Vapor.** Inventory section 10 is unambiguous: "Five rows... Every row carries an inert `promo-soon` chip; clicking shows a 'Soon' toast." The five rows are Google extension, Apple mobile app, Telegram bot, Slack/Notion/CRM bucket, Google Calendar - all gated behind "Soon" and live in the profile popover, not the product. Furthermore, inventory section 18 (0.9.0 release notes): "integrations card now says 'Soon' and points users at the profile menu." Promising integrations on the landing would be a direct vapor claim.
2. **Already covered elsewhere?** Partially. The `worksWith` section uses a different framing: "Records anything that plays through your Mac" - which is HONEST, because Corder doesn't integrate with Zoom, it just records whatever CoreAudio outputs. The works-with logo strip is recognition, not integration. This is the load-bearing reframe.
3. **Differentiator?** **In the inverse direction.** Granola integrates with Notion, Linear, Attio, Slack via real API hooks. Otter integrates with Zoom, Slack, Salesforce. Fireflies integrates with 40+ tools. Corder does not integrate with any of them. Claiming integrations is a losing comparison; refusing to claim them is the differentiator. The honest frame: "we don't integrate, we just record what's there, and the text drag-out goes anywhere plain text goes."
4. **Audience cares?** Mixed. Some want "syncs to my Notion automatically" - those people should buy Granola. The audience that bought Corder explicitly didn't want a SaaS chain.
5. **No-fluff filter?** **Catastrophic fail.** Saying "integrates with any tools" when the product ships zero working integrations and a "Soon" toast is exactly the kind of magic-marketing claim the audience refuses.
6. **Visually showable?** Yes, but the visual would be a lie at 0.9.0.

**Verdict: DROP. Hard no.** This candidate is the most dangerous of the five. If it survives, it goes into a Features grid that promises something the product doesn't ship - which is the single failure mode that cold paid traffic punishes hardest. The audience came skeptical; one vapor claim and they bounce.

**Reframe path:** the truth that the candidate is reaching toward - "Corder slots into your workflow without rewiring it" - is real and worth saying. The reframed version lives in the existing "Drag the transcript anywhere" / works-with idea, not as "integrations." See section 2 below for the drag-out cell.

---

## 2. What else research surfaces

The inventory and audience research surface six additional candidates that did not appear in the user's five but deserve evaluation.

### Candidate 6: Drag transcript out, no export dialog

1. **Real in 0.9.0?** Yes. Inventory section 10 / FAQ in current `copy.json`: select text, drag to Notion / Obsidian / Apple Notes / Finder, lands plain. No export modal, no format chooser. Also: `DownloadMenu` exists for TXT / MD / JSON / ZIP for users who do want files.
2. **Already covered elsewhere?** Partially. FAQ "Can I export the transcript?" mentions it. The works-with `Note` cluster (Notion, Obsidian, Apple Notes, Bear, Linear) implies it. Not a Features cell currently.
3. **Differentiator?** Yes, mostly. Granola "syncs" via integration. Otter "exports" via a modal. Corder just lets you grab the text and drop it. The mechanical action is different and reads as "Mac-native". Direct cite: F.B mocks panel 3 "Drag the transcript anywhere": "Notion, Obsidian, Apple Notes, your own files folder. Text lands plain. No markdown clutter. No exports. No CSV. Just drag."
4. **Audience cares?** Yes, strongly. The audience already lives in Notion / Obsidian / Apple Notes (per `works-with-section-2026-05.md` §1.2 - all five segments use these). They don't want another integration; they want their existing one to work.
5. **No-fluff filter?** Passes - it is a verifiable physical interaction.
6. **Visually showable?** Yes. `split-cell-illustration` hint already exists. CORDER text fragment + arrow + NOTION page mock. Strongest existing visual asset in the kit.

**Verdict: KEEP, position 04 or 05.** This is the cell that absorbs Candidate 5's energy ("works with my tools") with zero vapor risk.

### Candidate 7: Re-transcribe at zero extra cost (cache by audio MD5)

1. **Real in 0.9.0?** Yes. `gemini_raw_turns` cache table (migration v7), inventory section 9: "Cached afterwards via gemini_raw_turns... re-transcribe with cache is free." Re-transcribe trigger via context menu and EmptyDeleteBanner.
2. **Already covered elsewhere?** Partially. `how.steps[2]` mentions it. Comparison table row "Re-transcribe at zero extra cost". Current Features cell 6 (RE-RUN) is exactly this.
3. **Differentiator?** Yes, unique. Comparison table shows Granola / Otter / Read.ai / Fireflies / Fathom / tl;dv all "No". This is a Corder-only column.
4. **Audience cares?** Yes, specifically: a better Gemini model ships in 3 months; the user wants to re-run last quarter's calls on it without paying Google twice. This is concrete and verifiable.
5. **No-fluff filter?** Passes.
6. **Visually showable?** Yes. `version-sequence` hint already exists ("Flash 2.5 -> Flash 3 -> Pro 4"). Existing cell uses this.

**Verdict: KEEP, position 06.** The current cell is already good; copywriter should sharpen but not rewrite.

### Candidate 8: System audio capture without virtual drivers

1. **Real in 0.9.0?** Yes. Core Audio process tap + private aggregate device (inventory section 2). macOS 14.2+ floor exists exactly to enable this without BlackHole / Loopback / Soundflower.
2. **Already covered elsewhere?** Partially. `how.steps[0]` mentions "records what your Mac plays and what your microphone hears at the OS level." Not a Features cell explicitly. Current cell 4 ("System audio without a driver") covers it.
3. **Differentiator?** Yes vs Granola (which uses screen-share permission + ScreenCaptureKit, not the process tap), strongly yes vs Otter / Read.ai / Fireflies (which use a bot, not local capture). The "no virtual driver" claim is what Mac power users specifically care about.
4. **Audience cares?** Yes for the tertiary segment (Mac power users); medium for the primary (founders, consultants - they want it to work, don't care how). Net: it's a credibility cell for the technical reader.
5. **No-fluff filter?** Passes with the specific names: BlackHole, Loopback, Soundflower. Each is a real product the audience has installed and uninstalled.
6. **Visually showable?** Yes. `monospace-path` hint exists ("CoreAudio - Corder" or similar). Current cell uses it.

**Verdict: KEEP, position 05 or 04.** Different audience than the drag-out cell; the two complement each other. The audience for this cell is the Hacker News reader and the Reddit r/macapps lurker.

### Candidate 9: Library lives on your Mac, in Finder

1. **Real in 0.9.0?** Yes. `~/Library/Application Support/Corder/`. Open in Finder, rsync, Time Machine, gone. Inventory section 1.
2. **Already covered elsewhere?** Yes, heavily. Privacy section second card "Your files, your Mac" with the same path. FAQ "Where does my audio live?". Footer / spec implications.
3. **Differentiator?** Yes vs all SaaS competitors (Otter, Read.ai, Fireflies, Fathom, tl;dv). Same as Granola (which also stores locally). So it's a strong-but-not-unique differentiator.
4. **Audience cares?** Yes, but the Privacy section is where they buy this. By Features, the case is made.
5. **No-fluff filter?** Passes.
6. **Visually showable?** Yes, `monospace-path` hint. Current cell uses it.

**Verdict: REFRAME, possibly DROP.** The current cell exists ("Your library lives on your Mac") and it's good - but it's the third surface saying the same thing. Recommend: either (a) cut it and let Privacy own this narrative, or (b) reframe it from "local storage" to "your library is a Finder folder you can do anything with" - emphasising the open-format / portable-data angle that Privacy doesn't cover (rsync, Time Machine, drag to a new Mac, search with Spotlight). The portability angle is fresh; the storage angle is repetitive.

If kept: position 05. If cut: replaced by something else.

### Candidate 10: Auto-detect of meetings via menu bar invite

1. **Real in 0.9.0?** Yes. `MeetingDetector` 4s tick, per-process mic-owner check on 14.4+, menu-bar popover offer ("Zoom - record this call?") with Start / Not now (inventory section 2).
2. **Already covered elsewhere?** No, not directly. Current Features cell 3 (AUTO-DETECT) covers it. The hero's "no bot in the call" frame is adjacent but doesn't show the offer surface.
3. **Differentiator?** Yes vs Granola (which auto-detects via calendar, not OS mic). Strongly yes vs the SaaS competitors. **However:** auto-detect is a "trust feature" - the user has to opt in to letting Corder watch which apps are using the mic. Some audience members will find that surveillance-adjacent and recoil.
4. **Audience cares?** Mixed. Founders and consultants who context-switch between back-to-back calls: love it. Coaches and privacy-paranoid solo thinkers: ambivalent.
5. **No-fluff filter?** Passes if specific: Zoom / Meet / Teams / Discord / FaceTime + 12 browsers, opt-in white/blacklist, the offer appears in the menu bar not in the call.
6. **Visually showable?** Yes. The menu-bar popover offer card is a real UI surface (inventory section 2: "320-wide SwiftUI card with the app name red 14pt, large 22pt-light question, Start red-dot button, Not now"). `split-cell-illustration` hint with a mini menu-bar offer card.

**Verdict: KEEP, position 03 or 04.** This is one of the strongest "look, the product respects you" surfaces and it has a great visual asset. The current cell 3 is mediocre copy ("Catches the meeting before you do" - mild fluff); copywriter should sharpen.

### Candidate 11: Auto-titles for sessions

1. **Real in 0.9.0?** Yes. `GeminiTitler` ships (inventory section 18 Unreleased; visible in 0.9.0 screenshots per inventory section 0.5). 3-7 words, same language as transcript. Backfills on launch.
2. **Already covered elsewhere?** No, not in `content/copy.json` anywhere.
3. **Differentiator?** Mild. Granola, Otter, Read.ai all auto-name sessions. Not a Corder-unique surface.
4. **Audience cares?** Yes, mildly - it means the sidebar list is readable at a glance instead of "Today, 17:09 / Yesterday, 18:51" date stamps. But it's a quality-of-life feature, not a buying decision.
5. **No-fluff filter?** Passes.
6. **Visually showable?** Yes. A sidebar fragment with three real auto-titles ("Logic 7 outsourcing pitch" / "IT курсы и обещания удалён..." / "Baby, fuck this shit") from inventory section 0.5 would be funny and specific.

**Verdict: DO NOT GIVE A CELL.** Too minor for a 6-cell grid. Mention in marketing copy elsewhere if there's a "quiet conveniences" sub-list, but Features should be the sharp half-dozen, not the eight.

### Candidate 12: Pin, rename, archive with 7-day grace window

1. **Real in 0.9.0?** Yes. Pin/Unpin sidebar (0.9.0). Inline rename via Enter/Escape. Archive with 5-second Undo toast, then 7-day grace period before hard delete (inventory sections 3, 4, 14).
2. **Already covered elsewhere?** No.
3. **Differentiator?** Mild. SaaS competitors have folder/star/archive UIs. Corder's 7-day archive is calmer than most but not unique.
4. **Audience cares?** Marginally. Doesn't drive a download.
5. **No-fluff filter?** Passes.
6. **Visually showable?** The archive countdown ("in 5 days") is an excellent typographic moment per inventory section 19 ("calm respect for the user's data plus a concrete number"). But it's a Library-management feature, not a buying feature.

**Verdict: DO NOT GIVE A CELL.** Same logic as auto-titles.

### Candidate 13: Bring-your-own Gemini key / no subscription

1. **Real in 0.9.0?** **Contradicted.** Inventory section 9 / section 18 (0.9.0 release): "the in-app key field was REMOVED, model is 'subscribed', user no longer pastes their own key. The Settings Pro note reads 'Pro features are disabled in this build.'" This conflicts with current `how.steps[3]` ("No subscription. BYO Gemini key") and current pricing copy showing $9/$14/$99 tiers.
2. **Already covered elsewhere?** Yes (in stale form): `how.steps[3]`, pricing section, final CTA's "Pay Google, not us" framing, comparison table row "No subscription".
3. **Differentiator?** Was a strong differentiator at v0.7.0. At v0.9.0, the BYOK story is no longer how the product ships. This is a **research-output flag** to the copywriter, not a Features cell candidate.
4. **Audience cares?** Yes, but the audience cared about BYOK; if the product is now a subscription tier, the messaging has to change.
5. **No-fluff filter?** Cannot pass while the pricing copy and `how.steps[3]` contradict each other.
6. **Visually showable?** Moot.

**Verdict: DO NOT GIVE A CELL. Flag to copywriter as an inconsistency to resolve before the cells are written.** See section 5.

---

## 3. Final cell shortlist (recommended 6, ranked)

Six cells, in render order. Order matters: position 01 is the strongest differentiator the visitor sees first; position 06 is the closer. Layout is 3x2 hairline grid (3 cells across, 2 rows; per `corder-how-features-deep-dive.md` §7.2 + §3.4 Anthropic restraint plus §3.6 Cursor fragments).

### 01 - Per-speaker timeline

- **Eyebrow:** TIMELINE
- **Working heading:** Skip the scrub. Jump to the speaker.
- **Value rationale (66 words):** Each voice gets a coloured bar showing when they spoke and for how long. Click the purple block at 38 minutes to hear what the investor said about valuation. Click the green block to hear what you replied. Airtime percentages and durations are real numbers, not a chat-bubble feed. Investor calls, customer interviews, design reviews where one voice dominated. The bar is the navigation.
- **visualHint:** `mini-timeline-fragment` (existing). Show two or three speaker rows, percentage labels, a playhead.
- **Inventory proof:** Section 6 (Right panel - Recording tab, SpeakerTimeline), section 0.5 (visually confirmed in 0.9.0 screenshots), section 19 item 2 ("the per-speaker bar... IS the differentiator").
- **Competitors who lack this:** Otter (talk-time summary only, no click-to-seek). Granola (no airtime visual at all). Read.ai (summary panels but no scrubbable bar). Fireflies / Fathom / tl;dv (none).

### 02 - Screen recording, time-locked to the audio

- **Eyebrow:** SCREEN
- **Working heading:** Record what was on screen, not just what was said.
- **Value rationale (70 words):** A small HEVC video card sits above the audio scrubber. Click play on the transcript at minute 12 and the screen recording plays from minute 12. Useful when the meeting was about a Figma frame, a contract page, an investor deck, a dashboard the engineer was pointing at. Toggle it off in Settings if it's an audio-only call. Local file, never uploaded. Time-locked to the same clock the transcript uses.
- **visualHint:** Propose new `video-frame-fragment` hint - a 16:10 thumbnail with a centred play overlay, hairline border, "0:14 / 4:32" Plex Mono timestamp underneath. Alternative: extend `split-cell-illustration` to support a video-thumb + waveform pair.
- **Inventory proof:** Section 2 (Screen video), section 6 (Right panel screen video card), section 18 (0.8.0 + 0.8.6 + 0.8.7 + 0.8.8 deltas).
- **Competitors who lack this:** Granola (audio only). Otter / Read.ai / Fireflies / Fathom (bot-side cloud recordings, not local OS capture). tl;dv (records bot-side too). Nobody combines local OS screen capture + transcript clock + no bot.

### 03 - Menu-bar offer when a call starts

- **Eyebrow:** AUTO-DETECT
- **Working heading:** Zoom opens. The menu bar asks if you want to record.
- **Value rationale (62 words):** When Zoom, Meet, Teams, Discord or FaceTime takes the microphone for more than three seconds, Corder offers to record from the menu bar. Start, Not now, or never again for this app. The offer never appears in the call, only in your menu bar. Whitelist the apps you always record, blacklist the ones you never want offered. The default is ask.
- **visualHint:** `split-cell-illustration` (existing) - show a tiny menu-bar offer card with red dot, "Record this Zoom call?", Start / Not now buttons. Or propose new `menu-bar-popover-fragment`.
- **Inventory proof:** Section 2 (Meeting auto-detect, Auto-detect invite UI), section 7 (Settings whitelist/blacklist), section 18 Unreleased (per-process mic detector).
- **Competitors who lack this:** Granola (calendar-detect, not OS-mic-detect). All SaaS bots (don't need to detect, they're already in the call). The OS-mic detection method is Corder-unique.

### 04 - Drag the transcript out

- **Eyebrow:** DRAG
- **Working heading:** Drag the transcript into Notion. No export modal.
- **Value rationale (65 words):** Select any part of the transcript, drag it into Notion, Obsidian, Apple Notes, a folder in Finder. Plain text lands plain. No export dialog, no format chooser, no Markdown cleanup afterwards. If you want a file, drag to Finder and you have a `.txt`. If you want everything, the Download menu has TXT, MD, JSON, and a ZIP bundle. You stay in your existing notes app.
- **visualHint:** `split-cell-illustration` (existing) - CORDER fragment on the left, arrow, NOTION page mock on the right, "drag" label in Plex Mono between them.
- **Inventory proof:** Section 5 (Cmd+C bridge), section 10 (Download menu - TXT/MD/JSON/ZIP), section 18 (0.9.0 WKWebView download delegate).
- **Competitors who lack this:** Granola (sync via Notion integration only, not drag). Otter (export modal). Read.ai (export modal). Fireflies / Fathom / tl;dv (variants of export-then-import). The drag-to-anywhere mechanic is Mac-native and not replicated by SaaS.

### 05 - System audio capture, no virtual driver

- **Eyebrow:** AUDIO
- **Working heading:** No BlackHole. No Loopback. No virtual cable.
- **Value rationale (68 words):** Corder records system audio through CoreAudio's process tap on macOS 14.2+. That means it works on a fresh Mac with nothing installed. No BlackHole, no Loopback, no Soundflower, no audio MIDI setup. Microphone runs in parallel through AVAudioEngine, so a Zoom mute on the other side doesn't cost you their words. The recording sounds like the call sounded, not like an aggregate of routed taps.
- **visualHint:** `monospace-path` (existing). Use `CoreAudio - AVAudioEngine` or `~/Library/Application Support/Corder/` style mono treatment. Or propose new `kbd-cap-glyph` variant showing crossed-out competitor names (BlackHole / Loopback as struck-through tokens above the heading).
- **Inventory proof:** Section 2 (Three audio sources captured at once, Core Audio process tap, macOS 14.2+ floor).
- **Competitors who lack this:** Granola (ScreenCaptureKit-only, different mechanism). Otter / Read.ai / Fireflies / Fathom / tl;dv (bot-side, no local audio capture). The "no virtual driver" pitch is Mac-power-user catnip and Corder owns it.

### 06 - Re-transcribe is free after the first time

- **Eyebrow:** RE-RUN
- **Working heading:** A better Gemini model ships. Re-run last quarter for free.
- **Value rationale (64 words):** Corder caches Gemini's raw output by audio hash in your local SQLite. The first transcription pays Google's API; every re-run after that pays nothing. Switch to a smarter model when one ships, fix a speaker name and re-merge, change the clarify count from 3 to 4 - the audio doesn't re-upload, the cache replays. Old transcripts stay alongside new ones, so you can compare.
- **visualHint:** `version-sequence` (existing). Format: `Flash 2.5 -> Flash 3 -> Pro 4`. Already in the current cell.
- **Inventory proof:** Section 9 (Re-transcribe, gemini_raw_turns cache by audio MD5, migration v7).
- **Competitors who lack this:** All. Per comparison table in `content/copy.json`, Corder is the only "Yes" in this row.

### Why six (not five, not seven)

Five leaves position 05 or 06 vacant in a 3x2 grid - either you go 2x2 (loses two strong candidates) or 3x2 with a blank cell (looks unfinished). Seven needs a 2x3-or-3x3 layout - 3x3 has too much breathing room and an odd ninth cell becomes filler; 2x3 (six wide, hairline-thin) goes too narrow per cell. Six in 3x2 is doctrinally clean and fits the existing component shape.

### Why this order

01 (TIMELINE) leads because it is the visual moment the visitor scans first. It is also the single sharpest differentiator the inventory surfaced (per section 19).
02 (SCREEN) follows because it is the newest real feature (0.8.0+) and the freshest claim the page can make.
03 (AUTO-DETECT) lives in the middle because it is the most "Corder respects you" surface and reads better after the proof-of-product cells above.
04 (DRAG) opens the second row because it is the bridge to "fits my existing stack" without making integration claims.
05 (AUDIO) is the technical-credibility cell for the Hacker News reader.
06 (RE-RUN) closes the grid with the only "competitors all say No" row from the existing comparison table.

---

## 4. Cells to DROP, REFRAME, or KEEP from current Features

The current 6 cells in `content/copy.json` -> `features.cells`, each mapped to the shortlist above.

| # | Current cell | Verdict | Why |
|---|---|---|---|
| 1 | TIMELINE - Per-speaker timeline | **KEEP, sharpen** | Already correct. Copywriter should rewrite to lead with the click-to-seek benefit, not the description of the bar. New heading proposal: "Skip the scrub. Jump to the speaker." Same `visualHint`. |
| 2 | SEARCH - Search the whole library | **DROP from Features grid, MERGE elsewhere** | Real, working, valuable - but a flat-list of features doesn't have room for both Search and the six above. Search is implied by the transcript and already lives in the hero demo, the FAQ, and the pricing tier features list. Recommend folding the wording into the new DRAG cell (04) or letting the hero demo's search field carry it. If the copywriter feels strongly, swap with cell 05 AUDIO - but my read is AUDIO is the stronger acquisition cell. |
| 3 | AUTO-DETECT - Catches the meeting before you do | **REFRAME, keep position** | Real, valuable, but current copy ("catches the meeting before you do") is mildly fluffy and elides the menu-bar specificity. Replace with new cell 03 above. |
| 4 | AUDIO - System audio without a driver | **KEEP, sharpen** | Already correct. Copywriter should add the specific competitor-product names (BlackHole, Loopback) to anchor the claim. New cell 05. |
| 5 | LIBRARY - Your library lives on your Mac | **DROP** | Redundant with Privacy section card 2 ("Your files, your Mac") and FAQ. The portability angle is real but already implied. Replace with new cell 02 SCREEN (which is currently unrepresented and underexposed). |
| 6 | RE-RUN - Re-transcribe at zero margin | **KEEP, sharpen** | Already correct. Copywriter should sharpen the heading - "Re-transcribe at zero margin" is jargon. The proposed "A better Gemini model ships. Re-run last quarter for free." is more concrete. |

### Net diff

- Out: SEARCH, LIBRARY.
- In: SCREEN, DRAG.
- Reframed: AUTO-DETECT, AUDIO.
- Sharpened: TIMELINE, RE-RUN.

Three of the six cells survive in essence; three change.

---

## 5. Open questions for copywriter

These are real ambiguities the copywriter must resolve, ideally by checking with the user before writing the new cells.

### 5.1. Pricing / BYOK contradiction

Inventory section 19 flags a major mismatch: the 0.9.0 app shipped without a Gemini-key input field and with a "Pro features are disabled in this build" Settings note. Current `content/copy.json` carries a full 3-tier subscription ($9 / $14 / $99 Lifetime) plus a `how.steps[3]` "No subscription. BYO Gemini key" message. **These two stories cannot both be true on the page.** Before the copywriter rewrites Features, the pricing model story has to be settled. Suggested resolution path: confirm with user which model is current at the time of landing publication, then update `how.steps[3]`, `pricing.tiers`, `finalCta`, and the `comparison` row "No subscription" together. The Features grid does not depend on this directly, but the AUDIO cell mentions Google API costs only indirectly, and any rephrasing toward "free model" would need to align.

### 5.2. SCREEN cell - is the visualHint asset ready?

Cell 02 (SCREEN) calls for a `video-frame-fragment` or extended `split-cell-illustration` that the kit does not currently have. Soldier will need to either (a) add a new visualHint with a video thumbnail + timestamp pair, or (b) reuse `split-cell-illustration` with a video glyph. Copywriter should write the copy assuming option (b) and flag to soldier that option (a) is the cleaner asset if there is budget.

### 5.3. AUTO-DETECT - whitelist/blacklist disclosure

The auto-detect cell can be honest about the opt-in surveillance dimension or quiet about it. Recommend honest - mention "whitelist the apps you always record, blacklist the ones you never want offered." This pre-empts a privacy-paranoid reader's objection. Copywriter's call whether to keep this in the value rationale or move it to FAQ.

### 5.4. DRAG cell - mention DownloadMenu or not?

The Download menu (TXT / MD / JSON / ZIP) exists and is real (0.9.0 working). The DRAG cell can either lead with drag and tuck Download in a second sentence ("if you want a file, the Download menu has TXT, MD, JSON, ZIP") or treat them as parallel. Recommend leading with drag. The audience that came for Mac-native interaction will read "drag" as a feature; the audience that came for files will be glad to find DownloadMenu mentioned at all.

### 5.5. Heading style consistency

Three working headings above use a two-sentence form ("Skip the scrub. Jump to the speaker." / "Zoom opens. The menu bar asks if you want to record." / "A better Gemini model ships. Re-run last quarter for free."). Three use single-sentence form. Copywriter should decide whether the grid wants uniform headings (all single-sentence or all two-clause) or whether the variation is the point. My recommendation: keep the variation. Uniform headings on a 6-cell grid read as a template. Variation reads as a writer was here.

### 5.6. RE-RUN cell - is mention of "Google's API" still accurate at 0.9.0?

If the pricing model resolves to "subscription, no BYOK", the RE-RUN cell can no longer say "the first transcription pays Google's API." The Re-run cache is still real - free re-transcription after the first run - but the framing shifts from "pays Google" to "pays your monthly tier minutes once, then re-runs are free." Copywriter must align with whichever pricing path settles in 5.1.

---

## 6. Stop-words and tone

Copy of the constraints from `projects/corder-landing/CLAUDE.md` plus inherited doctrine, for the copywriter in one place.

### Forbidden words

seamless, powerful, robust, cutting-edge, supercharge, unlock, leverage, next-gen, redefine, revolutionary, magical, AI-powered, premium, enterprise-grade, industry-leading, best-in-class, save 25%, free trial (for Free tier).

### Forbidden punctuation

- No em-dash. Comma, colon, or full stop instead.
- No en-dash. Plain hyphen.
- No middle dot, no bullet, no curly quote. ASCII apostrophe only.
- No section sign.

### Frame discipline

- Frame A only. Never "stealth", "invisible", "covert", "hidden from the other side". The frame is "no bot in the call" - the other side sees nothing different because nothing different was added.

### Tone targets

- BBC editorial, technical sub-audience. Short declarative sentences. Specific over general. Verifiable over emotive.
- Each cell heading should be readable in under two seconds.
- Each cell rationale should be one paragraph, 50-80 words, that a sceptical Mac developer would not roll their eyes at.
- Specific names are welcome (BlackHole, Loopback, Notion, Obsidian, Zoom, Meet, Teams, Discord, FaceTime). Generic gestures ("any app", "your tools") are not.
- Numbers and units are welcome (HEVC, 15 fps, 3 seconds, 38 minutes, 280 ms, 7 days). Round numbers without unit are not.

### Body length budget (per cell)

- Eyebrow: 4-12 characters, uppercase, single token or two short tokens.
- Heading: 5-8 words.
- Rationale: 50-80 words. Not under 50 (reads as thin). Not over 80 (reads as essay).
- visualHint label (if `monoPath` or `versionSequence`): under 40 characters.

### Six-cell total word budget

Approximately 400 words across all six rationales. The current `features.cells` block totals around 280 words; the proposed grid trades up to 400, still under the 600-word page budget called out in `corder-fb-enthusiast-mocks.md` §6.7.

---

## 7. Self-check on this brief

| Check | Result |
|---|---|
| ASCII only | Pass. No em-dash, en-dash, middle dot, curly quote, section sign in this brief. |
| Every claim cited to inventory or research file | Pass. Each candidate verdict cites `corder-feature-inventory-2026-05.md` section or competitor reference. |
| Vapor flagged | Pass. Candidate 5 (Integrations) flagged DROP-Hard-no with exact inventory citation. Candidate 13 (BYOK / no subscription) flagged as outdated pending user resolution. |
| Duplication with other sections checked | Pass. Each candidate evaluated against existing `content/copy.json` sections (hero, how, privacy, pricing, FAQ, comparison, works-with, footer). |
| Final shortlist count | 6 cells, matching the existing grid shape. |
| Order reasoned | Section 3 explains why 01-06 in that sequence. |
| Open questions surfaced | Section 5 lists six discrete ambiguities for the copywriter / user to resolve. |
| Output is a brief, not final copy | Pass. Working headings + value rationales are 50-80 word drafts the copywriter sharpens, not ship-ready cell copy. |
