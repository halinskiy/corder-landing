# Corder Pricing Brief
# Written by 3mpq-economist — 2026-05-27
# Supersedes the 2026-05-09 version (old 3-tier minute-cap model is void).

---

## 1. Tier breakdown

### Free — $0 forever
**Great for:** Solo users who want full recording power and are comfortable managing their own Gemini API key.

Badge: none. Free should not feel like a stripped trial. No badge.

Feature lines (5-8, all under 8 words):
- No credit card, no sign-up required
- Record any meeting, unlimited length
- Gemini 2.5 Flash transcription, speakers labelled
- Full transcript: searchable, scrubable, drag-out to Notion
- Screen video captured alongside the transcript
- 30 days of meeting history, stored on your Mac
- Bring your own Gemini key (you pay Google ~$0.30/hr)

CTA: "Download for Mac"

---

### Pro — $14/mo ($10/mo launch offer, first 3 months)
**Great for:** Regular users who want zero API friction and sharper transcription on hard calls.

Badge: "Launch offer" on the $10 price only. Remove after the 3-month window. No badge on the $14 regular price.

Annual: $99/yr ($8.25/mo effective). Note: "Price locked."

Feature lines:
- Everything in Free, plus:
- Transcription included, no Gemini key required
- Gemini 2.5 Pro model for hard accents and crosstalk
- Unlimited meeting history (Free keeps 30 days)
- Auto-summary with sections and action items
- Custom summary templates for your call type
- Priority support, direct line to the maker

CTA: "Get Pro"

---

### Max — $30/mo
**Great for:** Power users who record daily and want their summaries delivered automatically to their tools.

Badge: "Power user"

Annual: OPEN QUESTION — see section 4.

Feature lines:
- Everything in Pro, plus:
- API access — pull any transcript via REST
- Webhook delivery — push summaries on meeting end
- AI search across your full meeting library
- Unlimited custom summary templates
- Early builds before public release
- Dedicated support with same-day SLA

CTA: "Get Max"

---

## 2. The upgrade story

### Free to Pro: what friction does Pro remove?

Two things.

First, the Gemini API key. Free users provision a key, paste it into settings, and get a Google bill. That is fine for a developer or a power user. It is real friction for a founder recording 15-20 hours a month who wants the thing to work. At $10/month launch price, Pro costs less than the Google pass-through bill for 34 hours of Flash transcription. Anyone recording more than 34 hours per month is already paying more via BYOK. Anyone who records less but does not want to manage API credentials will pay $10 to never think about it again.

Second, the model. Gemini 2.5 Flash is accurate for clean calls. Gemini 2.5 Pro catches heavy accents, crosstalk, and domain-specific jargon that Flash misses. A consultant on a client call with a non-native speaker who loses two sentences loses money. The model upgrade is insurance.

Third unlock: meeting history. The 30-day cap on Free means a user cannot pull a quote from a call 6 weeks ago. Unlimited history in Pro removes that ceiling with zero behavior change.

### Pro to Max: what is the $20/mo worth?

The only honest answer for a single-user macOS app is automation, not capacity. There are no teams to sell. No SSO. No workspace seat count.

The Max upgrade sells time.

A Pro user reads their summary, opens Notion, pastes it in. A Max user has the summary delivered to Notion the moment the call ends via webhook. For someone running 8-10 client calls a week, that is 30-40 minutes of copy-paste eliminated per week. At any billable rate above $50/hr, the $20/month pays for itself in one recovered session.

The API access reinforces this. A Max user can build their own CRM integration, their own Obsidian sync, their own Slack digest. This is the audience who would have built those integrations anyway. Max gives them the surface to build against instead of screenscraping.

AI search across all meetings is the third unlock. Not a list of transcripts to dig through. A single query that returns an answer from across the full library. "What did the client say about the deadline in April?" is a question Free and Pro users cannot answer without manual searching. Max makes that a two-second query.

Do not position Max as "premium Pro." Position it as "the version you automate." The $20 gap is only justifiable if Max visibly earns time back every week. The copy must make that concrete.

---

## 3. Pricing brief for copywriter

**Price anchors:** Free $0 / Pro $14 ($10 launch) / Max $30

**What each price signals:**
- Free: full product, not a trial. The signal is confidence.
- Pro $14: SaaS-market parity. Granola Business is $14. Fireflies Pro is $10-18. $14 reads as "serious tool, not a toy." $10 launch reads as "founder price, get in early."
- Max $30: deliberate power-user positioning. Not "enterprise." Not a seat count. $30 is the price of automation, not of storage or meeting minutes. Krisp Advanced is $15/mo; Fireflies Business is $19-29/mo. At $30 you are above the market midpoint, which is correct because the audience is people whose time is worth $100+/hr.

**Language the prices support:**
- Free: "download", "yours", "no sign-up", "keeps running", "your Mac only"
- Pro: "included", "no key", "direct line", "launch price", "Pro model", "every call"
- Max: "automates", "pipes into", "API", "webhook", "your tools", "on meeting end"

**Language the prices do NOT support:**
- "Premium" — forbidden word. Write the tier name "Pro" or "Max."
- "Enterprise-grade" or "business-ready" — there are no teams, no workspace, no SSO at any tier
- "Unlimited everything" — Free already has unlimited recording length. The differentiators are history, model, and automation, not time caps. "Unlimited" used loosely will confuse users who see a 30-day history limit on Free.
- "Trial" or "free trial" about the Free tier — it is not a trial. It is the product with BYOK. Calling it a trial undermines the BYOK story and sounds like a SaaS hook.
- "Save X%" on annual Pro — the existing "Price locked forever" line from copy.json is better. Use that.
- "Advanced AI" — name the model. "Gemini 2.5 Pro" not "advanced AI."

