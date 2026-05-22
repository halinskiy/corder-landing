"use client";

import { copy } from "@/content/copy";

const DATA_SOURCE =
  "projects/corder-landing/src/components/sections/YoursPrivacy.tsx";

/**
 * Section — "Your meetings stay yours".
 *
 * Three trust cards. Earlier each card carried a lucide icon (Lock /
 * UserX / EyeOff); user 2026-05-22 asked for "three different coloured
 * blobs of different shapes moving" instead -- the section should feel
 * alive rather than icon-grid.
 *
 * Colours pulled from the existing palette so the rest of the design
 * system stays consistent:
 *   - card 1  forest accent green  #217a50  (project accent)
 *   - card 2  speaker purple       #5a3aa6  (used inside hero transcript)
 *   - card 3  speaker amber        #a16207  (used inside hero transcript)
 *
 * Each blob is a single SVG circle with `border-radius` driven by CSS
 * keyframes for the morph, and a slight `transform: translate` so the
 * shape drifts. Three different keyframe sets give each blob its own
 * personality. Animation is pause-able via PauseOffscreen.
 */
export function YoursPrivacy() {
  const { yoursPrivacy } = copy;

  // Map the icon slug from copy.json onto a blob colour class. Content
  // stays declarative; future copy edits don't need to touch React code.
  const BLOB_VARIANT: Record<string, string> = {
    lock: "yours-privacy-blob--green",
    "user-x": "yours-privacy-blob--purple",
    "eye-off": "yours-privacy-blob--amber",
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
            const variant = BLOB_VARIANT[card.icon] ?? "yours-privacy-blob--green";
            return (
              <article
                key={card.heading}
                className="yours-privacy-card"
                data-component="YoursPrivacyCard"
                data-source={DATA_SOURCE}
                data-tokens="color-bg,color-text,color-border,color-accent,radius-window,font-serif,font-sans"
              >
                <div
                  className={`yours-privacy-blob ${variant}`}
                  aria-hidden
                />
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
