import { Suspense } from "react";

import { NewsEditLoader } from "@/components/admin/NewsEditLoader";

/**
 * /admin/news/edit/?id=... -- edit a news item.
 *
 * Query-param route (not a [id] dynamic segment) so the page stays
 * compatible with `output: "export"`: no per-id pre-render is needed,
 * the id is read client-side. Same approach as /checkout.
 */
export default function AdminNewsEditPage() {
  return (
    <Suspense fallback={<p className="admin-empty">Loading item</p>}>
      <NewsEditLoader />
    </Suspense>
  );
}
