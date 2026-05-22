#!/usr/bin/env node
// generate-seo-assets.mjs
//
// Single-shot generator that reads `assets/seo-master.svg` (brand mark)
// and `assets/og-master.svg` (social card) and emits the full SEO asset
// set into `public/`:
//
//   public/icon.svg          -- modern browsers (vector favicon)
//   public/favicon-16.png    -- 16×16, embedded in .ico
//   public/favicon-32.png    -- 32×32, embedded in .ico
//   public/favicon-48.png    -- 48×48, embedded in .ico
//   public/favicon.ico       -- multi-resolution ico (16/32/48)
//   public/apple-icon.png    -- 180×180, iOS Safari home screen
//   public/icon-192.png      -- 192×192, Web App Manifest
//   public/icon-512.png      -- 512×512, Web App Manifest
//   public/og-image.png      -- 1200×630, Open Graph + Twitter card
//
// Re-run after editing either SVG. Output files are committed to the repo
// so the GH Pages build doesn't need sharp/png-to-ico at deploy time.

import { readFile, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const ASSETS = path.join(ROOT, "assets");
const PUBLIC = path.join(ROOT, "public");

async function main() {
  const seoSvg = await readFile(path.join(ASSETS, "seo-master.svg"));
  const ogSvg = await readFile(path.join(ASSETS, "og-master.svg"));

  // 1) Vector favicon -- a straight copy of the master so modern browsers
  // can rasterise it at any size.
  await copyFile(
    path.join(ASSETS, "seo-master.svg"),
    path.join(PUBLIC, "icon.svg")
  );
  console.log("wrote public/icon.svg");

  // 2) Rasterised brand-mark variants. Sharp downscales the 1024×1024
  // master to each target size with no extra padding.
  const sizes = [
    { name: "favicon-16.png", size: 16 },
    { name: "favicon-32.png", size: 32 },
    { name: "favicon-48.png", size: 48 },
    { name: "apple-icon.png", size: 180 },
    { name: "icon-192.png", size: 192 },
    { name: "icon-512.png", size: 512 },
  ];

  for (const { name, size } of sizes) {
    await sharp(seoSvg, { density: 300 })
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(PUBLIC, name));
    console.log(`wrote public/${name} (${size}×${size})`);
  }

  // 3) Multi-resolution ICO. Bundles 16/32/48 so browsers pick the best
  // size on the fly. png-to-ico handles the embedding.
  const icoBuf = await pngToIco([
    path.join(PUBLIC, "favicon-16.png"),
    path.join(PUBLIC, "favicon-32.png"),
    path.join(PUBLIC, "favicon-48.png"),
  ]);
  await writeFile(path.join(PUBLIC, "favicon.ico"), icoBuf);
  console.log("wrote public/favicon.ico (multi-res 16/32/48)");

  // 4) Open Graph / Twitter card -- rasterise the OG SVG. density 200
  // is enough for 1200×630 (the SVG geometry is already in target units).
  await sharp(ogSvg, { density: 200 })
    .resize(1200, 630, { fit: "contain", background: "#f7f7f6" })
    .png({ quality: 92 })
    .toFile(path.join(PUBLIC, "og-image.png"));
  console.log("wrote public/og-image.png (1200×630)");

  console.log("\nDone. Commit the contents of public/ alongside the SVG masters.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
