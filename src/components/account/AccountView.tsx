"use client";

import { useCallback, useEffect, useState } from "react";

import { getSupabase, SUPABASE_CONFIGURED } from "@/lib/supabase";

const DATA_SOURCE =
  "projects/corder-landing/src/components/account/AccountView.tsx";

const API_BASE = "https://corder-api.empqwork.workers.dev";

type Me = {
  email: string | null;
  name: string | null;
  created_at: string | null;
  tier: "free" | "pro" | "max";
  subscription: {
    has_subscription: boolean;
    status: string | null;
    current_period_end: string | null;
  };
  usage: { used_seconds: number; cap_seconds: number | null; period: string };
};

type Txn = {
  id: string;
  billed_at: string | null;
  currency_code: string | null;
  grand_total: string | null;
};

type View = "loading" | "signin" | "ready" | "error";

const PLAN_LABEL: Record<Me["tier"], string> = {
  free: "Free",
  pro: "Pro",
  max: "Max",
};

/** /account -- the signed-in surface. Reads the real account over the
 *  Supabase JWT from corder-api, and drives cancel / manage through the
 *  Paddle customer portal. */
export function AccountView() {
  const [view, setView] = useState<View>("loading");
  const [me, setMe] = useState<Me | null>(null);
  const [txns, setTxns] = useState<Txn[]>([]);
  const [token, setToken] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!SUPABASE_CONFIGURED) {
      setView("error");
      return;
    }
    const { data } = await getSupabase().auth.getSession();
    const accessToken = data.session?.access_token ?? null;
    if (!accessToken) {
      setView("signin");
      return;
    }
    setToken(accessToken);
    try {
      const [meRes, histRes] = await Promise.all([
        fetch(`${API_BASE}/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        fetch(`${API_BASE}/billing/history`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ]);
      if (!meRes.ok) {
        setView("error");
        return;
      }
      setMe((await meRes.json()) as Me);
      if (histRes.ok) {
        const hj = (await histRes.json()) as { transactions?: Txn[] };
        setTxns(hj.transactions ?? []);
      }
      setView("ready");
    } catch {
      setView("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (view === "loading") {
    return (
      <p className="acct-note" aria-live="polite" data-source={DATA_SOURCE}>
        Loading your account…
      </p>
    );
  }
  if (view === "signin") return <AccountSignIn />;
  if (view === "error" || !me) {
    return (
      <p className="acct-note" data-source={DATA_SOURCE}>
        Could not load your account. Refresh to try again.
      </p>
    );
  }

  return (
    <div className="acct" data-source={DATA_SOURCE}>
      <ProfileCard me={me} token={token} onNameSaved={(n) => setMe({ ...me, name: n })} />
      <PlanCard me={me} token={token} />
      <BillingCard txns={txns} />
      <DeleteCard token={token} />
    </div>
  );
}

// ── Profile ──────────────────────────────────────────────────────────

function ProfileCard({
  me,
  token,
  onNameSaved,
}: {
  me: Me;
  token: string | null;
  onNameSaved: (name: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(me.name ?? "");
  const [saving, setSaving] = useState(false);

  async function save() {
    const value = draft.trim();
    setSaving(true);
    try {
      const { data } = await getSupabase().auth.getUser();
      const uid = data.user?.id;
      if (uid) {
        await getSupabase()
          .from("profiles")
          .update({ display_name: value || null })
          .eq("id", uid);
      }
      onNameSaved(value || (me.email?.split("@")[0] ?? ""));
    } catch {
      /* keep the old name on failure */
    }
    setSaving(false);
    setEditing(false);
  }

  const displayName = me.name || me.email?.split("@")[0] || "Account";

  return (
    <section className="acct-card">
      <h2 className="acct-card__title">Profile</h2>
      <dl className="acct-rows">
        <div className="acct-row">
          <dt className="acct-row__k">Email</dt>
          <dd className="acct-row__v">{me.email ?? "Not set"}</dd>
        </div>
        <div className="acct-row">
          <dt className="acct-row__k">Name</dt>
          <dd className="acct-row__v">
            {editing ? (
              <span className="acct-name-edit">
                <input
                  className="acct-input"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  autoFocus
                  aria-label="Display name"
                  disabled={saving}
                />
                <button className="acct-link" onClick={save} disabled={saving}>
                  {saving ? "Saving…" : "Save"}
                </button>
                <button
                  className="acct-link acct-link--muted"
                  onClick={() => {
                    setDraft(me.name ?? "");
                    setEditing(false);
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>
              </span>
            ) : (
              <span className="acct-name">
                <span>{displayName}</span>
                <button className="acct-link" onClick={() => setEditing(true)}>
                  Edit
                </button>
              </span>
            )}
          </dd>
        </div>
        <div className="acct-row">
          <dt className="acct-row__k">Member since</dt>
          <dd className="acct-row__v acct-row__v--muted">
            {formatDate(me.created_at) ?? "Not available"}
          </dd>
        </div>
      </dl>
    </section>
  );
}

// ── Plan + usage ─────────────────────────────────────────────────────

function PlanCard({ me, token }: { me: Me; token: string | null }) {
  const [opening, setOpening] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const usedH = me.usage.used_seconds / 3600;
  const capH = me.usage.cap_seconds != null ? me.usage.cap_seconds / 3600 : null;
  const pct =
    capH && capH > 0 ? Math.min(100, Math.round((usedH / capH) * 100)) : 0;

  const canceling =
    me.subscription.status === "canceled" ||
    (me.subscription.status != null &&
      me.subscription.status !== "active" &&
      me.subscription.status !== "trialing");

  async function openPortal() {
    if (!token) return;
    setErr(null);
    setOpening(true);
    try {
      const r = await fetch(`${API_BASE}/billing/portal`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const j = (await r.json()) as { ok?: boolean; url?: string | null };
      if (j.ok && j.url) {
        window.location.href = j.url;
        return;
      }
      setErr("Could not open the billing portal. Try again in a moment.");
    } catch {
      setErr("Could not open the billing portal. Try again in a moment.");
    }
    setOpening(false);
  }

  return (
    <section className="acct-card">
      <h2 className="acct-card__title">Plan</h2>

      <dl className="acct-rows">
        <div className="acct-row">
          <dt className="acct-row__k">Plan</dt>
          <dd
            className={`acct-row__v acct-plan-value${
              me.tier !== "free" ? " acct-plan-value--paid" : ""
            }`}
          >
            {PLAN_LABEL[me.tier]}
          </dd>
        </div>
        {me.tier !== "free" && me.subscription.current_period_end && (
          <div className="acct-row">
            <dt className="acct-row__k">{canceling ? "Access ends" : "Renews"}</dt>
            <dd className="acct-row__v">
              {formatDate(me.subscription.current_period_end)}
            </dd>
          </div>
        )}
      </dl>

      {me.tier !== "free" && capH != null && (
        <div className="acct-usage">
          <div className="acct-usage__head">
            <span>Cloud hours this month</span>
            <span className="acct-usage__num">
              {usedH.toFixed(1)} / {Math.round(capH)} h
            </span>
          </div>
          <div className="acct-usage__track" aria-hidden>
            <span className="acct-usage__fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      {me.tier === "free" && (
        <p className="acct-line acct-line--muted">
          You are on the free plan. Transcription runs on your Mac.
        </p>
      )}

      <div className="acct-actions">
        {me.tier === "free" ? (
          <a href="/#pricing" className="cta-pill cta-pill--primary acct-btn">
            Upgrade
          </a>
        ) : (
          <button
            className="acct-btn acct-btn--outline"
            onClick={openPortal}
            disabled={opening}
          >
            {opening ? "Opening…" : "Manage subscription"}
          </button>
        )}
      </div>
      {err && <p className="acct-err">{err}</p>}
    </section>
  );
}

// ── Billing history ──────────────────────────────────────────────────

function BillingCard({ txns }: { txns: Txn[] }) {
  return (
    <section className="acct-card">
      <h2 className="acct-card__title">Billing history</h2>
      {txns.length === 0 ? (
        <p className="acct-line acct-line--muted">No payments yet.</p>
      ) : (
        <ul className="acct-txns">
          {txns.map((t) => (
            <li key={t.id} className="acct-txn">
              <span className="acct-txn__date">{formatDate(t.billed_at) ?? "Pending"}</span>
              <span className="acct-txn__amt">
                {formatMoney(t.grand_total, t.currency_code)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// ── Delete account ───────────────────────────────────────────────────

function DeleteCard({ token }: { token: string | null }) {
  const [confirming, setConfirming] = useState(false);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const armed = typed === "DELETE";

  async function del() {
    if (!armed || !token) return;
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch(`${API_BASE}/me/delete`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const j = (await r.json()) as { ok?: boolean };
      if (j.ok) {
        await getSupabase().auth.signOut();
        window.location.href = "/";
        return;
      }
      setErr("Could not delete the account. Contact support and we will sort it.");
    } catch {
      setErr("Could not delete the account. Contact support and we will sort it.");
    }
    setBusy(false);
  }

  return (
    <section className="acct-card acct-card--danger">
      <h2 className="acct-card__title">Delete account</h2>
      <p className="acct-line acct-line--muted">
        Permanently delete your account and cancel any active subscription. This
        cannot be undone.
      </p>
      {!confirming ? (
        <button
          className="acct-danger-trigger"
          onClick={() => setConfirming(true)}
        >
          Delete account…
        </button>
      ) : (
        <div className="acct-danger-confirm">
          <p className="acct-line">
            Type <code>DELETE</code> to confirm.
          </p>
          <input
            className="acct-input"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="DELETE"
            aria-label="Type DELETE to confirm"
            autoFocus
            disabled={busy}
          />
          <div className="acct-danger-buttons">
            <button
              className="cta-pill cta-pill--ghost acct-btn"
              onClick={() => {
                setTyped("");
                setConfirming(false);
              }}
              disabled={busy}
            >
              Cancel
            </button>
            <button
              className="acct-danger-final"
              onClick={del}
              disabled={!armed || busy}
              aria-disabled={!armed || busy}
            >
              {busy ? "Deleting…" : "Delete account"}
            </button>
          </div>
          {err && <p className="acct-err">{err}</p>}
        </div>
      )}
    </section>
  );
}

// ── Signed-out ───────────────────────────────────────────────────────

function AccountSignIn() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function withGoogle() {
    setErr(null);
    if (!SUPABASE_CONFIGURED) {
      setErr("Sign-in is not configured on this build.");
      return;
    }
    setBusy(true);
    const { error } = await getSupabase().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          typeof window !== "undefined" ? window.location.href : undefined,
      },
    });
    if (error) {
      setBusy(false);
      setErr(error.message);
    }
  }

  return (
    <section className="acct-card acct-signin" data-source={DATA_SOURCE}>
      <h2 className="acct-card__title">Sign in</h2>
      <p className="acct-line acct-line--muted">
        Sign in with the account you use in the Corder app to manage your
        subscription.
      </p>
      <button
        className="cta-pill checkout-page__google-btn acct-btn inline-flex items-center justify-center gap-2"
        onClick={withGoogle}
        disabled={busy}
      >
        <GoogleGlyph />
        Continue with Google
      </button>
      {err && <p className="acct-err">{err}</p>}
    </section>
  );
}

// Google "G" logomark, inlined (matches the checkout sign-in).
function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.71a5.4 5.4 0 0 1 0-3.42V4.96H.96a9 9 0 0 0 0 8.08l3.01-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}

// ── helpers ──────────────────────────────────────────────────────────

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatMoney(total: string | null, currency: string | null): string {
  if (!total) return "n/a";
  // Paddle grand_total is a minor-unit integer string (e.g. "1400" = $14.00).
  const n = Number(total);
  if (Number.isNaN(n)) return "—";
  const amount = (n / 100).toFixed(2);
  const cur = currency ?? "USD";
  return `${cur} ${amount}`;
}
