"use client";

import { EyeOff, Lock, UserX } from "lucide-react";

import { copy } from "@/content/copy";

const DATA_SOURCE =
  "projects/corder-landing/src/components/sections/YoursPrivacy.tsx";

/**
 * Section — "Your meetings stay yours".
 *
 * Privacy as a stand-alone block, added 2026-05-22 ahead of paid ad
 * traffic. The headline angle ("no cloud lock-in, no telemetry, no
 * third-party bot") was already in the brief but split across hero
 * and FAQ. This section pulls it into one editorial beat positioned
 * between HowItWorks and Fit -- right where a skeptical reader who
 * just saw "Record from anywhere" asks "wait, who actually has my
 * audio?".
 *
 * Three cards: Local storage, No third-party bot, No telemetry. Icons
 * come from lucide-react (Lock, UserX, EyeOff) and inherit the page
 * accent via currentColor. Same hairline border + radius-window as
 * Privacy cards in template-design so the visual rhyme reads.
 */
export function YoursPrivacy() {
  const { yoursPrivacy } = copy;

  // Map the icon name from copy.json to the actual lucide component.
  // Keeping the mapping here means the content file stays declarative
  // and content editors don't import React components.
  const ICONS: Record<string, typeof Lock> = {
    lock: Lock,
    "user-x": UserX,
    "eye-off": EyeOff,
  };

  return (
    <section
      id="privacy"
      data-component="YoursPrivacy"
      data-source={DATA_SOURCE}
      data-tokens="color-text,color-text-muted,color-border,color-accent,radius-window,font-serif,font-sans"
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
            const Icon = ICONS[card.icon] ?? Lock;
            return (
              <article
                key={card.heading}
                className="yours-privacy-card"
                data-component="YoursPrivacyCard"
                data-source={DATA_SOURCE}
                data-tokens="color-bg,color-text,color-border,color-accent,radius-window,font-serif,font-sans"
              >
                <div className="yours-privacy-card__icon" aria-hidden>
                  <Icon size={22} strokeWidth={1.6} />
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
