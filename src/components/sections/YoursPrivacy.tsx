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
            <p
              className="section-eyebrow"
              data-component="YoursPrivacyEyebrow"
              data-source={DATA_SOURCE}
              data-tokens="eyebrow,color-accent,font-sans"
            >
              {yoursPrivacy.eyebrow}
            </p>
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
                <h3 className="yours-privacy-card__heading">{card.heading}</h3>
                <p className="yours-privacy-card__body">{card.body}</p>
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
        <radialGradient id="yp-grad-blob" cx="50%" cy="28%" r="80%">
          <stop offset="0%"  stopColor="#f0f8f3" />
          <stop offset="22%" stopColor="#bce0cc" />
          <stop offset="50%" stopColor="#6fb38c" />
          <stop offset="80%" stopColor="#2f8358" />
          <stop offset="100%" stopColor="#1f6843" />
        </radialGradient>
      </defs>
      {/*
       * Soft equilateral-ish triangle pointing up, all three corners
       * rounded with quadratic curves so the silhouette reads as a
       * friendly geometric mark, not a hard warning sign. Vertex math:
       *   apex          (32,  4)
       *   bottom-right  (58, 56)
       *   bottom-left   ( 6, 56)
       * Each vertex is replaced with a Q-curve that starts ~7 units
       * along the incoming edge and ends ~7 units along the outgoing
       * edge, with the sharp vertex as the control point. The result
       * is a triangle with ~7-unit corner radii inside a 64x64 viewBox.
       */}
      <path
        d="M 29 10
           Q 32 4, 35 10
           L 55 50
           Q 58 56, 51 56
           L 13 56
           Q 6 56, 9 50
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
        <radialGradient id="yp-grad-star" cx="34%" cy="28%" r="86%">
          <stop offset="0%"  stopColor="#f1edfb" />
          <stop offset="22%" stopColor="#cebcf0" />
          <stop offset="50%" stopColor="#9276d2" />
          <stop offset="80%" stopColor="#6948b4" />
          <stop offset="100%" stopColor="#4a2f8c" />
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
        <radialGradient id="yp-grad-diamond" cx="38%" cy="24%" r="86%">
          <stop offset="0%"  stopColor="#fcf4e0" />
          <stop offset="22%" stopColor="#f1d196" />
          <stop offset="50%" stopColor="#d6a44b" />
          <stop offset="80%" stopColor="#a87213" />
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
