import { Course } from "@/app/interfaces";
import api from "../api";

export interface CoursePayload {
  title: string;
  description: string;
  price: string;
  duration?: string;
  thumbnailUrl?: string; // base64 or URL
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  learningOutcomes?: string[];
  requirements?: string[];
  courseType: "ONLINE" | "PHYSICAL";
  serviceId: string;
  instructorId: string;
  isPublished?: boolean;
  startDate?: string | null;
  endDate?: string | null;
}

export const coursesApi = {
  getAll: async (): Promise<Course[]> => {
    const res = await api.get("/courses");
    return res.data;
  },

  getOne: async (id: string): Promise<Course> => {
    const res = await api.get(`/courses/${id}`);
    return res.data;
  },
  create: async (payload: CoursePayload): Promise<Course> =>
    (await api.post("/courses", payload)).data,
  update: async (
    id: string,
    payload: Partial<CoursePayload>,
  ): Promise<Course> => (await api.patch(`/courses/${id}`, payload)).data,
  remove: async (id: string): Promise<void> => {
    await api.delete(`/courses/${id}`);
  },
  publish: async (id: string): Promise<Course> =>
    (await api.put(`/courses/${id}/publish`)).data,
  publishCourseWithNoSession: async (id: string): Promise<Course> =>
    (await api.put(`/courses/${id}/publish-with-no-session`)).data,

  unpublish: async (id: string): Promise<Course> =>
    (await api.put(`/courses/${id}/unpublish`)).data,
};
