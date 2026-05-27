import type { Metadata } from "next";

import { InstallClient } from "@/components/install/InstallClient";

export const metadata: Metadata = {
  title: "Install Corder",
  description:
    "Your Corder download started. Open the zip, drag Corder to Applications, then launch it. Three steps, two minutes.",
  alternates: { canonical: "/install/" },
  robots: { index: false, follow: false },
};

/**
 * /install -- post-download landing.
 *
 * Triggers the Corder.zip download on mount and walks the user through
 * the three install steps while it lands in their Downloads folder.
 * Layout mirrors the Granola pattern the maker referenced: status pill
 * at the top, oversized serif "Thanks for downloading" heading, helper
 * line with a manual-download fallback link, then three numbered
 * illustration cards across the bottom.
 */
export default function InstallPage() {
  return <InstallClient />;
}
