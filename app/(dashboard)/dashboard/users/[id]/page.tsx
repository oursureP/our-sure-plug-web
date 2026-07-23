"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Globe,
  Building2,
  Shield,
  Bell,
  Pencil,
  Ban,
  CheckCircle2,
  BadgeCheck,
  Loader2,
  UserCog,
  Plus,
  X,
  CheckSquare,
  Calendar,
  // AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";
import { Role } from "@/app/interfaces";
import {
  useUser,
  useUpdateUserRole,
  useToggleUserActive,
  useAddPrivilege,
  useRemovePrivilege,
  usePrivilegeList,
} from "@/app/hooks/use-users";
import { useUserTasks } from "@/app/hooks/use-tasks";
import {
  useDepartments,
  useAddUserToDepartment,
  useRemoveUserFromDepartment,
} from "@/app/hooks/use-departments";
import { EditUserModal } from "@/app/components/dasboard/users/edit-user-modal";
import { SendNotificationModal } from "@/app/components/dasboard/send-notification-modal";
import { ConfirmDialog } from "@/app/components/dasboard/confirm-dialog";
import { hasPrivilege, PRIVILEGES } from "@/app/lib/privileges";
import { useAuthStore } from "@/app/stores/auth.store";

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

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "text-slate-500 bg-slate-500/10",
  MEDIUM: "text-blue-600 bg-blue-500/10 dark:text-blue-400",
  HIGH: "text-amber-600 bg-amber-500/10 dark:text-amber-400",
  CRITICAL: "text-red-600 bg-red-500/10 dark:text-red-400",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-slate-500/15 text-slate-600 dark:text-slate-400",
  IN_PROGRESS: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  IN_REVIEW: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  COMPLETED: "bg-green-500/15 text-green-600 dark:text-green-400",
  OVERDUE: "bg-red-500/15 text-red-600 dark:text-red-400",
};

