"use client";

import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCourse } from "@/app/hooks/use-courses";
import { CourseForm } from "@/app/components/courses/course-form";

export default function EditCoursePage() {
  const { id } = useParams<{ id: string }>();
  const { data: course, isLoading } = useCourse(id);

  if (isLoading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  if (!course)
    return (
      <div className="py-20 text-center text-foreground">Course not found.</div>
    );

  return <CourseForm course={course} />;
}
