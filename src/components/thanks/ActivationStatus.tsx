"use client";

import { useEffect, useState } from "react";

const DATA_SOURCE =
  "projects/corder-landing/src/components/thanks/ActivationStatus.tsx";

type ActivationState = "loading" | "confirmed" | "no-token";

/**
 * Tiny status pill above the /thanks heading.
 *
 * Reads Paddle's `?_ptxn=<txn_id>` query param the success-URL flow
 * leaves behind. Three states:
 *
 *   loading    -- ptxn present, briefly while we settle in.
 *   confirmed  -- ptxn present, shows "Order confirmed".
 *   no-token   -- direct hit on /thanks/ (email link, manual nav).
 *
 * Phase 3 will replace the synchronous confirm with a POST to
 * `/api/activate` against the activation Worker -- that endpoint
 * verifies the txn against Paddle Transactions API, flips the
 * subscription to active in our DB, and returns the licence key
 * so we can render plan + key inline. Until that Worker exists,
 * the Paddle licence email + the Mac app's activation prompt
 * carry the user the rest of the way.
 */
export function ActivationStatus() {
  const [state, setState] = useState<ActivationState>("loading");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ptxn = params.get("_ptxn");
    setState(ptxn ? "confirmed" : "no-token");
  }, []);

  return (
    <span
      className="thanks-page__status"
      data-component="ActivationStatus"
      data-source={DATA_SOURCE}
      data-state={state}
    >
      {state === "loading" && "Confirming"}
      {state === "confirmed" && "Order confirmed"}
      {state === "no-token" && "Welcome"}
    </span>
  );
}