**Feature line rules:**
- Under 8 words per line
- Specific nouns only: "Gemini 2.5 Pro model", not "better transcription"
- No parentheticals inside feature lines (use footnote microcopy below the table)
- "Everything in Free, plus:" before each Pro line
- "Everything in Pro, plus:" before each Max line

**CTA wording:**
- Free: "Download for Mac"
- Pro (launch window): "Get Pro"
- Pro (post-launch): "Start Pro"
- Max: "Get Max"

**Badge rules:**
- Pro: "Launch offer" badge on the $10 price. Remove after 3-month window. Do not badge $14.
- Max: "Power user" badge, small, subdued.
- Free: no badge.

**Annual microcopy:**
- Pro: "$99/yr — $8.25 a month. Price locked."
- Max annual: TBD (see open questions).

**Microcopy below the table (all tiers):**
- "No credit card to download"
- "Cancel anytime"
- "Prices in USD"
- "macOS 14 or later"

**Competitor context for voice calibration:**
- Granola Basic (free) limits meeting history. Corder Free is more generous on storage but requires a Gemini key. Do not name Granola on the pricing page.
- Fireflies Free gates AI summaries and transcript downloads. Corder Free includes both. Use this as a confidence signal, not as a comparison table item.
- Otter Free caps at 300 min/month. Corder Free has no minute cap. Never advertise this as "vs Otter." Use it as internal confidence: our Free is genuinely generous, the BYOK requirement is the only ask.

---

## 4. Open questions for the maker

1. **Is the Gemini API key truly removed in Pro, or does Pro include hosted transcription via a Corder-owned key?** The copy above assumes Corder pays Google on behalf of Pro and Max users. If the architecture is still BYOK but with a Corder-supplied key the user never sees, the feature line "no key required" reads the same to the buyer, but the unit economics change significantly. At $10/mo launch price and $0.30/hr Google pass-through, a Pro user recording more than 34 hours/month is unprofitable for Corder. Verify the margin model before shipping copy. ASSUMPTION: Pro = Corder-hosted transcription.

2. **Does Gemini 2.5 Pro Ultra exist as a selectable model, or is Max's higher-accuracy claim hypothetical?** The FAQ in copy.json mentions Flash vs Pro as two models. If Max introduces a third model tier, it needs to ship before the pricing page goes live. If it does not ship, Max's accuracy line must be removed or reframed as "same Pro model, plus automation."

3. **Is the API and webhook story real or roadmap?** If Max launches at $30/mo but the API is "coming soon," the tier has no upgrade story. Either ship the API first, or launch Max with a clear "API access in beta for early subscribers" qualifier.

4. **Is the 30-day history limit on Free enforced in the app today?** If Free currently has unlimited local history, adding a cap is a product change that requires a release, not just a copy change. If it is already enforced, the feature line is accurate as written.

5. **Annual pricing for Max: what is the target?** $299/yr ($24.92/mo effective, saves $61) is the logical parallel to Pro's $99/yr. Needs a number before the pricing section can be designed.

---

## 5. Maker decisions (2026-05-27, post-brief)

Maker answered the five open questions. Locked pricing + feature
copy is now driven by these decisions; copy.json#pricing reflects
this section verbatim.

### Q1 — Pro = hosted, NOT BYOK.

BYOK at mass-market = conversion death (90% of users do not know
what an API key is). All paid tiers are HOSTED. Free is hosted too,
with a 5-hour monthly cap. Pro carries a 25-hour soft cap with
"$0.40/hour overage if you go over" surfaced as a feature line, not
hidden in a tooltip. Max is unlimited with a fair-use clause.

Unit economics on Whisper API (gpt-4o-mini-transcribe, ~$0.36/hr
dual-track): Pro 25h x $0.36 = $9 cost on $10 revenue at launch
price = ~10% margin. Acceptable. Revisit if Whisper/Gemini cost
shifts more than 30%.

Free 5h x $0.36 = $1.80 cost. No revenue. Treated as customer
acquisition cost.

### Q2 — Model claim split.

NO fake "Ultra" tier. Real public models only.
- Pro: Gemini 2.5 Flash (or Whisper, depending on prod choice)
- Max: Gemini 2.5 Pro for summaries, marginal cost increase
  (~$0.05/hr), justifies the upper tier without inventing models.

Marketing line on Max card: "Gemini 2.5 Pro model for sharper
summaries". On Pro card: no model name -- just "Auto-summary".
Avoids cluttering Pro with model trivia while the Max claim stays
honest.

### Q3 — API and webhooks SCRAPPED from launch features.

Never sell roadmap as current. Both lines removed from Max card.
Max differentiator at launch = unlimited hours + 2.5 Pro model +
early builds + dedicated support. API ships 4-6 weeks post-launch
as free value-add to existing Max subscribers (announce on
Roadmap/Changelog, do not retro-add to landing copy until live).

### Q4 — 30-day Free history cap NOT implemented in code.

Removed from Free feature list entirely. Adding to copy without
shipping the cap = misleading. When the app-side gate ships
(MeetingRepository filter, lock-icon UI, 90-day grace window for
Pro->Free downgrades), the line returns to the Free feature list.

### Q5 — Max annual: $239/yr launch ($19.92/mo effective).

Aggressive launch positioning (Granola Business is $30/mo / $288/yr).
Below Granola, well below Otter Business. Locks in early adopters
at a price the maker can raise to $29-30 once product-market fit
is established 6 months in (classic SaaS pattern). priceOriginal
shows $348 (12 x $29) so the discount math reads.
