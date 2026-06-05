/**
 * Typed client for the corder-api admin endpoints.
 *
 * Every call attaches the operator's current Supabase access token as
 * `Authorization: Bearer <jwt>`. The Worker verifies the JWT against
 * Supabase and checks `app_metadata.role === "admin"`; a non-admin token
 * gets 403. The token is read fresh from the Supabase session on each
 * call so an auto-refreshed token is always used.
 *
 * Contract: see the admin panel spec. Base URL is the live Worker; it
 * can be pointed at a local `wrangler dev` via NEXT_PUBLIC_CORDER_API.
 */
import { getSupabase } from "@/lib/supabase";

export const CORDER_API =
  process.env.NEXT_PUBLIC_CORDER_API ??
  "https://corder-api.empqwork.workers.dev";

// --- shared vocab ---------------------------------------------------------

export type Tier = "free" | "pro" | "max";
export type Audience = "all" | "free" | "pro" | "max";
export type CtaAction = "dismiss" | "open_url" | "open_settings";

// --- users ----------------------------------------------------------------

export type AdminUser = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  app_metadata?: {
    tier?: Tier;
    role?: string;
  } | null;
  // GoTrue carries more fields; we only type what the table renders.
};

// --- news -----------------------------------------------------------------

export type NewsItemRow = {
  id: string;
  title: string;
  subtitle: string | null;
  body: string | null;
  cta_label: string | null;
  cta_action: CtaAction | null;
  cta_url: string | null;
  secondary_label: string | null;
  secondary_action: CtaAction | null;
  secondary_url: string | null;
  starts_at: string;
  ends_at: string;
  audience: Audience;
  dismissible: boolean;
  is_draft: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
};

/** Shape accepted by POST / PATCH. Server fills id, timestamps,
 * created_by; everything else is optional on PATCH and mostly optional
 * on POST (title is the only hard requirement). */
export type NewsItemInput = Partial<
  Omit<NewsItemRow, "id" | "created_at" | "updated_at" | "created_by">
>;

// --- transport ------------------------------------------------------------

export class AdminApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
  }
}

async function adminFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const {
    data: { session },
  } = await getSupabase().auth.getSession();

  if (!session) {
    throw new AdminApiError(401, "Your session expired. Sign in again.");
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${session.access_token}`);
  if (init.body) headers.set("Content-Type", "application/json");

  const res = await fetch(`${CORDER_API}${path}`, { ...init, headers });

  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;
    try {
      const payload = (await res.json()) as { error?: string; message?: string };
      message = payload.error ?? payload.message ?? message;
    } catch {
      // non-JSON error body, keep the status line
    }
    throw new AdminApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

// --- users API ------------------------------------------------------------

export async function listUsers(
  page = 1,
  perPage = 200,
): Promise<AdminUser[]> {
  // GoTrue admin listing is a raw passthrough: { users: [...] }.
  const data = await adminFetch<{ users?: AdminUser[] } | AdminUser[]>(
    `/admin/users?page=${page}&per_page=${perPage}`,
  );
  if (Array.isArray(data)) return data;
  return data.users ?? [];
}

export async function setUserTier(
  id: string,
  tier: Tier,
): Promise<AdminUser> {
  const data = await adminFetch<{ ok: boolean; user: AdminUser }>(
    `/admin/users/${id}/tier`,
    { method: "POST", body: JSON.stringify({ tier }) },
  );
  return data.user;
}

export async function deleteUser(id: string): Promise<void> {
  await adminFetch<{ ok: boolean }>(`/admin/users/${id}`, {
    method: "DELETE",
  });
}

// --- news API --------------------------------------------------------------

export async function listNews(): Promise<NewsItemRow[]> {
  const data = await adminFetch<{ items: NewsItemRow[] }>("/admin/news");
  return data.items ?? [];
}

export async function getNewsItem(id: string): Promise<NewsItemRow | null> {
  // No single-item GET in the contract; read the list and pick the row.
  const items = await listNews();
  return items.find((i) => i.id === id) ?? null;
}

export async function createNews(
  input: NewsItemInput,
): Promise<NewsItemRow> {
  const data = await adminFetch<{ ok: boolean; item: NewsItemRow }>(
    "/admin/news",
    { method: "POST", body: JSON.stringify(input) },
  );
  return data.item;
}

export async function updateNews(
  id: string,
  patch: NewsItemInput,
): Promise<NewsItemRow> {
  const data = await adminFetch<{ ok: boolean; item: NewsItemRow }>(
    `/admin/news/${id}`,
    { method: "PATCH", body: JSON.stringify(patch) },
  );
  return data.item;
}

export async function deleteNews(id: string): Promise<void> {
  await adminFetch<{ ok: boolean }>(`/admin/news/${id}`, {
    method: "DELETE",
  });
}

// --- derived status --------------------------------------------------------

export type NewsStatus = "draft" | "scheduled" | "active" | "ended";

/** Derive the lifecycle status of a news row at a given instant.
 * Draft wins over any date logic. Then: before starts_at => scheduled,
 * after ends_at => ended, otherwise active. */
export function newsStatus(row: NewsItemRow, now: number): NewsStatus {
  if (row.is_draft) return "draft";
  const start = Date.parse(row.starts_at);
  const end = Date.parse(row.ends_at);
  if (Number.isFinite(start) && now < start) return "scheduled";
  if (Number.isFinite(end) && now > end) return "ended";
  return "active";
}

// --- logs (bug reports + AI triage summary) ------------------------------

export type Severity = "low" | "medium" | "high" | "critical";

export type BugReportRow = {
  id: string;
  created_at: string;
  email: string;
  app_version: string | null;
  macos_version: string | null;
  /** Raw log. Only present on GET /admin/logs/:id (the list omits it
   *  because rows can be ~200 KB). */
  log_tail?: string;
  /** AI headline, null until the async Gemini summary lands. */
  title: string | null;
  summary: string | null;
  /** Model guess — render as a coloured chip, not a hard truth. */
  severity: Severity | null;
  summary_model: string | null;
  summarized_at: string | null;
};

export async function listLogs(limit = 100): Promise<BugReportRow[]> {
  const data = await adminFetch<{ items: BugReportRow[] }>(
    `/admin/logs?limit=${limit}`,
  );
  return data.items ?? [];
}

export async function getLog(id: string): Promise<BugReportRow> {
  const data = await adminFetch<{ item: BugReportRow }>(`/admin/logs/${id}`);
  return data.item;
}

export async function summarizeLog(id: string): Promise<BugReportRow> {
  const data = await adminFetch<{ ok: boolean; item: BugReportRow }>(
    `/admin/logs/${id}/summarize`,
    { method: "POST" },
  );
  return data.item;
}
