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
  Trash2,
  GraduationCap,
  Monitor,
  MapPin,
  X,
  Power,
  Calendar,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";
import { Course } from "@/app/interfaces/lms.interface";
import {
  useCourses,
  useDeleteCourse,
  useToggleCoursePublish,
  usePublishCourseWithNoSession,
} from "@/app/hooks/use-courses";
import { useServices } from "@/app/hooks/use-services";
import { ConfirmDialog } from "../dasboard/confirm-dialog";

function resolveMessage(message: unknown): string {
  if (Array.isArray(message))
    return String(message[0] ?? "Something went wrong");
  if (typeof message === "string") return message;
  return "Something went wrong. Please try again.";
}

function formatNaira(price: string) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(price));
}

function RowActions({
  course,
  onView,
  onEdit,
  onTogglePublish,
  onDelete,
}: {
  course: Course;
  onView: () => void;
  onEdit: () => void;
  onTogglePublish: () => void;
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
        <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-border bg-popover py-1 shadow-xl">
          <button
            onClick={() => {
              setOpen(false);
              onView();
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-foreground hover:bg-foreground/5">
            <Eye size={15} className="text-muted-foreground" /> Manage
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
              onTogglePublish();
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-foreground hover:bg-foreground/5">
            <Power size={15} className="text-muted-foreground" />{" "}
            {course.isPublished ? "Unpublish" : "Publish"}
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

function PublishChoiceDialog({
  course,
  onPublishWithSession,
  onPublishNoSession,
  onClose,
  loading,
}: {
  course: Course;
  onPublishWithSession: () => void;
  onPublishNoSession: () => void;
  onClose: () => void;
  loading: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
      onClick={() => !loading && onClose()}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-popover shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between border-b border-border p-5">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-foreground">
              Publish course
            </h3>
            <p className="mt-0.5 line-clamp-1 text-[12.5px] text-muted-foreground">
              {course.title}
            </p>
          </div>
          <button
            onClick={() => !loading && onClose()}
            className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3 p-5">
          <p className="text-[13px] text-muted-foreground">
            How would you like to publish this course?
          </p>

          {/* With sessions */}
          <button
            onClick={onPublishWithSession}
            disabled={loading}
            className="group flex w-full items-start gap-3 rounded-xl border border-border p-4 text-left transition-colors hover:border-primary/50 hover:bg-primary/4 disabled:opacity-60">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/13 text-primary">
              <Calendar size={17} />
            </span>
            <span>
              <span className="block text-[13.5px] font-semibold text-foreground">
                Publish with sessions
              </span>
              <span className="block text-[12px] text-muted-foreground">
                Cohort-based. Requires at least one active session with dates.
                Students enrol into a session.
              </span>
            </span>
          </button>

          {/* No session — personal */}
          <button
            onClick={onPublishNoSession}
            disabled={loading}
            className="group flex w-full items-start gap-3 rounded-xl border border-border p-4 text-left transition-colors hover:border-primary/50 hover:bg-primary/4 disabled:opacity-60">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--brand-green)/20 text-(--brand-green)">
              <User size={17} />
            </span>
            <span>
              <span className="block text-[13.5px] font-semibold text-foreground">
                Publish as personal course
              </span>
              <span className="block text-[12px] text-muted-foreground">
                Self-paced, no scheduled session needed. Goes live immediately.
              </span>
            </span>
          </button>
        </div>

        <div className="flex justify-end border-t border-border p-4">
          <button
            onClick={() => !loading && onClose()}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-foreground/4">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export function CoursesTab() {
  const router = useRouter();
  const { data: courses, isLoading } = useCourses();
  const { data: services } = useServices();
  const deleteMut = useDeleteCourse();
  const publishMut = useToggleCoursePublish();
  const publishWithNoCrsMut = usePublishCourseWithNoSession();

  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deleting, setDeleting] = useState<Course | null>(null);
  const [publishing, setPublishing] = useState<Course | null>(null);
  const [unpublishing, setUnpublishing] = useState<Course | null>(null);

  const list = courses ?? [];
  const filtered = list.filter((c) => {
    const s = c.title.toLowerCase().includes(search.toLowerCase());
    const svc = serviceFilter === "ALL" || c.serviceId === serviceFilter;
    const typ = typeFilter === "ALL" || c.courseType === typeFilter;
    const st =
      statusFilter === "ALL" ||
      (statusFilter === "PUBLISHED" ? c.isPublished : !c.isPublished);
    return s && svc && typ && st;
  });

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMut.mutateAsync(deleting.id);
      toast.success("Course deleted");
      setDeleting(null);
    } catch (error) {
      toast.error(
        resolveMessage(
          (error as AxiosError<{ message?: unknown }>).response?.data?.message,
        ),
      );
    }
  };

  const handlePublishClick = (c: Course) => {
    if (c.isPublished) {
      setUnpublishing(c);
    } else {
      setPublishing(c);
    }
  };

  // const handlePublis = async () => {
  //   if (!publishing) return;
  //   try {
  //     await publishMut.mutateAsync({ id: publishing.id, publish: !publishing.isPublished });
  //     toast.success(
  //       publishing.isPublished ? "Course unpublished" : "Course published",
  //     );
  //   } catch (error) {
  //     toast.error(
  //       resolveMessage(
  //         (error as AxiosError<{ message?: unknown }>).response?.data?.message,
  //       ),
  //     );
  //   }
  // };
  const handlePublishWithSession = async () => {
    if (!publishing) return;
    try {
      await publishMut.mutateAsync({ id: publishing.id, publish: true });
      toast.success("Course published");
      setPublishing(null);
    } catch (error) {
      toast.error(
        resolveMessage(
          (error as AxiosError<{ message?: unknown }>).response?.data?.message,
        ),
      );
    }
  };
  const handlePublishNoSession = async () => {
    if (!publishing) return;
    try {
      await publishWithNoCrsMut.mutateAsync(publishing.id);
      toast.success("Course published");
      setPublishing(null);
    } catch (error) {
      toast.error(
        resolveMessage(
          (error as AxiosError<{ message?: unknown }>).response?.data?.message,
        ),
      );
    }
  };

  const handleUnpublish = async () => {
    if (!unpublishing) return;
    try {
      await publishMut.mutateAsync({ id: unpublishing.id, publish: false });
      toast.success("Course unpublished");
      setUnpublishing(null);
    } catch (error) {
      toast.error(
        resolveMessage(
          (error as AxiosError<{ message?: unknown }>).response?.data?.message,
        ),
      );
    }
  };

  const selectClass =
    "rounded-lg border  border-border bg-card px-3 py-2.5 text-[13px] font-medium text-foreground outline-none focus:border-primary";

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 sm:max-w-xs sm:flex-1">
            <Search size={16} className="text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent py-2.5 text-[13.5px] text-foreground outline-none placeholder:text-muted-foreground"
              placeholder="Search courses..."
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
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className={selectClass}>
            <option value="ALL">All Services</option>
            {(services ?? []).map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={`${selectClass} w-full sm:w-auto`}>
              <option value="ALL">All Types</option>
              <option value="ONLINE">Online</option>
              <option value="PHYSICAL">On-site</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`${selectClass} w-full sm:w-auto`}>
              <option value="ALL">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => router.push("/dashboard/courses/new")}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:-translate-y-0.5 hover:opacity-90">
          <Plus size={17} /> New Course
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Course
                </th>
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Service
                </th>
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Type
                </th>
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Price
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
                    <td className="px-5 py-4" colSpan={6}>
                      <div className="h-8 w-full animate-pulse rounded bg-muted" />
                    </td>
                  </tr>
                ))
              ) : filtered.length > 0 ? (
                filtered.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-border transition-colors last:border-0 hover:bg-foreground/2">
                    <td className="px-5 py-4">
                      <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() =>
                          router.push(`/dashboard/courses/${c.id}`)
                        }>
                        <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {c.thumbnailUrl ? (
                            <Image
                              src={c.thumbnailUrl}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <GraduationCap
                                size={16}
                                className="text-muted-foreground/40"
                              />
                            </div>
                          )}
                        </div>
                        <span className="text-[13.5px] font-semibold text-foreground">
                          {c.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-muted-foreground">
                      {c.service?.name ?? "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
                        {c.courseType === "ONLINE" ? (
                          <Monitor size={13} className="text-primary" />
                        ) : (
                          <MapPin size={13} className="text-primary" />
                        )}
                        {c.courseType === "ONLINE" ? "Online" : "On-site"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[13px] font-semibold text-foreground">
                      {formatNaira(c.price)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase",
                          c.isPublished
                            ? "bg-green-500/15 text-green-600 dark:text-green-400"
                            : "bg-slate-500/15 text-slate-500",
                        )}>
                        {c.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <RowActions
                          course={c}
                          onView={() =>
                            router.push(`/dashboard/courses/${c.id}`)
                          }
                          onEdit={() =>
                            router.push(`/dashboard/courses/${c.id}/edit`)
                          }
                          onTogglePublish={() => handlePublishClick(c)}
                          onDelete={() => setDeleting(c)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <GraduationCap
                      size={32}
                      className="mx-auto mb-3 text-muted-foreground/40"
                    />
                    <p className="text-[14px] font-semibold text-foreground">
                      No courses found
                    </p>
                    <p className="mt-1 text-[13px] text-muted-foreground">
                      Create your first course to get started.
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
          title="Delete course?"
          action="delete"
          message={`Delete "${deleting.title}"? This removes its lessons and sessions too. This cannot be undone.`}
          loading={deleteMut.isPending}
          onConfirm={handleDelete}
          onClose={() => setDeleting(null)}
        />
      )}
      {publishing && (
        <PublishChoiceDialog
          course={publishing}
          loading={publishMut.isPending || publishWithNoCrsMut.isPending}
          onPublishWithSession={handlePublishWithSession}
          onPublishNoSession={handlePublishNoSession}
          onClose={() => setPublishing(null)}
        />
      )}

      {/* Unpublish confirm — for published courses */}
      {unpublishing && (
        <ConfirmDialog
          title="Unpublish course?"
          confirmLabel="Unpublish"
          message={`Unpublish "${unpublishing.title}"? It will no longer be visible on the public site.`}
          loading={publishMut.isPending}
          onConfirm={handleUnpublish}
          onClose={() => setUnpublishing(null)}
        />
      )}
    </div>
  );
}
