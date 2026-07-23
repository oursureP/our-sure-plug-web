import { Course } from "@/app/interfaces/lms.interface";

export type CourseFormat = "SELF_PACED" | "COHORT";

export function getCourseFormat(
  course: Pick<Course, "sessions">,
): CourseFormat {
  return course.sessions && course.sessions.length > 0
    ? "COHORT"
    : "SELF_PACED";
}

export const COURSE_FORMAT_LABEL: Record<CourseFormat, string> = {
  SELF_PACED: "Self-Paced",
  COHORT: "Scheduled",
};
