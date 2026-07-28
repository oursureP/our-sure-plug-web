import type { Metadata } from "next";
import { Suspense } from "react";
import { serverFetch } from "@/app/lib/api/server";
import { Course } from "@/app/interfaces/lms.interface";
import { Service } from "@/app/interfaces/lms.interface";
import { CoursesCatalog } from "@/app/components/web/courses-catalog";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Courses | OurSurePlug",
  description: "Browse our hands-on training programs and enroll.",
};

export default async function CoursesPage() {
  const [courses, services] = await Promise.all([
    serverFetch<Course[]>("/courses", { revalidate: 300 }),
    serverFetch<Service[]>("/services", { revalidate: 300 }),
  ]);
  const published = (courses ?? []).filter((c) => c.isPublished);
  const activeServices = (services ?? []).filter((s) => s.isActive);
  return (
    <Suspense fallback={null}>
      <CoursesCatalog courses={published} services={activeServices} />
    </Suspense>
  );
}
