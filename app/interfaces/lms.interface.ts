import { CourseType, EnrollmentStatus } from "./enums";
import { User } from "./user.interface";

// Backend "Service" model = a Training Category (Web Development, Graphics Design...)
// GET /services returns this with _count.courses
export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface CourseHighlight {
  icon: string;
  label: string;
}
export interface CurriculumWeek {
  n: number;
  title: string;
  topics: string[];
  deliverable: string;
}

export interface HowItWorksStep {
  step?: number;
  title: string;
  subtitle?: string;
}
export interface Testimonial {
  quote: string;
  author: string;
}
export interface FaqItem {
  question: string;
  answer: string;
}
export interface Service {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  tagline?: string | null; // ← add
  image?: string | null; // ← add
  features?: string[]; // ← add
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { courses: number };
  courses?: ServiceCourseSummary[];
  badge?: string | null;
  whoItsFor?: string | null;
  problems?: string[];
  howItWorks?: HowItWorksStep[] | null;
  testimonial?: Testimonial | null;
  faq?: FaqItem[] | null;
  ctaText?: string | null;
  user?: Pick<User, "id" | "firstName" | "lastName" | "email">;
}

// The exact shape findOne returns inside `courses`
export interface ServiceCourseSummary {
  id: string;
  title: string;
  price: string; // Decimal → string over JSON
  courseType: CourseType;
  isPublished: boolean;
  _count: {
    enrollments: number;
  };
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: string; // Decimal → string
  duration?: string | null;
  thumbnailUrl?: string | null;
  isPublished: boolean;
  courseType: CourseType;
  serviceId: string;
  instructorId: string;
  createdAt: string;
  updatedAt: string;

  service?: Pick<Service, "id" | "name" | "slug">;
  instructor?: Pick<User, "id" | "firstName" | "lastName" | "email">;
  lessons?: Lesson[];
  sessions?: CourseSession[];
  enrollments?: Enrollment[];
  _count?: {
    enrollments?: number;
    lessons?: number;
  };

  level?: CourseLevel;
  learningOutcomes?: string[];
  requirements?: string[];

  priceUSD?: string | null;
  priceNote?: string | null;
  tagline?: string | null;
  heroSummary?: string | null;
  badge?: string | null;
  highlights?: CourseHighlight[] | null;
  curriculum?: CurriculumWeek[] | null;
  isSelfPaced?: boolean;
  startDate?: string | null;
  endDate?: string | null;
  course?: { id: string; title: string; courseType: CourseType; price: string };
}

export interface CourseSession {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  onlineCapacity?: number | null;
  physicalCapacity?: number | null;
  venue?: string | null;
  isActive: boolean;
  courseId: string;
  createdAt: string;
  updatedAt: string;

  _count?: {
    enrollments: number;
  };
  // computed by backend findAll
  remainingSlots?: number | null;
  remainingPhysicalSlots?: number | null;
  remainingOnlineSlots?: number | null;
  course?: { id: string; title: string; courseType: CourseType; price: string };
}

export interface Lesson {
  id: string;
  title: string;
  content?: string | null;
  videoUrl?: string | null;
  order: number;
  duration?: number | null;
  courseId: string;
  createdAt: string;
  _count?: {
    progress: number;
  };
}

export interface Enrollment {
  id: string;
  status: EnrollmentStatus;
  enrolledAt?: string | null;
  completedAt?: string | null;
  certificateUrl?: string | null;
  paymentReference?: string | null;
  userId: string;
  courseId: string;
  sessionId?: string | null;
  createdAt: string;
  updatedAt: string;

  user?: Pick<User, "id" | "firstName" | "lastName" | "email" | "phone">;
  course?: Partial<Course>;
  session?: Partial<CourseSession>;
  lessonProgress?: LessonProgress[];
}

export interface LessonProgress {
  id: string;
  isCompleted: boolean;
  completedAt?: string | null;
  enrollmentId: string;
  lessonId: string;
  lesson?: Pick<Lesson, "id" | "title" | "order">;
}
