"use client";

import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  Building2,
  Users,
  Briefcase,
  // Loader2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
// import { cn } from "@/lib/utils";
import {
  useDepartments,
  useDeleteDepartment,
} from "@/app/hooks/use-departments";
import { Department } from "@/app/interfaces/department.interface";
import { DepartmentModal } from "@/app/components/dasboard/department/department-modal";
import { ConfirmDialog } from "@/app/components/dasboard/confirm-dialog";

function resolveMessage(message: unknown): string {
  if (Array.isArray(message))
    return String(message[0] ?? "Something went wrong");
  if (typeof message === "string") return message;
  return "Something went wrong. Please try again.";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Row actions dropdown
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
        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-foreground"
        aria-label="Actions">
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-xl border border-border bg-popover py-1 shadow-xl">
          <button
            onClick={() => {
              setOpen(false);
              onView();
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-foreground/5">
            <Eye size={15} className="text-muted-foreground" /> View
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-foreground/5">
            <Pencil size={15} className="text-muted-foreground" /> Edit
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-destructive transition-colors hover:bg-destructive/10">
            <Trash2 size={15} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function DepartmentsPage() {
  const { data: departments, isLoading } = useDepartments();
  const deleteMut = useDeleteDepartment();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [deleting, setDeleting] = useState<Department | null>(null);
  const [viewing, setViewing] = useState<Department | null>(null);

  const list = departments ?? [];
  const filtered = list.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      (d.description ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (d: Department) => {
    setEditing(d);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMut.mutateAsync(deleting.id);
      toast.success("Department deleted");
      setDeleting(null);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: unknown }>;
      toast.error(resolveMessage(axiosError.response?.data?.message));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Departments
          </h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">
            Manage your organization&apos;s departments.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:opacity-90">
          <Plus size={17} /> New Department
        </button>
      </div>

      {/* Search bar */}
      <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 dark:bg-[#161427] sm:max-w-xs">
        <Search size={16} className="text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent py-2.5 text-[13.5px] text-foreground outline-none placeholder:text-muted-foreground"
          placeholder="Search departments..."
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-muted-foreground hover:text-foreground">
            <X size={15} />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-white dark:bg-[#161427]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Department
                </th>
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Members
                </th>
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Projects
                </th>
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Created
                </th>
                <th className="px-5 py-3.5 text-right text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-5 py-4" colSpan={5}>
                      <div className="h-5 w-full animate-pulse rounded bg-muted" />
                    </td>
                  </tr>
                ))
              ) : filtered.length > 0 ? (
                filtered.map((dept) => (
                  <tr
                    key={dept.id}
                    className="border-b border-border transition-colors last:border-0 hover:bg-foreground/2">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/13 text-primary">
                          <Building2 size={17} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13.5px] font-semibold text-foreground">
                            {dept.name}
                          </div>
                          {dept.description && (
                            <div className="truncate text-[12px] text-muted-foreground">
                              {dept.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-[13px] text-foreground">
                        <Users size={14} className="text-muted-foreground" />
                        {dept._count?.users ?? dept.users?.length ?? 0}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-[13px] text-foreground">
                        <Briefcase
                          size={14}
                          className="text-muted-foreground"
                        />
                        {dept._count?.projects ?? 0}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-muted-foreground">
                      {formatDate(dept.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <RowActions
                          onView={() => setViewing(dept)}
                          onEdit={() => openEdit(dept)}
                          onDelete={() => setDeleting(dept)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <Building2
                      size={32}
                      className="mx-auto mb-3 text-muted-foreground/40"
                    />
                    <p className="text-[14px] font-semibold text-foreground">
                      No departments found
                    </p>
                    <p className="mt-1 text-[13px] text-muted-foreground">
                      {search
                        ? "Try a different search."
                        : "Create your first department to get started."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit modal */}
      {modalOpen && (
        <DepartmentModal
          department={editing}
          onClose={() => setModalOpen(false)}
        />
      )}

      {/* Delete confirm */}
      {deleting && (
        <ConfirmDialog
          title="Delete department?"
          message={`Are you sure you want to delete "${deleting.name}"? This action cannot be undone.`}
          loading={deleteMut.isPending}
          onConfirm={handleDelete}
          onClose={() => setDeleting(null)}
        />
      )}

      {/* View modal (simple) */}
      {viewing && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center p-4"
          onClick={() => setViewing(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-popover p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/13 text-primary">
                <Building2 size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {viewing.name}
                </h3>
                <p className="text-[12.5px] text-muted-foreground">
                  Created {formatDate(viewing.createdAt)}
                </p>
              </div>
            </div>
            {viewing.description && (
              <p className="mb-4 text-[13.5px] leading-relaxed text-muted-foreground">
                {viewing.description}
              </p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border p-3">
                <div className="text-[11px] font-medium uppercase text-muted-foreground">
                  Members
                </div>
                <div className="text-lg font-bold text-foreground">
                  {viewing._count?.users ?? viewing.users?.length ?? 0}
                </div>
              </div>
              <div className="rounded-xl border border-border p-3">
                <div className="text-[11px] font-medium uppercase text-muted-foreground">
                  Projects
                </div>
                <div className="text-lg font-bold text-foreground">
                  {viewing._count?.projects ?? 0}
                </div>
              </div>
            </div>
            <button
              onClick={() => setViewing(null)}
              className="mt-5 w-full rounded-xl border border-border py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/4">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
