/**
 * Browser Supabase client (admin panel only).
 *
 * The landing is a static export, so there is no server runtime and no
 * server-held secret. The operator authenticates client-side with the
 * Supabase `anon` key (public by design, like a Stripe `pk_` key) and a
 * magic link. The session JWT it receives carries
 * `app_metadata.role === "admin"`, which the corder-api Worker verifies
 * on every /admin/** request. Nothing here grants privilege on its own;
 * the Worker is the gate.
 *
 * URL + anon key are baked in as defaults (both are public) and can be
 * overridden at build time via NEXT_PUBLIC_* for local Supabase or a
 * future project move. The anon key default is filled once the maker
 * pastes it from Supabase dashboard -> Settings -> API.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://cfsajlsctzxgixjwslni.supabase.co";

// Public publishable key (the new Supabase equivalent of the legacy anon
// key, Settings -> API Keys -> "Publishable key"). Safe to ship in the
// static bundle: it is browser-scoped and gated by RLS. The secret key
// (sb_secret_*) must NEVER appear client-side. Override per build via
// NEXT_PUBLIC_SUPABASE_ANON_KEY.
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "sb_publishable_sqnQntW3VL3Qqh5YGzYFeA_G70fFq2N";

/** True once the anon key is present, so the guard can show a clear
 * "not configured" message instead of a cryptic Supabase error. */
export const SUPABASE_CONFIGURED = SUPABASE_ANON_KEY.length > 0;

let client: SupabaseClient | null = null;

/**
 * Singleton browser client. Created lazily so the module can be imported
 * in server components (layout metadata) without instantiating anything.
 * `detectSessionInUrl` lets the magic-link callback (token in the URL
 * hash) resolve to a session on load; `persistSession` keeps the
 * operator signed in across reloads.
 */
export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
    });
  }
  return client;
}
