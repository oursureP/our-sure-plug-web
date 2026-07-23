"use client";

import { useState } from "react";
import { X, Loader2, Save, Monitor, MapPin } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { CourseSession } from "@/app/interfaces/lms.interface";
import { useCreateSession, useUpdateSession } from "@/app/hooks/use-sessions";
import { useCourses } from "@/app/hooks/use-courses";

function resolveMessage(message: unknown): string {
  if (Array.isArray(message))
    return String(message[0] ?? "Something went wrong");
  if (typeof message === "string") return message;
  return "Something went wrong. Please try again.";
}

function toDateInput(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toISOString().split("T")[0];
}

export function SessionModal({
  courseId: fixedCourseId,
  courseType: fixedCourseType,
  session,
  onClose,
}: {
  courseId?: string; // provided from course hub (locked); omitted from global tab (picker shown)
  courseType?: "ONLINE" | "PHYSICAL";
  session?: CourseSession | null;
  onClose: () => void;
}) {
  const isEdit = !!session;
  const createMut = useCreateSession();
  const updateMut = useUpdateSession();
  const saving = createMut.isPending || updateMut.isPending;

  // Only fetch courses when we need the picker (no fixed course)
  const needsPicker = !fixedCourseId && !isEdit;
  const { data: courses } = useCourses();

  // Selected course (for the picker case)
  const [selectedCourseId, setSelectedCourseId] = useState(
    fixedCourseId ?? session?.courseId ?? "",
  );

  // Resolve the course type: from prop, from edit session's course, or from the picked course
  const pickedCourse = (courses ?? []).find((c) => c.id === selectedCourseId);
  const courseType =
    fixedCourseType ??
    session?.course?.courseType ??
    pickedCourse?.courseType ??
    "PHYSICAL";

  const [form, setForm] = useState({
    title: session?.title ?? "",
    startDate: toDateInput(session?.startDate),
    endDate: toDateInput(session?.endDate),
    venue: session?.venue ?? "",
    onlineCapacity:
      session?.onlineCapacity != null ? String(session.onlineCapacity) : "",
    physicalCapacity:
      session?.physicalCapacity != null ? String(session.physicalCapacity) : "",
  });

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));
  const isOnline = courseType === "ONLINE";

  const handleSave = async () => {
    const courseId = fixedCourseId ?? selectedCourseId;
    if (!isEdit && !courseId) {
      toast.error("Please select a course");
      return;
    }
    if (!form.title.trim()) {
      toast.error("Session title is required");
      return;
    }
    if (!form.startDate || !form.endDate) {
      toast.error("Start and end dates are required");
      return;
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      toast.error("End date must be after start date");
      return;
    }
    if (isOnline && !form.onlineCapacity) {
      toast.error("Online capacity is required");
      return;
    }
    if (!isOnline) {
      if (!form.physicalCapacity) {
        toast.error("Physical capacity is required");
        return;
      }
      if (!form.venue.trim()) {
        toast.error("Venue is required for on-site sessions");
        return;
      }
    }

    try {
      if (isEdit && session) {
        await updateMut.mutateAsync({
          id: session.id,
          payload: {
            title: form.title,
            startDate: new Date(form.startDate).toISOString(),
            endDate: new Date(form.endDate).toISOString(),
            venue: form.venue || undefined,
            onlineCapacity: form.onlineCapacity
              ? Number(form.onlineCapacity)
              : undefined,
            physicalCapacity: form.physicalCapacity
              ? Number(form.physicalCapacity)
              : undefined,
          },
        });
        toast.success("Session updated");
      } else {
        await createMut.mutateAsync({
          title: form.title,
          startDate: new Date(form.startDate).toISOString(),
          endDate: new Date(form.endDate).toISOString(),
          courseId,
          venue: form.venue || undefined,
          onlineCapacity: form.onlineCapacity
            ? Number(form.onlineCapacity)
            : undefined,
          physicalCapacity: form.physicalCapacity
            ? Number(form.physicalCapacity)
            : undefined,
        });
        toast.success("Session created");
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
        className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-popover shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-popover px-6 py-4">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-foreground">
              {isEdit ? "Edit Session" : "New Session"}
            </h3>
            {(fixedCourseId || isEdit || selectedCourseId) && (
              <p className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                {isOnline ? (
                  <>
                    <Monitor size={12} className="text-primary" /> Online course
                  </>
                ) : (
                  <>
                    <MapPin size={12} className="text-primary" /> On-site course
                  </>
                )}
              </p>
            )}
          </div>
          <button
            onClick={() => !saving && onClose()}
            className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 p-6">
          {/* Course picker — only in global-tab create mode */}
          {needsPicker && (
            <div>
              <label className={label}>Course *</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className={inputClass}>
                <option value="">Select a course...</option>
                {(courses ?? []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} (
                    {c.courseType === "ONLINE" ? "Online" : "On-site"})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className={label}>Session Title *</label>
            <input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className={inputClass}
              placeholder="e.g. January 2026 Cohort"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Start Date *</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => update("startDate", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={label}>End Date *</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => update("endDate", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Capacity fields appear once we know the course type */}
          {(fixedCourseId || isEdit || selectedCourseId) &&
            (isOnline ? (
              <div>
                <label className={label}>Online Capacity *</label>
                <input
                  type="number"
                  min={1}
                  value={form.onlineCapacity}
                  onChange={(e) => update("onlineCapacity", e.target.value)}
                  className={inputClass}
                  placeholder="e.g. 100"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className={label}>Venue *</label>
                  <input
                    value={form.venue}
                    onChange={(e) => update("venue", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. OurSurePlug Training Centre"
                  />
                </div>
                <div>
                  <label className={label}>Physical Capacity *</label>
                  <input
                    type="number"
                    min={1}
                    value={form.physicalCapacity}
                    onChange={(e) => update("physicalCapacity", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. 30"
                  />
                </div>
              </>
            ))}
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
