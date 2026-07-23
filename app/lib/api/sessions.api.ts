import api from "../api";
import { CourseSession } from "@/app/interfaces/lms.interface";

export interface SessionPayload {
  title: string;
  startDate: string;
  endDate: string;
  courseId: string;
  venue?: string;
  physicalCapacity?: number;
  onlineCapacity?: number;
  isActive?: boolean;
}

export const sessionsApi = {
  getAll: async (courseId?: string): Promise<CourseSession[]> =>
    (await api.get("/sessions", { params: courseId ? { courseId } : {} })).data,
  getOne: async (id: string): Promise<CourseSession> =>
    (await api.get(`/sessions/${id}`)).data,
  create: async (payload: SessionPayload) =>
    (await api.post("/sessions", payload)).data,
  update: async (id: string, payload: Partial<SessionPayload>) =>
    (await api.patch(`/sessions/${id}`, payload)).data,
  activate: async (id: string) =>
    (await api.put(`/sessions/${id}/activate`)).data,
  deactivate: async (id: string) =>
    (await api.put(`/sessions/${id}/deactivate`)).data,
  remainingSlots: async (id: string) =>
    (await api.get(`/sessions/${id}/remaining-slots`)).data,
  remove: async (id: string): Promise<void> => {
    await api.delete(`/sessions/${id}`);
  },
};
