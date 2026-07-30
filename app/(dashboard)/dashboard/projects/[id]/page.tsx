"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Pencil,
  Building2,
  User as UserIcon,
  Calendar,
  Wallet,
  LayoutGrid,
  Users,
  Flag,
  ListChecks,
  FolderOpen,
  Plus,
  Trash2,
  Check,
  X,
  Upload,
  Download,
  Paperclip,
  ThumbsUp,
  ThumbsDown,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";
import { Project } from "@/app/interfaces/project";
import {
  useProject,
  useAddMember,
  useRemoveMember,
  useAddMilestone,
  useCompleteMilestone,
  useUploadProjectFile,
  useApproveFile,
  useDeleteProjectFile,
} from "@/app/hooks/use-projects";
import { useUsers } from "@/app/hooks/use-users";
import { ConfirmDialog } from "@/app/components/dasboard/confirm-dialog";

function resolveMessage(m: unknown): string {
  if (Array.isArray(m)) return String(m[0] ?? "Something went wrong");
  if (typeof m === "string") return m;
  return "Something went wrong. Please try again.";
}
function naira(n?: string | null) {
  return n
    ? new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
      }).format(Number(n))
    : "—";
}
function fmtDate(d?: string | null) {
  return d
    ? new Date(d).toLocaleDateString("en-NG", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";
}

type Tab = "overview" | "members" | "milestones" | "tasks" | "files";

const STATUS_BADGE: Record<string, string> = {
  NOT_STARTED: "bg-slate-500/15 text-slate-600 dark:text-slate-400",
  IN_PROGRESS: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  IN_REVIEW: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  COMPLETED: "bg-green-500/15 text-green-600 dark:text-green-400",
  CANCELLED: "bg-red-500/15 text-red-600 dark:text-red-400",
};
const TASK_BADGE: Record<string, string> = {
  PENDING: "bg-slate-500/15 text-slate-600 dark:text-slate-400",
  IN_PROGRESS: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  IN_REVIEW: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  COMPLETED: "bg-green-500/15 text-green-600 dark:text-green-400",
  OVERDUE: "bg-red-500/15 text-red-600 dark:text-red-400",
};

const card = "rounded-2xl border border-border bg-card p-6";
const input =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-[13px] text-foreground outline-none focus:border-primary";

// ───────── Members ─────────
function MembersTab({ project }: { project: Project }) {
  const addMut = useAddMember(project.id);
  const removeMut = useRemoveMember(project.id);
  const { data: users } = useUsers();
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const [removing, setRemoving] = useState<string | null>(null);

  const members = project.members ?? [];
  const memberIds = new Set(members.map((m) => m.userId));
  const available = (users ?? []).filter(
    (u) => u.role !== "CLIENT" && !memberIds.has(u.id),
  );

  const add = async () => {
    if (!userId) {
      toast.error("Select a team member");
      return;
    }
    if (!role.trim()) {
      toast.error("Enter their role on this project");
      return;
    }
    try {
      await addMut.mutateAsync({ userId, role: role.trim() });
      toast.success("Member added");
      setUserId("");
      setRole("");
    } catch (e) {
      toast.error(
        resolveMessage(
          (e as AxiosError<{ message?: unknown }>).response?.data?.message,
        ),
      );
    }
  };

  return (
    <div className="space-y-5">
      <div className={card}>
        <h2 className="mb-4 text-[15px] font-bold text-foreground">
          Add Team Member
        </h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className={input}>
            <option value="">Select staff...</option>
            {available.map((u) => (
              <option key={u.id} value={u.id}>
                {u.firstName} {u.lastName}
              </option>
            ))}
          </select>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            className={input}
            placeholder="Role on project, e.g. Lead Developer"
          />
          <button
            onClick={add}
            disabled={addMut.isPending}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60">
            {addMut.isPending ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Plus size={15} />
            )}{" "}
            Add
          </button>
        </div>
      </div>

      {members.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {members.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                {m.user?.image ? (
                  <Image
                    src={m.user.image}
                    alt=""
                    width={38}
                    height={38}
                    className="h-9.5 w-9.5 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9.5 w-9.5 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-primary-foreground">
                    {m.user
                      ? `${m.user.firstName[0]}${m.user.lastName[0]}`
                      : "?"}
                  </div>
                )}
                <div>
                  <div className="text-[13.5px] font-semibold text-foreground">
                    {m.user
                      ? `${m.user.firstName} ${m.user.lastName}`
                      : "Unknown"}
                  </div>
                  <div className="text-[11.5px] text-muted-foreground">
                    {m.role}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setRemoving(m.userId)}
                className="text-muted-foreground hover:text-destructive">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <Users size={30} className="mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-[14px] font-semibold text-foreground">
            No members yet
          </p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Add the people working on this project.
          </p>
        </div>
      )}

      {removing && (
        <ConfirmDialog
          title="Remove member?"
          message="They'll no longer be listed on this project."
          confirmLabel="Remove"
          loading={removeMut.isPending}
          onConfirm={async () => {
            await removeMut.mutateAsync(removing);
            toast.success("Member removed");
            setRemoving(null);
          }}
          onClose={() => setRemoving(null)}
        />
      )}
    </div>
  );
}

