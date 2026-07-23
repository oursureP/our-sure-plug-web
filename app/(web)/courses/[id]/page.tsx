import type { Metadata } from "next";
import { serverFetch } from "@/app/lib/api/server";
import { Course } from "@/app/interfaces/lms.interface";
import { CourseDetailClient } from "@/app/components/web/course-detail-client";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const course = await serverFetch<Course>(`/courses/${id}`, {
    revalidate: 300,
  });
  if (!course) return { title: "Course | OurSurePlug" };
  return {
    title: `${course.title} | OurSurePlug`,
    description: course.heroSummary ?? course.description?.slice(0, 160),
    openGraph: {
      title: course.title,
      description: course.heroSummary ?? "",
      images: course.thumbnailUrl ? [{ url: course.thumbnailUrl }] : [],
    },
  };
}

export default async function CoursePage({ params }: PageProps) {
  const { id } = await params;
  const course = await serverFetch<Course>(`/courses/${id}`, {
    revalidate: 300,
  });
  return <CourseDetailClient course={course} />;
}
