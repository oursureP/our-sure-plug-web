"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  CalendarDays,
  X,
  Power,
  Monitor,
  MapPin,
  Users,
  ExternalLink,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";
import { CourseSession } from "@/app/interfaces/lms.interface";
import {
  useToggleSession,
  useDeleteSession,
  useSessions,
} from "@/app/hooks/use-sessions";
import { SessionModal } from "./session-modal";
import { ConfirmDialog } from "../dasboard/confirm-dialog";

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

function RowActions({
  session,
  onEdit,
  onToggle,
  onDelete,
  onViewCourse,
}: {
  session: CourseSession;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
  onViewCourse: () => void;
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
        <div className="absolute right-0 top-full z-20 mt-1 w-48 overflow-hidden rounded-xl border border-border bg-popover py-1 shadow-xl">
          <button
            onClick={() => {
              setOpen(false);
              onViewCourse();
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-foreground hover:bg-foreground/5">
            <ExternalLink size={15} className="text-muted-foreground" /> View
            Course
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
            {session.isActive ? "Deactivate" : "Activate"}
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

export function SessionsTab() {
  const router = useRouter();
  const { data: sessions, isLoading } = useSessions(); // all sessions
  const toggleMut = useToggleSession();
  const deleteMut = useDeleteSession();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editing, setEditing] = useState<CourseSession | null>(null);
  const [deleting, setDeleting] = useState<CourseSession | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  // in the header row (add next to the filters), e.g.:
  <button
    onClick={() => setCreateOpen(true)}
    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-bold text-primary-foreground hover:opacity-90 sm:ml-auto">
    <Plus size={16} /> Add Session
  </button>;
  const list = sessions ?? [];
  const filtered = list.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      (s.course?.title ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" ? s.isActive : !s.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleToggle = async (s: CourseSession) => {
    try {
      await toggleMut.mutateAsync({ id: s.id, activate: !s.isActive });
      toast.success(s.isActive ? "Session deactivated" : "Session activated");
    } catch (error) {
      toast.error(
        resolveMessage(
          (error as AxiosError<{ message?: unknown }>).response?.data?.message,
        ),
      );
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMut.mutateAsync(deleting.id);
      toast.success("Session deleted");
      setDeleting(null);
    } catch (error) {
      toast.error(
        resolveMessage(
          (error as AxiosError<{ message?: unknown }>).response?.data?.message,
        ),
      );
    }
  };

  const selectClass =
    "rounded-lg border border-border bg-card px-3 py-2.5 text-[13px] font-medium text-foreground outline-none focus:border-primary";

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 sm:max-w-xs sm:flex-1">
          <Search size={16} className="text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent py-2.5 text-[13.5px] text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="Search sessions or courses..."
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
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        <p className="text-[12.5px] text-muted-foreground sm:ml-auto">
          Sessions are created from within a course.
        </p>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-bold text-primary-foreground hover:opacity-90 sm:ml-auto">
          <Plus size={16} /> Add Session
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Session
                </th>
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Course
                </th>
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Dates
                </th>
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Enrolled
                </th>
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Slots Left
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
                filtered.map((s) => {
                  //   const isOnline = s.course?.courseType === "ONLINE";
                  const slotsLeft = s.remainingSlots;
                  return (
                    <tr
                      key={s.id}
                      className="border-b border-border transition-colors last:border-0 hover:bg-foreground/2">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/13 text-primary">
                            <CalendarDays size={16} />
                          </div>
                          <div>
                            <div className="text-[13.5px] font-semibold text-foreground">
                              {s.title}
                            </div>
                            {s.venue && (
                              <div className="text-[11.5px] text-muted-foreground">
                                {s.venue}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() =>
                            router.push(`/dashboard/courses/${s.courseId}`)
                          }
                          className="flex items-center gap-1.5 text-[13px] text-foreground hover:text-primary">
                          {s.course?.courseType === "ONLINE" ? (
                            <Monitor size={12} className="text-primary" />
                          ) : (
                            <MapPin size={12} className="text-primary" />
                          )}
                          {s.course?.title ?? "—"}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-[12.5px] text-muted-foreground">
                        {formatDate(s.startDate)} – {formatDate(s.endDate)}
                      </td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1.5 text-[13px] text-foreground">
                          <Users size={13} className="text-muted-foreground" />{" "}
                          {s._count?.enrollments ?? 0}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[13px] text-foreground">
                        {slotsLeft != null ? slotsLeft : "—"}
                      </td>
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
                            session={s}
                            onViewCourse={() =>
                              router.push(`/dashboard/courses/${s.courseId}`)
                            }
                            onEdit={() => setEditing(s)}
                            onToggle={() => handleToggle(s)}
                            onDelete={() => setDeleting(s)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <CalendarDays
                      size={32}
                      className="mx-auto mb-3 text-muted-foreground/40"
                    />
                    <p className="text-[14px] font-semibold text-foreground">
                      No sessions found
                    </p>
                    <p className="mt-1 text-[13px] text-muted-foreground">
                      Sessions appear here once you add them to a course.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit uses the shared SessionModal (course is fixed from the session) */}
      {editing && (
        <SessionModal
          courseId={editing.courseId}
          courseType={editing.course?.courseType ?? "PHYSICAL"}
          session={editing}
          onClose={() => setEditing(null)}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete session?"
          message={`Delete "${deleting.title}"? Enrolled students may be affected. This cannot be undone.`}
          loading={deleteMut.isPending}
          onConfirm={handleDelete}
          onClose={() => setDeleting(null)}
        />
      )}
      {createOpen && <SessionModal onClose={() => setCreateOpen(false)} />}
    </div>
  );
}
