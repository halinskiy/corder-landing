import { copy } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/Fit.tsx";

/**
 * Section — Is Corder for you?
 *
 * Reuses the Privacy two-card visual language: serif heading, body, then a
 * hairline-row list of qualifying lines. Each row carries a small leading
 * glyph: a filled accent check for the "yes" card, a neutral minus for the
 * "no" card. Same frame, same spacing, same hairline rows.
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
            glyph="check"
            heading={fit.yes.heading}
            items={fit.yes.items}
          />
          <FitCard
            variant="local"
            glyph="minus"
            heading={fit.no.heading}
            items={fit.no.items}
          />
        </div>
      </div>
    </section>
  );
}

function FitCard({
  variant,
  glyph,
  heading,
  items,
}: {
  variant: "default" | "local";
  glyph: "check" | "minus";
  heading: string;
  items: readonly string[];
}) {
  return (
    <article
      className={`privacy-card privacy-card--${variant}`}
      data-component="FitCard"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-border,radius-window,font-serif,font-sans"
    >
      <h3 className="privacy-card__heading privacy-card__heading--top">{heading}</h3>

      <ul className="privacy-card__spec privacy-card__spec--single">
        {items.map((item) => (
          <li key={item} className="privacy-card__spec-row privacy-card__spec-row--single">
            <span
              className={`fit-glyph fit-glyph--${glyph}`}
              aria-hidden="true"
            >
              {glyph === "check" ? <CheckIcon /> : <MinusIcon />}
            </span>
            <span className="privacy-card__spec-value">{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8.5l3.2 3.2L13 5" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M3.5 8h9" />
    </svg>
  );
}
