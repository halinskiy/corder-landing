#!/usr/bin/env node
// Sync the hardcoded Corder version constants to the latest published
// release, so they never have to be edited by hand again.
//
// The install page's download CTA already resolves the latest DMG at
// runtime via the GitHub API, so the actual download is always current.
// These four constants are the static layer the resolver can't reach:
//
//   src/components/install/InstallClient.tsx
//     FALLBACK_URL   offline / rate-limit / CORS safety-net DMG
//     FALLBACK_NAME  download filename for that fallback
//     VERSION        visible "What is new in <version>" label
//   src/app/layout.tsx
//     softwareVersion  JSON-LD SoftwareApplication (SEO)
//
// Run with no args to resolve the LATEST corder-updates release, or
// `--version=0.14.62` to pin a specific one. Idempotent: a no-op when the
// constants already match. FAIL-SOFT BY DESIGN: any network/API/parse
// failure logs a warning, leaves the committed constants untouched, and
// exits 0 — so it is safe as a `prebuild` hook and can never break a
// deploy. The committed values are always a recent, valid fallback.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const RELEASES_API =
  "https://api.github.com/repos/halinskiy/corder-updates/releases/latest";
const DMG_RE = /^Corder[-.\w]*\.dmg$/i;
const SEMVER_RE = /^\d+\.\d+\.\d+$/;

const INSTALL = join(ROOT, "src/components/install/InstallClient.tsx");
const LAYOUT = join(ROOT, "src/app/layout.tsx");

function warn(msg) {
  console.warn(`sync-corder-version: ${msg}`);
}

async function resolveTarget() {
  const pin = process.argv.slice(2).find((a) => a.startsWith("--version="));
  if (pin) {
    const v = pin.slice("--version=".length).trim();
    if (!SEMVER_RE.test(v)) throw new Error(`bad --version "${v}"`);
    return {
      version: v,
      url: `https://github.com/halinskiy/corder-updates/releases/download/v${v}/Corder-${v}.dmg`,
      name: `Corder-${v}.dmg`,
    };
  }
  const res = await fetch(RELEASES_API, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "corder-landing-sync",
    },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const rel = await res.json();
  const version = String(rel.tag_name || "").replace(/^v/, "").trim();
  if (!SEMVER_RE.test(version)) throw new Error(`unexpected tag "${rel.tag_name}"`);
  const asset = (rel.assets || []).find((a) => DMG_RE.test(a.name));
  if (!asset) throw new Error(`no Corder DMG asset on ${rel.tag_name}`);
  return { version, url: asset.browser_download_url, name: asset.name };
}

// Replace exactly one occurrence captured by `re` (which must expose the
// text around the value as $1 ... $2). Returns the new string; records the
// label when the value actually changed.
function patch(src, re, value, label, changed) {
  if (!re.test(src)) {
    warn(`pattern not found: ${label} (file layout changed?)`);
    return src;
  }
  const next = src.replace(re, `$1${value}$2`);
  if (next !== src) changed.push(label);
  return next;
}

async function main() {
  let target;
  try {
    target = await resolveTarget();
  } catch (e) {
    warn(`${e.message}; leaving constants unchanged`);
    return; // exit 0 — never break a build
  }
  const { version, url, name } = target;
  const changed = [];

  const installBefore = readFileSync(INSTALL, "utf8");
  let install = installBefore;
  install = patch(install, /(const FALLBACK_URL =\s*\n\s*")[^"]*(";)/, url, "FALLBACK_URL", changed);
  install = patch(install, /(const FALLBACK_NAME = ")[^"]*(";)/, name, "FALLBACK_NAME", changed);
  install = patch(install, /(const VERSION = ")[^"]*(";)/, version, "VERSION", changed);
  if (install !== installBefore) writeFileSync(INSTALL, install);

  const layoutBefore = readFileSync(LAYOUT, "utf8");
  let layout = layoutBefore;
  layout = patch(layout, /(softwareVersion: ")[^"]*(",)/, version, "softwareVersion", changed);
  if (layout !== layoutBefore) writeFileSync(LAYOUT, layout);

  if (changed.length) console.log(`sync-corder-version: set ${version} (${changed.join(", ")})`);
  else console.log(`sync-corder-version: already ${version}, nothing to do`);
}

main();
