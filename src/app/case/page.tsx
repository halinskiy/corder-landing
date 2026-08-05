import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { Metadata } from "next";

import { copy } from "@/content/copy";
import { CaseView } from "@/components/case/CaseView";

// The /case route is deliberately NOT linked from the main nav: the
// homepage sells the recorder, this page sells the finishing service.
// It is handed out directly (outreach, LinkedIn, footer credit).
export const metadata: Metadata = {
  title: copy.caseStudy.metaTitle,
  description: copy.caseStudy.metaDescription,
  robots: { index: true, follow: true },
};

// Self-contained DOM snapshots of the REAL app (old builds resurrected
// from git tags, current build from the shipped bundle), captured with
// identical mock data so every pair is an honest same-content diff.
// Read at build time (static export) and inlined into iframe srcDoc.
function snap(name: string): string {
  return readFileSync(
    join(process.cwd(), "content", "case-snapshots", `${name}.html`),
    "utf8",
  );
}

export default function CasePage() {
  // Order mirrors copy.json chapters: archive first (the most
  // representative pair), first-launch last.
  const pairs = [
    { before: snap("old-archive"), after: snap("new-archive") },
    { before: snap("old-main"), after: snap("new-main") },
    { before: snap("old-settings"), after: snap("new-settings") },
    { before: snap("old-empty"), after: snap("new-welcome") },
  ];
  return <CaseView pairs={pairs} />;
}
