import Link from "next/link";
import type { Metadata } from "next";

import { BackToHomeBtn } from "@/components/ui/BackToHomeBtn";
import { copy } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/app/contact/page.tsx";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to the maker about Corder for your team, or send a bug report, feature request, or a hello.",
  alternates: { canonical: "/contact/" },
};

/**
 * /contact -- hub page modelled on granola.ai/contact, but wearing the
 * same shell as /install: heading at the top, content in the middle,
 * primary CTA (Back) pinned to the bottom via flex-grow. Cards switch
 * from the cream-surface treatment to the white + hairline-border
 * language used by .install-step-card so the visual family across
 * standalone pages stays one system.
 */
export default function ContactPage() {
  const { contact } = copy;

  return (
    <main
      data-component="ContactPage"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-text,color-text-muted,color-border,color-accent,radius-window,radius-pill,font-serif,font-sans"
      className="install-page"
    >
      <div className="page-container py-16 md:py-24">
        <div className="install-page__inner mx-auto max-w-[1080px]">
          <div className="standalone-page-header">
            <BackToHomeBtn />
            <h1 className="install-page__heading">{contact.title}</h1>
          </div>

          <p className="install-page__sub">
            {contact.fallback}
            <a
              className="contact-hub__fallback-link"
              href={`mailto:${contact.fallbackEmail}`}
            >
              {contact.fallbackEmail}
            </a>
            .
          </p>

          <div className="contact-hub__cards">
            {contact.cards.map((card) => (
              <ContactCard
                key={card.heading}
                icon={card.icon as "team" | "help"}
                heading={card.heading}
                linkLabel={card.linkLabel}
                linkHref={card.linkHref}
              />
            ))}
          </div>

        </div>
      </div>
    </main>
  );
}

function ContactCard({
  icon,
  heading,
  linkLabel,
  linkHref,
}: {
  icon: "team" | "help";
  heading: string;
  linkLabel: string;
  linkHref: string;
}) {
  const isExternal = linkHref.startsWith("mailto:") || linkHref.startsWith("http");
  return (
    <article className="contact-hub__card" data-source={DATA_SOURCE}>
      <div className="contact-hub__icon" aria-hidden>
        {icon === "team" ? <TeamIcon /> : <HelpIcon />}
      </div>
      <h2 className="contact-hub__card-heading">{heading}</h2>
      {isExternal ? (
        <a className="contact-hub__card-link" href={linkHref}>
          {linkLabel}
        </a>
      ) : (
        <Link className="contact-hub__card-link" href={linkHref}>
          {linkLabel}
        </Link>
      )}
    </article>
  );
}

function TeamIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="32"
      height="32"
      aria-hidden="true"
    >
      <circle cx="11" cy="12" r="4" />
      <circle cx="22" cy="13" r="3" />
      <path d="M4 26c.6-4 3.4-6 7-6s6.4 2 7 6" />
      <path d="M19 25c.4-2.6 2-4 4.5-4s4.1 1.4 4.5 4" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="32"
      height="32"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="12" />
      <path d="M12.5 12.5a3.5 3.5 0 1 1 5 3c-1 .5-1.5 1.2-1.5 2.5" />
      <circle cx="16" cy="22" r="0.6" fill="currentColor" />
    </svg>
  );
}
