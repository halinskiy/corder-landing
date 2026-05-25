"use client";

import { copy } from "@/content/copy";

const DATA_SOURCE =
  "projects/corder-landing/src/components/sections/YoursPrivacy.tsx";

/**
 * Section — "Your meetings stay yours".
 *
 * Three trust cards. Each carries a distinctively-shaped coloured shape
 * (organic blob, star, diamond). The shapes give the section visual
 * rhythm in motion:
 *   card 1  organic asymmetric blob   forest accent green #217a50
 *   card 2  five-point star           speaker purple      #5a3aa6
 *   card 3  rounded diamond           speaker amber       #a16207
 *
 * Each shape rotates / pulses on its own keyframe so none of the three
 * moves the same way at the same time. PauseOffscreen halts all three
 * when the section leaves the viewport.
 *
 * Gradient construction (all three shapes): a 5-stop radial gradient with
 * a pastel pinpoint highlight in the upper-left and a deep saturated core
 * at ~85%, then a softer fade-out at 100%. Five stops give the colour
 * interpolation enough head-room that the eye never sees a hard band --
 * this was the "rough/harsh" issue with the earlier 2-stop version.
 */
export function YoursPrivacy() {
  const { yoursPrivacy } = copy;

  const SHAPE_FOR: Record<string, React.ComponentType> = {
    lock: BlobShape,
    "user-x": StarShape,
    "eye-off": DiamondShape,
  };

  return (
    <section
      id="privacy"
      data-component="YoursPrivacy"
      data-source={DATA_SOURCE}
      data-tokens="color-text,color-text-muted,color-border,color-accent,radius-window,font-serif,font-sans"
      data-pauseable
      className="relative w-full"
    >
      <div className="page-container py-10 md:py-[64px]">
        {/* Header */}
        <div className="grid grid-cols-1 gap-x-10 lg:grid-cols-12">
          <div className="lg:col-span-9">
            {/* Eyebrow removed per user request 2026-05-25 -- the
                heading "Your meetings stay yours" speaks for itself. */}
            <h2
              className="section-heading"
              data-component="YoursPrivacyHeading"
              data-source={DATA_SOURCE}
              data-tokens="display-md,font-serif,lh-display,ls-display,color-text"
            >
              {yoursPrivacy.heading}
            </h2>
            <p
              className="section-subhead"
              data-component="YoursPrivacySubhead"
              data-source={DATA_SOURCE}
              data-tokens="body-lg,lh-body,color-text-muted,font-sans"
            >
              {yoursPrivacy.subhead}
            </p>
          </div>
        </div>

        {/* Three cards */}
        <div className="yours-privacy-grid mt-10 md:mt-14">
          {yoursPrivacy.cards.map((card) => {
            const Shape = SHAPE_FOR[card.icon] ?? BlobShape;
            return (
              <article
                key={card.heading}
                className="yours-privacy-card"
                data-component="YoursPrivacyCard"
                data-source={DATA_SOURCE}
                data-tokens="color-bg,color-text,color-border,color-accent,radius-window,font-serif,font-sans"
              >
                <div className="yours-privacy-blob-wrap" aria-hidden>
                  <Shape />
                </div>
                {/* Text wrap so the mobile flex-row layout can keep
                 *  heading + body stacked as one column on the right
                 *  of the shape. Desktop layout (text below shape) is
                 *  unaffected -- the wrap is a transparent passthrough
                 *  there. */}
                <div className="yours-privacy-card__text">
                  <h3 className="yours-privacy-card__heading">
                    {card.heading}
                  </h3>
                  <p className="yours-privacy-card__body">{card.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------
 *  Three shape components -- each is its own SVG so the geometries can
 *  diverge sharply. Radial-gradient fills give each shape a "ball"
 *  highlight at the top-left, deeper colour at the centre, matching
 *  the existing visual language.
 * -------------------------------------------------------------------- */

function BlobShape() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="yp-shape yp-shape--blob"
      data-component="YoursPrivacyTriangle"
    >
      <defs>
        {/* 5-stop radial: pastel highlight near the top apex, mint mid,
         *  deep forest core, soft outer fade. Highlight cx/cy chosen so
         *  the "lit-from-above" pinpoint sits just under the top point. */}
        {/* Soft 3-stop radial. Removed the near-white #f0f8f3 stop --
         *  it produced a hot specular highlight the user disliked.
         *  Now the brightest point is a light-mint tone of the same
         *  green family, so "lit from above" reads as a gentle wash. */}
        <radialGradient id="yp-grad-blob" cx="42%" cy="34%" r="78%">
          <stop offset="0%"  stopColor="#a8d4be" />
          <stop offset="55%" stopColor="#5fa580" />
          <stop offset="100%" stopColor="#286c46" />
        </radialGradient>
      </defs>
      {/*
       * Soft equilateral-ish triangle pointing up, all three corners
       * rounded with quadratic curves so the silhouette reads as a
       * friendly geometric mark, not a hard warning sign. Path is
       * scaled to 85% of the 64x64 viewBox so the triangle reads a
       * touch smaller than the star and the diamond neighbours --
       * those silhouettes naturally fill more of their bounding box,
       * an un-scaled triangle was looking visually larger.
       * Vertex math (post-scale, centred at (32,32)):
       *   apex          (32,  8)
       *   bottom-right  (54, 52)
       *   bottom-left   (10, 52)
       * Corner radius ~6 inside the 64x64 viewBox.
       */}
      <path
        d="M 29 13
           Q 32 8, 35 13
           L 51 47
           Q 54 52, 48 52
           L 16 52
           Q 10 52, 13 47
           Z"
        fill="url(#yp-grad-blob)"
      />
    </svg>
  );
}

function StarShape() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="yp-shape yp-shape--star"
      data-component="YoursPrivacyStar"
    >
      <defs>
        {/* Soft 3-stop radial -- same softening as the triangle. */}
        <radialGradient id="yp-grad-star" cx="38%" cy="32%" r="80%">
          <stop offset="0%"  stopColor="#bda8e0" />
          <stop offset="55%" stopColor="#8266c4" />
          <stop offset="100%" stopColor="#4f3691" />
        </radialGradient>
      </defs>
      {/* Five-point star, slightly rounded line-join so it doesn't read
       *  as a sheriff's badge. Computed: outer radius 28, inner radius
       *  11, centred at (32, 32). */}
      <path
        d="M32 4 L37.8 23.2 L57.6 23.2 L41.6 35.2 L47.4 54.4 L32 42.8 L16.6 54.4 L22.4 35.2 L6.4 23.2 L26.2 23.2 Z"
        fill="url(#yp-grad-star)"
        strokeLinejoin="round"
        stroke="url(#yp-grad-star)"
        strokeWidth="2"
      />
    </svg>
  );
}

function DiamondShape() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="yp-shape yp-shape--diamond"
      data-component="YoursPrivacyDiamond"
    >
      <defs>
        {/* Soft 3-stop radial -- same softening as the triangle. */}
        <radialGradient id="yp-grad-diamond" cx="40%" cy="32%" r="80%">
          <stop offset="0%"  stopColor="#dfb777" />
          <stop offset="55%" stopColor="#c08735" />
          <stop offset="100%" stopColor="#7c5208" />
        </radialGradient>
      </defs>
      {/* Rounded diamond -- 45-degree-rotated square with a chunky
       *  corner radius so it reads as a soft rhombus, not a hard
       *  geometry sticker. */}
      <rect
        x="14"
        y="14"
        width="36"
        height="36"
        rx="8"
        transform="rotate(45 32 32)"
        fill="url(#yp-grad-diamond)"
      />
    </svg>
  );
}
