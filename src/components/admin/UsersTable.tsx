"use client";

import { useEffect, useMemo, useState } from "react";

import {
  AdminApiError,
  deleteUser,
  listUsers,
  setUserRole,
  setUserTier,
  type AdminUser,
  type Tier,
} from "@/lib/admin-api";

/** What a Plan dropdown can hold: the three tiers plus the admin role. */
type PlanValue = Tier | "admin";

const DATA_SOURCE =
  "projects/corder-landing/src/components/admin/UsersTable.tsx";

const TIERS: Tier[] = ["free", "pro", "max"];
const TIER_LABEL: Record<Tier, string> = {
  free: "Free",
  pro: "Pro",
  max: "Max",
};

function userTier(u: AdminUser): Tier {
  const t = u.app_metadata?.tier;
  return t === "pro" || t === "max" ? t : "free";
}

function isAdminUser(u: AdminUser): boolean {
  return u.app_metadata?.role === "admin";
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Users tab. Lists every auth user, filters by email + tier, lets the
 * operator change a user's tier inline (POST /admin/users/:id/tier) and
 * delete a user behind an inline confirm (DELETE /admin/users/:id).
 * Usage column is a placeholder until the aggregate RPC ships.
 */
export function UsersTable() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<"all" | Tier>("all");

  const [savingId, setSavingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  // A pending admin grant/revoke awaiting inline confirmation (privileged,
  // so it isn't applied on the raw <select> change like a tier swap).
  const [pendingPlan, setPendingPlan] = useState<{
    id: string;
    value: PlanValue;
  } | null>(null);
  const [rowError, setRowError] = useState<{ id: string; msg: string } | null>(
    null,
  );

  useEffect(() => {
    let live = true;
    listUsers()
      .then((rows) => {
        if (live) setUsers(rows);
      })
      .catch((e: unknown) => {
        if (live)
          setError(
            e instanceof AdminApiError
              ? e.message
              : "Could not load users.",
          );
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (tierFilter !== "all" && userTier(u) !== tierFilter) return false;
      if (q && !u.email?.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [users, query, tierFilter]);

  async function changeTier(u: AdminUser, tier: Tier) {
    if (tier === userTier(u)) return;
    setSavingId(u.id);
    setRowError(null);
    const prev = users;
    // optimistic
    setUsers((list) =>
      list.map((row) =>
        row.id === u.id
          ? { ...row, app_metadata: { ...row.app_metadata, tier } }
          : row,
      ),
    );
    try {
      await setUserTier(u.id, tier);
    } catch (e) {
      setUsers(prev);
      setRowError({
        id: u.id,
        msg: e instanceof AdminApiError ? e.message : "Tier change failed.",
      });
    } finally {
      setSavingId(null);
    }
  }

  // Routes a Plan dropdown change. Plain tier swaps apply immediately;
  // anything that grants or revokes the admin role is gated behind an
  // inline confirm because it's a privileged, easy-to-misclick action.
  function changePlan(u: AdminUser, value: PlanValue) {
    const wasAdmin = isAdminUser(u);
    const current: PlanValue = wasAdmin ? "admin" : userTier(u);
    if (value === current) return;
    setRowError(null);
    if (value === "admin" || wasAdmin) {
      setPendingPlan({ id: u.id, value });
    } else {
      changeTier(u, value as Tier);
    }
  }

  async function applyPlan(u: AdminUser, value: PlanValue) {
    setSavingId(u.id);
    setRowError(null);
    try {
      if (value === "admin") {
        await setUserRole(u.id, "admin");
        setUsers((list) =>
          list.map((row) =>
            row.id === u.id
              ? { ...row, app_metadata: { ...row.app_metadata, role: "admin" } }
              : row,
          ),
        );
      } else {
        // Set the tier; if the user was admin, also revoke the role so the
        // demotion is real (and visible) rather than masked by admin.
        await setUserTier(u.id, value);
        if (isAdminUser(u)) await setUserRole(u.id, null);
        setUsers((list) =>
          list.map((row) =>
            row.id === u.id
              ? {
                  ...row,
                  app_metadata: {
                    ...row.app_metadata,
                    tier: value,
                    role: undefined,
                  },
                }
              : row,
          ),
        );
      }
      setPendingPlan(null);
    } catch (e) {
      setRowError({
        id: u.id,
        msg: e instanceof AdminApiError ? e.message : "Plan change failed.",
      });
    } finally {
      setSavingId(null);
    }
  }

  async function removeUser(u: AdminUser) {
    setSavingId(u.id);
    setRowError(null);
    try {
      await deleteUser(u.id);
      setUsers((list) => list.filter((row) => row.id !== u.id));
      setConfirmId(null);
    } catch (e) {
      setRowError({
        id: u.id,
        msg: e instanceof AdminApiError ? e.message : "Delete failed.",
      });
    } finally {
      setSavingId(null);
    }
  }

  return (
    <section
      className="admin-panel"
      data-component="UsersTable"
      data-source={DATA_SOURCE}
    >
      <div className="admin-toolbar">
        <input
          type="search"
          className="admin-input admin-toolbar__search"
          placeholder="Search by email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search users by email"
        />
        <select
          className="admin-select admin-toolbar__filter"
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value as "all" | Tier)}
          aria-label="Filter by tier"
        >
          <option value="all">All tiers</option>
          {TIERS.map((t) => (
            <option key={t} value={t}>
              {TIER_LABEL[t]}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="admin-empty">Loading users</p>}
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Joined</th>
                <th>Last seen</th>
                <th>Plan</th>
                <th>Usage</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const isConfirming = confirmId === u.id;
                const busy = savingId === u.id;
                const isAdmin = u.app_metadata?.role === "admin";
                return (
                  <tr key={u.id}>
                    <td className="admin-table__email">
                      <div className="admin-table__email-inner">
                        <span>{u.email}</span>
                        {rowError?.id === u.id && (
                          <span className="admin-row-error">
                            {rowError.msg}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="admin-table__muted">
                      {formatDate(u.created_at)}
                    </td>
                    <td className="admin-table__muted">
                      {formatDate(u.last_sign_in_at)}
                    </td>
                    <td>
                      <select
                        className={`admin-select admin-tier-select${isAdmin ? " admin-tier-select--admin" : ""}`}
                        value={isAdmin ? "admin" : userTier(u)}
                        disabled={busy || pendingPlan?.id === u.id}
                        onChange={(e) =>
                          changePlan(u, e.target.value as PlanValue)
                        }
                        aria-label={`Plan for ${u.email}`}
                      >
                        {/* Free/Pro/Max set the tier; Admin grants the role.
                            Tier swaps apply on change; admin grant/revoke is
                            confirmed inline below (privileged action). */}
                        {TIERS.map((t) => (
                          <option key={t} value={t}>
                            {TIER_LABEL[t]}
                          </option>
                        ))}
                        <option value="admin">Admin</option>
                      </select>
                      {pendingPlan?.id === u.id && (
                        <span className="admin-confirm admin-plan-confirm">
                          <span className="admin-confirm__q">
                            {pendingPlan.value === "admin"
                              ? "Grant admin?"
                              : "Remove admin?"}
                          </span>
                          <button
                            type="button"
                            className="admin-link admin-link--danger"
                            disabled={busy}
                            onClick={() => applyPlan(u, pendingPlan.value)}
                          >
                            {busy ? "Saving…" : "Yes"}
                          </button>
                          <button
                            type="button"
                            className="admin-link"
                            disabled={busy}
                            onClick={() => setPendingPlan(null)}
                          >
                            No
                          </button>
                        </span>
                      )}
                    </td>
                    <td className="admin-table__muted">—</td>
                    <td className="admin-table__actions">
                      {isConfirming ? (
                        <span className="admin-confirm">
                          <span className="admin-confirm__q">Delete?</span>
                          <button
                            type="button"
                            className="admin-link admin-link--danger"
                            disabled={busy}
                            onClick={() => removeUser(u)}
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
                        <button
                          type="button"
                          className="admin-link admin-link--danger"
                          onClick={() => setConfirmId(u.id)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="admin-empty">No users match.</p>
          )}
        </div>
      )}
    </section>
  );
}
