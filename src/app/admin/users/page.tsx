import { UsersTable } from "@/components/admin/UsersTable";

const DATA_SOURCE = "projects/corder-landing/src/app/admin/users/page.tsx";

/** /admin/users -- the users table. Auth + chrome come from admin/layout.tsx. */
export default function AdminUsersPage() {
  return <UsersTable key={DATA_SOURCE} />;
}
