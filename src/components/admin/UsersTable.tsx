"use client";

import { useEffect, useMemo, useState } from "react";

import {
  AdminApiError,
  deleteUser,
  listUsers,
  setUserTier,
  type AdminUser,
  type Tier,
} from "@/lib/admin-api";

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
                return (
                  <tr key={u.id}>
                    <td className="admin-table__email">
                      {u.email}
                      {u.app_metadata?.role === "admin" && (
                        <span className="admin-role-mark"> · admin</span>
                      )}
                      {rowError?.id === u.id && (
                        <span className="admin-row-error">
                          {rowError.msg}
                        </span>
                      )}
                    </td>
                    <td className="admin-table__muted">
                      {formatDate(u.created_at)}
                    </td>
                    <td className="admin-table__muted">
                      {formatDate(u.last_sign_in_at)}
                    </td>
                    <td>
                      <select
                        className="admin-select admin-tier-select"
                        value={userTier(u)}
                        disabled={busy}
                        onChange={(e) =>
                          changeTier(u, e.target.value as Tier)
                        }
                        aria-label={`Tier for ${u.email}`}
                      >
                        {TIERS.map((t) => (
                          <option key={t} value={t}>
                            {TIER_LABEL[t]}
                          </option>
                        ))}
                      </select>
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
