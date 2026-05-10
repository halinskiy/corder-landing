import { copy } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/Fit.tsx";

/**
 * Section — Is Corder for you?
 *
 * Right-fit / wrong-fit dual card. Plain language, no jargon. Helps
 * cold-traffic skeptics self-select before reading pricing.
 */
export function Fit() {
  const { fit } = copy;

  return (
    <section
      id="fit"
      data-component="Fit"
      data-source={DATA_SOURCE}
      data-tokens="color-text,color-text-muted,color-border,color-accent,color-danger,radius-window,font-serif"
      className="relative w-full"
    >
      <div className="page-container py-24 md:py-32">
        <div className="grid grid-cols-1 gap-x-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2
              className="section-heading"
              data-component="FitHeading"
              data-source={DATA_SOURCE}
            >
              {fit.heading}
            </h2>
            <p
              className="section-subhead"
              data-component="FitSubhead"
              data-source={DATA_SOURCE}
            >
              {fit.subhead}
            </p>
          </div>
        </div>

        <div className="fit-grid">
          <FitCard tone="yes" heading={fit.yes.heading} items={fit.yes.items} />
          <FitCard tone="no" heading={fit.no.heading} items={fit.no.items} />
        </div>
      </div>
    </section>
  );
}

function FitCard({
  tone,
  heading,
  items,
}: {
  tone: "yes" | "no";
  heading: string;
  items: readonly string[];
}) {
  return (
    <article
      className={`fit-card fit-card--${tone}`}
      data-component="FitCard"
      data-source={DATA_SOURCE}
      data-tone={tone}
    >
      <h3 className="fit-card__heading">{heading}</h3>
      <ul className="fit-card__list">
        {items.map((item) => (
          <li key={item} className="fit-card__item">
            <span className="fit-card__icon" aria-hidden="true">
              {tone === "yes" ? <CheckGlyph /> : <CrossGlyph />}
            </span>
            <span className="fit-card__text">{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function CheckGlyph() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="10" />
      <path d="m7 11 3 3 5-6" />
    </svg>
  );
}

function CrossGlyph() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="10" />
      <path d="m8 8 6 6" />
      <path d="m14 8-6 6" />
    </svg>
  );
}
