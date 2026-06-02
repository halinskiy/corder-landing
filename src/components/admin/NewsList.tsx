"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  AdminApiError,
  createNews,
  deleteNews,
  listNews,
  newsStatus,
  type NewsItemRow,
  type NewsStatus,
} from "@/lib/admin-api";

const DATA_SOURCE =
  "projects/corder-landing/src/components/admin/NewsList.tsx";

const STATUS_LABEL: Record<NewsStatus, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  active: "Active",
  ended: "Ended",
};

const AUDIENCE_LABEL: Record<NewsItemRow["audience"], string> = {
  all: "Everyone",
  free: "Free",
  pro: "Pro",
  max: "Max",
};

function formatRange(start: string, end: string): string {
  const fmt = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  return `${fmt(start)} – ${fmt(end)}`;
}

/**
 * News tab. Lists every news_items row (drafts included), newest first,
 * with a derived status word, and per-row edit / duplicate / delete.
 * Duplicate POSTs a copy as a draft so the operator can adjust it
 * before it goes live.
 */
export function NewsList() {
  const [items, setItems] = useState<NewsItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [rowError, setRowError] = useState<{ id: string; msg: string } | null>(
    null,
  );
  // Captured once so every row's status is judged against the same
  // instant; avoids re-rendering churn from a live clock.
  const [now] = useState(() => Date.now());

  function load() {
    setLoading(true);
    listNews()
      .then(setItems)
      .catch((e: unknown) =>
        setError(
          e instanceof AdminApiError ? e.message : "Could not load news.",
        ),
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sorted = useMemo(
    () =>
      [...items].sort(
        (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at),
      ),
    [items],
  );

  async function duplicate(row: NewsItemRow) {
    setBusyId(row.id);
    setRowError(null);
    const {
      id: _id,
      created_at: _c,
      updated_at: _u,
      created_by: _b,
      ...rest
    } = row;
    void _id;
    void _c;
    void _u;
    void _b;
    try {
      const copy = await createNews({
        ...rest,
        title: `${row.title} (copy)`,
        is_draft: true,
      });
      setItems((list) => [copy, ...list]);
    } catch (e) {
      setRowError({
        id: row.id,
        msg: e instanceof AdminApiError ? e.message : "Duplicate failed.",
      });
    } finally {
      setBusyId(null);
    }
  }

  async function remove(row: NewsItemRow) {
    setBusyId(row.id);
    setRowError(null);
    try {
      await deleteNews(row.id);
      setItems((list) => list.filter((r) => r.id !== row.id));
      setConfirmId(null);
    } catch (e) {
      setRowError({
        id: row.id,
        msg: e instanceof AdminApiError ? e.message : "Delete failed.",
      });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section
      className="admin-panel"
      data-component="NewsList"
      data-source={DATA_SOURCE}
    >
      <div className="admin-toolbar admin-toolbar--end">
        <Link href="/admin/news/new/" className="cta-pill cta-pill--primary admin-new-btn">
          New item
        </Link>
      </div>

      {loading && <p className="admin-empty">Loading news</p>}
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && (
        <ul className="admin-news-list">
          {sorted.map((row) => {
            const status = newsStatus(row, now);
            const isConfirming = confirmId === row.id;
            const busy = busyId === row.id;
            return (
              <li key={row.id} className="admin-news-row">
                <div className="admin-news-row__main">
                  <span
                    className={`admin-status admin-status--${status}`}
                    aria-label={`Status: ${STATUS_LABEL[status]}`}
                  >
                    <span className="admin-status__dot" aria-hidden="true" />
                    {STATUS_LABEL[status]}
                  </span>
                  <div className="admin-news-row__text">
                    <span className="admin-news-row__title">{row.title}</span>
                    {row.subtitle && (
                      <span className="admin-news-row__sub">
                        {row.subtitle}
                      </span>
                    )}
                  </div>
                </div>

                <div className="admin-news-row__meta">
                  <span className="admin-news-row__audience">
                    {AUDIENCE_LABEL[row.audience]}
                  </span>
                  <span className="admin-news-row__dates">
                    {formatRange(row.starts_at, row.ends_at)}
                  </span>
                </div>

                <div className="admin-news-row__actions">
                  {rowError?.id === row.id && (
                    <span className="admin-row-error">{rowError.msg}</span>
                  )}
                  {isConfirming ? (
                    <span className="admin-confirm">
                      <span className="admin-confirm__q">Delete?</span>
                      <button
                        type="button"
                        className="admin-link admin-link--danger"
                        disabled={busy}
                        onClick={() => remove(row)}
                      >
                        {busy ? "Deleting…" : "Yes"}
                      </button>
                      <button
                        type="button"
                        className="admin-link"
                        disabled={busy}
                        onClick={() => setConfirmId(null)}
                      >
                        No
                      </button>
                    </span>
                  ) : (
                    <>
                      <Link
                        href={`/admin/news/edit/?id=${encodeURIComponent(row.id)}`}
                        className="admin-link"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="admin-link"
                        disabled={busy}
                        onClick={() => duplicate(row)}
                      >
                        {busy ? "Copying…" : "Duplicate"}
                      </button>
                      <button
                        type="button"
                        className="admin-link admin-link--danger"
                        onClick={() => setConfirmId(row.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
          {sorted.length === 0 && (
            <li className="admin-empty">No news items yet.</li>
          )}
        </ul>
      )}
    </section>
  );
}
