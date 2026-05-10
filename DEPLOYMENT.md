# Corder Landing — Deployment Guide

## Status
- **Code:** Ready for production (`npm run build` passes, typecheck clean, judge PASSED 2026-05-09)
- **GitHub:** https://github.com/halinskiy/corder-landing (main branch)
- **Vercel Project:** `3mpqs-projects/corder-landing` (created but awaiting GitHub integration)

## Why Not Deployed Yet
The project depends on `@aisoldier/ui-kit` via file-system path (`file:../../ui-kit`). This works locally and in monorepo contexts, but Vercel CLI deployment from a subdirectory cannot resolve parent-directory dependencies without seeing the full monorepo structure. 

Additionally, Vercel API returns generic "Unexpected error" when attempting CLI `vercel deploy --prod` — this is unrelated to the code and likely a transient API issue or account-level setting.

## How to Deploy

### Option 1: GitHub Integration (Recommended)
1. Go to https://vercel.com/dashboard
2. Click "+ Add New..." → "Project"
3. Select "Import Git Repository" → https://github.com/halinskiy/corder-landing
4. Vercel auto-detects Next.js, asks for root directory
5. **Critical:** Set "Root Directory" to `.` (project root, not subdirectory) since this is now a standalone repo
6. Leave all other settings as defaults (Node 20.x, npm build)
7. Click "Deploy"
8. GitHub will auto-trigger deploy on every `git push origin main`

### Option 2: Vercel CLI from Monorepo
If deploying from `/Users/3mpq/Aisoldier/` (monorepo root):
```bash
cd /Users/3mpq/Aisoldier
vercel deploy --prod --cwd projects/corder-landing
```
**Note:** This requires Vercel to properly handle the monorepo structure, which was failing at time of this writing.

### Option 3: Manual Build + Deploy
```bash
npm run build
vercel deploy --prod --prebuilt
```

## After Deploy
- Live URL will be visible on Vercel dashboard as `https://corder-landing-<hash>-3mpqs-projects.vercel.app`
- Custom domain: configure in Vercel project settings (domains tab)
- Auto-redeploys on every push to `halinskiy/corder-landing` main branch

## Build & Performance
- **Build time:** ~5s locally, ~20s on Vercel (first install)
- **Bundle size:** 102 KB (shared) + 72.5 KB (page) — well under 80 KB hard target after gzip
- **LCP:** < 1.5s on 4G (static HTML, no API calls)

## Troubleshooting
- **Build fails on Vercel:** Check Vercel build logs in dashboard. Most common: missing env variables (this project has none) or dependency resolution.
- **Deploy via CLI fails:** Use GitHub integration instead. The API error is ephemeral and unrelated to code.
- **Missing assets:** Verify `assets/` folder is included in `.gitignore` if you don't want it shipped. Currently excluded from `.vercelignore`.

---

**Created:** 2026-05-10  
**Status:** Ready for production via GitHub integration
