"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { trackEvent } from "@/lib/track";

const DATA_SOURCE = "projects/corder-landing/src/components/install/InstallClient.tsx";

const RELEASES_API =
  "https://api.github.com/repos/halinskiy/corder-updates/releases/latest";

// Fallback used when the GitHub API is rate-limited / blocked. Points
// at the latest-release HTML page rather than a stale binary URL so
// the user lands somewhere useful even if every fetch path fails.
const RELEASES_HTML_FALLBACK =
  "https://github.com/halinskiy/corder-updates/releases/latest";

// Match any .zip or .dmg asset Sparkle / a hand-rolled release pipeline
// might upload. Version suffix (e.g. Corder-0.10.0.zip) and naked names
// (Corder.zip, Corder.dmg) both match.
const ASSET_RE = /^Corder[-.\w]*\.(zip|dmg)$/i;

type Phase = "waiting" | "started" | "manual";

export function InstallClient() {
  const [phase, setPhase] = useState<Phase>("waiting");
  const [resolvedUrl, setResolvedUrl] = useState<string>(RELEASES_HTML_FALLBACK);
  const [resolvedName, setResolvedName] = useState<string>("Corder.zip");
  const triggeredRef = useRef(false);

  // Resolve the actual asset URL via the GitHub API. The repo names
  // its release artefact 'Corder-<version>.zip' (e.g. Corder-0.10.0.zip),
  // so the static `/releases/latest/download/Corder.zip` URL pattern
  // 404s. The API lookup picks the first .zip / .dmg asset on the
  // latest release and downloads THAT.
  useEffect(() => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;

    const ac = new AbortController();

    async function start() {
      let downloadUrl: string | null = null;
      let downloadName = "Corder.zip";

      try {
        const res = await fetch(RELEASES_API, { signal: ac.signal });
        if (res.ok) {
          const release = (await res.json()) as {
            assets?: Array<{ name: string; browser_download_url: string }>;
          };
          const match = release.assets?.find((a) => ASSET_RE.test(a.name));
          if (match) {
            downloadUrl = match.browser_download_url;
            downloadName = match.name;
          }
        }
      } catch {
        // GitHub API blocked / rate-limited / offline. Fall back to
        // the releases page below so the user still has somewhere to go.
      }

      if (ac.signal.aborted) return;

      const finalUrl = downloadUrl ?? RELEASES_HTML_FALLBACK;
      setResolvedUrl(finalUrl);
      setResolvedName(downloadName);

      if (!downloadUrl) {
        try {
          window.open(RELEASES_HTML_FALLBACK, "_blank", "noopener,noreferrer");
        } catch {
          /* popup blocked, manual link below covers it */
        }
        setPhase("manual");
        trackEvent("install_auto_download_fallback", {
          source: "install_page",
          reason: "no_asset_resolved",
        });
        return;
      }

      // Defer one tick so the "Download started" pill has painted
      // before the browser's save dialog opens.
      window.setTimeout(() => {
        if (ac.signal.aborted) return;
        try {
          const a = document.createElement("a");
          a.href = downloadUrl;
          a.download = downloadName;
          a.rel = "noopener noreferrer";
          document.body.appendChild(a);
          a.click();
          a.remove();
          setPhase("started");
          trackEvent("install_auto_download_started", {
            source: "install_page",
            asset: downloadName,
          });
        } catch {
          setPhase("manual");
        }
      }, 120);
    }

    start();
    return () => ac.abort();
  }, []);

  return (
    <main
      data-component="InstallPage"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-text,color-text-muted,color-accent,font-serif,font-sans,radius-window"
      className="install-page"
    >
      <div className="page-container py-16 md:py-24">
        <div className="install-page__inner mx-auto max-w-[640px]">
          <StatusPill phase={phase} />

          <h1 className="install-page__heading">
            Thanks for downloading.
            <br />
            Just a few steps left
          </h1>

          <p className="install-page__sub">
            Your download will begin automatically. If it did not start,{" "}
            <a
              href={resolvedUrl}
              download={resolvedName}
              className="install-page__manual-link"
              data-track-event="install_manual_download_click"
              onClick={() => setPhase("started")}
            >
              download Corder manually.
            </a>
          </p>

          <ol className="install-steps install-steps--text" aria-label="Install steps">
            <li className="install-step install-step--text">
              <div className="install-step__badge" aria-hidden>
                1
              </div>
              <p className="install-step__label">
                Open <em>Corder.zip</em> from your{" "}
                <em>Downloads</em> folder.
              </p>
            </li>
            <li className="install-step install-step--text">
              <div className="install-step__badge" aria-hidden>
                2
              </div>
              <p className="install-step__label">
                Drag the <em>Corder</em> icon into your{" "}
                <em>Applications</em> folder.
              </p>
            </li>
            <li className="install-step install-step--text">
              <div className="install-step__badge" aria-hidden>
                3
              </div>
              <p className="install-step__label">
                Open the Corder app from your{" "}
                <em>Applications</em> folder.
              </p>
            </li>
          </ol>

          <div className="install-page__footer-actions">
            <Link
              href="/"
              className="cta-pill cta-pill--primary inline-flex h-11 items-center justify-center rounded-[var(--radius-pill)] px-6 text-[15px] font-medium"
              data-track-event="install_back_home_click"
            >
              Back to corder.app
            </Link>
            <a
              href="mailto:hello@getcorder.com"
              className="cta-pill cta-pill--ghost inline-flex h-11 items-center justify-center rounded-[var(--radius-pill)] px-6 text-[15px] font-medium"
              data-track-event="install_help_email_click"
            >
              Need help?
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatusPill({ phase }: { phase: Phase }) {
  const label =
    phase === "started"
      ? "DOWNLOAD STARTED"
      : phase === "manual"
        ? "TAP THE LINK BELOW"
        : "STARTING DOWNLOAD";
  return (
    <div className="install-status-pill" data-phase={phase} role="status" aria-live="polite">
      <span className="install-status-pill__dot" aria-hidden>
        {phase === "started" ? (
          <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden>
            <circle cx="7" cy="7" r="7" fill="currentColor" />
            <path
              d="M4 7.2l2 2 4-4.4"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <span className="install-status-pill__spinner" />
        )}
      </span>
      <span className="install-status-pill__label">{label}</span>
    </div>
  );
}
