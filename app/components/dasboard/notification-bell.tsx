"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  Trash2,
  CheckSquare,
  AlertTriangle,
  DollarSign,
  Briefcase,
  UserPlus,
  TrendingUp,
  Info,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Notification, NotificationType } from "@/app/interfaces/notification";
import {
  useNotifications,
  useUnreadCount,
  useMarkRead,
  useMarkAllRead,
  useDeleteNotification,
} from "@/app/hooks/use-notifications";

const ICONS: Record<NotificationType, LucideIcon> = {
  TASK_ASSIGNED: CheckSquare,
  TASK_DUE_SOON: AlertTriangle,
  TASK_OVERDUE: AlertTriangle,
  PROJECT_UPDATE: Briefcase,
  INVOICE_GENERATED: DollarSign,
  PAYMENT_RECEIVED: DollarSign,
  NEW_CLIENT: UserPlus,
  NEW_LEAD: TrendingUp,
  GENERAL: Info,
};

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
  });
}

export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: notifications } = useNotifications();
  const { data: unreadData } = useUnreadCount();
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();
  const deleteNotif = useDeleteNotification();

  const list = notifications ?? [];
  const unreadCount =
    typeof unreadData === "number"
      ? unreadData
      : (unreadData?.count ?? list.filter((n) => !n.isRead).length);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClick = (n: Notification) => {
    if (!n.isRead) markRead.mutate(n.id);
    if (n.link) {
      setOpen(false);
      router.push(n.link);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Notifications">
        <Bell size={17} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl sm:w-96">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-[14px] font-bold text-foreground">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead.mutate()}
                className="flex items-center gap-1 text-[11.5px] font-semibold text-primary hover:underline">
                <Check size={13} /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-100 overflow-y-auto">
            {list.length > 0 ? (
              list.map((n) => {
                const Icon = ICONS[n.type] ?? Info;
                return (
                  <div
                    key={n.id}
                    className={cn(
                      "group flex gap-3 border-b border-border px-4 py-3 transition-colors last:border-0 hover:bg-foreground/2",
                      !n.isRead && "bg-primary/3",
                    )}>
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        n.isRead
                          ? "bg-muted text-muted-foreground"
                          : "bg-primary/13 text-primary",
                      )}>
                      <Icon size={16} />
                    </div>
                    <div
                      className="min-w-0 flex-1 cursor-pointer"
                      onClick={() => handleClick(n)}>
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[13px] font-semibold text-foreground">
                          {n.title}
                        </p>
                        {!n.isRead && (
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">
                        {n.body}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteNotif.mutate(n.id)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                      aria-label="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-12 text-center">
                <Bell
                  size={28}
                  className="mx-auto mb-2 text-muted-foreground/40"
                />
                <p className="text-[13px] font-medium text-foreground">
                  No notifications
                </p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">
                  You&apos;re all caught up!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
