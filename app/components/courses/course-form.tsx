"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Save,
  Camera,
  Plus,
  Trash2,
  ArrowLeft,
  X,
  Monitor,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";
import {
  Course,
  CourseHighlight,
  CurriculumWeek,
} from "@/app/interfaces/lms.interface";
import { useCreateCourse, useUpdateCourse } from "@/app/hooks/use-courses";
import { useServices } from "@/app/hooks/use-services";
import { useUsers } from "@/app/hooks/use-users";
import { COURSE_ICONS, COURSE_ICON_NAMES } from "@/app/lib/course-icons";

function resolveMessage(m: unknown): string {
  if (Array.isArray(m)) return String(m[0] ?? "Something went wrong");
  if (typeof m === "string") return m;
  return "Something went wrong. Please try again.";
}

const LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

export function CourseForm({ course }: { course?: Course | null }) {
  const isEdit = !!course;
  const router = useRouter();
  const createMut = useCreateCourse();
  const updateMut = useUpdateCourse();
  const fileRef = useRef<HTMLInputElement>(null);
  const saving = createMut.isPending || updateMut.isPending;

  const { data: services } = useServices();
  const { data: users } = useUsers();
  const trainers = (users ?? []).filter((u) => u.role === "TRAINER");

  const [thumbnail, setThumbnail] = useState<string | null>(
    course?.thumbnailUrl ?? null,
  );
  const [form, setForm] = useState({
    title: course?.title ?? "",
    description: course?.description ?? "",
    tagline: course?.tagline ?? "",
    heroSummary: course?.heroSummary ?? "",
    badge: course?.badge ?? "",
    price: course?.price ?? "",
    priceUSD: course?.priceUSD ?? "",
    priceNote: course?.priceNote ?? "",
    duration: course?.duration ?? "",
    level: course?.level ?? "BEGINNER",
    courseType: course?.courseType ?? "PHYSICAL",
    serviceId: course?.serviceId ?? "",
    instructorId: course?.instructorId ?? "",
    startDate: course?.startDate ? course.startDate.slice(0, 10) : "",
    endDate: course?.endDate ? course.endDate.slice(0, 10) : "",
  });
  const [outcomes, setOutcomes] = useState<string[]>(
    course?.learningOutcomes ?? [],
  );
  const [outcomeInput, setOutcomeInput] = useState("");
  const [requirements, setRequirements] = useState<string[]>(
    course?.requirements ?? [],
  );
  const [reqInput, setReqInput] = useState("");
  const [highlights, setHighlights] = useState<CourseHighlight[]>(
    course?.highlights ?? [],
  );
  const [hlIcon, setHlIcon] = useState<string>("Share2");
  const [hlLabel, setHlLabel] = useState("");
  const [curriculum, setCurriculum] = useState<CurriculumWeek[]>(
    course?.curriculum ?? [],
  );

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  // --- list helpers ---
  const addOutcome = () => {
    if (outcomeInput.trim()) {
      setOutcomes((a) => [...a, outcomeInput.trim()]);
      setOutcomeInput("");
    }
  };
  const addReq = () => {
    if (reqInput.trim()) {
      setRequirements((a) => [...a, reqInput.trim()]);
      setReqInput("");
    }
  };
  const addHighlight = () => {
    if (!hlLabel.trim()) return;
    setHighlights((a) => [...a, { icon: hlIcon, label: hlLabel.trim() }]);
    setHlLabel("");
  };

  // --- curriculum helpers ---
  const addWeek = () =>
    setCurriculum((c) => [
      ...c,
      { n: c.length + 1, title: "", topics: [], deliverable: "" },
    ]);
  const updateWeek = (i: number, patch: Partial<CurriculumWeek>) =>
    setCurriculum((c) =>
      c.map((w, idx) => (idx === i ? { ...w, ...patch } : w)),
    );
  const removeWeek = (i: number) =>
    setCurriculum((c) =>
      c.filter((_, idx) => idx !== i).map((w, idx) => ({ ...w, n: idx + 1 })),
    );

  const handleThumbSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setThumbnail(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!form.price.trim()) {
      toast.error("NGN price is required");
      return;
    }
    if (!form.serviceId) {
      toast.error("Select a service");
      return;
    }
    if (!form.instructorId) {
      toast.error("Select an instructor");
      return;
    }

    // clean curriculum: drop empty weeks, ensure topics are non-empty
    const cleanCurriculum = curriculum
      .filter((w) => w.title.trim())
      .map((w, idx) => ({
        n: idx + 1,
        title: w.title.trim(),
        topics: w.topics.filter((t) => t.trim()),
        deliverable: w.deliverable.trim(),
      }));

    const payload = {
      title: form.title,
      description: form.description,
      tagline: form.tagline || undefined,
      heroSummary: form.heroSummary || undefined,
      badge: form.badge || undefined,
      price: form.price,
      priceUSD: form.priceUSD || undefined,
      priceNote: form.priceNote || undefined,
      duration: form.duration || undefined,
      level: form.level as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
      courseType: form.courseType as "ONLINE" | "PHYSICAL",
      serviceId: form.serviceId,
      instructorId: form.instructorId,
      learningOutcomes: outcomes,
      requirements,
      highlights,
      curriculum: cleanCurriculum,
      ...(thumbnail ? { thumbnailUrl: thumbnail } : {}),
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
    };

    try {
      if (isEdit && course) {
        await updateMut.mutateAsync({ id: course.id, payload });
        toast.success("Course updated");
      } else {
        await createMut.mutateAsync(payload);
        toast.success("Course created");
      }
      router.push("/dashboard/courses");
    } catch (error) {
      toast.error(
        resolveMessage(
          (error as AxiosError<{ message?: unknown }>).response?.data?.message,
        ),
      );
    }
  };

  const input =
    "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-[13.5px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";
  const label = "mb-1.5 block text-[12.5px] font-semibold text-foreground";
  const card = "rounded-2xl border border-border bg-card p-6";

  const listBuilder = (
    title: string,
    hint: string,
    list: string[],
    setList: (v: string[]) => void,
    inputVal: string,
    setInputVal: (v: string) => void,
    add: () => void,
    placeholder: string,
  ) => (
    <div className={card}>
      <h2 className="mb-1 text-[15px] font-bold text-foreground">{title}</h2>
      <p className="mb-4 text-[12.5px] text-muted-foreground">{hint}</p>
      <div className="mb-3 flex gap-2">
        <input
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          className={input}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={add}
          disabled={!inputVal.trim()}
          className="flex items-center rounded-lg bg-primary px-4 text-[13px] font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60">
          <Plus size={15} />
        </button>
      </div>
      {list.length > 0 ? (
        <div className="space-y-2">
          {list.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-border px-3.5 py-2.5">
              <span className="flex items-center gap-2 text-[13px] text-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/[0.13] text-[10px] font-bold text-primary">
                  {i + 1}
                </span>
                {item}
              </span>
              <button
                type="button"
                onClick={() => setList(list.filter((_, idx) => idx !== i))}
                className="text-muted-foreground hover:text-destructive">
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-border py-6 text-center text-[12.5px] text-muted-foreground">
          None added yet.
        </p>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => router.push("/dashboard/courses")}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary">
        <ArrowLeft size={15} /> Back to courses
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          {isEdit ? "Edit Course" : "New Course"}
        </h1>
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          {isEdit
            ? "Update this course."
            : "Create a course with full public-page content."}
        </p>
      </div>

      <div className="space-y-6">
        {/* Thumbnail */}
        <div className={card}>
          <label className={label}>Thumbnail / Cover Image</label>
          <div className="relative h-52 w-full overflow-hidden rounded-xl border border-border bg-muted">
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt=""
                fill
                className="object-cover"
                unoptimized={thumbnail.startsWith("data:")}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <Camera size={26} className="opacity-40" />
                <span className="text-[12.5px]">No image selected</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-background/90 px-3.5 py-2 text-[12.5px] font-semibold text-foreground backdrop-blur-sm hover:bg-background">
              <Camera size={14} /> {thumbnail ? "Change" : "Upload"}
            </button>
            {thumbnail && (
              <button
                type="button"
                onClick={() => setThumbnail(null)}
                className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-background/90 px-3.5 py-2 text-[12.5px] font-semibold text-destructive backdrop-blur-sm hover:bg-background">
                <Trash2 size={14} /> Remove
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleThumbSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Basic + hero */}
        <div className={card}>
          <h2 className="mb-4 text-[15px] font-bold text-foreground">
            Course Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className={label}>Title *</label>
              <input
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                className={input}
                placeholder="Digital Marketing Fundamentals"
              />
            </div>
            <div>
              <label className={label}>Tagline</label>
              <input
                value={form.tagline}
                onChange={(e) => update("tagline", e.target.value)}
                className={input}
                placeholder="From zero to job-ready in 8 weeks"
              />
            </div>
            <div>
              <label className={label}>Badge</label>
              <input
                value={form.badge}
                onChange={(e) => update("badge", e.target.value)}
                className={input}
                placeholder="8-week beginner course"
              />
            </div>
            <div>
              <label className={label}>Hero Summary</label>
              <input
                value={form.heroSummary}
                onChange={(e) => update("heroSummary", e.target.value)}
                className={input}
                placeholder="Learn social media, SEO, email, ads and analytics — hands-on."
              />
            </div>
            <div>
              <label className={label}>Full Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={4}
                className={`${input} resize-none`}
                placeholder="The complete course description..."
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className={card}>
          <h2 className="mb-4 text-[15px] font-bold text-foreground">
            Pricing
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Price NGN (₦) *</label>
              <input
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                className={input}
                placeholder="484750"
                inputMode="decimal"
              />
            </div>
            <div>
              <label className={label}>Price USD ($)</label>
              <input
                value={form.priceUSD}
                onChange={(e) => update("priceUSD", e.target.value)}
                className={input}
                placeholder="350"
                inputMode="decimal"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className={label}>Price Note</label>
            <input
              value={form.priceNote}
              onChange={(e) => update("priceNote", e.target.value)}
              className={input}
              placeholder="per student · full program · certificate included"
            />
          </div>
        </div>

        {/* Meta */}
        <div className={card}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Duration</label>
              <input
                value={form.duration}
                onChange={(e) => update("duration", e.target.value)}
                className={input}
                placeholder="8 Weeks"
              />
            </div>
            <div>
              <label className={label}>Level</label>
              <select
                value={form.level}
                onChange={(e) =>
                  update("level", e.target.value as typeof form.level)
                }
                className={input}>
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l.charAt(0) + l.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Format</label>
              <div className="flex gap-2">
                {(["ONLINE", "PHYSICAL"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => update("courseType", t)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2.5 text-[13px] font-semibold transition-colors",
                      form.courseType === t
                        ? "border-primary bg-primary/[0.06] text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40",
                    )}>
                    {t === "ONLINE" ? (
                      <Monitor size={14} />
                    ) : (
                      <MapPin size={14} />
                    )}{" "}
                    {t === "ONLINE" ? "Online" : "On-site"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={label}>Service *</label>
              <select
                value={form.serviceId}
                onChange={(e) => update("serviceId", e.target.value)}
                className={input}>
                <option value="">Select service...</option>
                {(services ?? []).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Instructor *</label>
              <select
                value={form.instructorId}
                onChange={(e) => update("instructorId", e.target.value)}
                className={input}>
                <option value="">Select instructor...</option>
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.firstName} {t.lastName}
                  </option>
                ))}
              </select>
              {trainers.length === 0 && (
                <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400">
                  No trainers found. Create a user with the TRAINER role first.
                </p>
              )}
            </div>
          </div>
        </div>
        <div className={card}>
          <h2 className="mb-1 text-[15px] font-bold text-foreground">
            Course Dates
          </h2>
          <p className="mb-4 text-[12.5px] text-muted-foreground">
            When the actual course runs. Leave blank for self-paced courses
            (learners start anytime). The registration window is set per
            session.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Course Starts</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => update("startDate", e.target.value)}
                className={input}
              />
            </div>
            <div>
              <label className={label}>Course Ends</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => update("endDate", e.target.value)}
                className={input}
              />
            </div>
          </div>
        </div>
        {/* Highlights (icon + label) */}
        <div className={card}>
          <h2 className="mb-1 text-[15px] font-bold text-foreground">
            Highlights
          </h2>
          <p className="mb-4 text-[12.5px] text-muted-foreground">
            The icon + label chips shown on the course page (&quot;What
            you&apos;ll walk away with&quot;).
          </p>
          <div className="mb-3 flex gap-2">
            <select
              value={hlIcon}
              onChange={(e) => setHlIcon(e.target.value)}
              className={cn(input, "w-40")}>
              {COURSE_ICON_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <input
              value={hlLabel}
              onChange={(e) => setHlLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addHighlight();
                }
              }}
              className={input}
              placeholder="e.g. Social media strategy"
            />
            <button
              type="button"
              onClick={addHighlight}
              disabled={!hlLabel.trim()}
              className="flex items-center rounded-lg bg-primary px-4 text-primary-foreground hover:opacity-90 disabled:opacity-60">
              <Plus size={15} />
            </button>
          </div>
          {highlights.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {highlights.map((h, i) => {
                const Icon =
                  COURSE_ICONS[h.icon as keyof typeof COURSE_ICONS] ??
                  COURSE_ICONS.CheckCircle;
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
                    <span className="flex items-center gap-2.5 text-[13px] text-foreground">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/[0.13] text-primary">
                        <Icon size={15} />
                      </span>
                      {h.label}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setHighlights((a) => a.filter((_, idx) => idx !== i))
                      }
                      className="text-muted-foreground hover:text-destructive">
                      <X size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Outcomes */}
        {listBuilder(
          "What You'll Learn (Outcomes)",
          "The key outcomes — the biggest selling point.",
          outcomes,
          setOutcomes,
          outcomeInput,
          setOutcomeInput,
          addOutcome,
          "e.g. Build and deploy full-stack apps",
        )}

        {/* Curriculum weeks */}
        <div className={card}>
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-foreground">
              Curriculum
            </h2>
            <button
              type="button"
              onClick={addWeek}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[12px] font-semibold text-foreground hover:bg-foreground/[0.04]">
              <Plus size={13} /> Add Week/Module
            </button>
          </div>
          <p className="mb-4 text-[12.5px] text-muted-foreground">
            Week-by-week syllabus shown publicly. Each week has topics and a
            deliverable.
          </p>
          {curriculum.length > 0 ? (
            <div className="space-y-3">
              {curriculum.map((week, i) => (
                <WeekBuilder
                  key={i}
                  week={week}
                  index={i}
                  onChange={(patch) => updateWeek(i, patch)}
                  onRemove={() => removeWeek(i)}
                  inputClass={input}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-border py-6 text-center text-[12.5px] text-muted-foreground">
              No weeks added. Click &quot;Add Week/Module&quot;.
            </p>
          )}
        </div>

        {/* Requirements */}
        {listBuilder(
          "Requirements",
          "Prerequisites (optional). Leave empty for beginner courses.",
          requirements,
          setRequirements,
          reqInput,
          setReqInput,
          addReq,
          "e.g. Basic HTML & CSS knowledge",
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => router.push("/dashboard/courses")}
            className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-foreground/[0.04]">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60">
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={16} /> {isEdit ? "Update Course" : "Create Course"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Week builder sub-component ---
function WeekBuilder({
  week,
  index,
  onChange,
  onRemove,
  inputClass,
}: {
  week: CurriculumWeek;
  index: number;
  onChange: (patch: Partial<CurriculumWeek>) => void;
  onRemove: () => void;
  inputClass: string;
}) {
  const [open, setOpen] = useState(true);
  const [topicInput, setTopicInput] = useState("");
  const addTopic = () => {
    if (topicInput.trim()) {
      onChange({ topics: [...week.topics, topicInput.trim()] });
      setTopicInput("");
    }
  };

  return (
    <div className="rounded-xl border border-border">
      <div className="flex items-center gap-3 p-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/[0.13] text-[12px] font-bold text-primary">
          {String(index + 1).padStart(2, "0")}
        </span>
        <input
          value={week.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className={`${inputClass} flex-1`}
          placeholder="Week title, e.g. Introduction to Digital Marketing"
        />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="text-muted-foreground hover:text-foreground">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive">
          <Trash2 size={15} />
        </button>
      </div>
      {open && (
        <div className="space-y-3 border-t border-border p-3">
          <div>
            <label className="mb-1.5 block text-[11.5px] font-semibold text-muted-foreground">
              Topics
            </label>
            <div className="mb-2 flex gap-2">
              <input
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTopic();
                  }
                }}
                className={inputClass}
                placeholder="Add a topic"
              />
              <button
                type="button"
                onClick={addTopic}
                disabled={!topicInput.trim()}
                className="flex items-center rounded-lg bg-primary px-3 text-primary-foreground hover:opacity-90 disabled:opacity-60">
                <Plus size={14} />
              </button>
            </div>
            {week.topics.length > 0 && (
              <div className="space-y-1.5">
                {week.topics.map((t, ti) => (
                  <div
                    key={ti}
                    className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-1.5">
                    <span className="flex items-center gap-2 text-[12.5px] text-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {t}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onChange({
                          topics: week.topics.filter((_, idx) => idx !== ti),
                        })
                      }
                      className="text-muted-foreground hover:text-destructive">
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-[11.5px] font-semibold text-muted-foreground">
              Deliverable
            </label>
            <input
              value={week.deliverable}
              onChange={(e) => onChange({ deliverable: e.target.value })}
              className={inputClass}
              placeholder="e.g. Create a customer persona for a sample business"
            />
          </div>
        </div>
      )}
    </div>
  );
}
