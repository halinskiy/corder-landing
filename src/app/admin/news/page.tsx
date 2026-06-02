import { NewsList } from "@/components/admin/NewsList";

const DATA_SOURCE = "projects/corder-landing/src/app/admin/news/page.tsx";

/** /admin/news -- list of all news items. */
export default function AdminNewsPage() {
  return <NewsList key={DATA_SOURCE} />;
}
