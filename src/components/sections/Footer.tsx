"use client";

import { copy } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/Footer.tsx";

/**
 * Section 9 — Footer.
 *
 * Editorial closing pattern. Oversized brand wordmark on the left,
 * Product / Resources columns to the right. Hairline above baseline,
 * baseline carries © + back-to-top.
 *
 * Bespoke (not the kit's FooterEditorial) because the layout is
 * different — three rigid columns at md+, big serif brand, no built-with
 * row, custom back-to-top placement. The kit version is reserved for
 * the studio's editorial closing pattern; this one is product-marketing.
 */
export function Footer() {
  const { footer } = copy;

  return (
    <footer
      data-component="Footer"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-text,color-text-muted,color-border,font-serif,font-sans"
      className="site-footer"
    >
      <div className="page-container">
        <div className="site-footer__grid">
          <div className="site-footer__brand-col">
            <div className="site-footer__brand-block">
              <FooterMark />
              <span className="site-footer__brand-name">{footer.brandMark}</span>
            </div>
            <p className="site-footer__slogan">{footer.slogan}</p>
            <p className="site-footer__made-in">{footer.madeIn}</p>
          </div>

          {footer.columns.map((column) => (
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

        <div className="site-footer__baseline">
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
            .
          </span>
          <a className="site-footer__top" href="#top">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterMark() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 1024 1024"
      aria-hidden="true"
      role="img"
      style={{
        filter:
          "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.06)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.05))",
      }}
    >
      <rect
        x="0"
        y="0"
        width="1024"
        height="1024"
        rx="232"
        fill="#ffffff"
        stroke="rgba(0, 0, 0, 0.06)"
        strokeWidth="1"
      />
      <rect x="312" y="212" width="160" height="600" rx="44" fill="#0a0a0a" />
      <rect x="552" y="212" width="160" height="600" rx="44" fill="#0a0a0a" />
    </svg>
  );
}
