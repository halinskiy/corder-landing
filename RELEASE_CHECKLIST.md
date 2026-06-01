# Corder release checklist

Things to complete before opening paid traffic to the live `Get Pro`
and `Get Max` buttons. Items grouped by what needs to happen and who
does it (`maker` = you, `claude` = automated / code-side).

---

## Phase 1 -- Paddle live with safety net

### maker tasks (Paddle dashboard)

- [x] KYB approved on production Paddle account
- [x] `getcorder.com` listed in **Website Approval -> Approved domains**
- [x] Default payment link set to `getcorder.com` (Checkout Settings)
- [x] Six priceIds created (Pro x 3, Max x 3) with `custom_data`
      `{ tier, billing, launch }` set per price
- [x] Apple Pay + PayPal + Bancontact enabled (Checkout Settings)
- [ ] **Google Pay enabled** -- raises Mac + Chrome conversion. One
      checkbox in Checkout Settings -> Payment Methods.
- [ ] **Statement descriptor** set to `CORDER` (Checkout Settings ->
      Statement description) so card statements read recognisably
      instead of "PADDLE.NET"
- [ ] **Refund policy URL** added in Paddle compliance settings ->
      `https://getcorder.com/refunds/`. Required for some regions.
- [ ] **Privacy URL** added ->
      `https://getcorder.com/privacy-policy/`
- [ ] **Terms URL** added -> `https://getcorder.com/terms/`
- [ ] **Bank account verified** in Paddle Settings -> Payouts
- [ ] **Tax forms** filed (W-8BEN for non-US, or local equivalent)
      under Paddle Settings -> Tax

### Activation Worker (one-time deploy)

- [ ] `cd apps/activation-worker && npm install`
- [ ] `npx wrangler login` (once per machine)
- [ ] `npx wrangler deploy` -- copy the printed workers.dev URL
- [ ] Paddle dashboard -> Developer Tools -> Notifications ->
      **New destination**:
      - URL: `https://corder-activation.<your-account>.workers.dev/paddle-webhook`
      - Subscribed events:
        - `transaction.completed`
        - `subscription.activated`
        - `subscription.updated`
        - `subscription.canceled`
        - `subscription.paused`
- [ ] Copy the destination's **Secret key** ->
      `npx wrangler secret put PADDLE_WEBHOOK_SECRET`
- [ ] Paddle dashboard -> destination -> **Send test** -- watch
      `npx wrangler tail`, confirm `paddle.webhook` log line appears

### Real test purchase

- [ ] Open https://getcorder.com/#pricing -> Monthly -> **Get Pro**
- [ ] Land on `/checkout/?tier=pro_launch&billing=monthly` ->
      Paddle inline iframe loads -> price reads `$10.00 inc. VAT`
- [ ] Complete payment with your real card ($10)
- [ ] Confirm redirect to `/thanks/?_ptxn=...`
- [ ] Confirm receipt email arrives in inbox (sender:
      `noreply@paddle.com` or similar)
- [ ] Confirm `wrangler tail` logged `transaction.completed` and
      `subscription.activated`
- [ ] Paddle dashboard -> Transactions -> the transaction ->
      **Refund full amount**
- [ ] Confirm refund email arrives, transaction shows `refunded`,
      `wrangler tail` logs `transaction.updated` (status: refunded)

### Cross-browser smoke

- [ ] macOS Safari -- pricing toggle works, Get Pro lands on
      `/checkout/`, Paddle iframe renders
- [ ] iPhone Safari -- summary stacks above iframe, scrolling works
- [ ] Chrome on Windows / Linux if available
- [ ] Firefox

---

## Phase 2 -- Mac app activation flow

This is whichever activation pattern the Mac app supports. Three
realistic options:

| Pattern | Mac app does | Backend does |
|---|---|---|
| **Email sign-in** | Prompt for email, POST to Worker to validate active subscription | Worker reads from D1 (populated by webhooks), returns plan + expiry |
| **Magic link** | Open `corder://activate?token=...` from receipt email | Worker generates token on `subscription.activated`, sends via Resend |
| **Licence key** | Paste key from email | Worker generates + emails key on `subscription.activated`, validates key on app launch |

- [ ] Maker decides which pattern Corder Mac app implements
- [ ] Activation Worker extended to D1 + chosen pattern
- [ ] `/thanks/` `<ActivationStatus />` polls activation endpoint
      and shows real status (not just "Order confirmed")
- [ ] Receipt email body customised in Paddle dashboard ->
      Notifications -> emails template to match the chosen pattern

---

## Phase 3 -- Optional polish

- [ ] **Custom domain** for activation Worker:
      `api.getcorder.com/paddle-webhook`. Requires moving DNS
      to Cloudflare from Porkbun (or adding a Cloudflare zone
      with NS delegation). Same migration affects newsletter-worker.
- [ ] **`/account/`** built against real D1 (currently mocks)
- [ ] **Magic-link auth** so users can manage subscription from
      the landing page (not just Paddle Customer Portal)
- [ ] **Paddle Inline checkout CSS variables** set via dashboard
      to match Corder palette (Checkout Settings -> Inline tab ->
      Primary color `#217a50`, button radius `8`, font IBM Plex Sans)
- [ ] Resend domain `getcorder.com` audit -- confirm SPF / DKIM /
      DMARC pass on transactional emails from our side

---

## Analytics events to verify after first real purchases

- `cta_pro_click` (data-track-event on Pricing CTAs) -- fires in
  Plausible on every Get Pro / Get Max click
- `cta_max_click` -- same, Max card
- `cta_free_click` -- Free download click
- `pricing_view` -- fires when the Pricing section enters viewport
- `checkout_completed` (fired by Paddle.Initialize eventCallback in
  `app/layout.tsx`) -- should land on every successful purchase
- Twitter pixel `tw-checkout-completed` -- same trigger

If any of these are missing after a real purchase, check
`src/lib/track.ts` and the eventCallback in
`src/app/layout.tsx` line 247-249.
