"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { NewsForm } from "@/components/admin/NewsForm";
import {
  AdminApiError,
  getNewsItem,
  type NewsItemRow,
} from "@/lib/admin-api";

const DATA_SOURCE =
  "projects/corder-landing/src/components/admin/NewsEditLoader.tsx";

type LoadState =
  | { phase: "loading" }
  | { phase: "ready"; item: NewsItemRow }
  | { phase: "missing"; msg: string };

/**
 * Reads `?id=` from the URL (static-export-friendly, same pattern as
 * /checkout), loads the matching news row from the list endpoint, then
 * hands it to the shared NewsForm in edit mode. Wrapped in a Suspense
 * boundary by the page because it calls useSearchParams.
 */
export function NewsEditLoader() {
  const params = useSearchParams();
  const id = params.get("id");
  const [state, setState] = useState<LoadState>({ phase: "loading" });

  useEffect(() => {
    if (!id) {
      setState({ phase: "missing", msg: "No item id in the link." });
      return;
    }
    let live = true;
    getNewsItem(id)
      .then((item) => {
        if (!live) return;
        if (item) setState({ phase: "ready", item });
        else setState({ phase: "missing", msg: "That item no longer exists." });
      })
      .catch((e: unknown) => {
        if (!live) return;
        setState({
          phase: "missing",
          msg: e instanceof AdminApiError ? e.message : "Could not load item.",
        });
      });
    return () => {
      live = false;
    };
  }, [id]);

  if (state.phase === "loading") {
    return (
      <p className="admin-empty" data-source={DATA_SOURCE}>
        Loading item
      </p>
    );
  }

  if (state.phase === "missing") {
    return (
      <div className="admin-panel" data-source={DATA_SOURCE}>
        <p className="admin-error" role="alert">
          {state.msg}
        </p>
        <Link href="/admin/news/" className="admin-link">
          Back to news
        </Link>
      </div>
    );
  }

  return <NewsForm mode="edit" id={state.item.id} initial={state.item} />;
}
