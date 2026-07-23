import api from "../api";
import { Lesson } from "@/app/interfaces/lms.interface";

export interface LessonPayload {
  title: string;
  content?: string;
  videoUrl?: string;
  order: number;
  duration?: number;
  courseId: string;
}

export const lessonsApi = {
  getByCourse: async (courseId: string): Promise<Lesson[]> =>
    (await api.get(`/lessons/course/${courseId}`)).data,
  create: async (payload: LessonPayload) =>
    (await api.post("/lessons", payload)).data,
  update: async (id: string, payload: Partial<LessonPayload>) =>
    (await api.patch(`/lessons/${id}`, payload)).data,
  remove: async (id: string) => {
    await api.delete(`/lessons/${id}`);
  },
  reorder: async (courseId: string, lessonIds: string[]) =>
    (await api.patch(`/lessons/course/${courseId}/reorder`, { lessonIds }))
      .data,
};
