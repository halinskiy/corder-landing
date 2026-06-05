"use client";

import { useEffect, useRef, useState } from "react";

import {
  AdminApiError,
  getLog,
  summarizeLog,
  type BugReportRow,
} from "@/lib/admin-api";
import { SeverityChip, relativeTime } from "@/components/admin/SeverityChip";

const DATA_SOURCE =
  "projects/corder-landing/src/components/admin/LogDetailModal.tsx";

/**
 * Full bug-report viewer. Opened from a LogsList card. Shows the header
 * (title / severity / reporter / version / time), the AI summary, and the
 * full `log_tail` in a monospace, scrollable box fetched from
 * GET /admin/logs/:id (the list omits log_tail). Copy grabs the raw log;
 * Re-summarize re-runs the Gemini triage and updates both this view and
 * the parent list via `onUpdated`.
 */
export function LogDetailModal({
  row,
  onClose,
  onUpdated,
}: {
  row: BugReportRow;
  onClose: () => void;
  onUpdated: (r: BugReportRow) => void;
}) {
  // Seed from the list row (no log_tail) so the header paints instantly,
  // then merge the full row once the single-row GET resolves.
  const [detail, setDetail] = useState<BugReportRow>(row);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [resummarizing, setResummarizing] = useState(false);
  const [now] = useState(() => Date.now());
  const logBoxRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    let live = true;
    getLog(row.id)
      .then((full) => {
        if (live) setDetail(full);
      })
      .catch((e: unknown) => {
        if (live)
          setError(
            e instanceof AdminApiError ? e.message : "Could not load the log.",
          );
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, [row.id]);

  // Esc closes; lock body scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  function copyLog() {
    const text = detail.log_tail ?? "";
    if (!text || typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => setCopied(false));
  }

  async function reSummarize() {
    setResummarizing(true);
    setError(null);
    try {
      const updated = await summarizeLog(detail.id);
      // The summarize response may omit log_tail; keep the one we have.
      const merged = { ...detail, ...updated, log_tail: detail.log_tail };
      setDetail(merged);
      onUpdated(merged);
    } catch (e) {
      setError(
        e instanceof AdminApiError ? e.message : "Re-summarize failed.",
      );
    } finally {
      setResummarizing(false);
    }
  }

  const meta = [detail.email, detail.app_version, detail.macos_version]
    .filter(Boolean)
    .join("  ");

  return (
    <div
      className="admin-modal-overlay"
      data-component="LogDetailModal"
      data-source={DATA_SOURCE}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="admin-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Bug report"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="admin-modal__head">
          <div className="admin-modal__head-main">
            <div className="admin-modal__title-row">
              <h2 className="admin-modal__title">
                {detail.title ?? "Bug report"}
              </h2>
              <SeverityChip severity={detail.severity} />
            </div>
            <div className="admin-log-meta">
              <span>{detail.email || "anonymous"}</span>
              {detail.app_version && (
                <>
                  <span className="admin-log-meta__dot" aria-hidden />
                  <span>{detail.app_version}</span>
                </>
              )}
              {detail.macos_version && (
                <>
                  <span className="admin-log-meta__dot" aria-hidden />
                  <span>macOS {detail.macos_version}</span>
                </>
              )}
              <span className="admin-log-meta__dot" aria-hidden />
              <span>{relativeTime(detail.created_at, now)}</span>
            </div>
          </div>
          <button
            type="button"
            className="admin-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </header>

        {detail.summary && (
          <p className="admin-modal__summary">{detail.summary}</p>
        )}

        {error && (
          <p className="admin-error" role="alert">
            {error}
          </p>
        )}

        <div className="admin-modal__logwrap">
          {loading ? (
            <p className="admin-empty">Loading log</p>
          ) : (
            <pre ref={logBoxRef} className="admin-log-tail">
              {detail.log_tail || "No log captured."}
            </pre>
          )}
        </div>

        <footer className="admin-modal__actions">
          <button
            type="button"
            className="cta-pill cta-pill--ghost admin-modal__btn"
            onClick={copyLog}
            disabled={!detail.log_tail}
          >
            {copied ? "Copied" : "Copy log"}
          </button>
          <button
            type="button"
            className="cta-pill cta-pill--primary admin-modal__btn"
            onClick={reSummarize}
            disabled={resummarizing}
          >
            {resummarizing ? "Summarizing…" : "Re-summarize"}
          </button>
        </footer>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}
