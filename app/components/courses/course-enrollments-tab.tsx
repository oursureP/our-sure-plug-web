"use client";

import { useState, useRef, useEffect } from "react";
import {
  Users,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Search,
  X,
  Mail,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";
import { Course, Enrollment } from "@/app/interfaces/lms.interface";
import {
  useEnrollments,
  useConfirmEnrollment,
  useCancelEnrollment,
} from "@/app/hooks/use-enrollments";
import { ConfirmDialog } from "../dasboard/confirm-dialog";

function resolveMessage(m: unknown): string {
  if (Array.isArray(m)) return String(m[0] ?? "Something went wrong");
  if (typeof m === "string") return m;
  return "Something went wrong. Please try again.";
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-500/15 text-green-600 dark:text-green-400",
  COMPLETED: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  PENDING_PAYMENT: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  DROPPED: "bg-red-500/15 text-red-600 dark:text-red-400",
};

function RowActions({
  enrollment,
  onConfirm,
  onCancel,
}: {
  enrollment: Enrollment;
  onConfirm: () => void;
  onCancel: () => void;
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
  const canConfirm = enrollment.status === "PENDING_PAYMENT";
  const canCancel =
    enrollment.status === "ACTIVE" || enrollment.status === "PENDING_PAYMENT";
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-foreground/6 hover:text-foreground">
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-xl border border-border bg-popover py-1 shadow-xl">
          {canConfirm && (
            <button
              onClick={() => {
                setOpen(false);
                onConfirm();
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-green-600 hover:bg-green-500/10 dark:text-green-400">
              <CheckCircle2 size={15} /> Confirm
            </button>
          )}
          {canCancel && (
            <button
              onClick={() => {
                setOpen(false);
                onCancel();
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-destructive hover:bg-destructive/10">
              <XCircle size={15} /> Cancel
            </button>
          )}
          {!canConfirm && !canCancel && (
            <div className="px-3.5 py-2 text-[12px] text-muted-foreground">
              No actions
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function CourseEnrollmentsTab({ course }: { course: Course }) {
  const { data: enrollments, isLoading } = useEnrollments({
    courseId: course.id,
  });
  const confirmMut = useConfirmEnrollment();
  const cancelMut = useCancelEnrollment();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [cancelling, setCancelling] = useState<Enrollment | null>(null);

  const list = enrollments ?? [];
  const filtered = list.filter((e) => {
    const name = e.user ? `${e.user.firstName} ${e.user.lastName}` : "";
    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      (e.user?.email ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleConfirm = async (e: Enrollment) => {
    try {
      await confirmMut.mutateAsync(e.id);
      toast.success("Enrollment confirmed");
    } catch (err) {
      toast.error(
        resolveMessage(
          (err as AxiosError<{ message?: unknown }>).response?.data?.message,
        ),
      );
    }
  };
  const handleCancel = async () => {
    if (!cancelling) return;
    try {
      await cancelMut.mutateAsync(cancelling.id);
      toast.success("Enrollment cancelled");
      setCancelling(null);
    } catch (err) {
      toast.error(
        resolveMessage(
          (err as AxiosError<{ message?: unknown }>).response?.data?.message,
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
            placeholder="Search students..."
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
          <option value="PENDING_PAYMENT">Pending Payment</option>
          <option value="COMPLETED">Completed</option>
          <option value="DROPPED">Dropped</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Student
                </th>
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Contact
                </th>
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Session
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
                    <td className="px-5 py-4" colSpan={5}>
                      <div className="h-8 w-full animate-pulse rounded bg-muted" />
                    </td>
                  </tr>
                ))
              ) : filtered.length > 0 ? (
                filtered.map((e) => (
                  <tr
                    key={e.id}
                    className="border-b border-border transition-colors last:border-0 hover:bg-foreground/2">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-primary-foreground">
                          {e.user
                            ? `${e.user.firstName[0]}${e.user.lastName[0]}`
                            : "—"}
                        </div>
                        <span className="text-[13.5px] font-semibold text-foreground">
                          {e.user
                            ? `${e.user.firstName} ${e.user.lastName}`
                            : "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-0.5 text-[12px] text-muted-foreground">
                        {e.user?.email && (
                          <div className="flex items-center gap-1.5">
                            <Mail size={11} /> {e.user.email}
                          </div>
                        )}
                        {e.user?.phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone size={11} /> {e.user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-muted-foreground">
                      {e.session?.title ?? "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase",
                          STATUS_COLORS[e.status] ??
                            "bg-slate-500/15 text-slate-500",
                        )}>
                        {e.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <RowActions
                          enrollment={e}
                          onConfirm={() => handleConfirm(e)}
                          onCancel={() => setCancelling(e)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <Users
                      size={32}
                      className="mx-auto mb-3 text-muted-foreground/40"
                    />
                    <p className="text-[14px] font-semibold text-foreground">
                      No enrollments yet
                    </p>
                    <p className="mt-1 text-[13px] text-muted-foreground">
                      Students who enroll will appear here.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {cancelling && (
        <ConfirmDialog
          title="Cancel enrollment?"
          message={`Cancel ${cancelling.user ? cancelling.user.firstName : "this"}'s enrollment? This cannot be undone.`}
          confirmLabel="Cancel Enrollment"
          loading={cancelMut.isPending}
          onConfirm={handleCancel}
          onClose={() => setCancelling(null)}
        />
      )}
    </div>
  );
}
