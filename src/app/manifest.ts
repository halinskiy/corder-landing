import type { MetadataRoute } from "next";

/**
 * Web App Manifest -- powers Chrome / Edge "Install app", iOS Safari
 * "Add to Home Screen", and gives search engines a clean signal that
 * this is a recorder product.
 *
 * Next.js App Router auto-emits this at `/manifest.webmanifest` and
 * includes the `<link rel="manifest">` tag in the document head.
 * `dynamic = force-static` is required for `output: "export"`.
 */
export const dynamic = "force-static";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Corder. The Mac meeting recorder",
    short_name: "Corder",
    description:
      "Mac meeting recorder. Records system audio and transcribes the call. No bot joins, nothing leaves your Mac except the audio chunk sent to Gemini for transcription.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    /* White matches `--color-bg`; the mobile status bar / PWA chrome
     * should continue the page background, not show a coloured strip. */
    theme_color: "#ffffff",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    categories: ["productivity", "business", "utilities"],
  };
}