// ───────── Milestones ─────────
function MilestonesTab({ project }: { project: Project }) {
  const addMut = useAddMilestone(project.id);
  const completeMut = useCompleteMilestone(project.id);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const milestones = (project.milestones ?? [])
    .slice()
    .sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate));
  const done = milestones.filter((m) => m.isCompleted).length;

  const add = async () => {
    if (!title.trim()) {
      toast.error("Milestone title is required");
      return;
    }
    if (!dueDate) {
      toast.error("Due date is required");
      return;
    }
    try {
      await addMut.mutateAsync({
        title: title.trim(),
        dueDate: new Date(dueDate).toISOString(),
      });
      toast.success("Milestone added");
      setTitle("");
      setDueDate("");
    } catch (e) {
      toast.error(
        resolveMessage(
          (e as AxiosError<{ message?: unknown }>).response?.data?.message,
        ),
      );
    }
  };

  return (
    <div className="space-y-5">
      <div className={card}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-foreground">
            Add Milestone
          </h2>
          {milestones.length > 0 && (
            <span className="text-[12.5px] text-muted-foreground">
              {done} of {milestones.length} complete
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            className={input}
            placeholder="e.g. Design sign-off"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={`${input} sm:w-48`}
          />
          <button
            onClick={add}
            disabled={addMut.isPending}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60">
            {addMut.isPending ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Plus size={15} />
            )}{" "}
            Add
          </button>
        </div>
      </div>

      {milestones.length > 0 ? (
        <div className="space-y-2">
          {milestones.map((m) => {
            const overdue = !m.isCompleted && new Date(m.dueDate) < new Date();
            return (
              <div
                key={m.id}
                className={cn(
                  "flex items-center justify-between rounded-xl border p-4",
                  m.isCompleted
                    ? "border-border bg-muted/30"
                    : "border-border bg-card",
                )}>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                      m.isCompleted
                        ? "bg-green-500/15 text-green-600 dark:text-green-400"
                        : "bg-primary/13 text-primary",
                    )}>
                    <Flag size={13} />
                  </span>
                  <div>
                    <div
                      className={cn(
                        "text-[13.5px] font-semibold",
                        m.isCompleted
                          ? "text-muted-foreground line-through"
                          : "text-foreground",
                      )}>
                      {m.title}
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-1 text-[11.5px]",
                        overdue ? "text-destructive" : "text-muted-foreground",
                      )}>
                      <Calendar size={10} /> {fmtDate(m.dueDate)}
                      {overdue && " · overdue"}
                      {m.isCompleted &&
                        m.completedAt &&
                        ` · done ${fmtDate(m.completedAt)}`}
                    </div>
                  </div>
                </div>
                {!m.isCompleted && (
                  <button
                    onClick={async () => {
                      try {
                        await completeMut.mutateAsync(m.id);
                        toast.success("Milestone completed");
                      } catch (e) {
                        toast.error(
                          resolveMessage(
                            (e as AxiosError<{ message?: unknown }>).response
                              ?.data?.message,
                          ),
                        );
                      }
                    }}
                    className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[12px] font-semibold text-foreground hover:border-primary hover:text-primary">
                    <Check size={13} /> Complete
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <Flag size={30} className="mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-[14px] font-semibold text-foreground">
            No milestones yet
          </p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Break the project into checkpoints.
          </p>
        </div>
      )}
    </div>
  );
}

// ───────── Files ─────────
function FilesTab({ project }: { project: Project }) {
  const uploadMut = useUploadProjectFile(project.id);
  const approveMut = useApproveFile(project.id);
  const deleteMut = useDeleteProjectFile(project.id);
  const fileRef = useRef<HTMLInputElement>(null);
  const [isDesign, setIsDesign] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const files = project.files ?? [];

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await uploadMut.mutateAsync({
          base64: reader.result as string,
          name: file.name,
          isDesign,
        });
        toast.success("File uploaded");
      } catch (err) {
        toast.error(
          resolveMessage(
            (err as AxiosError<{ message?: unknown }>).response?.data?.message,
          ),
        );
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const review = async (fileId: string, approved: boolean) => {
    try {
      await approveMut.mutateAsync({ fileId, isApproved: approved });
      toast.success(approved ? "Design approved" : "Design rejected");
    } catch (e) {
      toast.error(
        resolveMessage(
          (e as AxiosError<{ message?: unknown }>).response?.data?.message,
        ),
      );
    }
  };

  return (
    <div className="space-y-5">
      <div
        className={cn(
          card,
          "flex flex-wrap items-center justify-between gap-3",
        )}>
        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={isDesign}
            onChange={(e) => setIsDesign(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-(--brand-purple)"
          />
          <span className="text-[13px] text-foreground">
            Mark as design file{" "}
            <span className="text-muted-foreground">
              (needs client approval)
            </span>
          </span>
        </label>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploadMut.isPending}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60">
          {uploadMut.isPending ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Uploading...
            </>
          ) : (
            <>
              <Upload size={15} /> Upload File
            </>
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          onChange={onSelect}
          className="hidden"
        />
      </div>

      {files.length > 0 ? (
        <div className="space-y-2">
          {files.map((f) => (
            <div
              key={f.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3.5">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    f.isDesign
                      ? "bg-(--brand-green)/20 text-(--brand-green)"
                      : "bg-primary/13 text-primary",
                  )}>
                  {f.isDesign ? (
                    <ImageIcon size={16} />
                  ) : (
                    <Paperclip size={16} />
                  )}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-foreground">
                    {f.name}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{fmtDate(f.createdAt)}</span>
                    {f.isDesign && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 font-bold uppercase",
                          f.isApproved === true
                            ? "bg-green-500/15 text-green-600 dark:text-green-400"
                            : f.isApproved === false
                              ? "bg-red-500/15 text-red-600 dark:text-red-400"
                              : "bg-amber-500/15 text-amber-600 dark:text-amber-400",
                        )}>
                        {f.isApproved === true
                          ? "Approved"
                          : f.isApproved === false
                            ? "Rejected"
                            : "Awaiting review"}
                      </span>
                    )}
                  </div>
                  {f.feedback && (
                    <p className="mt-1 text-[11.5px] text-muted-foreground">
                      Feedback: {f.feedback}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {f.isDesign && f.isApproved === null && (
                  <>
                    <button
                      onClick={() => review(f.id, true)}
                      disabled={approveMut.isPending}
                      className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-[12px] font-semibold text-green-600 hover:border-green-500/50 dark:text-green-400">
                      <ThumbsUp size={13} /> Approve
                    </button>
                    <button
                      onClick={() => review(f.id, false)}
                      disabled={approveMut.isPending}
                      className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-[12px] font-semibold text-destructive hover:border-destructive/50">
                      <ThumbsDown size={13} /> Reject
                    </button>
                  </>
                )}
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-foreground/6 hover:text-primary">
                  <Download size={15} />
                </a>
                <button
                  onClick={() => setDeleting(f.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <FolderOpen
            size={30}
            className="mx-auto mb-3 text-muted-foreground/40"
          />
          <p className="text-[14px] font-semibold text-foreground">
            No files yet
          </p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Upload deliverables, designs or documents.
          </p>
        </div>
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete file?"
          message="This file will be permanently removed."
          confirmLabel="Delete"
          loading={deleteMut.isPending}
          onConfirm={async () => {
            await deleteMut.mutateAsync(deleting);
            toast.success("File deleted");
            setDeleting(null);
          }}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

// ───────── Page ─────────
export default function SingleProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: project, isLoading } = useProject(id);
  const [tab, setTab] = useState<Tab>("overview");

  if (isLoading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  if (!project)
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-bold text-foreground">Project not found</p>
        <Link
          href="/dashboard/projects"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft size={15} /> Back to projects
        </Link>
      </div>
    );

  const milestones = project.milestones ?? [];
  const doneMilestones = milestones.filter((m) => m.isCompleted).length;
  const progress = milestones.length
    ? Math.round((doneMilestones / milestones.length) * 100)
    : 0;

  const tabs: {
    key: Tab;
    label: string;
    icon: typeof LayoutGrid;
    count?: number;
  }[] = [
    { key: "overview", label: "Overview", icon: LayoutGrid },
    {
      key: "members",
      label: "Members",
      icon: Users,
      count: project.members?.length,
    },
    {
      key: "milestones",
      label: "Milestones",
      icon: Flag,
      count: milestones.length,
    },
    {
      key: "tasks",
      label: "Tasks",
      icon: ListChecks,
      count: project._count?.tasks,
    },
    {
      key: "files",
      label: "Files",
      icon: FolderOpen,
      count: project.files?.length,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/dashboard/projects"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary">
        <ArrowLeft size={15} /> Back to projects
      </Link>

      {/* Header */}
      <div className={cn(card, "mb-6")}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                {project.title}
              </h1>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase",
                  STATUS_BADGE[project.status],
                )}>
                {project.status.replace(/_/g, " ")}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-muted-foreground">
              {project.client?.company && (
                <span className="flex items-center gap-1.5">
                  <UserIcon size={13} /> {project.client.company}
                </span>
              )}
              {project.department?.name && (
                <span className="flex items-center gap-1.5">
                  <Building2 size={13} /> {project.department.name}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Wallet size={13} /> {naira(project.budget)}
              </span>
            </div>
          </div>
          <button
            onClick={() =>
              router.push(`/dashboard/projects/${project.id}/edit`)
            }
            className="flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-[13px] font-semibold text-foreground hover:bg-foreground/4">
            <Pencil size={14} /> Edit
          </button>
        </div>

        {/* Timeline + progress */}
        <div className="mt-5 grid gap-4 border-t border-border pt-4 sm:grid-cols-3">
          <div className="text-[13px]">
            <span className="text-muted-foreground">Start: </span>
            <span className="font-semibold text-foreground">
              {fmtDate(project.startDate)}
            </span>
          </div>
          <div className="text-[13px]">
            <span className="text-muted-foreground">Due: </span>
            <span className="font-semibold text-foreground">
              {fmtDate(project.dueDate)}
            </span>
          </div>
          {milestones.length > 0 && (
            <div>
              <div className="mb-1 flex items-center justify-between text-[12px]">
                <span className="text-muted-foreground">Milestones</span>
                <span className="font-semibold text-foreground">
                  {progress}%
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2.5 text-[13.5px] font-semibold transition-colors",
              tab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}>
            <t.icon size={16} /> {t.label}
            {t.count != null && t.count > 0 && (
              <span className="rounded-full bg-muted px-1.5 text-[10px] font-bold">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className={card}>
          <h2 className="mb-3 text-[15px] font-bold text-foreground">
            Description
          </h2>
          <p className="whitespace-pre-line text-[13.5px] leading-relaxed text-muted-foreground">
            {project.description}
          </p>
        </div>
      )}

      {tab === "members" && <MembersTab project={project} />}
      {tab === "milestones" && <MilestonesTab project={project} />}

      {tab === "tasks" && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {project.tasks && project.tasks.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Task
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Assigned
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Deadline
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {project.tasks.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-border last:border-0 hover:bg-foreground/2">
                    <td className="px-5 py-3 text-[13.5px] font-semibold text-foreground">
                      {t.title}
                    </td>
                    <td className="px-5 py-3 text-[13px] text-muted-foreground">
                      {t.assignedTo
                        ? `${t.assignedTo.firstName} ${t.assignedTo.lastName}`
                        : "—"}
                    </td>
                    <td className="px-5 py-3 text-[13px] text-muted-foreground">
                      {fmtDate(t.deadline)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase",
                          TASK_BADGE[t.status] ??
                            "bg-slate-500/15 text-slate-500",
                        )}>
                        {t.status.replace(/_/g, " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <ListChecks
                size={30}
                className="mx-auto mb-3 text-muted-foreground/40"
              />
              <p className="text-[14px] font-semibold text-foreground">
                No tasks yet
              </p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Task creation comes with the Tasks module.
              </p>
            </div>
          )}
        </div>
      )}

      {tab === "files" && <FilesTab project={project} />}
    </div>
  );
}
