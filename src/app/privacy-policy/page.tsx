import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Corder",
  description:
    "How Corder handles your audio, transcripts, and account data. Local-first, no telemetry, no resale.",
};

const DATA_SOURCE =
  "projects/corder-landing/src/app/privacy-policy/page.tsx";

/**
 * Privacy Policy — placeholder ahead of the paid ad test.
 *
 * The footer links here from every page. Content is a working draft so
 * we can run ads without leaving the link broken; the maker will replace
 * the legalese with the canonical version before any GDPR/CCPA outreach.
 */
export default function PrivacyPolicyPage() {
  return (
    <main
      data-component="PrivacyPolicyPage"
      data-source={DATA_SOURCE}
      className="legal-page"
    >
      <div className="page-container py-16 md:py-24">
        <div className="mx-auto max-w-[720px]">
          <p className="section-eyebrow">Legal</p>
          <h1 className="section-heading">Privacy Policy</h1>
          <p className="section-subhead">
            Last updated: 22 May 2026. Working draft.
          </p>

          <div className="legal-body">
            <h2>Who runs Corder</h2>
            <p>
              Corder is a Mac application built and operated by a small
              independent team. Contact:{" "}
              <a href="mailto:hello@corder.app">hello@corder.app</a>.
            </p>

            <h2>What stays on your Mac</h2>
            <p>
              Recordings, transcripts, summaries, and the application
              database live only on the device where Corder is installed,
              under{" "}
              <code>~/Library/Application Support/Corder/</code>. We do not
              copy them to our servers. We have no servers that store user
              audio or transcripts.
            </p>

            <h2>What leaves your Mac</h2>
            <p>
              Two network calls are made by Corder:
            </p>
            <ul>
              <li>
                <strong>Transcription.</strong> Audio chunks are uploaded to
                the Google Gemini API and discarded after processing per
                Google&apos;s API terms. Gemini does not train on data sent
                through their API.
              </li>
              <li>
                <strong>Application updates.</strong> Corder checks for new
                releases through Sparkle (the standard macOS update
                framework). No identifying information is sent beyond the
                current app version.
              </li>
            </ul>
            <p>
              On the marketing site you are reading right now,
              getcorder.com, we run two third-party scripts: Microsoft
              Clarity for heatmaps and (when a paid ad campaign is live)
              the Twitter Pixel plus Plausible Analytics.
              These observe browsing behaviour on the site only. They do
              not see anything inside the application.
            </p>

            <h2>What we do not do</h2>
            <ul>
              <li>No telemetry from inside the app.</li>
              <li>No selling, sharing, or licensing your audio or transcripts.</li>
              <li>No advertising profiles built from your meetings.</li>
              <li>No third-party bot is added to your calls.</li>
            </ul>

            <h2>Your rights</h2>
            <p>
              You can delete any recording, transcript, or database file
              from Finder at any time. Removing the app removes all local
              data unless you have an optional Dropbox archive enabled, in
              which case those files live in your own Dropbox under your
              control.
            </p>

            <h2>Changes</h2>
            <p>
              We will date the next revision at the top of this page. For
              questions, write to{" "}
              <a href="mailto:hello@corder.app">hello@corder.app</a>.
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
