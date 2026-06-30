// Parse a Keep-a-Changelog release body (the GitHub release `body`, which
// Corder generates from its CHANGELOG) into the grouped shape the install
// page's "What is new" list renders. ONE parser, used for both the live
// notes fetched at runtime and the build-time fallback snapshot, so the
// two can never diverge.
//
// Input shape (example):
//   ## [0.14.96] - 2026-06-29
//   ### Fixed
//   - The HUD equalizer no longer flickers during a recording. A burst of
//     window-occlusion events was pausing the animation.
//   ### Added
//   - ...
//
// Output: [{ label: "Fixed", items: ["The HUD equalizer ..."] }, ...]
//
// The "## [version] - date" release-title line is dropped (the version is
// shown separately); only "### Category" headings become groups. Wrapped
// bullet lines are re-joined. Typographic dashes are normalised to ASCII so
// dynamic product copy still honours the landing's no-em-dash rule.

export type WhatsNewGroup = {
  /** Category heading (### Fixed / Added / ...), or null for ungrouped bullets. */
  label: string | null;
  /** One entry per change bullet, wrapped lines already joined. */
  items: string[];
};

// Em (U+2014) / en (U+2013) dash joining clauses -> comma, so dynamic
// product copy stays ASCII-only. Built from char codes so this source file
// contains no dash glyph itself.
const DASH_RE = new RegExp(
  "\\s*[" + String.fromCharCode(0x2014, 0x2013) + "]\\s*",
  "g",
);

/** Strip the inline markdown and normalise dashes in a single bullet. */
function cleanInline(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(DASH_RE, ", ")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseWhatsNew(markdown: string): WhatsNewGroup[] {
  if (!markdown) return [];
  const groups: WhatsNewGroup[] = [];
  let current: WhatsNewGroup | null = null;
  let lastItem = -1;

  for (const rawLine of markdown.replace(/\r\n/g, "\n").split("\n")) {
    const line = rawLine.trim();
    if (!line) {
      lastItem = -1; // a blank line closes the current bullet's continuation
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      if (heading[1].length >= 3) {
        current = { label: cleanInline(heading[2]), items: [] };
        groups.push(current);
      } else {
        current = null; // "## [x] - date" release line / "# title" -> not a group
      }
      lastItem = -1;
      continue;
    }

    const bullet = line.match(/^[-*+]\s+(.*)$/);
    if (bullet) {
      if (!current) {
        current = { label: null, items: [] };
        groups.push(current);
      }
      current.items.push(cleanInline(bullet[1]));
      lastItem = current.items.length - 1;
      continue;
    }

    // A wrapped continuation of the previous bullet.
    if (current && lastItem >= 0) {
      current.items[lastItem] = `${current.items[lastItem]} ${cleanInline(line)}`.trim();
    }
  }

  return groups.filter((g) => g.items.length > 0);
}
