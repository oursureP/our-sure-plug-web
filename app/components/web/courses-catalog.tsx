"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Check,
  GraduationCap,
  Infinity as InfinityIcon,
  CalendarClock,
} from "lucide-react";
import { Course, Service } from "@/app/interfaces/lms.interface";
import { formatNGN, formatUSD } from "@/app/lib/format";
import { cn } from "@/lib/utils";
import { getCourseFormat } from "@/app/lib/course-format";
import { Reveal } from "./reveal";

export function CoursesCatalog({
  courses,
  services,
}: {
  courses: Course[];
  services: Service[];
}) {
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") ?? "ALL";
  const [activeService, setActiveService] = useState(initialService);
  const [format, setFormat] = useState<"ALL" | "SELF_PACED" | "COHORT">("ALL");

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchesService =
        activeService === "ALL" || c.service?.slug === activeService;
      const matchesFormat = format === "ALL" || getCourseFormat(c) === format;
      return matchesService && matchesFormat;
    });
  }, [courses, activeService, format]);

  const servicesWithCourses = services.filter((s) =>
    courses.some((c) => c.serviceId === s.id),
  );

  return (
    <div className="bg-background pb-20 lg:pb-28">
      <section className="relative flex min-h-125 items-center justify-center overflow-hidden md:min-h-130">
        <Image
          src="/images/courses-hero.jpeg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(67,11,131,0.80) 0%, rgba(67,11,131,0.65) 50%, rgba(67,11,131,0.90) 100%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl px-5 pt-20 text-center">
          <p className="text-[13px] font-bold uppercase tracking-wider text-(--brand-green)">
            Our courses
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            Pick a course and enroll
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-white/80">
            Learn at your own pace, or join a scheduled cohort. Open any course
            for the full curriculum and pricing.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-5 pt-12">
        {/* <div className="max-w-2xl">
          <p className="text-[13px] font-bold uppercase tracking-wider text-primary">
            Our courses
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            Pick a course and enroll
          </h1>
          <p className="mt-4 text-muted-foreground">
            Learn at your own pace, or join a scheduled cohort. Open any course
            for the full curriculum and pricing.
          </p>
        </div> */}

        {/* Format filter — clear self-paced vs scheduled */}
        <div className="mt-8 flex flex-wrap gap-2">
          {(
            [
              ["ALL", "All Courses"],
              ["SELF_PACED", "Self-Paced"],
              ["COHORT", "Scheduled"],
            ] as const
          ).map(([key, lbl]) => (
            <button
              key={key}
              onClick={() => setFormat(key)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors",
                format === key
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:text-foreground",
              )}>
              {key === "SELF_PACED" && <InfinityIcon size={13} />}
              {key === "COHORT" && <CalendarClock size={13} />}
              {lbl}
            </button>
          ))}
        </div>

        {/* Service (category) filter */}
        {servicesWithCourses.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveService("ALL")}
              className={cn(
                "rounded-full px-4 py-2 text-[13px] font-semibold transition-colors",
                activeService === "ALL"
                  ? "bg-foreground text-background"
                  : "border border-border text-muted-foreground hover:text-foreground",
              )}>
              All Categories
            </button>
            {servicesWithCourses.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveService(s.slug)}
                className={cn(
                  "rounded-full px-4 py-2 text-[13px] font-semibold transition-colors",
                  activeService === s.slug
                    ? "bg-foreground text-background"
                    : "border border-border text-muted-foreground hover:text-foreground",
                )}>
                {s.name}
              </button>
            ))}
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {filtered.map((course, i) => (
              <Reveal key={course.id} delay={i * 80}>
                <CourseCard course={course} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-16 text-center">
            <GraduationCap
              size={32}
              className="mx-auto mb-3 text-muted-foreground/40"
            />
            <p className="text-[15px] font-semibold text-foreground">
              No courses match
            </p>
            <p className="mt-1 text-[13.5px] text-muted-foreground">
              Try a different filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  const outcomes = course.learningOutcomes ?? [];
  const fmt = getCourseFormat(course);
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:shadow-none">
      <div className="relative h-44 w-full overflow-hidden bg-muted">
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <GraduationCap size={30} className="text-muted-foreground/40" />
          </div>
        )}
        {/* Format badge */}
        <span
          className={cn(
            "absolute right-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase backdrop-blur",
            fmt === "SELF_PACED"
              ? "bg-(--brand-green)/90 text-(--brand-purple)"
              : "bg-(--brand-purple)/90 text-white",
          )}>
          {fmt === "SELF_PACED" ? (
            <>
              <InfinityIcon size={10} /> Self-Paced
            </>
          ) : (
            <>
              <CalendarClock size={10} /> Scheduled
            </>
          )}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        {course.badge && (
          <span className="w-fit rounded-full bg-primary/12 px-3 py-1 text-[11px] font-semibold text-primary">
            {course.badge}
          </span>
        )}
        <h3 className="mt-3 text-xl font-bold tracking-tight text-foreground">
          {course.title}
        </h3>
        {course.heroSummary && (
          <p className="mt-2 text-[13.5px] text-muted-foreground">
            {course.heroSummary}
          </p>
        )}
        {outcomes.length > 0 && (
          <ul className="mt-4 space-y-2">
            {outcomes.slice(0, 3).map((o, i) => (
              <li key={i} className="flex gap-2 text-[13px] text-foreground/80">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{o}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 flex items-end justify-between border-t border-border pt-5">
          <div>
            <p className="text-2xl font-bold text-foreground">
              {formatNGN(course.price)}
            </p>
            <p className="text-[12px] text-muted-foreground">
              {course.priceUSD ? `${formatUSD(course.priceUSD)} · ` : ""}
              {course.duration ?? ""}
            </p>
          </div>
          <span className="flex items-center gap-1 text-[13px] font-semibold text-foreground transition group-hover:gap-2">
            View course <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
