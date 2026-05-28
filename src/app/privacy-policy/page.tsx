import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Corder handles your audio, transcripts, and account data across the Mac app and getcorder.com. Sub-processors, retention, GDPR rights.",
  alternates: { canonical: "/privacy-policy/" },
};

const DATA_SOURCE =
  "projects/corder-landing/src/app/privacy-policy/page.tsx";

/**
 * Privacy Policy.
 *
 * Two distinct surfaces are covered: the Corder Mac app (which records
 * audio + transcribes + optionally syncs to a Corder-hosted cloud on
 * paid tiers) and the marketing site getcorder.com (which uses three
 * analytics scripts for the paid-ad funnel). The policy spells out
 * which data flows where, who the sub-processors are, what we retain,
 * and how you exercise GDPR rights.
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
            Last updated: 28 May 2026.
          </p>

          <div className="legal-body">
            <h2>Who runs Corder</h2>
            <p>
              Corder is a Mac application and the marketing site at
              getcorder.com, built and operated by a small independent
              team. Contact for any privacy question, data subject
              access request, or complaint:{" "}
              <a href="mailto:hello@getcorder.com">hello@getcorder.com</a>.
              We aim to reply within 5 business days.
            </p>

            <h2>What data, where it lives</h2>
            <p>
              Corder has two surfaces with separate data flows. The
              tables below describe each in plain language.
            </p>

            <h3>1. The Mac app</h3>
            <p>
              The macOS application records audio that plays through
              your speakers and microphone, transcribes it, and saves a
              transcript + summary. What happens to that data depends
              on your tier.
            </p>

            <h4>Free tier (Bring Your Own Key, on-device only)</h4>
            <ul>
              <li>
                Recordings, transcripts, summaries, and the application
                database live ONLY on your Mac, under{" "}
                <code>~/Library/Application Support/Corder/</code>.
              </li>
              <li>
                Transcription runs via the Google Gemini API using a
                key you supply in Settings. Audio chunks travel from
                your Mac directly to Google. We do not see them and we
                do not proxy them.
              </li>
              <li>
                Optional local Whisper model (Apple Silicon only) keeps
                transcription fully on-device. Nothing leaves the Mac.
              </li>
            </ul>

            <h4>Pro and Max tiers (Corder-hosted transcription)</h4>
            <ul>
              <li>
                Audio chunks are uploaded from your Mac to our
                infrastructure for transcription. We hand each chunk to
                Google Gemini (default) or OpenAI Whisper (Max), wait
                for the transcript, and discard the audio chunk
                immediately afterwards. The retention window inside our
                cloud is at most 48 hours and only as long as the
                transcription queue holds it.
              </li>
              <li>
                The transcript, summary, speaker labels, and meeting
                metadata are stored in a Supabase Postgres database
                hosted in the EU (Frankfurt region). Encrypted at rest
                (AES-256) and in transit (TLS 1.2+).
              </li>
              <li>
                Optional screen video and a copy of the original audio
                file may be uploaded to Supabase Storage if you turn on
                cloud sync. You can disable cloud sync per-meeting or
                globally in Settings. With cloud sync off, Pro and Max
                fall back to the on-device flow of the Free tier.
              </li>
              <li>
                Auto-summary and summary template processing call
                Google Gemini and never store the prompt or completion
                anywhere except your meeting record in Supabase.
              </li>
            </ul>

            <h3>2. The marketing site (getcorder.com)</h3>
            <p>
              The site is a static export hosted on Vercel. It loads
              three third-party analytics scripts. None of these see
              anything that happens inside the Mac app.
            </p>
            <ul>
              <li>
                <strong>Microsoft Clarity</strong> for heatmaps and
                session replays. Clarity does not record keystrokes;
                form inputs are masked. Data lives on Microsoft Azure
                in the United States.
              </li>
              <li>
                <strong>Plausible Analytics</strong> for aggregate
                pageview and event counts. Plausible is cookie-less and
                runs on EU servers. No personal data is collected.
              </li>
              <li>
                <strong>X (Twitter) Conversion Pixel</strong> when a
                paid ad campaign is live. Used for conversion
                attribution. You can opt out via X privacy settings.
              </li>
            </ul>

            <h2>Sub-processors</h2>
            <p>
              We use the following third-party services to operate
              Corder. Each holds either a signed Data Processing
              Agreement (DPA) with us or is covered by an off-the-shelf
              DPA that the provider publishes.
            </p>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Sub-processor</th>
                  <th>Purpose</th>
                  <th>Region</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Supabase</td>
                  <td>Auth, Postgres database, object storage for cloud-synced recordings (Pro / Max)</td>
                  <td>EU (Frankfurt)</td>
                </tr>
                <tr>
                  <td>Google Cloud (Gemini API)</td>
                  <td>Transcription, summarisation</td>
                  <td>Global (Google&apos;s default region routing)</td>
                </tr>
                <tr>
                  <td>OpenAI (Whisper API)</td>
                  <td>Transcription option on Max tier</td>
                  <td>United States</td>
                </tr>
                <tr>
                  <td>Paddle</td>
                  <td>Payments, billing, tax handling, invoicing</td>
                  <td>EU + United States</td>
                </tr>
                <tr>
                  <td>Resend</td>
                  <td>Transactional email (magic-link sign-in, receipts, product updates)</td>
                  <td>United States</td>
                </tr>
                <tr>
                  <td>Cloudflare</td>
                  <td>DNS, Workers, CDN for api.getcorder.com</td>
                  <td>Global edge</td>
                </tr>
                <tr>
                  <td>Vercel</td>
                  <td>Static hosting for getcorder.com</td>
                  <td>Global edge</td>
                </tr>
                <tr>
                  <td>Microsoft Clarity</td>
                  <td>Heatmaps and session replays on the marketing site</td>
                  <td>United States</td>
                </tr>
                <tr>
                  <td>Plausible Analytics</td>
                  <td>Aggregate pageview and event counts</td>
                  <td>EU</td>
                </tr>
                <tr>
                  <td>X (Twitter)</td>
                  <td>Conversion pixel (when paid ads are live)</td>
                  <td>United States</td>
                </tr>
              </tbody>
            </table>

            <h2>Account data</h2>
            <p>
              If you create an account on getcorder.com we store: your
              email address, your display name (which you choose, can
              edit anytime, and defaults to the local part of your
              email), an opaque internal user id, your subscription
              status, and a list of meetings you have synced to cloud
              if any. We use your email to send a one-time magic-link
              sign-in code on request, receipts, and any optional
              product-update emails you opt into in your account
              preferences. We do not sell, rent, or share this data
              with anyone outside the sub-processors named above.
            </p>

            <h2>Data retention</h2>
            <ul>
              <li>
                <strong>Audio chunks at our cloud transcription tier:</strong>{" "}
                discarded immediately after the transcript is produced,
                at most within 48 hours.
              </li>
              <li>
                <strong>Transcripts, summaries, meeting metadata in
                Supabase:</strong> kept as long as your account is
                active. You can delete any meeting from the app, which
                cascades to delete the row, the linked storage object,
                and all derived data.
              </li>
              <li>
                <strong>Cloud-synced screen recordings + audio
                originals:</strong> kept as long as your account is
                active. Delete the meeting to delete the storage
                object.
              </li>
              <li>
                <strong>Account row, after you click Delete account:
                </strong> 30-day grace period for accidental removal.
                After that the row is permanently removed from our
                database, cascade-deleting linked meetings + storage
                objects, your email is unsubscribed from every list,
                and the linked Paddle subscription is canceled. The
                30-day grace mirrors the GDPR standard for account
                erasure under Article 17.
              </li>
              <li>
                <strong>Billing records (Paddle):</strong> retained by
                Paddle for 7 years to meet tax law in their
                jurisdictions.
              </li>
              <li>
                <strong>Web analytics (Clarity, Plausible, X pixel):
                </strong> Clarity 90 days, Plausible 24 months,
                X pixel 540 days per the providers&apos; defaults.
              </li>
            </ul>

            <h2>What we do not do</h2>
            <ul>
              <li>
                No telemetry from inside the app beyond what is listed
                above.
              </li>
              <li>
                No selling, sharing, or licensing your audio,
                transcripts, summaries, or any derived data.
              </li>
              <li>
                No training of any AI model on your data. The
                providers we forward chunks to (Google Gemini, OpenAI
                Whisper) operate under their API terms which prohibit
                training on data sent through the API.
              </li>
              <li>
                No advertising profiles built from your meetings.
              </li>
              <li>
                No third-party bot is added to your calls. The other
                participants see nothing different in their attendee
                list.
              </li>
            </ul>

            <h2>Your rights under GDPR / UK GDPR / CCPA</h2>
            <p>
              You have the right to:
            </p>
            <ul>
              <li>
                <strong>Access</strong> your data. Email
                hello@getcorder.com with the subject &quot;Data export
                request&quot; and we will send a machine-readable copy
                within 30 days.
              </li>
              <li>
                <strong>Correct</strong> inaccurate data. Most fields
                (name, email, notification prefs) are editable directly
                in <a href="/account">/account</a>; for the rest,
                email us.
              </li>
              <li>
                <strong>Delete</strong> your data (right to be
                forgotten). Click Delete account in{" "}
                <a href="/account">/account</a> to start the 30-day
                grace deletion described above. Individual meetings
                can also be deleted from the Mac app.
              </li>
              <li>
                <strong>Port</strong> your data to another service.
                Same export request channel as Access; the export is
                JSON for the database and a folder of files for any
                cloud-synced audio + transcripts.
              </li>
              <li>
                <strong>Restrict</strong> processing or{" "}
                <strong>object</strong> to processing. Email us with
                the specific scope you want restricted.
              </li>
              <li>
                <strong>Complain</strong> to your local supervisory
                authority. For EU residents the right of complaint is
                in your country&apos;s data protection authority. For
                California residents, see your rights under the CCPA
                at oag.ca.gov.
              </li>
            </ul>

            <h2>Cookies on this website</h2>
            <p>
              Strictly necessary: none. The site does not require any
              cookie to function.
            </p>
            <p>
              Analytics: Microsoft Clarity sets a first-party cookie
              for session continuity. Plausible is cookie-less. The X
              pixel sets a third-party cookie when loaded. You can
              block these via browser settings or a tracker blocker;
              the site still works without them.
            </p>

            <h2>Children</h2>
            <p>
              Corder is not directed at children under 16. We do not
              knowingly collect data from minors. If you believe a
              child has created an account or sent us data, email
              hello@getcorder.com and we will delete it.
            </p>

            <h2>Changes</h2>
            <p>
              We will date the next revision at the top of this page
              and note material changes. For questions, write to{" "}
              <a href="mailto:hello@getcorder.com">hello@getcorder.com</a>.
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
