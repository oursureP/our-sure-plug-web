"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Pencil,
  Power,
  GraduationCap,
  Monitor,
  MapPin,
  LayoutGrid,
  CalendarDays,
  BookOpen,
  Users,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";
import { useCourse, useToggleCoursePublish } from "@/app/hooks/use-courses";
import { CourseSessionsTab } from "@/app/components/courses/course-sessions-tab";
import { CourseLessonsTab } from "@/app/components/courses/course-lessons-tab";
import { CourseEnrollmentsTab } from "@/app/components/courses/course-enrollments-tab";
// import { CourseLessonsTab } from "@/app/components/courses/course-lessons-tab";
// import { CourseEnrollmentsTab } from "@/app/components/courses/course-enrollments-tab";

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

type Tab = "overview" | "sessions" | "lessons" | "enrollments";

export default function CourseHubPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: course, isLoading } = useCourse(id);
  const publishMut = useToggleCoursePublish();
  const [tab, setTab] = useState<Tab>("overview");

  if (isLoading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  if (!course) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-bold text-foreground">Course not found</p>
        <Link
          href="/dashboard/courses"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft size={15} /> Back to courses
        </Link>
      </div>
    );
  }

  const handlePublish = async () => {
    try {
      await publishMut.mutateAsync({
        id: course.id,
        publish: !course.isPublished,
      });
      toast.success(
        course.isPublished ? "Course unpublished" : "Course published",
      );
    } catch (error) {
      toast.error(
        resolveMessage(
          (error as AxiosError<{ message?: unknown }>).response?.data?.message,
        ),
      );
    }
  };

  const tabs: { key: Tab; label: string; icon: typeof LayoutGrid }[] = [
    { key: "overview", label: "Overview", icon: LayoutGrid },
    { key: "sessions", label: "Sessions", icon: CalendarDays },
    { key: "lessons", label: "Lessons", icon: BookOpen },
    { key: "enrollments", label: "Enrollments", icon: Users },
  ];

  const isOnline = course.courseType === "ONLINE";
  const card = "rounded-2xl border border-border bg-card p-6";

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/dashboard/courses"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary">
        <ArrowLeft size={15} /> Back to courses
      </Link>

      {/* Header */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="relative h-40 w-full bg-muted sm:h-48">
          {course.thumbnailUrl ? (
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              fill
              className="object-cover"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{
                background:
                  "linear-gradient(120deg, var(--brand-purple), #6b21d6)",
              }}>
              <GraduationCap size={44} className="text-white/40" />
            </div>
          )}
          <div className="absolute right-4 top-4 flex gap-2">
            <button
              onClick={() =>
                router.push(`/dashboard/courses/${course.id}/edit`)
              }
              className="flex items-center gap-1.5 rounded-lg bg-background/90 px-3.5 py-2 text-[12.5px] font-semibold text-foreground backdrop-blur-sm hover:bg-background">
              <Pencil size={14} /> Edit
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-2 flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              {course.title}
            </h1>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase",
                course.isPublished
                  ? "bg-green-500/15 text-green-600 dark:text-green-400"
                  : "bg-slate-500/15 text-slate-500",
              )}>
              {course.isPublished ? "Published" : "Draft"}
            </span>
            <span className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
              {isOnline ? (
                <>
                  <Monitor size={13} className="text-primary" /> Online
                </>
              ) : (
                <>
                  <MapPin size={13} className="text-primary" /> On-site
                </>
              )}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-muted-foreground">
            <span className="font-semibold text-foreground">
              {formatNaira(course.price)}
            </span>
            {course.service && <span>{course.service.name}</span>}
            {course.duration && <span>{course.duration}</span>}
            {course.level && (
              <span className="capitalize">{course.level.toLowerCase()}</span>
            )}
          </div>
          <button
            onClick={handlePublish}
            disabled={publishMut.isPending}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-[12.5px] font-semibold text-foreground hover:bg-foreground/4 disabled:opacity-60">
            {publishMut.isPending ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Power size={13} />
            )}
            {course.isPublished ? "Unpublish" : "Publish"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex items-center gap-2 border-b-2 px-4 py-2.5 text-[13.5px] font-semibold whitespace-nowrap transition-colors",
              tab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}>
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === "overview" && (
        <div className="space-y-6">
          <div className={card}>
            <h2 className="mb-3 text-[15px] font-bold text-foreground">
              Description
            </h2>
            <p className="text-[13.5px] leading-relaxed text-muted-foreground whitespace-pre-line">
              {course.description}
            </p>
          </div>

          {course.learningOutcomes && course.learningOutcomes.length > 0 && (
            <div className={card}>
              <h2 className="mb-4 text-[15px] font-bold text-foreground">
                What Students Learn
              </h2>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {course.learningOutcomes.map((o, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/13 text-primary">
                      <Check size={12} />
                    </span>
                    <span className="text-[13px] text-foreground">{o}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {course.requirements && course.requirements.length > 0 && (
            <div className={card}>
              <h2 className="mb-4 text-[15px] font-bold text-foreground">
                Requirements
              </h2>
              <ul className="space-y-2">
                {course.requirements.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-[13px] text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{" "}
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {course.instructor && (
            <div className={card}>
              <h2 className="mb-3 text-[15px] font-bold text-foreground">
                Instructor
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-primary-foreground">
                  {course.instructor.firstName[0]}
                  {course.instructor.lastName[0]}
                </div>
                <div>
                  <div className="text-[13.5px] font-semibold text-foreground">
                    {course.instructor.firstName} {course.instructor.lastName}
                  </div>
                  <div className="text-[12px] text-muted-foreground">
                    {course.instructor.email}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {tab === "sessions" && (
        <CourseSessionsTab
          courseId={course.id}
          courseType={course.courseType}
        />
      )}
      {tab === "lessons" && <CourseLessonsTab courseId={course.id} />}
      {tab === "enrollments" && <CourseEnrollmentsTab course={course} />}
    </div>
  );
}
