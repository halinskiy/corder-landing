import { LogsList } from "@/components/admin/LogsList";

const DATA_SOURCE = "projects/corder-landing/src/app/admin/logs/page.tsx";

/** /admin/logs -- bug reports + AI triage summaries. */
export default function AdminLogsPage() {
  return <LogsList key={DATA_SOURCE} />;
}
