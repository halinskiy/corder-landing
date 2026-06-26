"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { trackEvent } from "@/lib/track";

const DATA_SOURCE = "projects/corder-landing/src/components/install/InstallClient.tsx";

const RELEASES_API =
  "https://api.github.com/repos/halinskiy/corder-updates/releases/latest";

// Hardcoded fallback to the current release's notarized DMG. Used when
// the GitHub API call fails (rate-limit, CORS, offline) so the user
// still gets a real binary, not a 'see the releases page' HTML hop.
// Update this URL + filename + isDmg defaults on every release; the
// API resolver upgrades to the live `/releases/latest` URL when it
// succeeds, so users on a fresh deploy with a fresh release get the
// new asset automatically and this hardcode is only the safety net.
const FALLBACK_URL =
  "https://github.com/halinskiy/corder-updates/releases/download/v0.14.64/Corder-0.14.64.dmg";
const FALLBACK_NAME = "Corder-0.14.64.dmg";

const VERSION = "0.14.64";

// Release notes shown under the install steps. Our style: short lead,
// plain supporting line, ASCII only (no typographic dashes or bullets).
const WHATS_NEW: ReadonlyArray<{ title: string; body: string }> = [
  {
    title: "On-device transcription",
    body: "Transcribe locally on Apple Silicon, with no audio leaving your Mac.",
  },
  {
    title: "Cleaner transcripts",
    body: "Sound from your speakers is removed before transcription, so it is not mistaken for your voice.",
  },
  {
    title: "Summary and Chapters on the free plan",
    body: "Both work without a paid tier.",
  },
  {
    title: "Fewer invented lines",
    body: "Phantom sign-offs over silent gaps are filtered out, so you see only what was said.",
  },
];

// Match any .zip or .dmg asset Sparkle / a hand-rolled release pipeline
// might upload. Version suffix (e.g. Corder-0.13.2.dmg) and naked names
// (Corder.zip, Corder.dmg) both match. The runtime scan below prefers a
// .dmg over a .zip when both exist on the release -- DMG gives the user
// a native mount + drag-to-Applications surface, whereas .zip is what
// Sparkle uses for in-app auto-update.
const DMG_RE = /^Corder[-.\w]*\.dmg$/i;
const ZIP_RE = /^Corder[-.\w]*\.zip$/i;

