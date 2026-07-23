"use client";

import { useState } from "react";
import {
  Plus,
  CalendarDays,
  Users,
  MoreVertical,
  Pencil,
  Trash2,
  Power,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CourseSession } from "@/app/interfaces/lms.interface";
import {
  useSessions,
  useToggleSession,
  useDeleteSession,
} from "@/app/hooks/use-sessions";
import { SessionModal } from "@/app/components/courses/session-modal";
import { ConfirmDialog } from "../dasboard/confirm-dialog";

function resolveMessage(m: unknown): string {
  if (Array.isArray(m)) return String(m[0] ?? "Something went wrong");
  if (typeof m === "string") return m;
  return "Something went wrong. Please try again.";
}
function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function RowActions({
  session,
  onEdit,
  onToggle,
  onDelete,
}: {
  session: CourseSession;
  onEdit: () => void;
  onToggle: () => void;
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
        <div className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-xl border border-border bg-popover py-1 shadow-xl">
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

export function CourseSessionsTab({
  courseId,
  courseType,
}: {
  courseId: string;
  courseType: "ONLINE" | "PHYSICAL";
}) {
  const { data: sessions, isLoading } = useSessions(courseId);
  const toggleMut = useToggleSession();
  const deleteMut = useDeleteSession();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CourseSession | null>(null);
  const [deleting, setDeleting] = useState<CourseSession | null>(null);

  const list = sessions ?? [];

  const handleToggle = async (s: CourseSession) => {
    try {
      await toggleMut.mutateAsync({ id: s.id, activate: !s.isActive });
      toast.success(s.isActive ? "Deactivated" : "Activated");
    } catch (e) {
      toast.error(
        resolveMessage(
          (e as AxiosError<{ message?: unknown }>).response?.data?.message,
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
    } catch (e) {
      toast.error(
        resolveMessage(
          (e as AxiosError<{ message?: unknown }>).response?.data?.message,
        ),
      );
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[13px] text-muted-foreground">
          {list.length} session{list.length === 1 ? "" : "s"}
        </p>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-bold text-primary-foreground hover:opacity-90">
          <Plus size={16} /> Add Session
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : list.length > 0 ? (
        <div className="space-y-2">
          {list.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/13 text-primary">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13.5px] font-semibold text-foreground">
                      {s.title}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase",
                        s.isActive
                          ? "bg-green-500/15 text-green-600 dark:text-green-400"
                          : "bg-slate-500/15 text-slate-500",
                      )}>
                      {s.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-3 text-[11.5px] text-muted-foreground">
                    <span>
                      {formatDate(s.startDate)} – {formatDate(s.endDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={11} /> {s._count?.enrollments ?? 0} enrolled
                    </span>
                    {s.remainingSlots != null && (
                      <span>{s.remainingSlots} slots left</span>
                    )}
                    {s.venue && <span>{s.venue}</span>}
                  </div>
                </div>
              </div>
              <RowActions
                session={s}
                onEdit={() => {
                  setEditing(s);
                  setModalOpen(true);
                }}
                onToggle={() => handleToggle(s)}
                onDelete={() => setDeleting(s)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <CalendarDays
            size={30}
            className="mx-auto mb-3 text-muted-foreground/40"
          />
          <p className="text-[14px] font-semibold text-foreground">
            No sessions yet
          </p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Add a session so students can enroll.
          </p>
        </div>
      )}

      {modalOpen && (
        <SessionModal
          courseId={courseId}
          courseType={courseType}
          session={editing}
          onClose={() => setModalOpen(false)}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete session?"
          message={`Delete "${deleting.title}"? This cannot be undone.`}
          loading={deleteMut.isPending}
          onConfirm={handleDelete}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
