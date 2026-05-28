#!/usr/bin/env node
// generate-seo-assets.mjs
//
// Reads two masters:
//   * `assets/seo-master.svg`        -- flat squircle, vector. Used ONLY
//                                       as public/icon.svg (the SVG
//                                       favicon some modern browsers
//                                       prefer for tab icons -- vector
//                                       scales crisp). All raster
//                                       favicons + app icons come from
//                                       the 3D PNG.
//   * `assets/corder-mark-3d-2048.png` -- 2048x2048 Tahoe-style 3D
//                                       render. Used for ALL raster
//                                       sizes (favicon-16/32/48,
//                                       apple-icon 180, icon-192/512,
//                                       brand-mark-128 inline, and the
//                                       OG card composite).
// And one composition master:
//   * `assets/og-master.svg`         -- 1200x630 OG card. The brand
//                                       tile inside is now composited
//                                       from the 3D PNG via Sharp
//                                       (see step 5) instead of drawn
//                                       as flat shapes in the SVG.
//
// Emits into `public/`:
//   public/icon.svg          -- modern browsers (vector favicon)
//   public/favicon-16.png    -- 16x16  (from flat SVG)
//   public/favicon-32.png    -- 32x32  (from flat SVG)
//   public/favicon-48.png    -- 48x48  (from flat SVG)
//   public/favicon.ico       -- multi-res 16/32/48
//   public/apple-icon.png    -- 180x180 (from 3D PNG)
//   public/icon-192.png      -- 192x192 (from 3D PNG)
//   public/icon-512.png      -- 512x512 (from 3D PNG)
//   public/brand-mark-128.png -- 128x128 (from 3D PNG, inline use)
//   public/og-image.png      -- 1200x630 (3D mark + OG SVG overlay)
//
// Re-run after editing either master. Output files are committed to the
// repo so the build doesn't need sharp/png-to-ico at deploy time.

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
  const brandPng = await readFile(
    path.join(ASSETS, "corder-mark-3d-2048.png")
  );

  // 1) Vector favicon -- straight copy of the FLAT master. Modern
  // browsers prefer SVG for tab favicons; the flat mark reads crisp
  // at any tiny size, the 3D depth gets lost there anyway.
  await copyFile(
    path.join(ASSETS, "seo-master.svg"),
    path.join(PUBLIC, "icon.svg")
  );
  console.log("wrote public/icon.svg");

  // 2) All raster sizes (16 -> 512) downscaled from the 3D PNG. Maker
  // wants consistent Tahoe-style depth EVERYWHERE -- earlier the tiny
  // favicons (16/32/48) used the flat SVG because depth was supposed
  // to "muddy" at small sizes, but at 32/48 the dark capsules + drop
  // shadow actually still read fine and the brand identity stays
  // consistent across browser tab / home screen / OG card.
  const rasterSizes = [
    { name: "favicon-16.png", size: 16 },
    { name: "favicon-32.png", size: 32 },
    { name: "favicon-48.png", size: 48 },
    { name: "apple-icon.png", size: 180 },
    { name: "icon-192.png", size: 192 },
    { name: "icon-512.png", size: 512 },
    { name: "brand-mark-128.png", size: 128 },
  ];
  for (const { name, size } of rasterSizes) {
    await sharp(brandPng)
      .resize(size, size, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ quality: 92 })
      .toFile(path.join(PUBLIC, name));
    console.log(`wrote public/${name} (${size}x${size}, 3D)`);
  }

  // 4) Multi-resolution ICO. Bundles 16/32/48 (all flat) so browsers
  // pick the best size on the fly. png-to-ico handles the embedding.
  const icoBuf = await pngToIco([
    path.join(PUBLIC, "favicon-16.png"),
    path.join(PUBLIC, "favicon-32.png"),
    path.join(PUBLIC, "favicon-48.png"),
  ]);
  await writeFile(path.join(PUBLIC, "favicon.ico"), icoBuf);
  console.log("wrote public/favicon.ico (multi-res 16/32/48)");

  // 5) Open Graph card. Rasterise the OG SVG (background + dot grid +
  // headline + sub) at 1200x630, then composite the 3D brand mark on
  // top at (72, 72) sized 96x96 -- same coordinates the OG SVG had
  // its flat tile drawn at. The OG SVG no longer carries the tile
  // shapes; only the background + text remain.
  const base = await sharp(ogSvg, { density: 200 })
    .resize(1200, 630, { fit: "contain", background: "#f7f7f6" })
    .png()
    .toBuffer();

  const markForOg = await sharp(brandPng)
    .resize(96, 96, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  await sharp(base)
    .composite([{ input: markForOg, top: 72, left: 72 }])
    .png({ quality: 92 })
    .toFile(path.join(PUBLIC, "og-image.png"));
  console.log("wrote public/og-image.png (1200x630, composited 3D mark)");

  console.log("\nDone. Commit the contents of public/ alongside the masters.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
