import { Suspense } from "react";
import type { Metadata } from "next";

import { CheckoutClient } from "@/components/checkout/CheckoutClient";

const DATA_SOURCE = "projects/corder-landing/src/app/checkout/page.tsx";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your Corder subscription. Payment handled by Paddle as merchant of record.",
  alternates: { canonical: "/checkout/" },
  // The checkout shell carries the user mid-purchase; search engines
  // have nothing useful to index here and the query-string variants
  // would inflate the crawl with near-duplicates.
  robots: { index: false, follow: false },
};

/**
 * /checkout -- inline Paddle embed inside our shell.
 *
 * URL accepts ?tier= + ?billing= query strings (see CheckoutClient
 * for the full contract). Wrapping the client component in Suspense
 * lets Next.js static-export prerender the shell while the
 * useSearchParams hook waits for the client to hydrate.
 */
export default function CheckoutPage() {
  return (
    <main
      data-component="CheckoutPage"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-text,color-text-muted,color-border,color-accent,font-serif,font-sans"
      className="install-page checkout-page"
    >
      <div className="page-container py-16 md:py-24">
        <div className="install-page__inner mx-auto max-w-[1080px]">
          <h1 className="install-page__heading">Complete your purchase.</h1>
          <p className="install-page__sub">
            Secure card and PayPal payments via Paddle, our merchant of record.
          </p>

          <Suspense fallback={<CheckoutFallback />}>
            <CheckoutClient />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

function CheckoutFallback() {
  return (
    <div className="checkout-page__fallback" aria-live="polite">
      Loading your plan
    </div>
  );
}
