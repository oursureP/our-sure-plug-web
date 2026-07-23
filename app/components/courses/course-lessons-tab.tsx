"use client";

import { useState, useRef, useEffect } from "react";
import {
  Plus,
  BookOpen,
  Video,
  Clock,
  MoreVertical,
  Pencil,
  Trash2,
  X,
  Loader2,
  Save,
  //   GripVertical,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Lesson } from "@/app/interfaces/lms.interface";
import {
  useLessons,
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson,
} from "@/app/hooks/use-lessons";
import { ConfirmDialog } from "../dasboard/confirm-dialog";

function resolveMessage(m: unknown): string {
  if (Array.isArray(m)) return String(m[0] ?? "Something went wrong");
  if (typeof m === "string") return m;
  return "Something went wrong. Please try again.";
}

// Lesson create/edit modal
function LessonModal({
  courseId,
  lesson,
  nextOrder,
  onClose,
}: {
  courseId: string;
  lesson?: Lesson | null;
  nextOrder: number;
  onClose: () => void;
}) {
  const isEdit = !!lesson;
  const createMut = useCreateLesson();
  const updateMut = useUpdateLesson(courseId);
  const saving = createMut.isPending || updateMut.isPending;

  const [form, setForm] = useState({
    title: lesson?.title ?? "",
    content: lesson?.content ?? "",
    videoUrl: lesson?.videoUrl ?? "",
    order: lesson?.order != null ? String(lesson.order) : String(nextOrder),
    duration: lesson?.duration != null ? String(lesson.duration) : "",
  });
  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Lesson title is required");
      return;
    }
    const order = Number(form.order);
    if (!order || order < 1) {
      toast.error("Order must be at least 1");
      return;
    }

    const payload = {
      title: form.title,
      content: form.content || undefined,
      videoUrl: form.videoUrl || undefined,
      order,
      duration: form.duration ? Number(form.duration) : undefined,
      courseId,
    };
    try {
      if (isEdit && lesson) {
        await updateMut.mutateAsync({ id: lesson.id, payload });
        toast.success("Lesson updated");
      } else {
        await createMut.mutateAsync(payload);
        toast.success("Lesson created");
      }
      onClose();
    } catch (error) {
      toast.error(
        resolveMessage(
          (error as AxiosError<{ message?: unknown }>).response?.data?.message,
        ),
      );
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-[13.5px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";
  const label = "mb-1.5 block text-[12.5px] font-semibold text-foreground";

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
      onClick={() => !saving && onClose()}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-popover shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-popover px-6 py-4">
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            {isEdit ? "Edit Lesson" : "New Lesson"}
          </h3>
          <button
            onClick={() => !saving && onClose()}
            className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4 p-6">
          <div className="grid grid-cols-[1fr_auto_auto] gap-3">
            <div>
              <label className={label}>Title *</label>
              <input
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                className={inputClass}
                placeholder="e.g. Introduction to Hooks"
                autoFocus
              />
            </div>
            <div className="w-20">
              <label className={label}>Order *</label>
              <input
                type="number"
                min={1}
                value={form.order}
                onChange={(e) => update("order", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="w-24">
              <label className={label}>Mins</label>
              <input
                type="number"
                min={1}
                value={form.duration}
                onChange={(e) => update("duration", e.target.value)}
                className={inputClass}
                placeholder="45"
              />
            </div>
          </div>
          <div>
            <label className={label}>Video URL</label>
            <input
              value={form.videoUrl}
              onChange={(e) => update("videoUrl", e.target.value)}
              className={inputClass}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className={label}>Content</label>
            <textarea
              value={form.content}
              onChange={(e) => update("content", e.target.value)}
              rows={6}
              className={`${inputClass} resize-none`}
              placeholder="Lesson notes, description, or resources (HTML/markdown supported)..."
            />
          </div>
        </div>
        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-border bg-popover px-6 py-4">
          <button
            onClick={() => !saving && onClose()}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-foreground/4">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60">
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={16} /> {isEdit ? "Update" : "Create"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function RowActions({
  onEdit,
  onDelete,
}: {
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
              onEdit();
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-foreground hover:bg-foreground/5">
            <Pencil size={15} className="text-muted-foreground" /> Edit
          </button>
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

export function CourseLessonsTab({ courseId }: { courseId: string }) {
  const { data: lessons, isLoading } = useLessons(courseId);
  const deleteMut = useDeleteLesson(courseId);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Lesson | null>(null);
  const [deleting, setDeleting] = useState<Lesson | null>(null);

  const list = (lessons ?? []).slice().sort((a, b) => a.order - b.order);
  const nextOrder =
    list.length > 0 ? Math.max(...list.map((l) => l.order)) + 1 : 1;

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMut.mutateAsync(deleting.id);
      toast.success("Lesson deleted");
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
          {list.length} lesson{list.length === 1 ? "" : "s"}
        </p>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-bold text-primary-foreground hover:opacity-90">
          <Plus size={16} /> Add Lesson
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : list.length > 0 ? (
        <div className="space-y-2">
          {list.map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/13 text-[12px] font-bold text-primary">
                {lesson.order}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-semibold text-foreground">
                  {lesson.title}
                </div>
                <div className="mt-0.5 flex items-center gap-3 text-[11.5px] text-muted-foreground">
                  {lesson.videoUrl && (
                    <span className="flex items-center gap-1">
                      <Video size={11} className="text-primary" /> Video
                    </span>
                  )}
                  {lesson.duration && (
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {lesson.duration} min
                    </span>
                  )}
                  {lesson._count?.progress != null && (
                    <span>{lesson._count.progress} completed</span>
                  )}
                </div>
              </div>
              <RowActions
                onEdit={() => {
                  setEditing(lesson);
                  setModalOpen(true);
                }}
                onDelete={() => setDeleting(lesson)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <BookOpen
            size={30}
            className="mx-auto mb-3 text-muted-foreground/40"
          />
          <p className="text-[14px] font-semibold text-foreground">
            No lessons yet
          </p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Build the curriculum by adding lessons.
          </p>
        </div>
      )}

      {modalOpen && (
        <LessonModal
          courseId={courseId}
          lesson={editing}
          nextOrder={nextOrder}
          onClose={() => setModalOpen(false)}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete lesson?"
          message={`Delete "${deleting.title}"? This cannot be undone.`}
          loading={deleteMut.isPending}
          onConfirm={handleDelete}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
