import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "How Corder handles refunds. 14-day no-questions-asked window on both monthly and annual Pro subscriptions.",
  alternates: { canonical: "/refunds/" },
};

const DATA_SOURCE = "projects/corder-landing/src/app/refunds/page.tsx";

/**
 * Refund Policy.
 *
 * Required by Paddle for KYB verification as a distinct URL -- cannot be
 * folded into Terms. Same `.legal-page` shell as /terms/ and
 * /privacy-policy/ so the three legal pages share width, typography,
 * and back-to-home affordance.
 */
export default function RefundsPage() {
  return (
    <main
      data-component="RefundsPage"
      data-source={DATA_SOURCE}
      className="legal-page"
    >
      <div className="page-container py-16 md:py-24">
        <div className="mx-auto max-w-[1080px]">
            <h1 className="install-page__heading">Refund Policy</h1>
          <p className="install-page__sub">Last updated: 22 May 2026.</p>

          <div className="legal-body">
            <p>
              We want you to be happy with Corder. If you are not, we will
              refund you.
            </p>

            <h2>14-day no-questions-asked refund</h2>
            <p>
              For both monthly and annual Pro subscriptions, you can
              request a full refund within <strong>14 days</strong> of your
              purchase. We will not ask you why, and we will not try to
              talk you out of it.
            </p>

            <h2>How to request a refund</h2>
            <p>
              Email us at{" "}
              <a href="mailto:hello@getcorder.com">
                <strong>hello@getcorder.com</strong>
              </a>{" "}
              from the address you used at purchase and ask for a refund.
              We approve it and Paddle, our merchant of record, returns the
              money to your original card. We respond within one business
              day.
            </p>

            <h2>Processing time</h2>
            <p>
              Once approved, refunds are issued by Paddle (our merchant of
              record) and typically appear on your statement within{" "}
              <strong>5-10 business days</strong>, depending on your bank
              or card issuer. The refund is returned to the original
              payment method in the original currency charged.
            </p>

            <h2>After 14 days</h2>
            <p>
              After the 14-day window, monthly subscriptions can be
              cancelled at any time from your customer portal. You keep
              Pro access until the end of the current billing period and
              are not billed again.
            </p>
            <p>
              Annual subscriptions purchased more than 14 days ago are
              non-refundable for the remainder of the term, but
              cancellation prevents the next year&apos;s renewal.
            </p>

            <h2>Free tier</h2>
            <p>
              The free tier costs nothing, so there is nothing to refund.
              You can stop using it at any time without contacting us.
            </p>

            <h2>Questions</h2>
            <p>
              For anything not covered here, email{" "}
              <a href="mailto:hello@getcorder.com">
                <strong>hello@getcorder.com</strong>
              </a>
              . We read every message.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
