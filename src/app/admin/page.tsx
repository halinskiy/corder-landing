import { UsersTable } from "@/components/admin/UsersTable";

const DATA_SOURCE = "projects/corder-landing/src/app/admin/page.tsx";

/** /admin -- users tab. Auth + chrome come from admin/layout.tsx. */
export default function AdminUsersPage() {
  return <UsersTable key={DATA_SOURCE} />;
}
