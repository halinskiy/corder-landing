# Cloudflare Pages migration — getcorder.com

Goal: move `getcorder.com` from GitHub Pages (requires public repo) to
Cloudflare Pages (works with private repo, free, edge CDN). No downtime.

Current state (verified 2026-05-23):
- Repo: `halinskiy/corder-landing` — **public** on GitHub
- Build: `npm run build` → static export into `out/`
- Hosting: GitHub Pages, custom domain `getcorder.com`
- DNS registrar / nameservers: **Porkbun** (`*.porkbun.com`)
- Apex `getcorder.com` → 4 A records to GitHub Pages IPs
  (185.199.108.153 / .109.153 / .110.153 / .111.153)
- `www.getcorder.com` → CNAME `halinskiy.github.io`

Migration order matters — do steps 1–8 in sequence so the site stays
up the entire time. Repo stays public until step 9.

---

## Step 1 — Create a Cloudflare account

If you don't have one yet:

1. Open https://dash.cloudflare.com/sign-up
2. Sign up with the same email you use for GitHub
3. Verify email
4. Skip "Add a site" for now — we'll do it via Pages

## Step 2 — Connect the repo to Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages** → **Create application** →
   **Pages** tab → **Connect to Git**
2. Authorize Cloudflare on GitHub → grant access to **`halinskiy/corder-landing`** only
3. Select the repo and click **Begin setup**
4. Project name: `corder-landing` (this becomes `corder-landing.pages.dev`)
5. Production branch: `main`
6. Build settings:
   - **Framework preset:** `Next.js (Static HTML Export)`
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
   - **Root directory (advanced):** leave empty
   - **Node version:** 22 (matches local nvm)
7. Environment variables (optional — defaults in code work):
   ```
   NEXT_PUBLIC_PADDLE_ENV           = sandbox
   NEXT_PUBLIC_PADDLE_TOKEN         = test_642bcf86f349f296bce7814c10f
   NEXT_PUBLIC_PADDLE_PRICE_MONTHLY = pri_01ks8rxaz7567n2531ymyt1y0e
   NEXT_PUBLIC_PADDLE_PRICE_ANNUAL  = pri_01ks8s0c5drt5147fsem76wxtq
   ```
   These are sandbox values; the code already has them as fallbacks so
   you can skip this step until you go to production Paddle.
8. Click **Save and Deploy**
9. Wait ~2 minutes for first build. Watch the log.
10. When it shows "Success" — visit `https://corder-landing.pages.dev`
    and verify the site loads identically to `https://getcorder.com`.

If the Pages deploy succeeds: you now have **two** working URLs.
`getcorder.com` still serves from GitHub Pages (untouched);
`corder-landing.pages.dev` serves from Cloudflare. Good.

## Step 3 — Add `getcorder.com` to Cloudflare DNS

This is the "move DNS to Cloudflare" step. Required because Cloudflare
Pages needs Cloudflare to manage the DNS in order to issue certificates
and serve the custom domain.

1. Cloudflare dashboard → **Add a site** (top right) → type `getcorder.com`
2. Choose **Free** plan
3. Cloudflare scans existing DNS at Porkbun and imports records.
   **Verify** the import includes:
   - 4 × A `getcorder.com` → 185.199.108–111.153
   - 1 × CNAME `www` → halinskiy.github.io
   - any TXT records (Google verification etc)
4. Cloudflare gives you **two Cloudflare nameservers** like:
   ```
   chad.ns.cloudflare.com
   norah.ns.cloudflare.com
   ```
   Copy them.

## Step 4 — Update nameservers at Porkbun

1. Log into Porkbun → Domain Management → `getcorder.com` → **Authoritative Nameservers**
2. Replace the three porkbun.com nameservers with the **two Cloudflare** ones
3. Save
4. Back in Cloudflare → click **Continue** / **Check nameservers** —
   it'll go yellow ("pending"). Propagation usually takes 10–60 min;
   sometimes up to 24h.
5. Wait until Cloudflare shows ✅ "Cloudflare is now protecting your site".

**During this wait the site stays up** — the existing A records pointing
to GitHub Pages are still authoritative until the Cloudflare zone
takes over. Then those records (which Cloudflare imported in step 3)
keep working, just served via Cloudflare's edge.

## Step 5 — Attach `getcorder.com` to the Pages project

After nameservers are active in Cloudflare:

1. CF dashboard → Workers & Pages → `corder-landing` project →
   **Custom domains** tab
