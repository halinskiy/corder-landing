"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";

import {
  AdminApiError,
  createNews,
  updateNews,
  type Audience,
  type CtaAction,
  type NewsItemInput,
  type NewsItemRow,
} from "@/lib/admin-api";

const DATA_SOURCE =
  "projects/corder-landing/src/components/admin/NewsForm.tsx";

const AUDIENCES: { value: Audience; label: string }[] = [
  { value: "all", label: "Everyone" },
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "max", label: "Max" },
];

const ACTIONS: { value: CtaAction | ""; label: string }[] = [
  { value: "", label: "None" },
  { value: "dismiss", label: "Dismiss" },
  { value: "open_url", label: "Open URL" },
  { value: "open_settings", label: "Open settings" },
];

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
function orNull(s: string): string | null {
  const t = s.trim();
  return t.length ? t : null;
}

/**
 * Create / edit form for a news_items row, shared by /admin/news/new
 * and /admin/news/edit. The same component drives both; `mode` only
 * decides whether Save POSTs or PATCHes and what the heading reads.
 *
 * Toggles reuse the account page's `.account-toggle` switch and the
 * inputs reuse `.admin-input` / `.admin-select` so the form reads as
 * one family with the rest of the panel and the site.
 */
export function NewsForm({
  mode,
  id,
  initial,
}: {
  mode: "new" | "edit";
  id?: string;
  initial?: NewsItemRow;
}) {
  const router = useRouter();

  const [title, setTitle] = useState(initial?.title ?? "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [body, setBody] = useState(initial?.body ?? "");

  const [ctaLabel, setCtaLabel] = useState(initial?.cta_label ?? "");
  const [ctaAction, setCtaAction] = useState<CtaAction | "">(
    initial?.cta_action ?? "",
  );
  const [ctaUrl, setCtaUrl] = useState(initial?.cta_url ?? "");

  const [secLabel, setSecLabel] = useState(initial?.secondary_label ?? "");
  const [secAction, setSecAction] = useState<CtaAction | "">(
    initial?.secondary_action ?? "",
  );
  const [secUrl, setSecUrl] = useState(initial?.secondary_url ?? "");

  const [audience, setAudience] = useState<Audience>(
    initial?.audience ?? "all",
  );
  const [dismissible, setDismissible] = useState(initial?.dismissible ?? true);
  const [isDraft, setIsDraft] = useState(initial?.is_draft ?? false);

  const [range, setRange] = useState<DateRange | undefined>(() => {
    if (initial) {
      return {
        from: new Date(initial.starts_at),
        to: new Date(initial.ends_at),
      };
    }
    const from = new Date();
    const to = new Date();
    to.setDate(to.getDate() + 7);
    return { from, to };
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!range?.from) {
      setError("Pick a date range.");
      return;
    }

    const from = startOfDay(range.from);
    const to = endOfDay(range.to ?? range.from);

    const input: NewsItemInput = {
      title: title.trim(),
      subtitle: orNull(subtitle),
      body: orNull(body),
      cta_label: orNull(ctaLabel),
      cta_action: ctaAction || null,
      cta_url: orNull(ctaUrl),
      secondary_label: orNull(secLabel),
      secondary_action: secAction || null,
      secondary_url: orNull(secUrl),
      audience,
      dismissible,
      is_draft: isDraft,
      starts_at: from.toISOString(),
      ends_at: to.toISOString(),
    };

    setSubmitting(true);
    try {
      if (mode === "edit" && id) {
        await updateNews(id, input);
      } else {
        await createNews(input);
      }
      router.push("/admin/news/");
    } catch (e) {
      setSubmitting(false);
      setError(
        e instanceof AdminApiError ? e.message : "Could not save. Try again.",
      );
    }
  }

  return (
    <form
      className="admin-form"
      onSubmit={handleSubmit}
      data-component="NewsForm"
      data-source={DATA_SOURCE}
      noValidate
    >
      <h2 className="admin-form__heading">
        {mode === "edit" ? "Edit item" : "New item"}
      </h2>

      {/* Content */}
      <fieldset className="admin-fieldset">
        <div className="admin-field">
          <label className="admin-label" htmlFor="nf-title">
            Title
          </label>
          <input
            id="nf-title"
            className="admin-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="admin-field">
          <label className="admin-label" htmlFor="nf-subtitle">
            Subtitle
          </label>
          <input
            id="nf-subtitle"
            className="admin-input"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
        </div>
        <div className="admin-field">
          <label className="admin-label" htmlFor="nf-body">
            Body
          </label>
          <textarea
            id="nf-body"
            className="admin-input admin-textarea"
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
      </fieldset>

      {/* Primary CTA */}
      <fieldset className="admin-fieldset">
        <legend className="admin-legend">Primary button</legend>
        <div className="admin-field-row">
          <div className="admin-field">
            <label className="admin-label" htmlFor="nf-cta-label">
              Label
            </label>
            <input
              id="nf-cta-label"
              className="admin-input"
              value={ctaLabel}
              onChange={(e) => setCtaLabel(e.target.value)}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="nf-cta-action">
              Action
            </label>
            <select
              id="nf-cta-action"
              className="admin-select"
              value={ctaAction}
              onChange={(e) => setCtaAction(e.target.value as CtaAction | "")}
            >
              {ACTIONS.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {ctaAction === "open_url" && (
          <div className="admin-field">
            <label className="admin-label" htmlFor="nf-cta-url">
              URL
            </label>
            <input
              id="nf-cta-url"
              className="admin-input"
              type="url"
              placeholder="https://"
              value={ctaUrl}
              onChange={(e) => setCtaUrl(e.target.value)}
            />
          </div>
        )}
      </fieldset>

      {/* Secondary CTA */}
      <fieldset className="admin-fieldset">
        <legend className="admin-legend">Secondary button</legend>
        <div className="admin-field-row">
          <div className="admin-field">
            <label className="admin-label" htmlFor="nf-sec-label">
              Label
            </label>
            <input
              id="nf-sec-label"
              className="admin-input"
              value={secLabel}
              onChange={(e) => setSecLabel(e.target.value)}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="nf-sec-action">
              Action
            </label>
            <select
              id="nf-sec-action"
              className="admin-select"
              value={secAction}
              onChange={(e) => setSecAction(e.target.value as CtaAction | "")}
            >
              {ACTIONS.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {secAction === "open_url" && (
          <div className="admin-field">
            <label className="admin-label" htmlFor="nf-sec-url">
              URL
            </label>
            <input
              id="nf-sec-url"
              className="admin-input"
              type="url"
              placeholder="https://"
              value={secUrl}
              onChange={(e) => setSecUrl(e.target.value)}
            />
          </div>
        )}
      </fieldset>

      {/* Targeting */}
      <fieldset className="admin-fieldset">
        <legend className="admin-legend">Targeting</legend>
        <div className="admin-field">
          <label className="admin-label" htmlFor="nf-audience">
            Audience
          </label>
          <select
            id="nf-audience"
            className="admin-select"
            value={audience}
            onChange={(e) => setAudience(e.target.value as Audience)}
          >
            {AUDIENCES.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-switch-row">
          <span className="admin-label">Dismissible</span>
          <button
            type="button"
            role="switch"
            aria-checked={dismissible}
            aria-label="Dismissible"
            className={`account-toggle${dismissible ? " account-toggle--on" : ""}`}
            onClick={() => setDismissible((v) => !v)}
          >
            <span className="account-toggle__thumb" />
          </button>
        </div>

        <div className="admin-switch-row">
          <span className="admin-label">Draft</span>
          <button
            type="button"
            role="switch"
            aria-checked={isDraft}
            aria-label="Draft"
            className={`account-toggle${isDraft ? " account-toggle--on" : ""}`}
            onClick={() => setIsDraft((v) => !v)}
          >
            <span className="account-toggle__thumb" />
          </button>
        </div>
      </fieldset>

      {/* Schedule */}
      <fieldset className="admin-fieldset">
        <legend className="admin-legend">Schedule</legend>
        <DayPicker
          className="admin-rdp"
          mode="range"
          numberOfMonths={2}
          selected={range}
          onSelect={setRange}
          weekStartsOn={1}
        />
      </fieldset>

      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}

      <div className="admin-form__actions">
        <Link href="/admin/news/" className="cta-pill cta-pill--ghost admin-cancel-btn">
          Cancel
        </Link>
        <button
          type="submit"
          className="cta-pill cta-pill--primary admin-save-btn"
          disabled={submitting}
        >
          {submitting ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
