"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  MoreVertical,
  Eye,
  Pencil,
  Bell,
  Ban,
  CheckCircle2,
  Users as UsersIcon,
  X,
  // ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";
import { User } from "@/app/interfaces/user.interface";
import { Role } from "@/app/interfaces";
import { useUsers, useToggleUserActive } from "@/app/hooks/use-users";
import { AddUserModal } from "@/app/components/dasboard/users/add-user-modal";
import { EditUserModal } from "@/app/components/dasboard/users/edit-user-modal";
import { SendNotificationModal } from "@/app/components/dasboard/send-notification-modal";
import { ConfirmDialog } from "@/app/components/dasboard/confirm-dialog";

function resolveMessage(message: unknown): string {
  if (Array.isArray(message))
    return String(message[0] ?? "Something went wrong");
  if (typeof message === "string") return message;
  return "Something went wrong. Please try again.";
}

const ROLES: Role[] = [
  "CEO",
  "HEAD_OF_OPERATIONS",
  "DEPARTMENT_HEAD",
  "STAFF",
  "TRAINER",
  "CLIENT",
];

const ROLE_COLORS: Record<string, string> = {
  CEO: "bg-primary/[0.13] text-primary",
  HEAD_OF_OPERATIONS: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  DEPARTMENT_HEAD: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  STAFF: "bg-slate-500/15 text-slate-600 dark:text-slate-400",
  TRAINER: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  CLIENT: "bg-green-500/15 text-green-600 dark:text-green-400",
};

function RowActions({
  user,
  onView,
  onEdit,
  onNotify,
  onToggle,
}: {
  user: User;
  onView: () => void;
  onEdit: () => void;
  onNotify: () => void;
  onToggle: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-foreground">
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-border bg-popover py-1 shadow-xl">
          <button
            onClick={() => {
              setOpen(false);
              onView();
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-foreground hover:bg-foreground/5">
            <Eye size={15} className="text-muted-foreground" /> View Details
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-foreground hover:bg-foreground/5">
            <Pencil size={15} className="text-muted-foreground" /> Edit
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onNotify();
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-foreground hover:bg-foreground/5">
            <Bell size={15} className="text-muted-foreground" /> Send
            Notification
          </button>
          <div className="my-1 h-px bg-border" />
          <button
            onClick={() => {
              setOpen(false);
              onToggle();
            }}
            className={cn(
              "flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium",
              user.isActive
                ? "text-destructive hover:bg-destructive/10"
                : "text-green-600 hover:bg-green-500/10 dark:text-green-400",
            )}>
            {user.isActive ? (
              <>
                <Ban size={15} /> Deactivate
              </>
            ) : (
              <>
                <CheckCircle2 size={15} /> Activate
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default function UsersPage() {
  const router = useRouter();
  const { data: users, isLoading } = useUsers();
  const toggleActive = useToggleUserActive();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [notifying, setNotifying] = useState<User | null>(null);
  const [toggling, setToggling] = useState<User | null>(null);

  const list = users ?? [];
  const filtered = list.filter((u) => {
    const matchesSearch =
      `${u.firstName} ${u.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" ? u.isActive : !u.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggle = async () => {
    if (!toggling) return;
    try {
      await toggleActive.mutateAsync({
        id: toggling.id,
        activate: !toggling.isActive,
      });
      toast.success(toggling.isActive ? "User deactivated" : "User activated");
      setToggling(null);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: unknown }>;
      toast.error(resolveMessage(axiosError.response?.data?.message));
    }
  };

  const selectClass =
    "rounded-lg border border-border bg-card px-3 py-2.5 text-[13px] font-medium text-foreground outline-none focus:border-primary";

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Staff & Users
          </h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">
            Manage team members, roles and access.
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:opacity-90">
          <Plus size={17} /> Add User
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 sm:max-w-xs sm:flex-1">
          <Search size={16} className="text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent py-2.5 text-[13.5px] text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="Search by name or email..."
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-muted-foreground hover:text-foreground">
              <X size={15} />
            </button>
          )}
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className={selectClass}>
          <option value="ALL">All Roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as typeof statusFilter)
          }
          className={selectClass}>
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  User
                </th>
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Role
                </th>
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Department
                </th>
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Status
                </th>
                <th className="px-5 py-3.5 text-right text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-5 py-4" colSpan={5}>
                      <div className="h-6 w-full animate-pulse rounded bg-muted" />
                    </td>
                  </tr>
                ))
              ) : filtered.length > 0 ? (
                filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-border transition-colors last:border-0 hover:bg-foreground/2">
                    <td className="px-5 py-4">
                      <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() =>
                          router.push(`/dashboard/users/${user.id}`)
                        }>
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt=""
                            width={36}
                            height={36}
                            className="h-9 w-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-primary-foreground">
                            {user.firstName[0]}
                            {user.lastName[0]}
                          </div>
                        )}
                        <div>
                          <div className="text-[13.5px] font-semibold text-foreground">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-[12px] text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide",
                          ROLE_COLORS[user.role] ?? ROLE_COLORS.STAFF,
                        )}>
                        {user.role.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-muted-foreground">
                      {user.departments && user.departments.length > 0
                        ? user.departments.map((d) => d.name).join(", ")
                        : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase",
                          user.isActive
                            ? "bg-green-500/15 text-green-600 dark:text-green-400"
                            : "bg-destructive/15 text-destructive",
                        )}>
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            user.isActive ? "bg-green-500" : "bg-destructive",
                          )}
                        />
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <RowActions
                          user={user}
                          onView={() =>
                            router.push(`/dashboard/users/${user.id}`)
                          }
                          onEdit={() => setEditing(user)}
                          onNotify={() => setNotifying(user)}
                          onToggle={() => setToggling(user)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <UsersIcon
                      size={32}
                      className="mx-auto mb-3 text-muted-foreground/40"
                    />
                    <p className="text-[14px] font-semibold text-foreground">
                      No users found
                    </p>
                    <p className="mt-1 text-[13px] text-muted-foreground">
                      {search || roleFilter !== "ALL" || statusFilter !== "ALL"
                        ? "Try adjusting your filters."
                        : "Add your first user to get started."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {addOpen && <AddUserModal onClose={() => setAddOpen(false)} />}
      {editing && (
        <EditUserModal user={editing} onClose={() => setEditing(null)} />
      )}
      {notifying && (
        <SendNotificationModal
          userId={notifying.id}
          userName={`${notifying.firstName} ${notifying.lastName}`}
          onClose={() => setNotifying(null)}
        />
      )}
      {toggling && (
        <ConfirmDialog
          title={toggling.isActive ? "Deactivate user?" : "Activate user?"}
          message={
            toggling.isActive
              ? `${toggling.firstName} will lose access until reactivated.`
              : `${toggling.firstName} will regain access to the system.`
          }
          confirmLabel={toggling.isActive ? "Deactivate" : "Activate"}
          loading={toggleActive.isPending}
          onConfirm={handleToggle}
          onClose={() => setToggling(null)}
        />
      )}
    </div>
  );
}