2. **Set up a custom domain** → type `getcorder.com` → confirm
3. CF will offer to **update the DNS records** to point at the Pages
   project. Click **Update**.
   This replaces the 4 GitHub Pages A records with a single CNAME
   `getcorder.com` → `corder-landing.pages.dev` (flattened).
4. Repeat for `www.getcorder.com` — set up custom domain, CF updates
   the existing `www` CNAME from `halinskiy.github.io` to the Pages
   project.
5. Wait ~5–15 min for CF to issue SSL certificate (auto, Universal SSL).
6. Visit `https://getcorder.com` — should serve from Cloudflare now.
   Verify by checking response headers: should see `server: cloudflare`
   (curl `https://getcorder.com -sI`).

## Step 6 — Verify everything

Critical checks before flipping the repo private:
- [ ] `https://getcorder.com/` returns 200, identical to before
- [ ] `https://getcorder.com/thanks/` returns 200
- [ ] `https://getcorder.com/privacy-policy/` returns 200
- [ ] `https://getcorder.com/refunds/` returns 200
- [ ] `https://getcorder.com/terms/` returns 200
- [ ] `https://getcorder.com/og-image.png` returns 200
- [ ] `https://getcorder.com/sitemap.xml` returns 200
- [ ] `https://www.getcorder.com/` redirects to apex (or serves the
      same content) without certificate errors
- [ ] Paddle checkout still loads (test with sandbox card 4242)
- [ ] Plausible / Clarity scripts still load if you've enabled them
- [ ] Google Search Console verification file
      `https://getcorder.com/google6657f24bde52d2b3.html` still
      serves the verification line

If any of these fail — STOP. Re-check the Pages build log + DNS
records. Don't proceed to step 7.

## Step 7 — Remove GitHub Pages dependency from the repo

Now that Cloudflare Pages is serving the site, the `CNAME` file and
the `.github/workflows/deploy.yml` are dead weight. They can stay (no
harm) or be removed (cleaner).

Recommended cleanup commit:
```bash
git rm public/CNAME
git rm .github/workflows/deploy.yml
git commit -m "chore: remove GitHub Pages deploy config (migrated to Cloudflare Pages)"
git push
```

Verify Cloudflare Pages still deploys after the push (every push to
`main` triggers a new Pages build).

## Step 8 — Disable GitHub Pages

In the GitHub repo settings:
1. Settings → Pages → "Build and deployment" → **Source** → change
   to **None** (or **Disabled**)
2. This stops GH Pages from serving even if someone reaches the
   `*.github.io` URL.

## Step 9 — Flip the repo to private

This is the last step. Do it ONLY after steps 6 + 7 succeed —
otherwise GitHub Pages stops serving (free tier requires public) and
if Cloudflare isn't fully ready you get downtime.

1. GitHub → repo Settings → **General** → scroll to **Danger Zone**
2. **Change repository visibility** → **Make private**
3. Confirm the repo name to proceed
4. GitHub asks once more — confirm.

The Cloudflare Pages integration **continues to work on private
repos** — CF holds an OAuth token granted in step 2 that survives the
visibility change.

## Step 10 — Optional: remove internal docs from the repo

Even private, the repo can be cleaner. Strategy docs that don't need
to be in version control:
- `DECISIONS.md`, `BRIEF.md`, `RETRO.md`, `HANDOFF.md` — useful but
  internal. Keep if you want history; safe to remove since you're now
  private anyway.
- `research/*.md` — research snapshots. Keep for reference.
- `content/pricing-brief.md` — pricing strategy. Can stay private.

No action required here; just an option to tidy.

---

## Rollback plan

If Cloudflare Pages goes wrong after step 4 (DNS at CF) but before
step 7 (CNAME removed):

1. CF dashboard → DNS → manually re-add the 4 A records to GitHub Pages
   IPs (185.199.108–111.153) for `getcorder.com`
2. CF DNS → re-add CNAME `www` → `halinskiy.github.io`
3. Disable proxying (orange cloud → grey) so CF doesn't intercept
4. Site is back on GitHub Pages within the TTL window

If wrong after step 9 (repo private + GH Pages disabled):
- Make the repo public again from GitHub settings
- Re-enable GitHub Pages
- Restore CNAME + `.github/workflows/deploy.yml` from git history
- Fix the CF Pages issue at leisure

---

## Cost

Cloudflare Pages free tier:
- 500 builds / month
- Unlimited bandwidth
- Unlimited custom domains
- Free SSL (Universal)
- Free DDoS protection
- 100 ms global TTFB (CF edge)

We're solidly inside the free tier. Zero monthly cost.
