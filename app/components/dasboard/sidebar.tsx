"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, X, PanelLeftClose } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/app/stores/auth.store";
import { dashboardNav } from "@/app/config/dashboard-nav";

export function Sidebar({
  open,
  onClose,
  collapsed,
  onToggleCollapse,
}: {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const items = dashboardNav.filter(
    (item) => user && item.roles.includes(user.role),
  );

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-primary bg-primary/15 transition-all duration-300 ",
          collapsed ? "w-18" : "w-64",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}>
        {/* Logo + collapse toggle */}
        <div className="flex h-15.5 items-center justify-between border-b border-border px-3">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-2.5",
              collapsed && "justify-center",
            )}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-[13px] font-extrabold text-primary-foreground">
              OS
            </div>
            {!collapsed && (
              <span className="text-[14px] font-bold tracking-tight text-foreground">
                Our<span className="text-primary">Sure</span>Plug
              </span>
            )}
          </Link>
          {/* Mobile close */}
          <button
            onClick={onClose}
            className="text-muted-foreground lg:hidden"
            aria-label="Close menu">
            <X size={20} />
          </button>

          {/* Desktop collapse toggle */}
          {/* {!collapsed && (
            <button
              onClick={onToggleCollapse}
              className="hidden text-muted-foreground transition-colors hover:text-foreground lg:block"
              aria-label="Collapse sidebar">
              <PanelLeftClose size={18} />
            </button>
          )} */}
        </div>
        <div className="flex relative">
          {/* <hr className="w-full bg-primary h-0.5" /> */}
          <button
            onClick={onToggleCollapse}
            className="hidden text-primary transition-colors hover:text-foreground lg:block absolute -right-4 -top-6"
            aria-label="Collapse sidebar">
            <PanelLeftClose size={18} />
          </button>
        </div>
        {/* Expand button when collapsed */}
        {/* {collapsed && (
          <button
            onClick={onToggleCollapse}
            className="mx-auto mt-2 hidden text-muted-foreground transition-colors hover:text-foreground lg:block"
            aria-label="Expand sidebar">
            <PanelLeftOpen size={18} />
          </button>
        )} */}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 [&::-webkit-scrollbar]:w-px [&::-webkit-scrollbar-track]:bg-none [&::-webkit-scrollbar-thumb]:bg-primary [&::-webkit-scrollbar-thumb]:rounded-full">
          <ul className="space-y-1">
            {items.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors",
                      collapsed && "justify-center px-0",
                      active
                        ? "bg-primary/12 text-primary"
                        : "text-foreground hover:bg-foreground/4 hover:text-foreground",
                    )}>
                    <item.icon size={18} className="shrink-0" />
                    {!collapsed && item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User + logout */}
        <div className="border-t border-border p-3">
          {!collapsed ? (
            <>
              <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-primary-foreground">
                  {user ? `${user.firstName[0]}${user.lastName[0]}` : "U"}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-semibold text-foreground">
                    {user ? `${user.firstName} ${user.lastName}` : "User"}
                  </div>
                  <div className="truncate text-[11.5px] capitalize text-muted-foreground">
                    {user?.role.toLowerCase().replace(/_/g, " ")}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                <LogOut size={18} /> Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="flex w-full items-center justify-center rounded-lg py-2.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
              <LogOut size={18} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
