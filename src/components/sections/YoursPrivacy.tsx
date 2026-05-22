"use client";

import { copy } from "@/content/copy";

const DATA_SOURCE =
  "projects/corder-landing/src/components/sections/YoursPrivacy.tsx";

/**
 * Section — "Your meetings stay yours".
 *
 * Three trust cards. Each carries a distinctively-shaped coloured shape
 * (blob, star, diamond) rather than three near-identical rounded
 * squircles. The shapes give the section visual rhythm in motion:
 *   card 1  organic blob   forest accent green #217a50
 *   card 2  five-point star speaker purple    #5a3aa6
 *   card 3  rounded diamond speaker amber     #a16207
 *
 * Each shape rotates / pulses on its own keyframe so none of the three
 * moves the same way at the same time. PauseOffscreen halts all three
 * when the section leaves the viewport.
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
      data-component="YoursPrivacyBlob"
    >
      <defs>
        <radialGradient id="yp-grad-blob" cx="30%" cy="25%" r="80%">
          <stop offset="0%" stopColor="#7bc49f" />
          <stop offset="75%" stopColor="#217a50" />
        </radialGradient>
      </defs>
      {/* Asymmetric organic splat -- deliberately not a circle. */}
      <path
        d="M40 4 C54 6 60 18 58 32 C56 48 42 60 28 58 C12 56 2 44 4 28 C6 12 24 2 40 4 Z"
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
        <radialGradient id="yp-grad-star" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#a082dc" />
          <stop offset="75%" stopColor="#5a3aa6" />
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
        <radialGradient id="yp-grad-diamond" cx="40%" cy="25%" r="80%">
          <stop offset="0%" stopColor="#dcaa5f" />
          <stop offset="75%" stopColor="#a16207" />
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
