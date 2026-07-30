"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  X,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  Briefcase,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  Loader2,
  ListChecks,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";
import { Project } from "@/app/interfaces/project";
import {
  useProjects,
  useProjectStats,
  useDeleteProject,
} from "@/app/hooks/use-projects";
import { useClients } from "@/app/hooks/use-clients";
import { useDepartments } from "@/app/hooks/use-departments";
import { ConfirmDialog } from "@/app/components/dasboard/confirm-dialog";

function resolveMessage(m: unknown): string {
  if (Array.isArray(m)) return String(m[0] ?? "Something went wrong");
  if (typeof m === "string") return m;
  return "Something went wrong. Please try again.";
}
function naira(n?: string | null) {
  if (!n) return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(n));
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

const STATUS_BADGE: Record<string, string> = {
  NOT_STARTED: "bg-slate-500/15 text-slate-600 dark:text-slate-400",
  IN_PROGRESS: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  IN_REVIEW: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  COMPLETED: "bg-green-500/15 text-green-600 dark:text-green-400",
  CANCELLED: "bg-red-500/15 text-red-600 dark:text-red-400",
};

const STATUSES = [
  { key: "NOT_STARTED", label: "Not Started" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "IN_REVIEW", label: "In Review" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED", label: "Cancelled" },
];

function RowActions({
  onView,
  onEdit,
  onDelete,
}: {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-foreground/6 hover:text-foreground">
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-36 overflow-hidden rounded-xl border border-border bg-popover py-1 shadow-xl">
          <button
            onClick={() => {
              setOpen(false);
              onView();
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-foreground hover:bg-foreground/5">
            <Eye size={15} className="text-muted-foreground" /> Open
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-foreground hover:bg-foreground/5">
            <Pencil size={15} className="text-muted-foreground" /> Edit
          </button>
          <div className="my-1 h-px bg-border" />
          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-destructive hover:bg-destructive/10">
            <Trash2 size={15} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [clientFilter, setClientFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<Project | null>(null);

  const { data: projects, isLoading } = useProjects({
    ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
    ...(clientFilter !== "ALL" ? { clientId: clientFilter } : {}),
    ...(deptFilter !== "ALL" ? { departmentId: deptFilter } : {}),
  });
  const { data: stats } = useProjectStats();
  const { data: clients } = useClients();
  const { data: departments } = useDepartments();
  const deleteMut = useDeleteProject();

  const list = projects ?? [];
  const filtered = list.filter((p) =>
    `${p.title} ${p.client?.company ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMut.mutateAsync(deleting.id);
      toast.success("Project deleted");
      setDeleting(null);
    } catch (error) {
      toast.error(
        resolveMessage(
          (error as AxiosError<{ message?: unknown }>).response?.data?.message,
        ),
      );
    }
  };

  const statCards = [
    {
      label: "Total",
      value: stats?.total ?? "—",
      icon: Briefcase,
      tint: "text-primary bg-primary/13",
    },
    {
      label: "In Progress",
      value: stats?.inProgress ?? "—",
      icon: Loader2,
      tint: "text-blue-600 dark:text-blue-400 bg-blue-500/12",
    },
    {
      label: "In Review",
      value: stats?.inReview ?? "—",
      icon: Clock,
      tint: "text-amber-600 dark:text-amber-400 bg-amber-500/12",
    },
    {
      label: "Completed",
      value: stats?.completed ?? "—",
      icon: CheckCircle2,
      tint: "text-green-600 dark:text-green-400 bg-green-500/12",
    },
  ];
  const selectClass =
    "rounded-lg border border-border bg-card px-3 py-2.5 text-[13px] font-medium text-foreground outline-none focus:border-primary";

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Projects
          </h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">
            Track delivery across every client engagement.
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/projects/new")}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:-translate-y-0.5 hover:opacity-90">
          <Plus size={17} /> New Project
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-card p-5">
            <div
              className={cn(
                "mb-3 flex h-9 w-9 items-center justify-center rounded-lg",
                s.tint,
              )}>
              <s.icon size={18} />
            </div>
            <div className="text-xl font-extrabold text-foreground">
              {s.value}
            </div>
            <div className="text-[12.5px] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 sm:max-w-xs sm:flex-1">
          <Search size={16} className="text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent py-2.5 text-[13.5px] text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="Search projects..."
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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={selectClass}>
          <option value="ALL">All Status</option>
          {STATUSES.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
          className={selectClass}>
          <option value="ALL">All Clients</option>
          {(clients ?? []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.company ??
                (c.user ? `${c.user.firstName} ${c.user.lastName}` : "Unknown")}
            </option>
          ))}
        </select>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className={selectClass}>
          <option value="ALL">All Departments</option>
          {(departments ?? []).map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Project
                </th>
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Client
                </th>
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Department
                </th>
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Budget
                </th>
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Due
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
                    <td className="px-5 py-4" colSpan={7}>
                      <div className="h-8 w-full animate-pulse rounded bg-muted" />
                    </td>
                  </tr>
                ))
              ) : filtered.length > 0 ? (
                filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-border transition-colors last:border-0 hover:bg-foreground/2">
                    <td className="px-5 py-4">
                      <div
                        className="cursor-pointer"
                        onClick={() =>
                          router.push(`/dashboard/projects/${p.id}`)
                        }>
                        <div className="text-[13.5px] font-semibold text-foreground">
                          {p.title}
                        </div>
                        <div className="mt-0.5 flex items-center gap-3 text-[11.5px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <ListChecks size={11} /> {p._count?.tasks ?? 0}{" "}
                            tasks
                          </span>
                          {p.members && p.members.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Users size={11} /> {p.members.length}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-muted-foreground">
                      {p.client?.company ?? "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                        <Building2 size={13} className="text-primary" />{" "}
                        {p.department?.name ?? "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[13px] font-semibold text-foreground">
                      {naira(p.budget)}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-muted-foreground">
                      {fmtDate(p.dueDate)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase",
                          STATUS_BADGE[p.status],
                        )}>
                        {p.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <RowActions
                          onView={() =>
                            router.push(`/dashboard/projects/${p.id}`)
                          }
                          onEdit={() =>
                            router.push(`/dashboard/projects/${p.id}/edit`)
                          }
                          onDelete={() => setDeleting(p)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <Briefcase
                      size={32}
                      className="mx-auto mb-3 text-muted-foreground/40"
                    />
                    <p className="text-[14px] font-semibold text-foreground">
                      No projects found
                    </p>
                    <p className="mt-1 text-[13px] text-muted-foreground">
                      Create a project to start tracking delivery.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleting && (
        <ConfirmDialog
          title="Delete project?"
          message={`Delete "${deleting.title}"? This removes its tasks, milestones and files. This cannot be undone.`}
          confirmLabel="Delete"
          loading={deleteMut.isPending}
          onConfirm={handleDelete}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
