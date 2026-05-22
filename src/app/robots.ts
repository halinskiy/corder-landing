import type { MetadataRoute } from "next";

/**
 * robots.txt -- explicit "everything is open, here's the sitemap".
 *
 * Next.js emits this file at `/robots.txt`. `dynamic = force-static`
 * is required for `output: "export"`.
 */
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://getcorder.com/sitemap.xml",
    host: "https://getcorder.com",
  };
}
