import Link from "next/link";

import type { Metadata } from "next";


const DATA_SOURCE = "projects/corder-landing/src/app/docs/api/page.tsx";

export const metadata: Metadata = {
  title: "REST API",
  description:
    "The Corder REST API roadmap. Use the MCP server today; the HTTP surface ships in phases alongside auth and billing.",
  alternates: { canonical: "/docs/api/" },
};

/**
 * /docs/api -- honest stub for the REST surface.
 *
 * The public REST API is under design. This page tells the reader what
 * lands when, and points them at the MCP server for programmatic
 * access today. Same standalone-page shell as /docs/mcp.
 */
export default function DocsApiPage() {
  return (
    <main
      data-component="DocsApiPage"
      data-source={DATA_SOURCE}
      className="legal-page"
    >
      <div className="page-container py-16 md:py-24">
        <div className="mx-auto max-w-[1080px]">
            <h1 className="install-page__heading">REST API</h1>
          <p className="install-page__sub">
            The HTTP REST surface is under design. If you need programmatic
            access today, use the MCP server.
          </p>

          <div className="legal-body">
            <h2>Use the MCP server today</h2>
            <p>
              The MCP server reads from your local Corder database and
              exposes meetings, transcripts, summaries, and search to any
              MCP-aware client (Claude, Cursor, and others). Install:
            </p>
            <pre className="docs-code">
              <code>npx -y corder-mcp</code>
            </pre>
            <p>
              Full setup in <Link href="/docs/mcp/">/docs/mcp/</Link>.
            </p>

            <h2>What lands when</h2>
            <p>
              The REST surface ships in phases alongside the cloud
              infrastructure. Order is firm; dates depend on the same auth
              and billing work the Pro tier needs.
            </p>
            <h3>Phase 3 (auth + read)</h3>
            <ul>
              <li>
                <code>POST /auth/magic-link</code>: send a one-time sign-in
                link to an email address.
              </li>
              <li>
                <code>GET /auth/verify?token=...</code>: exchange a magic
                link for a JWT cookie.
              </li>
              <li>
                <code>GET /me</code>: account profile, subscription state,
                notification prefs.
              </li>
              <li>
                <code>GET /meetings</code>: list meetings synced to the
                cloud, paginated.
              </li>
              <li>
                <code>GET /meetings/:id</code>: meeting metadata, transcript,
                summary.
              </li>
            </ul>
            <h3>Phase 4 (write + delete)</h3>
            <ul>
              <li>
                <code>PATCH /meetings/:id</code>: edit title, speaker
                labels, custom tags.
              </li>
              <li>
                <code>DELETE /meetings/:id</code>: remove a meeting and all
                derived data, including any storage objects.
              </li>
              <li>
                <code>DELETE /me</code>: cascade delete the entire account
                with a 30-day grace window per GDPR pattern.
              </li>
            </ul>

            <h2>Current public endpoints</h2>
            <p>
              The only HTTP endpoint live today is the contact form
              forwarder. It accepts a JSON post from{" "}
              <Link href="/contact/sales/">/contact/sales/</Link> and
              forwards the message to the maker through Resend.
            </p>
            <h3>
              <code>POST https://corder-contact.empqwork.workers.dev/</code>
            </h3>
            <p>
              Request body:
            </p>
            <pre className="docs-code">
              <code>{`{
  "email":   "you@example.com",
  "subject": "Corder for teams: Acme Inc",
  "message": "Plain text from the textarea",
  "source":  "Corder for teams"
}`}</code>
            </pre>
            <p>
              Responses: <code>200 {`{ "ok": true }`}</code>,{" "}
              <code>
                400 {`{ "ok": false, "error": "invalid_email" }`}
              </code>{" "}
              for client-side validation failures,{" "}
              <code>500 {`{ "ok": false, "error": "server_error" }`}</code>{" "}
              for everything else. CORS allows{" "}
              <code>https://getcorder.com</code> only.
            </p>

            <h2>Need it sooner</h2>
            <p>
              If you have a specific use case that needs the REST surface
              before Phase 3, write to{" "}
              <a href="mailto:hello@getcorder.com">hello@getcorder.com</a>{" "}
              with what you are building. We prioritise based on real
              demand.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
