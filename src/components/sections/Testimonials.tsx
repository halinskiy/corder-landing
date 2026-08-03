import { copy } from "@/content/copy";

const DATA_SOURCE =
  "projects/corder-landing/src/components/sections/Testimonials.tsx";

/**
 * Social proof -- real comments from the Product Hunt launch. Every card
 * links out to the Corder Product Hunt page so a visitor can read the
 * original thread. Deliberately NOT fabricated: the whole product is a
 * trust play, so only genuine, attributable quotes belong here.
 */
export function Testimonials() {
  const t = copy.testimonials;
  if (!t?.items?.length) return null;

  return (
    <section
      id="testimonials"
      data-component="Testimonials"
      data-source={DATA_SOURCE}
      className="relative w-full"
    >
      <div className="page-container py-8 md:py-[52px]">
        <div className="testimonials-head">
          <h2 className="section-heading">{t.heading}</h2>
          <p className="testimonials-head__sub">{t.subhead}</p>
        </div>

        <div className="testimonials-grid">
          {t.items.map((item, i) => (
            <a
              key={i}
              href={t.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="testimonial-card"
              data-track-event="testimonial_click"
            >
              <p className="testimonial-card__quote">{item.quote}</p>
              <span className="testimonial-card__meta">
                <span className="testimonial-card__name">{item.name}</span>
                <span className="testimonial-card__src">
                  {t.sourceLabel}
                  <ArrowUpRight />
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArrowUpRight() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}
