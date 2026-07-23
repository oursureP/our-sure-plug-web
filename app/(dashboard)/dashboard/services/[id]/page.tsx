"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Pencil,
  Layers,
  GraduationCap,
  CheckCircle2,
  Users,
  Monitor,
  MapPin,
  Check,
  Power,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";
import { useService, useToggleService } from "@/app/hooks/use-services";

function resolveMessage(message: unknown): string {
  if (Array.isArray(message))
    return String(message[0] ?? "Something went wrong");
  if (typeof message === "string") return message;
  return "Something went wrong. Please try again.";
}

function formatNaira(price: string) {
  const n = Number(price);
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function SingleServicePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: service, isLoading } = useService(id);
  const toggleMut = useToggleService();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }
  if (!service) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-bold text-foreground">Service not found</p>
        <Link
          href="/dashboard/services"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft size={15} /> Back to services
        </Link>
      </div>
    );
  }

  const courses = service.courses ?? [];
  const courseCount = service._count?.courses ?? courses.length;
  const publishedCount = courses.filter((c) => c.isPublished).length;
  const totalEnrollments = courses.reduce(
    (sum, c) => sum + (c._count?.enrollments ?? 0),
    0,
  );

  const handleToggle = async () => {
    try {
      await toggleMut.mutateAsync(service.id);
      toast.success(
        service.isActive ? "Service deactivated" : "Service activated",
      );
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: unknown }>;
      toast.error(resolveMessage(axiosError.response?.data?.message));
    }
  };

  const card = "rounded-2xl border border-border bg-card p-6";

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/dashboard/services"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary">
        <ArrowLeft size={15} /> Back to services
      </Link>

      {/* Header card */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-card">
        {/* Cover image or brand banner */}
        <div className="relative h-40 w-full bg-muted sm:h-52">
          {service.image ? (
            <Image
              src={service.image}
              alt={service.name}
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
              <Layers size={44} className="text-white/40" />
            </div>
          )}
          <button
            onClick={() =>
              router.push(`/dashboard/services/${service.id}/edit`)
            }
            className="absolute right-4 top-4 flex items-center gap-1.5 rounded-lg bg-background/90 px-3.5 py-2 text-[12.5px] font-semibold text-foreground backdrop-blur-sm hover:bg-background">
            <Pencil size={14} /> Edit
          </button>
        </div>

        <div className="p-6">
          <div className="mb-2 flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              {service.name}
            </h1>
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase",
                service.isActive
                  ? "bg-green-500/15 text-green-600 dark:text-green-400"
                  : "bg-slate-500/15 text-slate-500",
              )}>
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  service.isActive ? "bg-green-500" : "bg-slate-400",
                )}
              />
              {service.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          {service.tagline && (
            <p className="mb-3 text-[14px] font-medium text-primary">
              {service.tagline}
            </p>
          )}
          {service.description && (
            <p className="text-[13.5px] leading-relaxed text-muted-foreground">
              {service.description}
            </p>
          )}

          <button
            onClick={handleToggle}
            disabled={toggleMut.isPending}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-[12.5px] font-semibold text-foreground hover:bg-foreground/4 disabled:opacity-60">
            {toggleMut.isPending ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Power size={13} />
            )}
            {service.isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className={card}>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/13 text-primary">
            <GraduationCap size={20} />
          </div>
          <div className="text-2xl font-extrabold text-foreground">
            {courseCount}
          </div>
          <div className="text-[12.5px] text-muted-foreground">
            Total Courses
          </div>
        </div>
        <div className={card}>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/13 text-primary">
            <CheckCircle2 size={20} />
          </div>
          <div className="text-2xl font-extrabold text-foreground">
            {publishedCount}
          </div>
          <div className="text-[12.5px] text-muted-foreground">Published</div>
        </div>
        <div className={card}>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/13 text-primary">
            <Users size={20} />
          </div>
          <div className="text-2xl font-extrabold text-foreground">
            {totalEnrollments}
          </div>
          <div className="text-[12.5px] text-muted-foreground">
            Total Enrollments
          </div>
        </div>
      </div>

      {/* Features */}
      {service.features && service.features.length > 0 && (
        <div className={cn(card, "mb-6")}>
          <h2 className="mb-4 text-[15px] font-bold text-foreground">
            What&apos;s Included
          </h2>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {service.features.map((f, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/13 text-primary">
                  <Check size={12} />
                </span>
                <span className="text-[13px] text-foreground">{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Courses list */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-[15px] font-bold text-foreground">
            Courses in this Service
          </h2>
          <span className="text-[12.5px] text-muted-foreground">
            {courses.length} course{courses.length === 1 ? "" : "s"}
          </span>
        </div>

        {courses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Course
                  </th>
                  <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Type
                  </th>
                  <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Price
                  </th>
                  <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Enrollments
                  </th>
                  <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr
                    key={course.id}
                    onClick={() =>
                      router.push(`/dashboard/courses/${course.id}`)
                    }
                    className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-foreground/2">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/13 text-primary">
                          <GraduationCap size={16} />
                        </div>
                        <span className="text-[13.5px] font-semibold text-foreground">
                          {course.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
                        {course.courseType === "ONLINE" ? (
                          <Monitor size={13} className="text-primary" />
                        ) : (
                          <MapPin size={13} className="text-primary" />
                        )}
                        {course.courseType === "ONLINE" ? "Online" : "On-site"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[13px] font-semibold text-foreground">
                      {formatNaira(course.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-[13px] text-foreground">
                        <Users size={13} className="text-muted-foreground" />{" "}
                        {course._count?.enrollments ?? 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase",
                          course.isPublished
                            ? "bg-green-500/15 text-green-600 dark:text-green-400"
                            : "bg-slate-500/15 text-slate-500",
                        )}>
                        {course.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ChevronRight
                        size={16}
                        className="text-muted-foreground"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <GraduationCap
              size={32}
              className="mx-auto mb-3 text-muted-foreground/40"
            />
            <p className="text-[14px] font-semibold text-foreground">
              No courses yet
            </p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Courses added under this service will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
