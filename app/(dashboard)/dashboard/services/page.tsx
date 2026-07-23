"use client";

import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Layers,
  GraduationCap,
  X,
  Power,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";
import {
  useServicesAdmin,
  useDeleteService,
  useToggleService,
} from "@/app/hooks/use-services";
import { ServiceModal } from "@/app/components/services/service-modal";
import { ConfirmDialog } from "@/app/components/dasboard/confirm-dialog";
import { Service } from "@/app/interfaces/lms.interface";
import { useRouter } from "next/navigation";

function resolveMessage(message: unknown): string {
  if (Array.isArray(message))
    return String(message[0] ?? "Something went wrong");
  if (typeof message === "string") return message;
  return "Something went wrong. Please try again.";
}

function RowActions({
  service,
  onEdit,
  onToggle,
  onDelete,
  onView,
}: {
  service: Service;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
  onView: () => void;
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
            <Eye size={15} className="text-muted-foreground" /> View
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
              onToggle();
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-foreground hover:bg-foreground/5">
            <Power size={15} className="text-muted-foreground" />{" "}
            {service.isActive ? "Deactivate" : "Activate"}
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

export default function ServicesPage() {
  const router = useRouter();
  const { data: services, isLoading } = useServicesAdmin();
  const deleteMut = useDeleteService();
  const toggleMut = useToggleService();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  // const [editing, setEditing] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState<Service | null>(null);

  const list = services ?? [];
  const filtered = list.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.description ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  // const openCreate = () => {
  //   setEditing(null);
  //   setModalOpen(true);
  // };
  // const openEdit = (s: Service) => {
  //   setEditing(s);
  //   setModalOpen(true);
  // };

  const handleToggle = async (s: Service) => {
    try {
      await toggleMut.mutateAsync(s.id);
      toast.success(s.isActive ? "Service deactivated" : "Service activated");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: unknown }>;
      toast.error(resolveMessage(axiosError.response?.data?.message));
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMut.mutateAsync(deleting.id);
      toast.success("Service deleted");
      setDeleting(null);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: unknown }>;
      toast.error(resolveMessage(axiosError.response?.data?.message));
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Services
          </h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">
            Your service offerings and training categories.
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/services/new")}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:opacity-90">
          <Plus size={17} /> New Service
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 sm:max-w-xs">
        <Search size={16} className="text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent py-2.5 text-[13.5px] text-foreground outline-none placeholder:text-muted-foreground"
          placeholder="Search services..."
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-muted-foreground hover:text-foreground">
            <X size={15} />
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Service
                </th>
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Courses
                </th>
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Tag
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
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-5 py-4" colSpan={4}>
                      <div className="h-6 w-full animate-pulse rounded bg-muted" />
                    </td>
                  </tr>
                ))
              ) : filtered.length > 0 ? (
                filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-border transition-colors last:border-0 hover:bg-foreground/2">
                    <td className="px-5 py-4">
                      <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() =>
                          router.push(`/dashboard/services/${s.id}`)
                        }>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/13 text-primary">
                          <Layers size={17} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13.5px] font-semibold text-foreground">
                            {s.name}
                          </div>
                          {s.description && (
                            <div className="truncate text-[12px] max-w-25 text-muted-foreground">
                              {s.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-[13px] text-foreground">
                        <GraduationCap
                          size={14}
                          className="text-muted-foreground"
                        />{" "}
                        {s._count?.courses ?? 0}
                      </span>
                    </td>
                    <td className="px-5 py-4">{s.tagline}</td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase",
                          s.isActive
                            ? "bg-green-500/15 text-green-600 dark:text-green-400"
                            : "bg-slate-500/15 text-slate-500",
                        )}>
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            s.isActive ? "bg-green-500" : "bg-slate-400",
                          )}
                        />
                        {s.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <RowActions
                          service={s}
                          onView={() =>
                            router.push(`/dashboard/services/${s.id}`)
                          }
                          onEdit={() =>
                            router.push(`/dashboard/services/${s.id}/edit`)
                          }
                          onToggle={() => handleToggle(s)}
                          onDelete={() => setDeleting(s)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-5 py-16 text-center">
                    <Layers
                      size={32}
                      className="mx-auto mb-3 text-muted-foreground/40"
                    />
                    <p className="text-[14px] font-semibold text-foreground">
                      No services found
                    </p>
                    <p className="mt-1 text-[13px] text-muted-foreground">
                      {search
                        ? "Try a different search."
                        : "Create your first service to get started."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <ServiceModal service={null} onClose={() => setModalOpen(false)} />
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete service?"
          message={`Delete "${deleting.name}"? Courses under it may be affected. This cannot be undone.`}
          loading={deleteMut.isPending}
          onConfirm={handleDelete}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
