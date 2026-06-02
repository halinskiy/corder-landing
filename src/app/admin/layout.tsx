import type { Metadata } from "next";

// react-day-picker base styles, overridden to the Corder palette in
// globals.css (.admin-rdp). Imported here so it loads on every admin
// route but nowhere else on the public site.
import "react-day-picker/style.css";

import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin",
  // Operator-only surface. Never index, never follow.
  robots: { index: false, follow: false },
};

/**
 * Layout for every /admin/** route.
 *
 * AdminGuard gates access client-side (Supabase session + admin role);
 * AdminShell renders only once an admin session is confirmed, so the
 * sign-in and not-authorised states never show the tabs.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}
