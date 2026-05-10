import { copy } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/Fit.tsx";

/**
 * Section — Is Corder for you?
 *
 * Reuses the Privacy two-card visual language: tag, serif heading, body, then
 * a hairline-row list of qualifying lines. Card 1 (yes) carries the accent
 * tag, card 2 (no) is neutral. Same frame, same spacing, same hairline rows.
 */
export function Fit() {
  const { fit } = copy;

  return (
    <section
      id="fit"
      data-component="Fit"
      data-source={DATA_SOURCE}
      data-tokens="color-text,color-text-muted,color-border,color-accent,radius-window,font-serif"
      className="relative w-full"
    >
      <div className="page-container py-24 md:py-32">
        <div className="grid grid-cols-1 gap-x-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2
              className="section-heading"
              data-component="FitHeading"
              data-source={DATA_SOURCE}
              data-tokens="display-md,font-serif,lh-display,ls-display,color-text"
            >
              {fit.heading}
            </h2>
            <p
              className="section-subhead"
              data-component="FitSubhead"
              data-source={DATA_SOURCE}
              data-tokens="body-lg,lh-body,color-text-muted,font-sans"
            >
              {fit.subhead}
            </p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 md:gap-8">
          <FitCard
            variant="default"
            tag={fit.yes.tag}
            heading={fit.yes.heading}
            body={fit.yes.body}
            items={fit.yes.items}
          />
          <FitCard
            variant="local"
            tag={fit.no.tag}
            heading={fit.no.heading}
            body={fit.no.body}
            items={fit.no.items}
          />
        </div>
      </div>
    </section>
  );
}

function FitCard({
  variant,
  tag,
  heading,
  body,
  items,
}: {
  variant: "default" | "local";
  tag: string;
  heading: string;
  body: string;
  items: readonly string[];
}) {
  return (
    <article
      className={`privacy-card privacy-card--${variant}`}
      data-component="FitCard"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-border,radius-window,font-serif,font-sans"
    >
      <span className="privacy-card__tag">{tag}</span>
      <h3 className="privacy-card__heading">{heading}</h3>
      <p className="privacy-card__body">{body}</p>

      <ul className="privacy-card__spec privacy-card__spec--single">
        {items.map((item) => (
          <li key={item} className="privacy-card__spec-row privacy-card__spec-row--single">
            <span className="privacy-card__spec-value">{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
