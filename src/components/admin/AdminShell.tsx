"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { getSupabase } from "@/lib/supabase";

const DATA_SOURCE =
  "projects/corder-landing/src/components/admin/AdminShell.tsx";

const TABS = [
  { href: "/admin/", label: "Users", match: (p: string) => p === "/admin" || p === "/admin/" },
  { href: "/admin/news/", label: "News", match: (p: string) => p.startsWith("/admin/news") },
  { href: "/admin/logs/", label: "Logs", match: (p: string) => p.startsWith("/admin/logs") },
] as const;

/**
 * Chrome for every admin page: a title row, two section tabs, and the
 * operator's email with a sign-out control. Sits inside the shared
 * .legal-page shell so the typography, spacing and back-to-home arrow
 * match the rest of the site. Only ever rendered once the AdminGuard
 * has confirmed an admin session.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const [operator, setOperator] = useState("");

  useEffect(() => {
    getSupabase()
      .auth.getSession()
      .then(({ data }) => setOperator(data.session?.user?.email ?? ""));
  }, []);

  // Each tab carries its own matcher: News/Logs stay active across their
  // sub-routes (new / edit / detail), Users matches only the /admin root.
  function isActive(tab: (typeof TABS)[number]): boolean {
    return tab.match(pathname);
  }

  return (
    <main
      className="legal-page admin-page"
      data-component="AdminShell"
      data-source={DATA_SOURCE}
    >
      <div className="page-container py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] admin-body">
          <header className="admin-header">
            <h1 className="install-page__heading admin-header__title">Admin</h1>
            {operator && (
              <div className="admin-header__operator">
                <span className="admin-header__email">{operator}</span>
                <button
                  type="button"
                  className="admin-header__signout"
                  onClick={() => getSupabase().auth.signOut()}
                >
                  Sign out
                </button>
              </div>
            )}
          </header>

          <nav className="admin-tabs" aria-label="Admin sections">
            {TABS.map((tab) => {
              const active = isActive(tab);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`admin-tab${active ? " admin-tab--active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>

          {children}
        </div>
      </div>
    </main>
  );
}
