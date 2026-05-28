"use client";

import { copy } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/Footer.tsx";

type SocialIcon = "x" | "github" | "mail";

/**
 * Section 9 — Footer.
 *
 * Editorial closing pattern. Brand wordmark + slogan + social row on
 * the left, Product / Support / Legal columns to the right. Hairline
 * above baseline carries the copyright. The hairline is split out of
 * the baseline row so we can shorten it at md+ and stop it before the
 * floating CorderPresenceForm card (right:32px, width:380px) — the
 * earlier full-width border crossed under the card and read as broken.
 *
 * The baseline copy also carries `id="site-footer-bottom"` so the Nav
 * "Contact Us" link and the footer's own Support column scroll the
 * page to the very bottom (per maker 2026-05-26: "Contact Us должен
 * просто к футеру якорить в самый низ страницы").
 */
export function Footer() {
  const { footer } = copy;
  const socials = (footer as typeof footer & { socials?: Array<{ label: string; href: string; icon: SocialIcon }> }).socials ?? [];

  return (
    <footer
      data-component="Footer"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-text,color-text-muted,color-border,font-serif,font-sans"
      className="site-footer relative overflow-hidden"
    >
      <div className="page-container">
        <div className="site-footer__grid">
          <div className="site-footer__brand-col">
            <div className="site-footer__brand-block">
              <FooterMark />
              <span className="site-footer__brand-name">{footer.brandMark}</span>
            </div>
            {/* Slogan with the word "Record" tinted REC red to echo the
              * hero headline treatment. The split is regex-safe and stays
              * silent if the word isn't present, so the copy stays driven
              * by copy.json. */}
            <p className="site-footer__slogan">
              {renderSloganWithRec(footer.slogan)}
            </p>
            {socials.length > 0 && (
              <ul className="site-footer__socials" aria-label="Corder on social">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      className="site-footer__social"
                      href={s.href}
                      aria-label={s.label}
                      target={s.href.startsWith("http") ? "_blank" : undefined}
                      // `rel="me"` declares the linked profile as part of
                      // the same brand entity. Cheap brand-graph signal
                      // for Google + Mastodon-style identity verification.
                      rel={s.href.startsWith("http") ? "me noopener noreferrer" : undefined}
                    >
                      <SocialIcon name={s.icon as SocialIcon} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {footer.columns
            .filter((column) => column.heading !== "Resources")
            .map((column) => (
              <div key={column.heading}>
                <p className="site-footer__col-heading">{column.heading}</p>
                <ul className="site-footer__list">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a className="site-footer__link" href={link.href}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>

        {/* Divider is its own element so it can be shortened at md+
            to stop before the floating newsletter card on the right.
            Was previously `border-top` on .site-footer__baseline, which
            ran the full footer width and crossed under the card. */}
        <div className="site-footer__divider" aria-hidden="true" />

        <div
          id="site-footer-bottom"
          className="site-footer__baseline"
        >
          <span className="site-footer__copy">
            © 2026 Corder. Powered by{" "}
            <a
              className="site-footer__studio"
              href="https://halinskiy.github.io/3mpq-studio/"
              target="_blank"
              rel="noopener noreferrer"
            >
              3mpq Studio
            </a>
            {" "}
            <span aria-hidden="true" className="site-footer__heart">❤️</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

/* Renders the slogan with the word "Record" (case-insensitive, whole-word)
 * coloured REC red — same `var(--rec)` used by the hero "Record" rec pill.
 * If the word isn't present, returns the string unchanged so we don't
 * silently break a future copy revision that drops the word. */
function renderSloganWithRec(slogan: string) {
  const parts = slogan.split(/(\bRecord\b)/);
  if (parts.length === 1) return slogan;
  return parts.map((part, i) =>
    /^Record$/i.test(part) ? (
      <span key={i} className="site-footer__slogan-rec">
        {part}
      </span>
    ) : (
      part
    )
  );
}

function FooterMark() {
  // 3D Tahoe-style brand mark. Displayed at 40 px; the 128 source
  // covers ~3x retina. Drop shadow is baked into the PNG's alpha.
  return (
    <img
      src="/brand-mark-128.png"
      width={40}
      height={40}
      alt=""
      aria-hidden="true"
      decoding="async"
      style={{ display: "block" }}
    />
  );
}

/* Monochrome 18px social icons inlined so there's no extra dep. They
   inherit currentColor and recolour on hover via the parent anchor. */
function SocialIcon({ name }: { name: SocialIcon }) {
  if (name === "x") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817-5.97 6.817H1.673l7.73-8.835L1.254 2.25h6.823l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  if (name === "github") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.16-.02-2.1-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.73.8 1.18 1.82 1.18 3.08 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.55C20.21 21.38 23.5 17.08 23.5 12 23.5 5.73 18.27.5 12 .5z" />
      </svg>
    );
  }
  // mail
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
