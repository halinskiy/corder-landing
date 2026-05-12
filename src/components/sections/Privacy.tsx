"use client";

import { copy } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/Privacy.tsx";

/**
 * Section 3 — Privacy / Trust.
 *
 * Two-card layout, asymmetric anchor: heading + subhead anchored left,
 * cards full-width below. No icons. Spec lists use Plex Mono for keys
 * and Plex Sans for values, hairline rows.
 *
 * Card 1 (Default) carries the forest-green accent tag — it represents the
 * cloud transcription path. Card 2 (Local) is neutral.
 */
export function Privacy() {
  const { privacy } = copy;

  return (
    <section
      id="privacy"
      data-component="Privacy"
      data-source={DATA_SOURCE}
      data-tokens="color-text,color-text-muted,color-border,color-accent,radius-window,font-serif"
      className="relative w-full"
    >
      <div className="page-container py-14 md:py-[88px]">
        <div className="grid grid-cols-1 gap-x-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2
              className="section-heading"
              data-component="PrivacyHeading"
              data-source={DATA_SOURCE}
              data-tokens="display-md,font-serif,lh-display,ls-display,color-text"
            >
              {privacy.heading}
            </h2>
            <p
              className="section-subhead"
              data-component="PrivacySubhead"
              data-source={DATA_SOURCE}
              data-tokens="body-lg,lh-body,color-text-muted,font-sans"
            >
              {privacy.subhead}
            </p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 md:gap-8">
          {privacy.cards.map((card, idx) => (
            <PrivacyCard key={card.tag} card={card} variant={idx === 0 ? "default" : "local"} />
          ))}
        </div>
      </div>
    </section>
  );
}

type PrivacyCardData = (typeof copy)["privacy"]["cards"][number];

function PrivacyCard({
  card,
  variant,
}: {
  card: PrivacyCardData;
  variant: "default" | "local";
}) {
  return (
    <article
      className={`privacy-card privacy-card--${variant}`}
      data-component="PrivacyCard"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-border,radius-window,font-serif,font-mono,font-sans"
    >
      <h3 className="privacy-card__heading">{card.heading}</h3>
      <p className="privacy-card__body">{card.body}</p>

      <dl className="privacy-card__spec">
        {card.specList.map((row) => {
          const isMono = isMonoValue(row.value);
          return (
            <div key={row.key} className="privacy-card__spec-row">
              <dt className="privacy-card__spec-key">{row.key}</dt>
              <dd
                className={
                  isMono
                    ? "privacy-card__spec-value privacy-card__spec-value--mono"
                    : "privacy-card__spec-value"
                }
              >
                {row.value}
              </dd>
            </div>
          );
        })}
      </dl>
    </article>
  );
}

/**
 * A spec value is rendered in monospace when it looks like a path,
 * a hostname, or a file extension. Heuristic, not a content-flag.
 */
function isMonoValue(value: string): boolean {
  if (value.startsWith("~/")) return true;
  if (value.startsWith("/")) return true;
  if (/^[a-z0-9.-]+\.(com|org|net|io|googleapis\.com)/i.test(value)) return true;
  if (value.startsWith("HTTPS to ")) return true;
  if (/\.(m4a|mp3|wav|txt|json|js)$/i.test(value)) return true;
  return false;
}
