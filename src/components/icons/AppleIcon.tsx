/**
 * AppleIcon — the classic Apple silhouette with leaf.
 *
 * Path digitised from the well-known reference rendering (same shape
 * Granola, Linear, Raycast and Notion ship on their "Download for Mac"
 * pills). Fill uses `currentColor` so it inherits from the parent
 * button text colour -- white on the filled accent CTA, accent on the
 * transparent nav variant.
 *
 * 14 px is the default size used by Nav + Hero CTAs. Override via the
 * `size` prop.
 */
export function AppleIcon({
  size = 14,
  className,
  "aria-hidden": ariaHidden = true,
}: {
  size?: number;
  className?: string;
  "aria-hidden"?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden={ariaHidden}
      role="img"
      style={{
        // The Apple glyph reads optically heavy on top because the leaf
        // adds visual mass. A 1 px nudge down inside the optical box
        // re-centres it next to text on the same baseline.
        transform: "translateY(0.5px)",
        flexShrink: 0,
      }}
    >
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.41-1.09-.47-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.41C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}
