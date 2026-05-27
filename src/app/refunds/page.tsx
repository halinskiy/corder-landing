import Link from "next/link";

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
        <div className="mx-auto max-w-[720px]">
          <p className="section-eyebrow">Legal</p>
          <h1 className="section-heading">Refund Policy</h1>
          <p className="section-subhead">Last updated: 22 May 2026.</p>

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
            <p>Two options, either works:</p>
            <ol>
              <li>
                <strong>Self-serve via Paddle.</strong> Open the receipt
                email from <code>noreply@paddle.com</code> you received at
                purchase, click the "Manage subscription" link, and use
                the refund option in the customer portal.
              </li>
              <li>
                <strong>Email us.</strong> Send a message to{" "}
                <a href="mailto:support@corder.app">
                  <strong>support@corder.app</strong>
                </a>{" "}
                with the email address you used for purchase. We respond
                within one business day.
              </li>
            </ol>

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
              <a href="mailto:support@corder.app">
                <strong>support@corder.app</strong>
              </a>
              . We read every message.
            </p>
          </div>

          <p className="legal-footer">
            <Link href="/">Back to corder.app</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
