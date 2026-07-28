"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  //   ArrowRight,
  Clock,
  GraduationCap,
  Check,
  ChevronDown,
  Monitor,
  MapPin,
  BarChart,
  BookOpen,
  Calendar,
} from "lucide-react";
import { Course } from "@/app/interfaces/lms.interface";
import { COURSE_ICONS } from "@/app/lib/course-icons";
import { formatNGN, formatUSD } from "@/app/lib/format";
import { EnrollButton } from "@/app/components/web/enroll-button";

const LEVEL_LABEL: Record<string, string> = {
  BEGINNER: "Complete beginners — no experience needed",
  INTERMEDIATE: "Intermediate — some experience helpful",
  ADVANCED: "Advanced — for experienced learners",
};
const LEVEL_SHORT: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
function fmtDateShort(d?: string | null) {
  return d
    ? new Date(d).toLocaleDateString("en-NG", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;
}

export function CourseDetailClient({ course }: { course: Course | null }) {
  const [openWeeks, setOpenWeeks] = useState<number[]>([1]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!course) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
        <h1 className="text-3xl font-bold text-foreground">Course not found</h1>
        <p className="mt-3 text-muted-foreground">
          We couldn&apos;t find that course — it may have moved.
        </p>
        <Link
          href="/courses"
          className="mt-6 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90">
          Back to all courses
        </Link>
      </div>
    );
  }

  const toggleWeek = (n: number) =>
    setOpenWeeks((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n],
    );
  const outcomes = course.learningOutcomes ?? [];
  const highlights = course.highlights ?? [];
  const curriculum = (course.curriculum ?? [])
    .slice()
    .sort((a, b) => a.n - b.n);
  const activeSessions = (course.sessions ?? []).filter((s) => s.isActive);
  const lessons = course.lessons ?? [];
  const isOnline = course.courseType === "ONLINE";

  return (
    <div className="min-h-screen bg-background">
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--brand-purple)" }}>
        {course.thumbnailUrl && (
          <div className="absolute inset-0">
            <Image
              src={course.thumbnailUrl}
              alt=""
              fill
              aria-hidden
              className="scale-110 object-cover blur-sm"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, var(--brand-purple), rgba(67,11,131,0.6), rgba(67,11,131,0.4))",
              }}
            />
          </div>
        )}
        <div className="relative mx-auto max-w-5xl px-5 py-16 md:py-24">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1 text-sm font-medium text-white/70 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" /> All courses
          </Link>
          <div className="mt-6">
            {course.badge && (
              <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur">
                {course.badge}
              </span>
            )}
            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
              {course.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/80">
              {course.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              {course.duration && (
                <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 font-medium text-white backdrop-blur">
                  <Clock className="h-4 w-4 text-(--brand-green)" />{" "}
                  {course.duration}
                </span>
              )}
              {course.level && (
                <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 font-medium text-white backdrop-blur">
                  <GraduationCap className="h-4 w-4 text-(--brand-green)" />{" "}
                  {LEVEL_LABEL[course.level] ?? course.level}
                </span>
              )}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {/* {activeSessions.length > 0 ? (
                <EnrollButton
                  course={{
                    id: course.id,
                    title: course.title,
                    courseType: course.courseType,
                  }}
                  sessions={activeSessions}
                  label={`Enrol now — ${formatNGN(course.price)}`}
                  className="w-max"
                />
              ) : (
                <Link
                  href="/contact"
                  className="rounded-xl bg-(--brand-green) px-6 py-3 font-semibold text-(--brand-purple) hover:opacity-90">
                  Contact us to enrol
                </Link>
              )} */}

              {activeSessions.length > 0 ? (
                <EnrollButton
                  course={{
                    id: course.id,
                    title: course.title,
                    courseType: course.courseType,
                  }}
                  sessions={activeSessions}
                  label={`Enrol now — ${formatNGN(course.price)}`}
                />
              ) : (
                // Personal course — enroll with no session
                <EnrollButton
                  course={{
                    id: course.id,
                    title: course.title,
                    courseType: course.courseType,
                  }}
                  sessions={[]}
                  label={`Enrol now — ${formatNGN(course.price)}`}
                />
              )}
              <a
                href="#curriculum"
                className="rounded-xl border border-white/25 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20">
                View curriculum
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Price band */}
      <section className="bg-primary">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-5 py-6 sm:flex-row text-primary-foreground">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">
              {formatNGN(course.price)}
            </span>
            {course.priceUSD && (
              <span className="text-lg font-semibold opacity-70">
                {formatUSD(course.priceUSD)}
              </span>
            )}
          </div>
          {course.priceNote && (
            <p className="text-sm font-medium opacity-80">{course.priceNote}</p>
          )}
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.7fr_1fr] lg:gap-14">
          <div className="space-y-14">
            {/* Highlights */}
            {highlights.length > 0 && (
              <section className="bg-background">
                <div className="mx-auto max-w-5xl px-5 py-4">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    What you&apos;ll walk away with
                  </h2>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                    {highlights.map((h, i) => {
                      const Icon =
                        COURSE_ICONS[h.icon as keyof typeof COURSE_ICONS] ??
                        Check;
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5">
                          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-(--brand-purple) text-(--brand-green)">
                            <Icon className="h-5 w-5" />
                          </span>
                          <span className="font-medium text-foreground">
                            {h.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* Outcomes */}
            {outcomes.length > 0 && (
              <section className="bg-muted/30">
                <div className="mx-auto max-w-5xl px-4">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    What you&apos;ll learn
                  </h2>
                  <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {outcomes.map((o, i) => (
                      <div
                        key={i}
                        className="flex gap-3 rounded-xl bg-card p-4">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span className="text-foreground/80">{o}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Curriculum */}
            {curriculum.length > 0 && (
              <section id="curriculum" className="scroll-mt-24 bg-background">
                <div className="mx-auto max-w-4xl px-5 py-2 ">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    {course.duration
                      ? `${course.duration} curriculum`
                      : "Curriculum"}
                  </h2>
                  <p className="mt-3 text-muted-foreground">
                    A structured path — each week ends with a real deliverable
                    for your portfolio.
                  </p>
                  <ol className="mt-10 space-y-4">
                    {curriculum.map((w) => {
                      const isOpen = openWeeks.includes(w.n);
                      return (
                        <li
                          key={w.n}
                          className="overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/50">
                          <button
                            onClick={() => toggleWeek(w.n)}
                            className="flex w-full items-center gap-5 p-5 text-left">
                            <span className="text-2xl font-bold tabular-nums text-primary">
                              {String(w.n).padStart(2, "0")}
                            </span>
                            <span className="flex-1 text-lg font-bold text-foreground">
                              {w.title}
                            </span>
                            <ChevronDown
                              className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                            />
                          </button>
                          <div
                            className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                            <div className="overflow-hidden">
                              <div className="border-t border-border px-5 pb-5 pt-4">
                                {w.topics.length > 0 && (
                                  <ul className="space-y-2">
                                    {w.topics.map((t, ti) => (
                                      <li
                                        key={ti}
                                        className="flex gap-2.5 text-sm text-foreground/75">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                        <span>{t}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                                {w.deliverable && (
                                  <p className="mt-4 rounded-lg bg-card px-3 py-2 text-sm text-muted-foreground">
                                    <span className="font-semibold text-foreground">
                                      Deliverable:
                                    </span>{" "}
                                    {w.deliverable}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </section>
            )}
            {course.requirements && course.requirements.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  Requirements
                </h2>
                <ul className="mt-6 space-y-2.5">
                  {course.requirements.map((r, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-[14px] text-muted-foreground bg-card p-3 rounded-lg">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{" "}
                      {r}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <div>
            <div className="sticky top-28 rounded-3xl border border-border bg-card p-6 shadow-lg shadow-black/4 dark:shadow-none">
              <div className="mb-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-foreground">
                  {formatNGN(course.price)}
                </span>
                {course.priceUSD && (
                  <span className="text-lg font-semibold text-muted-foreground">
                    {formatUSD(course.priceUSD)}
                  </span>
                )}
              </div>
              <p className="mb-5 text-[13px] text-muted-foreground">
                {course.priceNote ?? "One-time payment"}
              </p>

              {/* Quick facts */}
              <div className="mb-5 space-y-3 border-y border-border py-5">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    {isOnline ? (
                      <Monitor size={15} className="text-primary" />
                    ) : (
                      <MapPin size={15} className="text-primary" />
                    )}{" "}
                    Format
                  </span>
                  <span className="font-semibold text-foreground">
                    {isOnline ? "Online" : "On-site"}
                  </span>
                </div>
                {course.duration && (
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Clock size={15} className="text-primary" /> Duration
                    </span>
                    <span className="font-semibold text-foreground">
                      {course.duration}
                    </span>
                  </div>
                )}
                {course.level && (
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <BarChart size={15} className="text-primary" /> Level
                    </span>
                    <span className="font-semibold text-foreground">
                      {LEVEL_SHORT[course.level] ?? course.level}
                    </span>
                  </div>
                )}
                {lessons.length > 0 && (
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <BookOpen size={15} className="text-primary" /> Lessons
                    </span>
                    <span className="font-semibold text-foreground">
                      {lessons.length}
                    </span>
                  </div>
                )}
                {course.startDate && (
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Calendar size={15} className="text-primary" /> Starts
                    </span>
                    <span className="font-semibold text-primary">
                      {fmtDateShort(course.startDate)}
                    </span>
                  </div>
                )}
                {course.endDate && (
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Calendar size={15} className="text-primary" /> Ends
                    </span>
                    <span className="font-semibold text-primary">
                      {fmtDateShort(course.endDate)}
                    </span>
                  </div>
                )}
              </div>

              {/* Sessions */}
              {/* {activeSessions.length > 0 ? (
                <div className="mb-5">
                  <h3 className="mb-2.5 text-[12.5px] font-bold uppercase tracking-wide text-muted-foreground">
                    Upcoming Sessions
                  </h3>
                  <div className="space-y-2">
                    {activeSessions.map((s) => (
                      <div
                        key={s.id}
                        className="rounded-xl border border-border p-3">
                        <div className="text-[13px] font-semibold text-foreground">
                          {s.title}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                          <Calendar size={11} className="text-primary" />
                          {fmtDate(s.startDate)} – {fmtDate(s.endDate)}
                        </div>
                        {s.remainingSlots != null && (
                          <div className="mt-1 text-[11.5px] font-medium text-primary">
                            {s.remainingSlots} slots left
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mb-5 rounded-xl border border-dashed border-border p-3 text-center text-[12.5px] text-muted-foreground">
                  No sessions scheduled yet. Contact us for details.
                </p>
              )} */}

              {activeSessions.length > 0 && (
                <div className="mb-5">
                  <h3 className="mb-2.5 text-[12.5px] font-bold uppercase tracking-wide text-muted-foreground">
                    Registration{" "}
                    {activeSessions.length === 1 ? "Window" : "Windows"}
                  </h3>
                  <div className="space-y-2">
                    {activeSessions.map((s) => (
                      <div
                        key={s.id}
                        className="rounded-xl border border-border p-3">
                        <div className="text-[13px] font-semibold text-foreground">
                          {s.title}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                          <Calendar size={11} className="text-primary" />
                          Register by {fmtDate(s.endDate)}
                        </div>
                        {s.remainingSlots != null && (
                          <div className="mt-1 text-[11.5px] font-medium text-primary">
                            {s.remainingSlots} slots left
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enroll */}
              {activeSessions.length > 0 ? (
                <EnrollButton
                  course={{
                    id: course.id,
                    title: course.title,
                    courseType: course.courseType,
                  }}
                  sessions={activeSessions}
                  label={`Enrol now — ${formatNGN(course.price)}`}
                />
              ) : (
                <Link
                  href="/contact"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-4 text-sm font-bold text-foreground transition-all hover:border-primary/50">
                  Contact Us
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Enrol CTA */}
      <section className="bg-background pb-20">
        <div className="mx-auto max-w-5xl px-5">
          <div
            className="relative overflow-hidden rounded-3xl px-8 py-14 text-center md:px-16"
            style={{ background: "var(--brand-purple)" }}>
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-(--brand-green)/20 blur-3xl" />
            <h2 className="relative text-3xl font-bold tracking-tight text-white md:text-4xl">
              Ready to enrol in {course.title}?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-white/75">
              Secure your spot in the next cohort — pay safely online in Naira.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {activeSessions.length > 0 ? (
                <EnrollButton
                  course={{
                    id: course.id,
                    title: course.title,
                    courseType: course.courseType,
                  }}
                  sessions={activeSessions}
                  label={`Enrol now — ${formatNGN(course.price)}`}
                  className="w-max"
                />
              ) : (
                <Link
                  href="/contact"
                  className="rounded-xl bg-(--brand-green) px-8 py-3 font-semibold text-(--brand-purple) hover:opacity-90">
                  Contact us
                </Link>
              )}
              {course.priceUSD && (
                <span className="text-sm text-white/60">
                  {formatUSD(course.priceUSD)} · {course.priceNote}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
