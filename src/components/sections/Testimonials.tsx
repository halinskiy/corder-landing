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

        {/* Infinite marquee: the item set is rendered twice so the track can
            loop seamlessly (translate -50%). Pauses on hover and off-screen. */}
        <div className="testimonials-marquee" data-pauseable>
          <div className="testimonials-track">
            {[...t.items, ...t.items].map((item, i) => {
              const dup = i >= t.items.length;
              return (
                <a
                  key={i}
                  href={t.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="testimonial-card"
                  data-track-event="testimonial_click"
                  aria-hidden={dup || undefined}
                  tabIndex={dup ? -1 : undefined}
                  aria-label={dup ? undefined : `${item.name} ${t.sourceLabel}`}
                >
                  <p className="testimonial-card__quote">{item.quote}</p>
                  <span className="testimonial-card__meta">
                    <span className="testimonial-card__person">
                      <span className="testimonial-card__name">{item.name}</span>
                      {"title" in item && item.title && (
                        <span className="testimonial-card__title">{item.title}</span>
                      )}
                    </span>
                    <ProductHuntLogo />
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        {t.ctaLabel && (
          <div className="testimonials-cta">
            <a
              href={t.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-pill cta-pill--ghost inline-flex h-12 items-center justify-center rounded-[var(--radius-pill)] px-7 text-[16px] font-medium"
              data-track-event="testimonial_feedback_click"
            >
              {t.ctaLabel}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

// Product Hunt logomark (official: orange circle + white "P").
function ProductHuntLogo() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 240 240"
      aria-hidden
      className="testimonial-card__ph"
    >
      <path
        fill="#DA552F"
        d="M240 120c0 66.3-53.7 120-120 120S0 186.3 0 120 53.7 0 120 0s120 53.7 120 120"
      />
      <path
        fill="#fff"
        d="M136 120h-34v-36h34c9.94 0 18 8.06 18 18s-8.06 18-18 18m0-60h-58v120h24v-36h34c26.51 0 48-21.49 48-48s-21.49-48-48-48"
      />
    </svg>
  );
}
