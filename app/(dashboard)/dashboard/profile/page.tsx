"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Camera,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Building2,
  BadgeCheck,
  Edit,
  Shield,
  User as UserIcon,
  Lock,
  Globe,
  CheckSquare,
  ArrowRight,
  Calendar,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/app/stores/auth.store";
import { usersApi } from "@/app/lib/api/users.api";
import { ChangePasswordForm } from "@/app/components/dasboard/change-password-form";
import { EditProfileModal } from "@/app/components/dasboard/edit-profile-modal";
import { useMyTasks } from "@/app/hooks/use-tasks";
import { useRouter } from "next/navigation";

function resolveMessage(message: unknown): string {
  if (Array.isArray(message))
    return String(message[0] ?? "Something went wrong");
  if (typeof message === "string") return message;
  return "Something went wrong. Please try again.";
}

// type Tab = "details" | "privileges" | "security";
type Tab = "details" | "tasks" | "departments" | "privileges" | "security";

const tabs: { key: Tab; label: string; icon: typeof UserIcon }[] = [
  { key: "details", label: "User Details", icon: UserIcon },
  { key: "tasks", label: "My Tasks", icon: CheckSquare },
  { key: "departments", label: "Departments", icon: Building2 },
  { key: "privileges", label: "Privileges", icon: Shield },
  { key: "security", label: "Security", icon: Lock },
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

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("details");
  const router = useRouter();
  const { data: myTasks, isLoading: tasksLoading } = useMyTasks();

  if (!user) return null;

  const initials = `${user.firstName[0]}${user.lastName[0]}`;
  const roleLabel = user.role.toLowerCase().replace(/_/g, " ");
  const privileges = (user as { privileges?: string[] }).privileges ?? [];
  const departments = user.departments ?? [];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await usersApi.uploadProfilePicture(
          reader.result as string,
        );
        setUser({ ...user, image: res.image });
        toast.success("Profile picture updated");
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: unknown }>;
        toast.error(resolveMessage(axiosError.response?.data?.message));
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // const tabs: { key: Tab; label: string; icon: typeof UserIcon }[] = [
  //   { key: "details", label: "User Details", icon: UserIcon },
  //   { key: "privileges", label: "Privileges", icon: Shield },
  //   { key: "security", label: "Security", icon: Lock },
  // ];

  const detailRow = (
    icon: typeof Mail,
    label: string,
    value?: string | null,
  ) => {
    const Icon = icon;
    return (
      <div className="flex items-start gap-3 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon size={16} />
        </div>
        <div className="min-w-0">
          <div className="text-[11.5px] font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </div>
          <div className="text-[13.5px] text-foreground">
            {value || <span className="text-muted-foreground">Not set</span>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-1 text-2xl font-extrabold tracking-tight text-foreground">
        My Profile
      </h1>
      <p className="mb-8 text-[13.5px] text-muted-foreground">
        Manage your information, privileges and security.
      </p>

      {/* HEADER CARD */}
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-border bg-card dark:bg-[#161427]">
        {/* Brand banner */}
        <div
          className="h-24"
          style={{
            background: "linear-gradient(120deg, var(--brand-purple), #6b21d6)",
          }}>
          <div
            aria-hidden
            className="h-full w-40 opacity-[0.15]"
            style={{
              background:
                "repeating-linear-gradient(115deg, var(--brand-green) 0 2px, transparent 2px 22px)",
            }}
          />
        </div>

        {/* Edit icon */}
        <button
          onClick={() => setEditOpen(true)}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg bg-background/90 text-foreground backdrop-blur-sm transition-colors hover:bg-background"
          aria-label="Edit profile">
          <Edit size={24} className="text-primary" />
        </button>

        <div className="px-6 pb-6">
          {/* Avatar overlapping banner */}
          <div className="-mt-12 mb-4 flex items-end justify-between">
            <div className="relative">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={`${user.firstName} ${user.lastName}`}
                  width={96}
                  height={96}
                  className="rounded-2xl border-4 border-card object-cover dark:border-[#161427]"
                  style={{ height: 96, width: 96 }}
                />
              ) : (
                <div
                  className="flex items-center justify-center rounded-2xl border-4 border-card bg-primary text-3xl font-bold text-primary-foreground dark:border-[#161427]"
                  style={{ height: 96, width: 96 }}>
                  {initials}
                </div>
              )}
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-lg border-2 border-card bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60 dark:border-[#161427]"
                aria-label="Change photo">
                {uploading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Camera size={14} />
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Name + badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl font-extrabold tracking-tight text-foreground">
              {user.firstName} {user.lastName}
            </h2>
            {/* Role badge */}
            <span className="rounded-full bg-primary/13 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-primary">
              {roleLabel}
            </span>
            {/* Status badge */}
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide",
                user.isActive !== false
                  ? "bg-green-500/15 text-green-600 dark:text-green-400"
                  : "bg-destructive/15 text-destructive",
              )}>
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  user.isActive !== false ? "bg-green-500" : "bg-destructive",
                )}
              />
              {user.isActive !== false ? "Active" : "Inactive"}
            </span>
            {user.isEmailVerified && (
              <span className="flex items-center gap-1 text-[11.5px] font-medium text-primary">
                <BadgeCheck size={14} /> Verified
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12.5px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Mail size={13} /> {user.email}
            </span>
            {user.departments && (
              <span className="flex items-center gap-1.5">
                <Building2 size={13} />{" "}
                {departments.map((d) => d.name).join(", ")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* TABBED CARD */}
      <div className="rounded-2xl border border-border bg-card dark:bg-[#161427]">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-border px-3 pt-3">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-[13px] font-semibold transition-colors",
                tab === t.key
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}>
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === "details" && (
            <div className="grid gap-x-6 sm:grid-cols-2">
              {detailRow(
                UserIcon,
                "Full Name",
                `${user.firstName} ${user.lastName}`,
              )}
              {detailRow(Phone, "Phone", user.phone)}
              {detailRow(UserIcon, "Gender", user.gender)}
              {detailRow(MapPin, "Address", user.address)}
              {detailRow(Globe, "Country", user.country)}
              {detailRow(MapPin, "State", user.state)}
              {detailRow(MapPin, "LGA", user.lga)}
              {detailRow(
                Building2,
                "Department",
                departments.map((d) => d.name).join(", "),
              )}
              <div className="sm:col-span-2">
                {detailRow(UserIcon, "Bio", user.bio)}
              </div>
            </div>
          )}

          {tab === "privileges" && (
            <div>
              <p className="mb-4 text-[13px] text-muted-foreground">
                Your access level is determined by your role:{" "}
                <span className="font-semibold capitalize text-foreground">
                  {roleLabel}
                </span>
                .
              </p>
              {privileges.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {privileges.map((p) => (
                    <span
                      key={p}
                      className="rounded-lg bg-primary/10 px-3 py-1.5 text-[12.5px] font-medium text-primary">
                      {p}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border p-8 text-center">
                  <Shield
                    size={28}
                    className="mx-auto mb-2 text-muted-foreground/50"
                  />
                  <p className="text-[13px] text-muted-foreground">
                    No custom privileges assigned. Access is based on your role.
                  </p>
                </div>
              )}
            </div>
          )}

          {tab === "security" && (
            <div>
              <h3 className="mb-1 text-[15px] font-bold text-foreground">
                Change Password
              </h3>
              <p className="mb-5 text-[12.5px] text-muted-foreground">
                Update your password to keep your account secure.
              </p>
              <ChangePasswordForm />
            </div>
          )}
          {tab === "tasks" && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-[15px] font-bold text-foreground">
                    Assigned Tasks
                  </h3>
                  <p className="text-[12.5px] text-muted-foreground">
                    Tasks currently assigned to you.
                  </p>
                </div>
                <button
                  onClick={() => router.push("/dashboard/tasks")}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:opacity-90">
                  Go to Task Board <ArrowRight size={15} />
                </button>
              </div>

              {tasksLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-12 animate-pulse rounded-lg bg-muted"
                    />
                  ))}
                </div>
              ) : myTasks && myTasks.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border text-left">
                          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                            Task
                          </th>
                          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                            Project
                          </th>
                          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                            Priority
                          </th>
                          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                            Status
                          </th>
                          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                            Deadline
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {myTasks.map((t) => (
                          <tr
                            key={t.id}
                            className="border-b border-border last:border-0 hover:bg-foreground/2">
                            <td className="px-4 py-3 text-[13px] font-semibold text-foreground">
                              {t.title}
                            </td>
                            <td className="px-4 py-3 text-[12.5px] text-muted-foreground">
                              {t.project?.title ?? "—"}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={cn(
                                  "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase",
                                  PRIORITY_COLORS[t.priority] ??
                                    PRIORITY_COLORS.MEDIUM,
                                )}>
                                {t.priority}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={cn(
                                  "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase",
                                  STATUS_COLORS[t.status] ??
                                    STATUS_COLORS.PENDING,
                                )}>
                                {t.status.replace(/_/g, " ")}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-[12.5px] text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <Calendar size={12} className="text-primary" />
                                {t.deadline
                                  ? new Date(t.deadline).toLocaleDateString(
                                      "en-NG",
                                      { month: "short", day: "numeric" },
                                    )
                                  : "—"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border p-10 text-center">
                  <CheckSquare
                    size={28}
                    className="mx-auto mb-2 text-muted-foreground/50"
                  />
                  <p className="text-[13.5px] font-semibold text-foreground">
                    No tasks assigned
                  </p>
                  <p className="mt-1 text-[12.5px] text-muted-foreground">
                    You&apos;re all caught up.
                  </p>
                </div>
              )}
            </div>
          )}

          {tab === "departments" && (
            <div>
              <h3 className="mb-1 text-[15px] font-bold text-foreground">
                My Departments
              </h3>
              <p className="mb-4 text-[12.5px] text-muted-foreground">
                Departments you belong to.
              </p>

              {departments.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border text-left">
                          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                            Department
                          </th>
                          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {departments.map((d) => (
                          <tr
                            key={d.id}
                            className="border-b border-border last:border-0 hover:bg-foreground/2">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/13 text-primary">
                                  <Layers size={15} />
                                </div>
                                <span className="text-[13px] font-semibold text-foreground">
                                  {d.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-[12.5px] text-muted-foreground">
                              {(d as { description?: string | null })
                                .description || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border p-10 text-center">
                  <Building2
                    size={28}
                    className="mx-auto mb-2 text-muted-foreground/50"
                  />
                  <p className="text-[13.5px] font-semibold text-foreground">
                    No departments
                  </p>
                  <p className="mt-1 text-[12.5px] text-muted-foreground">
                    You&apos;re not assigned to any department yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit modal */}
      {editOpen && (
        <EditProfileModal user={user} onClose={() => setEditOpen(false)} />
      )}
    </div>
  );
}
