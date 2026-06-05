"use client";

import type { Severity } from "@/lib/admin-api";

const SEVERITY_LABEL: Record<Severity, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

/**
 * Severity chip for a bug report. Four semantic status colours
 * (grey / amber / orange / red) defined in globals.css as
 * `.admin-sev--{level}`. These are status signals, not brand accents,
 * so they are allowed to sit outside the single forest-green accent
 * (same exception as the REC red). The model's guess, not a hard truth.
 */
export function SeverityChip({ severity }: { severity: Severity | null }) {
  if (!severity) return null;
  return (
    <span className={`admin-sev admin-sev--${severity}`}>
      {SEVERITY_LABEL[severity]}
    </span>
  );
}

/** Compact relative time: "just now", "5m ago", "3h ago", "2d ago". */
export function relativeTime(iso: string, now: number): string {
  const then = Date.parse(iso);
  if (!Number.isFinite(then)) return "";
  const s = Math.max(0, Math.floor((now - then) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}
