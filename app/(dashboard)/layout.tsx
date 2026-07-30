"use client";

import { useEffect, useState } from "react";
import { RoleGuard } from "@/app/components/auth/role-guard";
import { Topbar } from "../components/dasboard/topbar";
import { STAFF_ROLES } from "../lib/roles";
import { Sidebar } from "../components/dasboard/sidebar";
import { cn } from "@/lib/utils";
import { usersApi } from "../lib/api/users.api";
import { useAuthStore } from "../stores/auth.store";
import NextTopLoader from "nextjs-toploader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Only refetch if we think we're logged in
    if (!isAuthenticated) return;

    let cancelled = false;
    (async () => {
      try {
        const fullProfile = await usersApi.getProfile();
        if (!cancelled) setUser(fullProfile);
      } catch (error) {
        // If the token is invalid/expired, the profile call 401s — log out cleanly
        const status = (error as { response?: { status?: number } })?.response
          ?.status;
        if (status === 401 && !cancelled) {
          logout();
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [setUser, logout, isAuthenticated]);

  return (
    <RoleGuard allow={STAFF_ROLES}>
      <NextTopLoader
        color="var(--brand-purple)"
        height={3}
        showSpinner={true}
      />
      <div className="min-h-screen bg-background">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />
        <div
          className={cn(
            "transition-all duration-300",
            collapsed ? "lg:pl-18" : "lg:pl-64",
          )}>
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}
