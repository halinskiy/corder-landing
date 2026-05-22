import type { MetadataRoute } from "next";

/**
 * XML sitemap -- explicit map of crawlable URLs for Google / Bing.
 *
 * Includes only the three real public pages. The 404 (`/not-found`) is
 * a special boundary, not a destination, so we omit it.
 *
 * Next.js auto-emits the file at `/sitemap.xml`. `dynamic = force-static`
 * is required for `output: "export"` so the route is materialised at
 * build time into a real file in `out/`.
 */
export const dynamic = "force-static";

const BASE = "https://getcorder.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: `${BASE}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE}/privacy-policy/`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE}/terms/`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}
