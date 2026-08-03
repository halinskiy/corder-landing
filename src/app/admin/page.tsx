import { StatsDashboard } from "@/components/admin/StatsDashboard";

const DATA_SOURCE = "projects/corder-landing/src/app/admin/page.tsx";

/** /admin -- Overview (traction dashboard). Auth + chrome come from
 *  admin/layout.tsx; the Users table now lives at /admin/users/. */
export default function AdminOverviewPage() {
  return <StatsDashboard key={DATA_SOURCE} />;
}
