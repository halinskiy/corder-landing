import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms | Corder",
  description:
    "Terms of use for Corder, the macOS meeting recorder. Plain-language working draft.",
};

const DATA_SOURCE = "projects/corder-landing/src/app/terms/page.tsx";

/**
 * Terms of Use — placeholder ahead of the paid ad test.
 *
 * Plain-language draft. The maker will replace this with the canonical
 * legal copy before launching a paid sales channel; in the meantime the
 * link from the footer goes to a real page rather than a 404.
 */
export default function TermsPage() {
  return (
    <main
      data-component="TermsPage"
      data-source={DATA_SOURCE}
      className="legal-page"
    >
      <div className="page-container py-16 md:py-24">
        <div className="mx-auto max-w-[720px]">
          <p className="section-eyebrow">Legal</p>
          <h1 className="section-heading">Terms</h1>
          <p className="section-subhead">
            Last updated: 22 May 2026. Working draft.
          </p>

          <div className="legal-body">
            <h2>The deal</h2>
            <p>
              You install Corder on your Mac. The app records audio that
              plays through your speakers and microphone, and (with your
              consent) sends chunks of that audio to the Google Gemini API
              for transcription. The audio, the transcript, the summary,
              and the database live on your Mac unless you choose to
              archive recordings to your own Dropbox.
            </p>

            <h2>Free and Pro tiers</h2>
            <p>
              The Free tier allows recordings up to 60 minutes each and
              uses the default Gemini Flash model. The Pro tier removes
              the recording length limit, enables auto-summary, gives you
              the slower-but-stronger Pro model option, and includes
              priority support. Pro is billed monthly or annually with a
              31% saving on the annual plan.
            </p>

            <h2>Cancel anytime</h2>
            <p>
              You can cancel the Pro subscription at any time. Cancellation
              takes effect at the end of the current billing period. No
              credit card is needed to download or use Free.
            </p>

            <h2>You are responsible for disclosure</h2>
            <p>
              Some jurisdictions require all parties to a conversation to
              consent before recording. Corder does not handle disclosure
              on your behalf. Telling the other side you are recording
              where local law requires it is your responsibility.
            </p>

            <h2>No warranty</h2>
            <p>
              Corder is provided as is. Transcription accuracy depends on
              the Gemini API and on audio quality. We do not warrant any
              specific level of accuracy and we are not liable for damage
              caused by transcription errors.
            </p>

            <h2>Refunds</h2>
            <p>
              If a charge looks wrong or if Corder did not work as
              described, write to{" "}
              <a href="mailto:hello@corder.app">hello@corder.app</a> within
              14 days of the charge and we will sort it out.
            </p>

            <h2>Changes</h2>
            <p>
              We will date the next revision at the top of this page.
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
