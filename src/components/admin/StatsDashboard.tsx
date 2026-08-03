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

/** Minimal SVG bar chart, responsive via viewBox. */
function BarChart({ data }: { data: { label: string; value: number }[] }) {
  if (data.length === 0)
    return <p className="stats-empty">No data yet.</p>;
  const W = 640;
  const H = 180;
  const pad = { t: 12, r: 8, b: 22, l: 8 };
  const max = Math.max(1, ...data.map((d) => d.value));
  const bw = (W - pad.l - pad.r) / data.length;
  const barW = Math.max(2, bw * 0.7);
  return (
    <svg className="stats-bars" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Bar chart">
      {data.map((d, i) => {
        const x = pad.l + i * bw + (bw - barW) / 2;
        const h = ((H - pad.t - pad.b) * d.value) / max;
        const y = H - pad.b - h;
        const showLabel =
          data.length <= 12 || i === 0 || i === data.length - 1 || i === Math.floor(data.length / 2);
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={barW} height={h} rx={2} className="stats-bar" />
            {d.value > 0 && (
              <text x={x + barW / 2} y={y - 3} className="stats-bar__val" textAnchor="middle">
                {d.value}
              </text>
            )}
            {showLabel && (
              <text x={x + barW / 2} y={H - 6} className="stats-bar__lbl" textAnchor="middle">
                {d.label.slice(5)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
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
