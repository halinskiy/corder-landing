import Link from "next/link";

import type { Metadata } from "next";


const DATA_SOURCE = "projects/corder-landing/src/app/docs/mcp/page.tsx";

export const metadata: Metadata = {
  title: "MCP server (early access)",
  description:
    "The Corder MCP server for Claude, Cursor and other MCP clients is in early access. The package exists; the token flow in the Mac app does not ship yet.",
  alternates: { canonical: "/docs/mcp/" },
};

/**
 * /docs/mcp -- honest status page for the corder-mcp package.
 *
 * The npm package reads a signed-in user's meetings through the Corder
 * backend with a personal token. The Mac app has no "reveal token"
 * control yet, so an end user cannot connect it today. Until that ships,
 * this page states the status and links to the source; it must not show
 * a setup that does not work.
 */
export default function DocsMcpPage() {
  return (
    <main
      data-component="DocsMcpPage"
      data-source={DATA_SOURCE}
      className="legal-page"
    >
      <div className="page-container py-16 md:py-24">
        <div className="mx-auto max-w-[1080px]">
            <h1 className="install-page__heading">MCP server</h1>
          <p className="install-page__sub">
            Early access. Connecting Corder to Claude, Cursor or another
            Model Context Protocol client is not available to end users
            yet.
          </p>

          <div className="legal-body">
            <h2>Status</h2>
            <p>
              The server is published on npm as <code>corder-mcp</code> and
              the source is on{" "}
              <a
                href="https://github.com/halinskiy/corder-mcp"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              . It reads your own meetings, transcripts and summaries
              through the Corder backend with a personal access token, and
              row-level security keeps it scoped to your account. Nothing
              is written through it.
            </p>
            <p>
              What is missing is the token: the Mac app does not yet offer
              a way to reveal or rotate one, and tokens issued by sign-in
              expire within an hour. Until the app ships that control, the
              package cannot be used outside development. This page will
              carry the setup steps when it does.
            </p>

            <h2>What it will expose</h2>
            <ul>
              <li>
                <strong>list_meetings</strong>: recent meetings with title,
                date, duration and speaker count.
              </li>
              <li>
                <strong>get_meeting</strong>: the full transcript of a
                meeting by id, with speaker labels and timestamps.
              </li>
              <li>
                <strong>search_transcripts</strong>: full-text search across
                the transcripts in your account.
              </li>
              <li>
                <strong>get_summary</strong>: the summary of a meeting, if
                one has been produced.
              </li>
            </ul>

            <h2>REST API</h2>
            <p>
              The HTTP REST surface is being designed in parallel; see{" "}
              <Link href="/docs/api/">/docs/api/</Link> for the roadmap.
            </p>

            <h2>Questions</h2>
            <p>
              Bug reports and feature requests are welcome on the{" "}
              <a
                href="https://github.com/halinskiy/corder-mcp/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub issue tracker
              </a>
              , or write to <a href="mailto:hegona3@gmail.com">hegona3@gmail.com</a>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
