import Link from "next/link";

import type { Metadata } from "next";


const DATA_SOURCE = "projects/corder-landing/src/app/docs/mcp/page.tsx";

export const metadata: Metadata = {
  title: "MCP server",
  description:
    "Connect Corder to Claude, Cursor, and any MCP client. One npx command, no auth setup.",
  alternates: { canonical: "/docs/mcp/" },
};

/**
 * /docs/mcp -- developer docs for the corder-mcp package.
 *
 * Same standalone-page shell as the rest of the project. Content here
 * is short on purpose: the install snippet + a Claude Desktop config
 * + what the server exposes today. Anything deeper lives in the
 * upstream README and GitHub issues for now.
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
            Connect Corder to Claude, Cursor, or any Model Context Protocol
            client. One npx command, no auth setup, runs against your local
            Corder app.
          </p>

          <div className="legal-body">
            <h2>Install</h2>
            <p>
              The server is published on npm under{" "}
              <code>corder-mcp</code> (previously{" "}
              <code>@corder/mcp</code>, now unscoped). Run it directly with
              npx so you never have a stale global:
            </p>
            <pre className="docs-code">
              <code>npx -y corder-mcp</code>
            </pre>
            <p>
              Source on{" "}
              <a
                href="https://github.com/halinskiy/corder-mcp"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              . Package on{" "}
              <a
                href="https://www.npmjs.com/package/corder-mcp"
                target="_blank"
                rel="noopener noreferrer"
              >
                npm
              </a>
              . MIT licence, accepts pull requests.
            </p>

            <h2>Add to Claude Desktop</h2>
            <p>
              Edit{" "}
              <code>
                ~/Library/Application Support/Claude/claude_desktop_config.json
              </code>{" "}
              and add the server under <code>mcpServers</code>:
            </p>
            <pre className="docs-code">
              <code>{`{
  "mcpServers": {
    "corder": {
      "command": "npx",
      "args": ["-y", "corder-mcp"]
    }
  }
}`}</code>
            </pre>
            <p>
              Restart Claude Desktop. Corder shows up under the
              hammer-and-screwdriver icon, with tools for listing meetings
              and pulling transcripts.
            </p>

            <h2>What it exposes</h2>
            <ul>
              <li>
                <strong>list_meetings</strong>: returns recent meetings with
                title, date, duration, speaker count.
              </li>
              <li>
                <strong>get_transcript</strong>: returns the full transcript
                of a meeting by id, with speaker labels and timestamps.
              </li>
              <li>
                <strong>search_transcripts</strong>: full-text search across
                every transcript in the local Corder database.
              </li>
              <li>
                <strong>get_summary</strong>: returns the auto-generated
                summary if one has been produced.
              </li>
            </ul>
            <p>
              The server reads from the Corder SQLite database under{" "}
              <code>~/Library/Application Support/Corder/</code>. Nothing
              leaves your Mac through the MCP server; the MCP client
              (Claude, Cursor) is the one that sees the data, and it sees
              only what you ask for.
            </p>

            <h2>REST API</h2>
            <p>
              The HTTP REST surface is being designed in parallel. Use the
              MCP server today; see <Link href="/docs/api/">/docs/api/</Link>{" "}
              for the roadmap.
            </p>

            <h2>Status</h2>
            <p>
              Public beta. Bug reports and feature requests welcome on the{" "}
              <a
                href="https://github.com/halinskiy/corder-mcp/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub issue tracker
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
