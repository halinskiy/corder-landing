import Link from "next/link";
import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/ContactForm";
import { copy } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/app/contact/sales/page.tsx";

export const metadata: Metadata = {
  title: "Corder for teams",
  description:
    "Talk to the maker about deploying Corder across a team. Seats, tools, timeline.",
  alternates: { canonical: "/contact/sales/" },
};

/**
 * /contact/sales -- team / sales contact form.
 *
 * Same .install-page shell + 1080 px page width as /install, /contact,
 * /thanks. The form column is capped narrower (560 px) inside that
 * shell because text inputs read better at a comfortable width, not at
 * the full page span. Back-to-contact is a ghost cta-pill that sits to
 * the LEFT of the Send button at the bottom of the form (handed into
 * ContactForm via the secondaryAction prop).
 */
export default function SalesContactPage() {
  const { sales } = copy.contact;

  return (
    <main
      data-component="SalesContactPage"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-text,color-text-muted,color-border,color-accent,radius-window,radius-pill,font-serif,font-sans"
      className="install-page"
    >
      <div className="page-container py-16 md:py-24">
        <div className="install-page__inner mx-auto max-w-[1080px]">
            <h1 className="install-page__heading">{sales.title}</h1>
          <p className="install-page__sub install-page__sub--multi">
            {sales.subhead}
          </p>

          <div className="mx-auto w-full max-w-[560px]">
            <ContactForm
              copy={sales}
              secondaryAction={
                <Link
                  href="/contact/"
                  className="contact-form__back cta-pill cta-pill--ghost inline-flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] px-5 text-[15px] font-medium sm:w-auto sm:min-w-[160px]"
                  data-track-event="sales_back_to_contact_click"
                >
                  <ArrowLeft />
                  <span>Back to contact</span>
                </Link>
              }
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function ArrowLeft() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}