export function InstallClient() {
  const [resolvedUrl, setResolvedUrl] = useState<string>(FALLBACK_URL);
  const [resolvedName, setResolvedName] = useState<string>(FALLBACK_NAME);
  const triggeredRef = useRef(false);

  // Resolve the actual asset URL via the GitHub API, then trigger the
  // download. If the API call fails (rate-limit, CORS, offline) or
  // returns no matching asset, fall back to the hardcoded FALLBACK_URL
  // (the current notarised DMG). Either way the trigger fires -- the
  // user never lands on an idle page.
  //
  // Trigger uses window.location.assign so cross-origin Content-
  // Disposition: attachment responses (which GitHub release assets
  // return) download in place without a popup-blocker hit. The earlier
  // anchor.click() + download attribute path was ignored for cross-
  // origin URLs and unreliable; the previous window.open fallback got
  // killed by popup blockers entirely.
  useEffect(() => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;

    async function start() {
      let downloadUrl = FALLBACK_URL;
      let downloadName = FALLBACK_NAME;

      try {
        const res = await fetch(RELEASES_API);
        if (res.ok) {
          const release = (await res.json()) as {
            assets?: Array<{ name: string; browser_download_url: string }>;
          };
          // Prefer .dmg over .zip when both exist (cleaner UX for the
          // user). Fall back to .zip if the release only ships zip.
          const dmg = release.assets?.find((a) => DMG_RE.test(a.name));
          const zip = release.assets?.find((a) => ZIP_RE.test(a.name));
          const match = dmg ?? zip;
          if (match) {
            downloadUrl = match.browser_download_url;
            downloadName = match.name;
          }
        }
      } catch {
        // API blocked / rate-limited / offline. downloadUrl already
        // holds the hardcoded FALLBACK_URL, so the trigger below fires
        // against a real binary either way.
      }

      setResolvedUrl(downloadUrl);
      setResolvedName(downloadName);

      // Trigger via hidden iframe. Cross-origin URLs from GitHub
      // release assets return `Content-Disposition: attachment` so the
      // browser downloads the file and the iframe gets nothing to
      // render -- user stays on /install/, no popup blocker, no
      // navigation flash. The anchor-click + download-attribute trick
      // gets ignored cross-origin by Chrome 83+, and window.open hits
      // popup blockers. This is the path Sparkle uses for the same
      // reason.
      try {
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = downloadUrl;
        document.body.appendChild(iframe);
        window.setTimeout(() => iframe.remove(), 30_000);
        trackEvent("install_auto_download_started", {
          source: "install_page",
          asset: downloadName,
        });
      } catch {
        /* user can still use the manual link below */
      }
    }

    start();
  }, []);

  // Step copy diverges by file type: DMG mounts a Finder window with
  // an Applications shortcut; ZIP expands an .app you drag yourself.
  const isDmg = /\.dmg$/i.test(resolvedName);

  return (
    <main
      data-component="InstallPage"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-text,color-text-muted,color-accent,font-serif,font-sans,radius-window"
      className="install-page"
    >
      <div className="page-container py-16 md:py-24">
        <div className="install-page__inner mx-auto max-w-[1080px]">
            <h1 className="install-page__heading">Thanks for downloading.</h1>

          <p className="install-page__sub">
            Your download will begin automatically. If it did not start.
          </p>
          <a
            href={resolvedUrl}
            download={resolvedName}
            className="install-page__manual-link install-page__manual-link--standalone"
            data-track-event="install_manual_download_click"
          >
            Download Corder manually
          </a>

          <ol className="install-steps" aria-label="Install steps">
            <li className="install-step-card">
              <div className="install-step-card__badge" aria-hidden>
                1
              </div>
              <p className="install-step-card__label">
                {isDmg ? (
                  <>
                    Open <em>Corder.dmg</em> from your <em>Downloads</em> folder.
                  </>
                ) : (
                  <>
                    Open <em>Corder.zip</em> from your <em>Downloads</em> folder.
                  </>
                )}
              </p>
            </li>
            <StepArrow />
            <li className="install-step-card">
              <div className="install-step-card__badge" aria-hidden>
                2
              </div>
              <p className="install-step-card__label">
                {isDmg ? (
                  <>
                    Drag <em>Corder</em> into the <em>Applications</em> folder in the window that opens.
                  </>
                ) : (
                  <>
                    Drag the <em>Corder</em> icon into your <em>Applications</em> folder.
                  </>
                )}
              </p>
            </li>
            <StepArrow />
            <li className="install-step-card">
              <div className="install-step-card__badge" aria-hidden>
                3
              </div>
              <p className="install-step-card__label">
                Open the Corder app from your <em>Applications</em> folder.
              </p>
            </li>
          </ol>

          <section
            className="install-whatsnew"
            aria-label={`What is new in Corder ${VERSION}`}
            data-component="InstallWhatsNew"
            data-source={DATA_SOURCE}
          >
            <h2 className="install-whatsnew__heading">What is new in {VERSION}</h2>
            <ul className="install-whatsnew__list">
              {WHATS_NEW.map((f) => (
                <li key={f.title} className="install-whatsnew__item">
                  <span className="install-whatsnew__title">{f.title}</span>
                  <span className="install-whatsnew__body">{f.body}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="install-page__footer-actions">
            <a
              href="mailto:hello@getcorder.com"
              className="install-page__ghost-cta cta-pill cta-pill--ghost inline-flex h-14 w-full md:w-auto md:min-w-[260px] items-center justify-center rounded-[var(--radius-pill)] px-7 md:px-9 text-[17px] font-medium"
              data-track-event="install_help_email_click"
            >
              Need help?
            </a>
          </div>

          {/* Back stays pinned to the bottom of the viewport while the
              user scrolls the release notes, then docks at its natural
              spot at the very end of the column and goes no further. */}
          <Link
            href="/"
            className="install-page__back-sticky cta-pill cta-pill--primary inline-flex h-14 w-full md:w-auto md:min-w-[260px] items-center justify-center rounded-[var(--radius-pill)] px-7 md:px-9 text-[17px] font-medium"
            data-track-event="install_back_home_click"
          >
            Back
          </Link>
        </div>
      </div>
    </main>
  );
}

/* Chevron between step cards. Sits as a non-list item in the ol; the
 * StepArrow is aria-hidden so screen readers skip straight from step
 * 1 to step 2 without "arrow" filler. On mobile the arrow rotates 90deg
 * so it points downward between stacked cards. */
function StepArrow() {
  return (
    <span aria-hidden="true" className="install-step-arrow">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    </span>
  );
}

