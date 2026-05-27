import Link from "next/link";
import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/ContactForm";
import { copy } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/app/contact/sales/page.tsx";

export const metadata: Metadata = {
  title: "Corder for teams | Contact",
  description:
    "Talk to the maker about deploying Corder across a team. Seats, tools, timeline.",
};

/**
 * /contact/sales -- team / sales contact form.
 *
 * Routed from the /contact hub's left card. Form opens the user's
 * default mail client via mailto: -- no backend hop. Honest UX: the
 * submit verb means "open your mail app" not "post to a fake API".
 */
export default function SalesContactPage() {
  const { sales } = copy.contact;

  return (
    <main
      data-component="SalesContactPage"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-text,color-text-muted,color-border,color-accent,radius-window,radius-pill,font-serif,font-sans"
      className="legal-page"
    >
      <div className="page-container py-16 md:py-24">
        <div className="mx-auto max-w-[600px]">
          <Link href="/contact/" className="contact-page__back-link">
            ← Back to contact
          </Link>

          <h1 className="contact-page__heading">{sales.title}</h1>
          <p className="contact-page__sub">{sales.subhead}</p>

          <ContactForm copy={sales} />
        </div>
      </div>
    </main>
  );
}
