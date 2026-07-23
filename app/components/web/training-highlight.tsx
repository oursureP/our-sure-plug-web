"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Clock,
  Monitor,
  MapPin,
  GraduationCap,
  Calendar,
} from "lucide-react";
import { Course } from "@/app/interfaces/lms.interface";
// import { useCourses } from "@/app/hooks/use-courses";

// Hardcoded fallback — shaped like real Course
function formatNaira(price: string) {
  const n = Number(price);
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
}

export function TrainingHighlight({ list }: { list?: Course[] }) {
  const courses =
    list && list.length > 0
      ? list.filter((c) => c.isPublished).slice(0, 3)
      : [];

  return (
    <section className="bg-card/65 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
              Skills Training
            </span>
            <h2 className="mb-3 text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
              Level up with our{" "}
              <span className="text-primary">expert-led courses</span>
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Gain real-world skills through expert-led, hands-on
              training—available online and at our training centers.
            </p>
          </div>
          <Link
            href="/courses"
            className="group hidden shrink-0 items-center gap-2 rounded-xl border border-primary bg-card px-5 py-3 text-sm font-semibold text-foreground transition-all hover:bg-primary hover:text-white hover:-translate-y-0.5 hover:border-primary sm:inline-flex ">
            View all courses
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Courses grid */}
        {courses.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-md shadow-black/4 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/12 dark:border-white/10 dark:bg-[#161427] dark:shadow-none">
                {/* Thumbnail */}
                <div className="relative h-44 overflow-hidden bg-muted">
                  {course.thumbnailUrl ? (
                    <Image
                      src={course.thumbnailUrl}
                      alt={course.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <GraduationCap
                        size={34}
                        className="text-muted-foreground/40"
                      />
                    </div>
                  )}
                  <span className="absolute left-3.5 top-3.5 flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-foreground backdrop-blur-sm">
                    {course.courseType === "ONLINE" ? (
                      <>
                        <Monitor size={11} className="text-primary" /> Online
                      </>
                    ) : (
                      <>
                        <MapPin size={11} className="text-primary" /> On-site
                      </>
                    )}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="mb-2 text-base font-bold tracking-tight text-foreground line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 flex-1 text-[12.5px] leading-relaxed text-muted-foreground">
                    {course.description}
                  </p>

                  {/* Meta */}
                  <div className="mb-4 flex items-center gap-4 text-[11.5px] text-muted-foreground">
                    {course.duration && (
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} className="text-primary" />
                        {course.duration}
                      </span>
                    )}
                    {course.sessions && course.sessions.length > 0 ? (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-primary" />
                        Starts{" "}
                        {new Date(
                          course.sessions[0].startDate,
                        ).toLocaleDateString("en-NG", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <GraduationCap size={13} className="text-primary" />
                        {course._count?.enrollments ?? 0} enrolled
                      </span>
                    )}
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <span className="text-lg font-extrabold text-foreground">
                      {formatNaira(course.price)}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                      Enroll{" "}
                      <ArrowRight
                        size={13}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex items-center flex-col gap-4">
            <p> New courses coming soon....</p>
            <Link
              href="/services"
              className="group hidden shrink-0 items-center gap-2 rounded-xl border border-primary bg-card px-5 py-3 text-sm font-semibold text-foreground transition-all hover:bg-primary hover:text-white hover:-translate-y-0.5 hover:border-primary sm:inline-flex ">
              Visit services <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* Mobile view-all */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            href="/courses"
            className="group inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground dark:bg-[#161427]">
            View all courses <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
