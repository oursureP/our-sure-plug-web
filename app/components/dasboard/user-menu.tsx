"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/app/stores/auth.store";
import Image from "next/image";

export function UserMenu() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) return null;

  const initials = `${user.firstName[0]}${user.lastName[0]}`;
  const roleLabel = user.role.toLowerCase().replace(/_/g, " ");

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 rounded-lg border border-border py-1.5 pl-1.5 pr-2.5 transition-colors hover:bg-foreground/4">
        {user.image ? (
          <Image
            src={user.image}
            alt={`${user.firstName} ${user.lastName}`}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-primary-foreground">
            {initials}
          </div>
        )}
        <span className="hidden max-w-40 truncate text-[13px] font-medium text-foreground sm:block">
          {user.firstName}
        </span>
        <ChevronDown
          size={15}
          className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-xl border border-primary bg-popover shadow-xl">
          {/* User info (static, disabled-looking) */}
          <div className="border-b border-border px-2 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-primary-foreground">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="truncate text-[13px] font-semibold text-foreground">
                  {user.firstName} {user.lastName}
                </div>
                <div className="truncate text-[11.5px] capitalize text-muted-foreground">
                  {roleLabel}
                </div>
              </div>
            </div>
            <div className="mt-2 truncate text-[11.5px] text-muted-foreground">
              {user.email}
            </div>
          </div>

          {/* Actions */}
          <div className="p-1.5">
            <Link
              href="/dashboard/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-foreground/5">
              <User size={16} className="text-muted-foreground" /> My Profile
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-destructive transition-colors hover:bg-destructive/10">
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
