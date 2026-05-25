"use client";

import { useEffect } from "react";

/**
 * Phase 1 mock: after the spinner has been visible for ~800 ms,
 * route to /account. The real verify call lands in Phase 3 with
 *   fetch("https://api.getcorder.com/auth/verify?token=" + token,
 *         { credentials: "include" })
 * which sets the JWT cookie and returns a redirect URL.
 */
export function VerifyClient() {
  useEffect(() => {
    const t = window.setTimeout(() => {
      window.location.replace("/account");
    }, 800);
    return () => window.clearTimeout(t);
  }, []);
  return null;
}
