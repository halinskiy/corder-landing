import type { NextConfig } from "next";

/**
 * 2026-05-22: dropped basePath / assetPrefix.
 *
 * Earlier the site was published at https://halinskiy.github.io/corder-landing/
 * and Next.js needed basePath '/corder-landing' so internal links and assets
 * resolved correctly under the GitHub user-site sub-path. The custom domain
 * `getcorder.com` now serves the same artefact from the root, so the prefix
 * is no longer needed -- it would actually break asset resolution at the
 * domain root.
 *
 * Keeping `output: "export"` (static export, no Node runtime) and
 * `trailingSlash: true` (matches GitHub Pages's "directory + index.html"
 * behaviour and the existing /privacy-policy/ and /terms/ routes).
 */
const config: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default config;
