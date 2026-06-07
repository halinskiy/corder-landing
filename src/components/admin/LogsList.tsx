"use client";

import { useEffect, useRef, useState } from "react";

import {
  AdminApiError,
  archiveLog,
  listLogs,
  type BugReportRow,
} from "@/lib/admin-api";
import { SeverityChip, relativeTime } from "@/components/admin/SeverityChip";
import { LogDetailModal } from "@/components/admin/LogDetailModal";

const DATA_SOURCE =
  "projects/corder-landing/src/components/admin/LogsList.tsx";

type View = "active" | "archived";

/**
 * Logs tab. Bug reports as horizontal cards, newest first. Each card is
 * title + summary + meta (reporter / version / relative time) + severity
 * chip, with an Archive pill that fades in on hover. A just-submitted
 * report has title === null until the async Gemini summary lands, so those
 * rows show a "Summarizing…" shimmer and the list quietly re-polls until
 * every row is summarized. An Active / Archived toggle switches between the
 * live queue and the soft-archived rows. Clicking a card opens the full log.
 */
export function LogsList() {
  const [items, setItems] = useState<BugReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openRow, setOpenRow] = useState<BugReportRow | null>(null);
  const [view, setView] = useState<View>("active");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const pollRef = useRef<number | null>(null);
  // Latest view, read inside the silent poll so it never queries the
  // wrong list after a toggle.
  const viewRef = useRef<View>(view);
  viewRef.current = view;

  async function load(silent = false) {
    if (!silent) setLoading(true);
    try {
      const rows = await listLogs(100, viewRef.current === "archived");
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

  // Reload whenever the view flips.
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  // While any row is still being summarized (title === null), re-poll
  // every 5 s so the shimmer resolves without a manual refresh. Only the
  // active view can hold un-summarized rows.
  const pending = view === "active" && items.some((r) => r.title === null);
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

  async function toggleArchive(row: BugReportRow) {
    const undo = view === "archived"; // archived view → restore
    setBusyId(row.id);
    setError(null);
    const prev = items;
    // Optimistic: the row leaves whichever list we're viewing.
    setItems((list) => list.filter((r) => r.id !== row.id));
    try {
      await archiveLog(row.id, undo);
    } catch (e) {
      setItems(prev);
      setError(
        e instanceof AdminApiError
          ? e.message
          : undo
            ? "Restore failed."
            : "Archive failed.",
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section
      className="admin-panel"
      data-component="LogsList"
      data-source={DATA_SOURCE}
    >
      <div className="admin-toolbar">
        <div
          className="admin-segment"
          role="tablist"
          aria-label="Log view"
        >
          <button
            type="button"
            role="tab"
            aria-selected={view === "active"}
            className={`admin-segment__btn${view === "active" ? " admin-segment__btn--on" : ""}`}
            onClick={() => setView("active")}
          >
            Active
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === "archived"}
            className={`admin-segment__btn${view === "archived" ? " admin-segment__btn--on" : ""}`}
            onClick={() => setView("archived")}
          >
            Archived
          </button>
        </div>
      </div>

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
            const busy = busyId === row.id;
            return (
              <li key={row.id} className="admin-log-item">
                <div
                  className="admin-log-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => setOpenRow(row)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setOpenRow(row);
                    }
                  }}
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

                  <span className="admin-log-card__right">
                    <button
                      type="button"
                      className="admin-log-archive"
                      disabled={busy}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleArchive(row);
                      }}
                    >
                      {busy
                        ? "…"
                        : view === "archived"
                          ? "Restore"
                          : "Archive"}
                    </button>
                    <SeverityChip severity={row.severity} />
                  </span>
                </div>
              </li>
            );
          })}
          {items.length === 0 && (
            <li className="admin-empty">
              {view === "archived" ? "No archived reports." : "No reports yet."}
            </li>
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
