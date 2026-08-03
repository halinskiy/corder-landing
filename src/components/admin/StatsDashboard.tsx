"use client";

import { useEffect, useState } from "react";

import { AdminApiError, getStats, type AdminStats } from "@/lib/admin-api";

const DATA_SOURCE =
  "projects/corder-landing/src/components/admin/StatsDashboard.tsx";

type View = "loading" | "ready" | "error";

/**
 * Admin Overview -- traction at a glance. Registrations come from GoTrue
 * (100% of users); device activity / tier / version / failures come from
 * the opt-in telemetry sample in D1. Both are surfaced honestly (the
 * telemetry cards are labelled as a sample).
 */
export function StatsDashboard() {
  const [view, setView] = useState<View>("loading");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getStats()
      .then((s) => {
        if (!alive) return;
        setStats(s);
        setView("ready");
      })
      .catch((e) => {
        if (!alive) return;
        setError(e instanceof AdminApiError ? e.message : "Could not load stats.");
        setView("error");
      });
    return () => {
      alive = false;
    };
  }, []);

  if (view === "loading")
    return (
      <p className="stats-note" data-source={DATA_SOURCE}>
        Loading stats…
      </p>
    );
  if (view === "error" || !stats)
    return (
      <p className="stats-note stats-note--err" data-source={DATA_SOURCE}>
        {error ?? "Could not load stats."}
      </p>
    );

  const { registrations: r, devices: d } = stats;
  const paid = r.tiers.pro + r.tiers.max;

  return (
    <div className="stats" data-source={DATA_SOURCE}>
      {/* Registered users (100%). */}
      <div className="stats-cards">
        <StatCard label="Registered users" value={r.total} delta={`+${r.new24h} today`} />
        <StatCard label="New this week" value={r.new7d} sub={`${r.new30d} this month`} />
        <StatCard label="Paid" value={paid} sub={`${r.tiers.pro} Pro · ${r.tiers.max} Max`} />
        <StatCard label="Active now (24h)" value={d.active24h} sub={`${d.active7d} / 7d · ${d.active30d} / 30d`} />
      </div>

      <div className="stats-grid">
        <Panel title="New registrations" subtitle="per day, last 30 days">
          <BarChart data={r.daily.map((x) => ({ label: x.date, value: x.count }))} />
        </Panel>
        <Panel title="Active devices" subtitle="per day, telemetry sample (incl. guests)">
          <BarChart
            data={d.activeDaily.map((x) => ({ label: x.date, value: Number(x.devices) }))}
          />
        </Panel>
      </div>

      <div className="stats-grid">
        <Panel title="By plan" subtitle="all registered users">
          <SplitBars
            rows={[
              { label: "Free", value: r.tiers.free },
              { label: "Pro", value: r.tiers.pro },
              { label: "Max", value: r.tiers.max },
            ]}
          />
        </Panel>
        <Panel title="By app version" subtitle="active devices (telemetry sample)">
          <SplitBars
            rows={d.versionSplit.map((v) => ({
              label: v.version ?? "unknown",
              value: Number(v.devices),
            }))}
          />
        </Panel>
      </div>

      <p className="stats-foot">
        Registrations are exact. Device activity, versions and failures come
        from the opt-in telemetry sample ({d.ever} devices seen ever
        {d.withFailures > 0 ? `, ${d.withFailures} with a failed recording` : ", none with failures"}
        ).
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  delta,
  sub,
  accent,
}: {
  label: string;
  value: number;
  delta?: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className={`stats-card${accent ? " stats-card--accent" : ""}`}>
      <span className="stats-card__label">{label}</span>
      <span className="stats-card__value">{value.toLocaleString("en-US")}</span>
      {delta && <span className="stats-card__delta">{delta}</span>}
      {sub && <span className="stats-card__sub">{sub}</span>}
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="stats-panel">
      <header className="stats-panel__head">
        <h3 className="stats-panel__title">{title}</h3>
        <span className="stats-panel__sub">{subtitle}</span>
      </header>
      {children}
    </section>
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2026-05-28" -> "May 28". Falls back to the raw label if it isn't ISO. */
function fmtDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${MONTHS[Number(m[2]) - 1]} ${Number(m[3])}`;
}

/**
 * Interactive bar chart. Shapes are SVG (scale with the panel); the axis
 * labels and the hover tooltip are HTML so they stay crisp at a real size
 * instead of shrinking with the viewBox. Hovering a column highlights it,
 * dims the rest, and floats a tooltip with the exact date + value.
 */
function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  if (data.length === 0) return <p className="stats-empty">No data yet.</p>;

  const W = 1000;
  const H = 360;
  const padT = 24;
  const padB = 8;
  const padX = 6;
  const plotH = H - padT - padB;
  const max = Math.max(1, ...data.map((d) => d.value));
  const n = data.length;
  const colW = (W - padX * 2) / n;
  const barW = Math.min(40, colW * 0.62);
  const labelEvery = Math.max(1, Math.ceil(n / 8));

  const barTop = (v: number) => padT + plotH - Math.max(2, (plotH * v) / max);

  return (
    <div
      className={`chart${hover !== null ? " chart--hovering" : ""}`}
      onMouseLeave={() => setHover(null)}
    >
      <div className="chart__plot">
        <svg className="chart__svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Bar chart">
          {[0.25, 0.5, 0.75, 1].map((f) => {
            const y = padT + plotH - plotH * f;
            return <line key={f} className="chart__grid" x1={0} x2={W} y1={y} y2={y} />;
          })}
          <line className="chart__axis" x1={0} x2={W} y1={padT + plotH} y2={padT + plotH} />
          {data.map((d, i) => {
            const x = padX + i * colW + (colW - barW) / 2;
            const y = barTop(d.value);
            const h = padT + plotH - y;
            return (
              <g key={d.label}>
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={h}
                  rx={3}
                  className={`chart__bar${hover === i ? " chart__bar--on" : ""}`}
                />
                <rect
                  x={padX + i * colW}
                  y={padT}
                  width={colW}
                  height={plotH}
                  fill="transparent"
                  onMouseEnter={() => setHover(i)}
                />
              </g>
            );
          })}
        </svg>
        {hover !== null && (
          <div
            className={`chart__tip${
              data[hover].value / max > 0.7 ? " chart__tip--below" : ""
            }`}
            style={{
              left: `${((padX + hover * colW + colW / 2) / W) * 100}%`,
              top: `${(barTop(data[hover].value) / H) * 100}%`,
            }}
          >
            <span className="chart__tip-val">{data[hover].value}</span>
            <span className="chart__tip-lbl">{fmtDate(data[hover].label)}</span>
          </div>
        )}
      </div>
      <div className="chart__xaxis" aria-hidden>
        {data.map((d, i) => (
          <span key={d.label} className="chart__xlbl">
            {i % labelEvery === 0 || i === n - 1 ? fmtDate(d.label) : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Horizontal split bars for categorical breakdowns. */
function SplitBars({ rows }: { rows: { label: string; value: number }[] }) {
  const total = Math.max(1, rows.reduce((a, b) => a + b.value, 0));
  if (rows.every((r) => r.value === 0))
    return <p className="stats-empty">No data yet.</p>;
  return (
    <ul className="stats-split">
      {rows.map((r) => (
        <li key={r.label} className="stats-split__row">
          <span className="stats-split__label">{r.label}</span>
          <span className="stats-split__track">
            <span
              className="stats-split__fill"
              style={{ width: `${Math.round((r.value / total) * 100)}%` }}
            />
          </span>
          <span className="stats-split__value">{r.value}</span>
        </li>
      ))}
    </ul>
  );
}
