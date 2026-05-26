# Corder brand assets

Canonical Corder logo — keep this folder as the single source of truth.
Every rendered surface (Dock icon, DMG installer, email avatars, landing
sites, marketing) should resample from these files.

## Files

- `corder-mark.svg` — canonical mark. Pure white squircle (continuous
  corner radius = 22.4 % of side, matches Apple's icon template) with
  two solid black capsule bars. No drop shadow, no gradients. Use this
  for Dock / Finder / app icons — macOS draws its own shadow.
- `corder-mark-bordered.svg` — same mark with a 12 % black hairline
  border. Use this on light backgrounds where the white squircle
  would otherwise vanish (welcome emails, marketing decks on white
  paper, Lighthouse-style report mocks).
- `corder-mark-{64,128,256,512,1024}.png` — pre-rendered PNGs from the
  canonical SVG, ready for direct use.
- `corder-mark-bordered-512.png` — pre-rendered bordered variant.

## Geometry (1024 × 1024 viewBox)

- Squircle: `rect(0, 0, 1024, 1024, rx=230)` filled `#ffffff`.
- Left bar:  `rect(340, 248, 144, 528, rx=72)` filled `#111111`.
- Right bar: `rect(540, 248, 144, 528, rx=72)` filled `#111111`.
- Bar gap (visual): 56 px (484 → 540).
- Bordered variant: outer rect inset by 6 px, `stroke = rgba(0,0,0,0.12)`,
  `stroke-width = 12`.

## Regenerate PNGs

```bash
cd /Users/3mpq/corder-brand
for s in 64 128 256 512 1024; do
  rsvg-convert -w $s -h $s corder-mark.svg -o corder-mark-${s}.png
done
rsvg-convert -w 512 -h 512 corder-mark-bordered.svg \
  -o corder-mark-bordered-512.png
```

Always render through `rsvg-convert` (not `qlmanage` — its thumbnailer
muddies the squircle edges at small sizes).

## Where the brand currently lives

- `/Users/3mpq/Corder/Resources/icons/AppIcon.{svg,icns,iconset/...}` —
  Dock / Finder / cmd-tab icon. Rebuild from `corder-mark.svg`.
- `/Users/3mpq/corder-api/src/assets/corder.png` — welcome email
  Corder avatar (uses the bordered variant).
- `/Users/3mpq/3mpq-studio-export/public/icons/corder.svg` — 3mpq.studio
  portfolio thumbnail.
- `/Users/3mpq/Corder/Scripts/make-dmg-background.py` — DMG installer
  background that shows "drag Corder to Applications".
- Future: getcorder.com landing (Corder-page maintainer should pull
  this folder).
