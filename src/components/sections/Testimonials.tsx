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
              // Quotes sent to Kostya in DMs carry the Telegram mark and do
              // NOT link out (there is no public thread to land on); Product
              // Hunt quotes keep linking to the PH page.
              const fromDm =
                "source" in item && (item as { source?: string }).source === "telegram";
              const body = (
                <>
                  <p className="testimonial-card__quote">{item.quote}</p>
                  <span className="testimonial-card__meta">
                    <span className="testimonial-card__person">
                      <span className="testimonial-card__name">{item.name}</span>
                      {"title" in item && item.title && (
                        <span className="testimonial-card__title">{item.title}</span>
                      )}
                    </span>
                    {fromDm ? <TelegramLogo /> : <ProductHuntLogo />}
                  </span>
                </>
              );
              if (fromDm) {
                return (
                  <div
                    key={i}
                    className="testimonial-card testimonial-card--static"
                    aria-hidden={dup || undefined}
                  >
                    {body}
                  </div>
                );
              }
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
                  {body}
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

// Telegram logomark (official: blue circle + white paper plane) for
// quotes that arrived as direct messages.
function TelegramLogo() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 240 240"
      aria-hidden
      className="testimonial-card__ph"
    >
      <circle cx="120" cy="120" r="120" fill="#229ED9" />
      <path
        fill="#fff"
        d="M53.6 118.9c34.5-15 57.5-25 69-29.8 32.9-13.7 39.7-16.1 44.2-16.2 1 0 3.2.2 4.6 1.4 1.2 1 1.5 2.3 1.7 3.3.2 1 .4 3.2.2 4.9-1.8 18.7-9.5 64.1-13.4 85-1.7 8.9-4.9 11.8-8.1 12.1-6.9.6-12.1-4.5-18.8-8.9-10.4-6.8-16.3-11.1-26.4-17.7-11.7-7.7-4.1-11.9 2.5-18.8 1.7-1.8 31.9-29.2 32.4-31.7.1-.3.2-1.5-.6-2.1s-1.8-.4-2.6-.2c-1.1.3-18.5 11.8-52.3 34.5-5 3.4-9.4 5.1-13.5 5-4.4-.1-13-2.5-19.3-4.6-7.8-2.5-14-3.9-13.4-8.2.3-2.2 3.4-4.5 9.3-6.9z"
      />
    </svg>
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