export default function SingleUserPage() {
  const { id } = useParams<{ id: string }>();
  const { data: privilegeGroups } = usePrivilegeList();
  const me = useAuthStore((s) => s.user);
const canAssignRole = hasPrivilege(me, PRIVILEGES.ASSIGN_ROLE);
const canBlock = hasPrivilege(me, PRIVILEGES.BLOCK_USER);
const canManagePrivileges = hasPrivilege(me, PRIVILEGES.MANAGE_PRIVILEGES);
const canManageDepts = hasPrivilege(me, PRIVILEGES.MANAGE_DEPARTMENTS);
  // const router = useRouter();
  const addPriv = useAddPrivilege();
  const removePriv = useRemovePrivilege();
  const [newPriv, setNewPriv] = useState("");
  const { data: user, isLoading } = useUser(id);
  const { data: tasks } = useUserTasks(id);
  const { data: departments } = useDepartments();
  const roleMut = useUpdateUserRole();
  const toggleMut = useToggleUserActive();
  const addDept = useAddUserToDepartment();
  const removeDept = useRemoveUserFromDepartment();

  const [editOpen, setEditOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [toggleOpen, setToggleOpen] = useState(false);
  const [roleValue, setRoleValue] = useState<string>("");
  const [deptValue, setDeptValue] = useState<string>("");

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }
  if (!user) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <p className="text-lg font-bold text-foreground">User not found</p>
        <Link
          href="/dashboard/users"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft size={15} /> Back to users
        </Link>
      </div>
    );
  }

  const initials = `${user.firstName[0]}${user.lastName[0]}`;
  const roleLabel = user.role.toLowerCase().replace(/_/g, " ");
  const privileges = (user as { privileges?: string[] }).privileges ?? [];

  const handleRoleChange = async () => {
    if (!roleValue || roleValue === user.role) return;
    try {
      await roleMut.mutateAsync({ id: user.id, role: roleValue });
      toast.success("Role updated");
      setRoleValue("");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: unknown }>;
      toast.error(resolveMessage(axiosError.response?.data?.message));
    }
  };

  const handleToggle = async () => {
    try {
      await toggleMut.mutateAsync({ id: user.id, activate: !user.isActive });
      toast.success(user.isActive ? "User deactivated" : "User activated");
      setToggleOpen(false);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: unknown }>;
      toast.error(resolveMessage(axiosError.response?.data?.message));
    }
  };

  const handleAddDept = async () => {
    if (!deptValue) return;
    try {
      await addDept.mutateAsync({ departmentId: deptValue, userId: user.id });
      toast.success("Added to department");
      setDeptValue("");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: unknown }>;
      toast.error(resolveMessage(axiosError.response?.data?.message));
    }
  };

  const handleRemoveDept = async (departmentId: string) => {
    try {
      await removeDept.mutateAsync({ departmentId, userId: user.id });
      toast.success("Removed from department");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: unknown }>;
      toast.error(resolveMessage(axiosError.response?.data?.message));
    }
  };

  const handleAddPriv = async () => {
    if (!newPriv) return;
    try {
      await addPriv.mutateAsync({ id: user.id, privilege: newPriv });
      toast.success("Privilege granted");
      setNewPriv("");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: unknown }>;
      toast.error(resolveMessage(axiosError.response?.data?.message));
    }
  };

  const handleRemovePriv = async (privilege: string) => {
    try {
      await removePriv.mutateAsync({ id: user.id, privilege });
      toast.success("Privilege removed");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: unknown }>;
      toast.error(resolveMessage(axiosError.response?.data?.message));
    }
  };

  const detailRow = (
    Icon: typeof Mail,
    label: string,
    value?: string | null,
  ) => (
    <div className="flex items-start gap-3 py-2.5">
      <Icon size={15} className="mt-0.5 text-muted-foreground" />
      <div>
        <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div className="text-[13.5px] text-foreground">
          {value || <span className="text-muted-foreground">Not set</span>}
        </div>
      </div>
    </div>
  );

  const sectionCard = "rounded-2xl border border-border bg-card p-6";
  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-[13px] text-foreground outline-none focus:border-primary";

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/dashboard/users"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary">
        <ArrowLeft size={15} /> Back to users
      </Link>

      {/* Header card */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-card">
        <div
          className="h-20"
          style={{
            background: "linear-gradient(120deg, var(--brand-purple), #6b21d6)",
          }}
        />
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              {user.image ? (
                <Image
                  src={user.image}
                  alt=""
                  width={88}
                  height={88}
                  className="rounded-2xl border-4 border-card object-cover"
                  style={{ height: 88, width: 88 }}
                />
              ) : (
                <div
                  className="flex items-center justify-center rounded-2xl border-4 border-card bg-primary text-2xl font-bold text-primary-foreground"
                  style={{ height: 88, width: 88 }}>
                  {initials}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setNotifyOpen(true)}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-[13px] font-semibold text-foreground hover:bg-foreground/4">
                <Bell size={14} /> Notify
              </button>
              <button
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-[13px] font-bold text-primary-foreground hover:opacity-90">
                <Pencil size={14} /> Edit
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-extrabold tracking-tight text-foreground">
              {user.firstName} {user.lastName}
            </h1>
            <span className="rounded-full bg-primary/13 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-primary">
              {roleLabel}
            </span>
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase",
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
            {user.isEmailVerified && (
              <span className="flex items-center gap-1 text-[11.5px] font-medium text-primary">
                <BadgeCheck size={14} /> Verified
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* LEFT column */}
        <div className="space-y-6">
          {/* Details */}
          <div className={sectionCard}>
            <h2 className="mb-3 text-[15px] font-bold text-foreground">
              Details
            </h2>
            <div className="grid gap-x-6 sm:grid-cols-2">
              {detailRow(Mail, "Email", user.email)}
              {detailRow(Phone, "Phone", user.phone)}
              {detailRow(UserCog, "Gender", user.gender)}
              {detailRow(MapPin, "Address", user.address)}
              {detailRow(Globe, "Country", user.country)}
              {detailRow(MapPin, "State", user.state)}
            </div>
            {user.bio && (
              <p className="mt-3 border-t border-border pt-3 text-[13px] leading-relaxed text-muted-foreground">
                {user.bio}
              </p>
            )}
          </div>

          {/* Department management */}
          {/* Department management — multi */}
          {canManageDepts && (
            <div className={sectionCard}>
              <h2 className="mb-4 flex items-center gap-2 text-[15px] font-bold text-foreground">
                <Building2 size={17} className="text-primary" /> Departments
              </h2>

              {/* Current departments as chips */}
              {user.departments && user.departments.length > 0 ? (
                <div className="mb-4 flex flex-wrap gap-2">
                  {user.departments.map((d) => (
                    <span
                      key={d.id}
                      className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 py-1.5 pl-3 pr-2 text-[12.5px] font-medium text-foreground">
                      {d.name}
                      <button
                        onClick={() => handleRemoveDept(d.id)}
                        disabled={removeDept.isPending}
                        className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                        aria-label={`Remove from ${d.name}`}>
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mb-4 text-[13px] text-muted-foreground">
                  Not a member of any department yet.
                </p>
              )}

              {/* Add to a department */}
              <div className="flex gap-2">
                <select
                  value={deptValue}
                  onChange={(e) => setDeptValue(e.target.value)}
                  className={inputClass}>
                  <option value="">Add to department...</option>
                  {(departments ?? [])
                    .filter(
                      (d) => !user.departments?.some((ud) => ud.id === d.id),
                    )
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                </select>
                <button
                  onClick={handleAddDept}
                  disabled={!deptValue || addDept.isPending}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60">
                  {addDept.isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Plus size={14} />
                  )}{" "}
                  Add
                </button>
              </div>
            </div>
          )}
          {/* Privileges (read-only for now) */}
          {/* Privileges */}
          {canManagePrivileges && (
            <div className={sectionCard}>
              <h2 className="mb-4 flex items-center gap-2 text-[15px] font-bold text-foreground">
                <Shield size={17} className="text-primary" /> Privileges
              </h2>

              {/* Add privilege */}
              <div className="mb-4 flex gap-2">
                <select
                  value={newPriv}
                  onChange={(e) => setNewPriv(e.target.value)}
                  className={inputClass}>
                  <option value="">Select a privilege to grant...</option>
                  {(privilegeGroups ?? []).map((grp) => (
                    <optgroup key={grp.group} label={grp.group}>
                      {grp.items
                        .filter((p) => !privileges.includes(p))
                        .map((p) => (
                          <option key={p} value={p}>
                            {p.replace(/_/g, " ")}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
                <button
                  onClick={handleAddPriv}
                  disabled={!newPriv || addPriv.isPending}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60">
                  {addPriv.isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Plus size={14} />
                  )}{" "}
                  Grant
                </button>
              </div>

              {/* Privilege chips */}
              {privileges.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {privileges.map((p) => (
                    <span
                      key={p}
                      className="flex items-center gap-2 rounded-lg bg-primary/10 py-1.5 pl-3 pr-2 text-[12.5px] font-medium text-primary">
                      {p}
                      <button
                        onClick={() => handleRemovePriv(p)}
                        disabled={removePriv.isPending}
                        className="flex h-5 w-5 items-center justify-center rounded text-primary/70 transition-colors hover:bg-destructive/15 hover:text-destructive disabled:opacity-50"
                        aria-label={`Remove ${p}`}>
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border p-6 text-center">
                  <Shield
                    size={24}
                    className="mx-auto mb-2 text-muted-foreground/50"
                  />
                  <p className="text-[12.5px] text-muted-foreground">
                    No custom privileges yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT column */}
        <div className="space-y-6">
          {/* Role management */}
          {canAssignRole && (
            <div className={sectionCard}>
              <h2 className="mb-4 flex items-center gap-2 text-[15px] font-bold text-foreground">
                <UserCog size={17} className="text-primary" /> Role
              </h2>
              <select
                value={roleValue || user.role}
                onChange={(e) => setRoleValue(e.target.value)}
                className={inputClass}>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              <button
                onClick={handleRoleChange}
                disabled={
                  !roleValue || roleValue === user.role || roleMut.isPending
                }
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-[13px] font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50">
                {roleMut.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Updating...
                  </>
                ) : (
                  "Update Role"
                )}
              </button>
            </div>
          )}
          {/* Status management */}

          {canBlock && (
            <div className={sectionCard}>
              <h2 className="mb-3 text-[15px] font-bold text-foreground">
                Account Status
              </h2>
              <p className="mb-4 text-[12.5px] text-muted-foreground">
                {user.isActive
                  ? "This user currently has access to the system."
                  : "This user is blocked from accessing the system."}
              </p>
              <button
                onClick={() => setToggleOpen(true)}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-[13px] font-bold transition-colors",
                  user.isActive
                    ? "border border-destructive/30 text-destructive hover:bg-destructive/10"
                    : "bg-green-600 text-white hover:opacity-90",
                )}>
                {user.isActive ? (
                  <>
                    <Ban size={15} /> Block User
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={15} /> Unblock User
                  </>
                )}
              </button>
            </div>
          )}
          {/* Assigned tasks */}
          <div className={sectionCard}>
            <h2 className="mb-4 flex items-center gap-2 text-[15px] font-bold text-foreground">
              <CheckSquare size={17} className="text-primary" /> Assigned Tasks
            </h2>
            {tasks && tasks.length > 0 ? (
              <div className="space-y-2">
                {tasks.slice(0, 6).map((t) => (
                  <div
                    key={t.id}
                    className="rounded-xl border border-border p-3">
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <span className="truncate text-[13px] font-semibold text-foreground">
                        {t.title}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 rounded-md px-2 py-0.5 text-[9.5px] font-bold uppercase",
                          PRIORITY_COLORS[t.priority] ?? PRIORITY_COLORS.MEDIUM,
                        )}>
                        {t.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-[9.5px] font-bold uppercase",
                          STATUS_COLORS[t.status] ?? STATUS_COLORS.PENDING,
                        )}>
                        {t.status.replace(/_/g, " ")}
                      </span>
                      {t.deadline && (
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Calendar size={11} />{" "}
                          {new Date(t.deadline).toLocaleDateString("en-NG", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {tasks.length > 6 && (
                  <p className="pt-1 text-center text-[12px] text-muted-foreground">
                    +{tasks.length - 6} more tasks
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-6 text-center">
                <CheckSquare
                  size={24}
                  className="mx-auto mb-2 text-muted-foreground/50"
                />
                <p className="text-[12.5px] text-muted-foreground">
                  No tasks assigned.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {editOpen && (
        <EditUserModal user={user} onClose={() => setEditOpen(false)} />
      )}
      {notifyOpen && (
        <SendNotificationModal
          userId={user.id}
          userName={`${user.firstName} ${user.lastName}`}
          onClose={() => setNotifyOpen(false)}
        />
      )}
      {toggleOpen && (
        <ConfirmDialog
          title={user.isActive ? "Block user?" : "Unblock user?"}
          message={
            user.isActive
              ? `${user.firstName} will lose access until unblocked.`
              : `${user.firstName} will regain access.`
          }
          confirmLabel={user.isActive ? "Block" : "Unblock"}
          loading={toggleMut.isPending}
          onConfirm={handleToggle}
          onClose={() => setToggleOpen(false)}
        />
      )}
    </div>
  );
}
