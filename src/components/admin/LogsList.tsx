"use client";

import { useEffect, useRef, useState } from "react";

import {
  AdminApiError,
  listLogs,
  type BugReportRow,
} from "@/lib/admin-api";
import { SeverityChip, relativeTime } from "@/components/admin/SeverityChip";
import { LogDetailModal } from "@/components/admin/LogDetailModal";

const DATA_SOURCE =
  "projects/corder-landing/src/components/admin/LogsList.tsx";

/**
 * Logs tab. Bug reports as horizontal cards, newest first. Each card is
 * title + summary + meta (reporter / version / relative time) + severity
 * chip. A just-submitted report has title === null until the async Gemini
 * summary lands, so those rows show a "Summarizing…" shimmer and the list
 * quietly re-polls until every row is summarized. Clicking a card opens
 * the full log (LogDetailModal).
 */
export function LogsList() {
  const [items, setItems] = useState<BugReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openRow, setOpenRow] = useState<BugReportRow | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const pollRef = useRef<number | null>(null);

  async function load(silent = false) {
    if (!silent) setLoading(true);
    try {
      const rows = await listLogs();
      setItems(rows);
      setNow(Date.now());
      setError(null);
    } catch (e) {
      if (!silent)
        setError(
          e instanceof AdminApiError ? e.message : "Could not load logs.",
        );
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // While any row is still being summarized (title === null), re-poll
  // every 5 s so the shimmer resolves into a real card without a manual
  // refresh. Stop polling once every row has a title.
  const pending = items.some((r) => r.title === null);
  useEffect(() => {
    if (!pending) {
      if (pollRef.current) {
        window.clearInterval(pollRef.current);
        pollRef.current = null;
      }
      return;
    }
    if (pollRef.current) return;
    pollRef.current = window.setInterval(() => load(true), 5000);
    return () => {
      if (pollRef.current) {
        window.clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending]);

  function applyUpdate(updated: BugReportRow) {
    setItems((list) =>
      list.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)),
    );
    setOpenRow((cur) =>
      cur && cur.id === updated.id ? { ...cur, ...updated } : cur,
    );
  }

  return (
    <section
      className="admin-panel"
      data-component="LogsList"
      data-source={DATA_SOURCE}
    >
      {loading && <p className="admin-empty">Loading logs</p>}
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && (
        <ul className="admin-log-list">
          {items.map((row) => {
            const summarizing = row.title === null;
            return (
              <li key={row.id}>
                <button
                  type="button"
                  className="admin-log-card"
                  onClick={() => setOpenRow(row)}
                >
                  <span className="admin-log-card__body">
                    {summarizing ? (
                      <span className="admin-log-shimmer" aria-hidden>
                        <span className="admin-log-shimmer__bar admin-log-shimmer__bar--title" />
                        <span className="admin-log-shimmer__bar admin-log-shimmer__bar--line" />
                        <span className="admin-log-shimmer__label">
                          Summarizing…
                        </span>
                      </span>
                    ) : (
                      <>
                        <span className="admin-log-card__title">
                          {row.title}
                        </span>
                        {row.summary && (
                          <span className="admin-log-card__summary">
                            {row.summary}
                          </span>
                        )}
                      </>
                    )}
                    <span className="admin-log-meta">
                      <span>{row.email || "anonymous"}</span>
                      {row.app_version && (
                        <>
                          <span className="admin-log-meta__dot" aria-hidden />
                          <span>{row.app_version}</span>
                        </>
                      )}
                      <span className="admin-log-meta__dot" aria-hidden />
                      <span>{relativeTime(row.created_at, now)}</span>
                    </span>
                  </span>
                  <SeverityChip severity={row.severity} />
                </button>
              </li>
            );
          })}
          {items.length === 0 && (
            <li className="admin-empty admin-empty--card">No reports yet.</li>
          )}
        </ul>
      )}

      {openRow && (
        <LogDetailModal
          row={openRow}
          onClose={() => setOpenRow(null)}
          onUpdated={applyUpdate}
        />
      )}
    </section>
  );
}
