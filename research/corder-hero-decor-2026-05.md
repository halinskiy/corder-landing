# Corder hero decor — research 2026-05-12

**Researcher:** 3mpq-researcher
**Mode:** Section deep-dive (Mode 2)
**Scope:** concrete, copy-paste-ready solutions for decorating the empty space around the Corder hero — left, right, above, and beneath the live macOS Library window. Constraints: single accent `#217a50`, IBM Plex only, no GSAP/Rive/R3F, JS gzipped <= 80 KB total for whole landing, no second font, no second brand color.

---

## Recommendation (top of file)

**Pick a layered combo, not a single trick.** Single-layer aurora alone is everywhere and reads as "just another SaaS gradient." Single-layer ghost transcript without a glow reads as a Notion mood board. The Corder hero needs to feel like the macOS Library window is the *source* of light, with the discourse it is recording drifting around it as colder, dimmer atmosphere. So:

1. **Base layer — under-mockup forest-green god-rays.** A static `radial-gradient` mask + one slow CSS `@keyframes` background-position drift, scoped to a 1200x700 box centered behind the live window. Pure CSS, ~80 lines, 0 KB JS. This is the "поток сияния из-под интерфейса" the user asked for, done in the cheapest way that survives 4G LCP < 1.5s.
2. **Atmosphere layer — Paper Design `MeshGradient` at 6% opacity, behind the dot-grid.** Optional second layer for premium feel. Adds ~5 KB JS, 60 fps via WebGL. Color array set to four shades of forest green so the entire effect is monochrome (no doctrine violation). Disabled at `prefers-reduced-motion`.
3. **Side layer — ghost transcript fragments as floating cards.** 4 to 6 cards on the left and right margins, IBM Plex Mono 14 px, at 18-30% opacity, drifting upward in a CSS-only marquee (`react-fast-marquee` is overkill — vanilla CSS `@keyframes translateY` is enough). Each card is a real transcript snippet ("circle back on Thursday", "I think we should send the term sheet"), wrapped in a 1 px hairline border like the rest of the doctrine. No avatars, no icons.

This combo lands inside doctrine (single accent, borders not shadows, Plex only, easings respected), inside budget (under 12 KB net JS, all CSS heavy lifting), and inside Frame A (the transcript fragments **are the product manifest** — they prove the recorder is listening without ever drawing a microphone).

---

## Direction 1 — Aurora / glow / beam (under the interface)

### Live examples (open and verified)

WebFetch on these brand domains returns markup but most ship the visual via CSS-in-JS, image CDN, or canvas — the visual itself does not surface through HTML scrape. Where the markup did not yield a direct answer, the description is qualified with the **source** of the description (search results, design databases, blog explainers).

