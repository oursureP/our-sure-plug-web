"use client";

import { Menu } from "lucide-react";
import { ThemeToggle } from "@/app/components/web/theme-toggle";
import { useAuthStore } from "@/app/stores/auth.store";
import { UserMenu } from "./user-menu";
import { NotificationBell } from "./notification-bell";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-primary bg-card px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="text-muted-foreground transition-colors hover:text-foreground lg:hidden"
          aria-label="Open menu">
          <Menu size={22} />
        </button>
        <div className="lg:hidden block">
          <h1 className="text-[15px] font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
        </div>
        <div>
          <h1 className="text-[15px] font-bold tracking-tight text-foreground hidden lg:block">
            Welcome back, {user?.firstName ?? "there"}
          </h1>
          <p className="hidden text-[12px] text-muted-foreground sm:block">
            Here&apos;s what&apos;s happening today.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Notifications">
          
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </button> */}
        <NotificationBell />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}

{
  /* <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-primary bg-background/95 px-4 backdrop-blur-md sm:px-6">
  <div className="flex items-center gap-3">
    <button
      onClick={onMenuClick}
      className="text-muted-foreground transition-colors hover:text-foreground lg:hidden"
      aria-label="Open menu">
      <Menu size={22} />
    </button>
    <div className="hidden sm:block">
      <h1 className="text-[15px] font-bold tracking-tight text-foreground">
        Dashboard
      </h1>
    </div>
  </div>

  <div className="flex items-center gap-2">
    <button
      className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
      aria-label="Notifications">
      <Bell size={17} />
      <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
    </button>
    <ThemeToggle />
    <UserMenu />
  </div>
</header>; */
}