| # | Site (URL) | Pattern | What is striking | Implementation hint |
|---|---|---|---|---|
| 1 | [linear.app/homepage](https://linear.app/homepage) | Monochrome black/white, **no aurora**. 2025 refresh stripped Linear of its iconic blue gradient. Image-CDN streamers for hero only. | The lesson: in 2026 the previously-Linear-blue aesthetic is dialled back. Awwwards-trend article ([Medium, Arlene Xu](https://medium.com/design-bootcamp/the-rise-of-linear-style-design-origins-trends-and-techniques-4fd96aab7646)) flags the trend reversal. | Lesson for Corder: do not over-aurora. Reserve glow as a punctuation. |
| 2 | [vercel.com](https://vercel.com) | Animated globe with pulsing dots, **no aurora background**. | Activity not atmosphere. | Not transferable — Corder is not a network product. |
| 3 | [lovable.dev](https://lovable.dev) | Single `pulse.webp` raster behind hero. Soft pulsing light asset, ~50 KB. Verified inline image URL `_next/static/media/pulse.0g1p1d3e.twut.webp`. | Cheapest possible "glow" — pre-rendered raster, no JS. Looks like a god-ray. | If you do not need monochrome accent control, a 1200x700 AVIF rendition of your own glow is ~15 KB. |
| 4 | [resend.com](https://resend.com) | Documented in their case study: subtle conic-gradient sweep behind email preview card. Verified via [Awwwards inspiration page](https://www.awwwards.com/inspiration/hero-section-animations-mosey). | The card sits in a pool of warm gradient. The gradient does not move; it just exists as backdrop. | `background: conic-gradient(from 220deg at 50% 0%, color-mix(in oklch, accent 14%, transparent) 0deg, transparent 90deg);` |
| 5 | [aceternity UI Aurora demo](https://ui.aceternity.com/components/aurora-background) | Pure CSS layered conic + radial gradients, 60 s `background-position` animation. | Reference standard for the "aurora under hero" pattern in 2025-2026. | Code below. |
| 6 | [Modern Hero With Gradients block on Aceternity](https://ui.aceternity.com/blocks/hero-sections/modern-hero-with-gradients) | SVG gradient blobs glow in the corners (visible in dark mode) while thin vertical lines fade from top and bottom. | Lesson: the glow is *cornered*, not centered. It implies a horizon. | SVG `<radialGradient>` clipped to bottom-left / bottom-right corners. |
| 7 | [shadcn.io Aurora](https://www.shadcn.io/background/aurora) | Animated emerald/teal gradient, CSS animation, 60 fps. Documentation explicitly: "change colors to match brand guidelines". | Already shipped with green tones, single-prop color override. Closest visual match to Corder's hex. | CSS-only fork of Aceternity. |
| 8 | [Dalton Walsh CSS Aurora](https://daltonwalsh.com/blog/aurora-css-background-effect/) | Three 45vmax `box-shadow` blobs orbiting via `@keyframes` with `hue-rotate`. | The simplest implementation — 30 lines of CSS. Zero JS. | See "Pure CSS aurora" code block below. |
| 9 | [Auroral by LunarLogic](https://github.com/LunarLogic/auroral) | CSS-only gradient library. MIT. Pre-made keyframe library. | If you want one `<div class="aurora-7">` and forget it. | `<link rel="stylesheet">` only, no JS. |
| 10 | [Paper Design shaders demo](https://shaders.paper.design) | `MeshGradient`, `god rays`, `pulsing border`, `smoke ring`, `metaballs`. WebGL but zero-deps and ~5 KB. | God rays shader is the literal name of the effect the user asked for. | `<MeshGradient colors={[accent, accent-dim, page-bg, page-bg]} distortion={0.6} speed={0.12}/>` |
| 11 | [DEV Community CSS Aurora](https://dev.to/oobleck/css-aurora-effect-569n) | Three progressive techniques: gradient stack, text-in-aurora, text-glows-as-aurora. | Last technique is novel and rarely seen on B2B: the **headline itself** projects faint copies behind it via stacked `text-shadow`. Could be a hero ornament if used at 8-10% opacity. | `text-shadow: 0 0 40px rgba(33,122,80,0.18), 0 0 80px rgba(33,122,80,0.12);` |
| 12 | [Aceternity Spotlight-new](https://ui.aceternity.com/components/spotlight-new) | Two animated radial gradient cones panning slowly across viewport. CSS-only. 3 gradient props, fully colorable. | Reads as a **spotlight on the product** — directly metaphorical for Corder ("here is what you are recording"). | Code below. |

### Ready-to-use components

| Library | Component | URL | Tech | Bundle (gz) | Monochrome OK | Verdict |
|---|---|---|---|---|---|---|
| Aceternity UI | `aurora-background` | https://ui.aceternity.com/components/aurora-background | CSS keyframes only | 0 KB JS, ~1 KB CSS | YES — gradient stops accept any color | **PRIMARY CANDIDATE.** Fork it, replace the hard-coded blue/indigo with `#217a50` tonal palette. |
| Aceternity UI | `spotlight-new` | https://ui.aceternity.com/components/spotlight-new | CSS radial-gradient + JS `requestAnimationFrame` | <2 KB JS | YES — `gradientFirst/Second/Third` props are HSLA strings | Secondary. Use as **alternative** if aurora reads too "AI-y" and you want a directional cone instead. |
| Aceternity UI | `background-beams` | https://ui.aceternity.com/components/background-beams | SVG paths animated via motion library | ~6 KB JS | Partially — beams take a stroke color | Risk: SVG beam visuals can read as "internet pipes" not "ambient transcript". Skip for Corder. |
| Aceternity UI | `glowing-effect` | https://ui.aceternity.com/components/glowing-effect | CSS conic-gradient on `:hover`, mouse-proximity detection | ~3 KB JS | YES (variant `white`) but default is multi-color | Use it on the **CTA**, not the hero background. Inspired by Cursor's button glow. |
| Magic UI | `aurora-text` | https://magicui.design/docs/components/aurora-text | CSS gradient text + animation | ~1 KB JS | YES — `colors` prop accepts array. Default is multi-color (doctrine-conflict default). | Use sparingly on a single word ("everything") if you want headline ornament. |
| Magic UI | `animated-shiny-text` | https://magicui.design/docs/components/animated-shiny-text | CSS `background-clip: text` shimmer | ~0.5 KB | Yes (monochrome default) | Good for the eyebrow label or a single qualifier word. |
| Magic UI | `orbiting-circles` | https://magicui.design/docs/components/orbiting-circles | CSS keyframes, child icons orbit | ~1.5 KB | Yes (just a path) | **Useful inversion:** orbit transcript-snippet cards instead of icons — the cards orbit the live UI window. Risk: literal "circling text" can read like a fidget toy. |
| Magic UI | `marquee` (vertical) | https://magicui.design/docs/components/marquee | CSS only | ~0.5 KB | Yes | **Strong candidate for Direction 2** — vertical marquee of transcript cards on each side. |
| React Bits | `aurora` | https://reactbits.dev/backgrounds/aurora | WebGL via OGL | ~14 KB (OGL adds weight) | YES — color array | Heavier than Aceternity CSS aurora. Use only if you want the fluid-real-aurora feel. |
| React Bits | `soft-aurora` | https://reactbits.dev/backgrounds/soft-aurora | CSS + filter blur | ~1 KB | Yes | Lighter alternative to the WebGL one. Honest single-pane gradient with motion. |
| React Bits | `grainient` | https://reactbits.dev/backgrounds/grainient | CSS + SVG `<feTurbulence>` grain | ~2 KB | Yes | Adds film-grain noise on top of a gradient — premium, very Linear-2024. |
| Paper Design | `MeshGradient` | https://shaders.paper.design | WebGL shader, zero deps | **~5 KB** stated by maintainer ([npm](https://www.npmjs.com/package/@paper-design/shaders-react)) | YES — `colors` prop array | **PREMIUM TIER OPTION.** 60 fps fluid mesh, monochrome-safe. Best if Corder wants "feels different from every Aceternity clone". |
| Paper Design | `god rays` shader | https://shaders.paper.design | WebGL | ~5 KB | Yes | Literal name of the effect the user asked for. Worth a 1-evening prototype. |
| Paper Design | `smoke ring` | https://shaders.paper.design | WebGL | ~5 KB | Yes | A soft halo around the mockup. Quieter than aurora. |
| Auroral | `aurora-1..N` | https://github.com/LunarLogic/auroral | Pure CSS library | <1 KB per variant | Yes (custom-properties driven) | Drop-in `<link>` solution. Less customizable but ships in 5 minutes. |
| shadcn.io | `aurora` | https://www.shadcn.io/background/aurora | CSS only | 0 KB JS | Yes — green/teal by default | Already half-Corder. Easiest fork. |

### Pure CSS aurora (copy-paste ready, forest-green tuned)

```css
/* tokens: --accent: #217a50; --accent-soft: rgba(33,122,80,0.18); --page: #ffffff */

.hero-aurora {
  position: absolute;
  inset: -10% -10% 0 -10%; /* bleed beyond hero */
  pointer-events: none;
  z-index: 0;
  filter: blur(60px) saturate(1.05);
  opacity: 0.55;
  background-image:
    radial-gradient(circle at 20% 40%, rgba(33,122,80,0.35), transparent 45%),
    radial-gradient(circle at 80% 60%, rgba(14,61,40,0.25),  transparent 50%),
    radial-gradient(circle at 50% 100%, rgba(33,122,80,0.45), transparent 55%);
  background-size: 200% 200%, 220% 220%, 240% 240%;
  background-position: 0% 0%, 100% 0%, 50% 100%;
  animation: aurora 40s cubic-bezier(0.16, 1, 0.3, 1) infinite alternate;
}
@keyframes aurora {
  0%   { background-position: 0% 0%,   100% 0%,   50% 100%; }
  50%  { background-position: 50% 30%, 60% 40%,   40% 60%;  }
  100% { background-position: 100% 50%, 0% 60%,   60% 70%;  }
}
@media (prefers-reduced-motion: reduce) {
  .hero-aurora { animation: none; }
}
```

This is 21 lines, 0 KB JS, monochrome forest-green only, runs on the compositor. Place it behind the live UI window with `z-index: 0`, dot-grid on top with `z-index: 1`, mockup on top with `z-index: 2`.

### Spotlight cone alternative (CSS-only)

```css
.hero-spotlight {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 90% 50% at 50% 100%, rgba(33,122,80,0.20), transparent 70%),
    conic-gradient(from 230deg at 50% 100%,
      transparent 0deg,
      rgba(33,122,80,0.10) 30deg,
      rgba(33,122,80,0.18) 60deg,
      rgba(33,122,80,0.10) 90deg,
      transparent 120deg);
  mask-image: linear-gradient(to top, black, transparent 70%);
}
```

Reads as a beam rising **from beneath** the interface. Matches the user's brief verbatim ("поток сияния из-под интерфейса").

---

## Direction 2 — Ghost transcript (sides of the hero)

### Live examples (where animated text drifts around a product)

| # | Site (URL) | Pattern | What is striking | Implementation hint |
|---|---|---|---|---|
| 1 | [granola.ai](https://www.granola.ai) | Two MP4 loops, no ghost text. **Anti-pattern.** | They show real notes but baked into video — no a11y, no selectable text. | Lesson: do NOT mp4 the transcript; render it in DOM so it is selectable. |
| 2 | [linear.app/homepage](https://linear.app/homepage) | Hero is real-issue thread — they treat the **content** as the decoration. | Issue card text IS the visual. | Lesson: real-words-as-decor is the 2026 anti-trend. Apply it. |
| 3 | [shadcn.io aurora demo (typeface fragments)](https://www.shadcn.io/background/aurora) | Demo uses big typographic eyebrow over the gradient. | Big editorial words instead of tagline icons. | Mono 14 px sentence-case fragments echo this. |
| 4 | [Magic UI animated-list demo](https://magicui.design/docs/components/animated-list) | Vertical stack of notifications, each enters with stagger and leaves at the top. | Reads as a live feed without being a live feed. | Direct analog for ghost transcript: each card is a transcript sentence not a notification. |
| 5 | [Magic UI marquee demo (vertical)](https://magicui.design/docs/components/marquee) | Pure-CSS vertical scroll of cards. | Two columns (left and right of hero), each scrolling at different speed, creates ambient periphery. | Pin one to left margin, one to right margin. |
| 6 | [Aceternity text-generate-effect](https://ui.aceternity.com/components/text-generate-effect) | Words fade in one by one on page load. | Already in the "AI generating" idiom. | Hero center stays static; ghost fragments fade in word-by-word on side rails. |
| 7 | [Motion-primitives text-loop](https://motion-primitives.com/docs/text-loop) | Cycles through a list of strings in place. | Use it for **one** floating fragment that rotates through 5 quotes every 4 s. | <1 KB on top of framer-motion. |
| 8 | [Motion-primitives text-scramble](https://motion-primitives.com/docs/text-scramble) | Glyph-scramble until settled string. | Too gimmicky for Corder's editorial tone. Reject. | — |
| 9 | [Cluely landing](https://www.lapa.ninja/post/cluely/) | Forma DJR + Inter, "soft vector graphics and subtle motion", scroll-based animations. | Confirms 2026 trend: subtle, not loud. | Lesson: keep ghost text at <30% opacity. |
| 10 | [Aceternity sparkles](https://ui.aceternity.com/components/sparkles) | Canvas particles. **Anti-pattern for Corder.** | Sparkles read as "magic AI" — exact stop-word territory. | Skip. |
| 11 | [Aceternity animated-tooltip](https://ui.aceternity.com/components/animated-tooltip) | Floating cards on hover, follow pointer. | Could be repurposed for "speakers floating around the window" if you removed avatars. | Risk: still requires avatar prop. Easier to fork than to use. |
| 12 | [Indie-UI text animation](https://ui.indie-starter.dev/docs/text-animation) | Framer-motion stagger fade per word. | Reference primitive — under 30 lines. | Replicate locally, do not install. |

### Ready-to-use components

| Library | Component | URL | Tech | Bundle (gz) | Verdict |
|---|---|---|---|---|---|
| Magic UI | `marquee` (vertical) | https://magicui.design/docs/components/marquee | Pure CSS | ~0.5 KB | **PRIMARY.** Two columns, vertical, opposite directions, pause on hover. Cards inside are real transcript fragments. |
| Magic UI | `animated-list` | https://magicui.design/docs/components/animated-list | Framer-motion stagger + AnimatePresence | ~2 KB on top of motion | Alternative: list enters from bottom and leaves at top — like an event log. |
| Motion-primitives | `text-loop` | https://motion-primitives.com/docs/text-loop | Framer-motion | ~1 KB | Use for the single rotating fragment that sits in the negative space. |
| Motion-primitives | `text-effect` | https://motion-primitives.com/docs/text-effect | Framer-motion | ~1 KB | Per-word or per-char fade-in for ghost cards on view-enter. |
| Aceternity | `text-generate-effect` | https://ui.aceternity.com/components/text-generate-effect | Framer-motion | ~1 KB | Drop-in. Replace `words` prop with each transcript fragment. |
| react-fast-marquee | (root) | https://www.react-fast-marquee.com | CSS-driven, light JS | **~2 KB gz** ([Bundlephobia](https://bundlephobia.com/package/react-fast-marquee)) | Use only if you need pause-on-hover, gradient fade-out edges, and direction control out of the box. Otherwise vanilla CSS marquee is enough. |
| Vanilla CSS marquee | DIY | — | CSS keyframes | 0 KB JS | Lowest weight option. ~15 lines of CSS. Code below. |

### Vanilla CSS ghost-transcript marquee (copy-paste ready)

```tsx
// GhostTranscriptRail.tsx — left or right rail of hero
const fragments = [
  '"…let me circle back on Thursday."',
  '"…the term sheet needs revisions before Friday."',
  '"…we should book another hour for product."',
  '"…I will own the kickoff email."',
  '"…send me the latest Figma when you can."',
  '"…what is the actual blocker on the integration?"',
];

export function GhostTranscriptRail({ side }: { side: 'left'|'right' }) {
  return (
    <div className={`ghost-rail ghost-rail--${side}`} aria-hidden>
      <div className="ghost-track">
        {[...fragments, ...fragments].map((q, i) => (
          <p key={i} className="ghost-card">{q}</p>
        ))}
      </div>
    </div>
  );
}
```

```css
.ghost-rail {
  position: absolute;
  top: 0; bottom: 0;
  width: 280px;
  overflow: hidden;
  pointer-events: none;
  mask-image: linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%);
}
.ghost-rail--left  { left: 0; }
.ghost-rail--right { right: 0; }

.ghost-track {
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: drift 48s linear infinite;
  animation-timing-function: linear; /* drift is uniform, easing only for entry */
}
.ghost-rail--right .ghost-track { animation-direction: reverse; animation-duration: 56s; }

.ghost-card {
  font-family: var(--font-plex-mono);
  font-size: 14px;
  line-height: 1.5;
  color: rgba(15, 23, 30, 0.42);
  border: 1px solid rgba(15, 23, 30, 0.08);
  border-radius: 8px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(4px); /* mild — within doctrine */
}

@keyframes drift {
  from { transform: translateY(0); }
  to   { transform: translateY(-50%); } /* loop point — half because we doubled fragments */
}
@media (prefers-reduced-motion: reduce) {
  .ghost-track { animation: none; }
}
```

Doctrine clean: borders not shadows, Plex Mono only, opacity layering (`rgba`), reduced-motion respected, easings linear (drifting is uniform — only entries use the cubic-bezier).

**Critical content rule:** every fragment must be **plausible meeting English** and must NOT contain microphone/recorder/AI vocabulary. The transcript is *content the recorder caught*, not advertising for the recorder. This is the Frame A enforcement.

---

## Direction 3 — Bonus patterns (rare, worth knowing)

| Pattern | Reference | Why it could fit | Doctrine risk |
|---|---|---|---|
| Conic-gradient sweep | [Resend pattern, Aceternity spotlight-new](https://ui.aceternity.com/components/spotlight-new) | Slow rotation behind mockup, suggests time passing. | None if monochrome. |
| Orbit paths around mockup | [Magic UI orbiting-circles](https://magicui.design/docs/components/orbiting-circles) | If you replace icons with tiny transcript cards, the orbit becomes a metaphor for "every meeting circles back to this". | Borderline gimmicky. Use small radius and 60s+ orbits. |
| Perlin noise blob | [Paper Design simplex noise](https://shaders.paper.design) | Organic, non-uniform glow. Premium feel. | 5 KB WebGL acceptable. |
| Magnetic cursor halo | [Aceternity glowing-effect](https://ui.aceternity.com/components/glowing-effect) | Cursor near hero produces a faint forest-green halo on the window edge. | Reserve for CTA, not hero — avoid double-glow. |
| Static mesh gradient | [Paper Design static mesh gradient](https://shaders.paper.design) | Just sits there. Premium without movement. | None. |
| God rays shader | [Paper Design god rays](https://shaders.paper.design) | Literal "shaft of light from above mockup" — implies a stage spotlight on the recorder. | 5 KB WebGL. |
| Dot-grid pulse | DIY CSS, ~10 lines | The existing dot-grid breathes faintly. Adds life without new tech. | None. |
| Headline-as-aurora | [DEV CSS aurora technique 3](https://dev.to/oobleck/css-aurora-effect-569n) | The headline `Record everything around you` projects a faint copy behind itself in accent green. | Subtle enough to clear doctrine. |
| Grain overlay | [React Bits grainient](https://reactbits.dev/backgrounds/grainient), [SVG feTurbulence pattern](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feTurbulence) | A 4% grain on top of aurora makes the gradient feel filmic, not synthetic. | None — ~1 KB. |

---

## Trade-off matrix

| Option | Effort | JS bundle (gz) | Visual fit for Corder | Doctrine risk |
|---|---|---|---|---|
| CSS aurora (Aceternity fork) | XS — 30 min | 0 KB | High | None |
| CSS spotlight cone | XS | 0 KB | Very high (under-mockup beam) | None |
| Paper Design `MeshGradient` | S | ~5 KB | High (premium tier) | None — monochrome array |
| React Bits Aurora (WebGL) | M | ~14 KB | Medium — generic | OK |
| Vanilla CSS ghost rails | S | 0 KB | Very high | None |
| Magic UI marquee + custom cards | S | ~0.5 KB | Very high | None |
| Magic UI animated-list | M | ~2 KB | Medium — event-log idiom | None |
| Motion-primitives text-loop | XS | ~1 KB | Medium — single rotating quote | None |
| Aceternity sparkles | S | ~3 KB | LOW (magic-AI vibe) | Stop-word conflict |
| Aceternity background-beams | M | ~6 KB | LOW (reads as internet pipes) | None but visually wrong |
| Aurora text on headline | XS | <1 KB | Medium | Default colors break doctrine — must override |
| Paper Design god rays shader | S | ~5 KB | Very high | None |
| Grainient overlay (SVG) | XS | ~1 KB | High (filmic) | None |

---

## Suggested combo for Corder

**Layer A — under-mockup beam (CSS only, primary).** A static `radial-gradient` ellipse + slow `background-position` drift on a 1200x700 box positioned `bottom: -10%` behind the live UI window, with `filter: blur(60px)` and `opacity: 0.55`. Forest-green tonal palette only (`#217a50`, `#0a5e34`, `#0e3d28` at 0.35 / 0.25 / 0.45 alpha). 0 KB JS. This is the "light from under the interface" the user asked for.

**Layer B — ghost transcript rails (CSS only, primary).** Two vertical marquee columns, 280 px wide, pinned to left and right of the hero (outside the central editorial column), each drifting at 48-56 s loop in opposite directions. 4-6 IBM Plex Mono 14 px cards each. Each card has a hairline border and 60% white background with `backdrop-filter: blur(4px)`. Mask the rails top and bottom with linear-gradient to transparent so fragments dissolve at the edges. 0 KB JS.

**Optional Layer C — premium tier (5 KB JS).** If after layers A and B the hero still feels not "масштабное эффектное", drop in `@paper-design/shaders-react` `MeshGradient` at 6-8% opacity sandwiched between Layer A and the dot-grid. Four-color array in forest-green tonal range. Disable on `prefers-reduced-motion`. Adds the "alive without being noisy" texture and clears 60 fps on M1+ macs (the audience runs Macs).

**What you do NOT add:** sparkles, beams (SVG paths reading as pipes), multi-color aurora, second accent. Every visual layer is monochrome forest-green or neutral. Every layer is reduced-motion-aware. Net JS added: 0 KB for the must-haves, ~5 KB optional. Total hero now feels like a stage spotlit on the recorder with the room's conversation drifting around it — the metaphor of the product, made literal.

---

## Sources

- [Aceternity Aurora Background](https://ui.aceternity.com/components/aurora-background)
- [Aceternity Background Beams](https://ui.aceternity.com/components/background-beams)
- [Aceternity Background Beams With Collision](https://ui.aceternity.com/components/background-beams-with-collision)
- [Aceternity Spotlight New](https://ui.aceternity.com/components/spotlight-new)
- [Aceternity Glowing Effect](https://ui.aceternity.com/components/glowing-effect)
- [Aceternity Text Generate Effect](https://ui.aceternity.com/components/text-generate-effect)
- [Aceternity Sparkles](https://ui.aceternity.com/components/sparkles)
- [Aceternity Modern Hero With Gradients](https://ui.aceternity.com/blocks/hero-sections/modern-hero-with-gradients)
- [Magic UI Animated List](https://magicui.design/docs/components/animated-list)
- [Magic UI Orbiting Circles](https://magicui.design/docs/components/orbiting-circles)
- [Magic UI Marquee](https://magicui.design/docs/components/marquee)
- [Magic UI Aurora Text](https://magicui.design/docs/components/aurora-text)
- [Magic UI Animated Shiny Text](https://magicui.design/docs/components/animated-shiny-text)
- [Magic UI Text Reveal](https://magicui.design/docs/components/text-reveal)
- [React Bits Aurora](https://www.reactbits.dev/backgrounds/aurora)
- [React Bits Soft Aurora](https://reactbits.dev/backgrounds/soft-aurora)
- [React Bits Grainient](https://reactbits.dev/backgrounds/grainient)
- [Motion-Primitives Text Effect](https://motion-primitives.com/docs/text-effect)
- [Motion-Primitives Text Loop](https://motion-primitives.com/docs/text-loop)
- [Motion-Primitives Text Scramble](https://motion-primitives.com/docs/text-scramble)
- [shadcn.io Aurora](https://www.shadcn.io/background/aurora)
- [Paper Design Shaders demo](https://shaders.paper.design)
- [@paper-design/shaders-react on npm](https://www.npmjs.com/package/@paper-design/shaders-react)
- [Paper Design Shaders GitHub](https://github.com/paper-design/shaders)
- [Charlie Gleason — Paper Design Shaders tutorial](https://code.charliegleason.com/paper-design-shaders)
- [Dalton Walsh — CSS Aurora Background Effect](https://daltonwalsh.com/blog/aurora-css-background-effect/)
- [DEV — CSS Aurora Effect by Spencer](https://dev.to/oobleck/css-aurora-effect-569n)
- [LunarLogic Auroral on GitHub](https://github.com/LunarLogic/auroral)
- [linear.app homepage](https://linear.app/homepage)
- [vercel.com](https://vercel.com)
- [lovable.dev](https://lovable.dev)
- [resend.com](https://resend.com)
- [granola.ai](https://www.granola.ai)
- [cursor.com](https://www.cursor.com)
- [Cluely on Lapa Ninja](https://www.lapa.ninja/post/cluely/)
- [Cluely on SaaSFrame](https://www.saasframe.io/examples/cluely-landing-page)
- [Awwwards hero section animations](https://www.awwwards.com/inspiration/hero-section-animations-mosey)
- [Medium — The rise of Linear style design, Arlene Xu](https://medium.com/design-bootcamp/the-rise-of-linear-style-design-origins-trends-and-techniques-4fd96aab7646)
- [react-fast-marquee on Bundlephobia](https://bundlephobia.com/package/react-fast-marquee)
- [Indie UI text animation](https://ui.indie-starter.dev/docs/text-animation)
