import api from "../api";
import { Enrollment } from "@/app/interfaces/lms.interface";

export const enrollmentsApi = {
  getAll: async (params?: {
    courseId?: string;
    sessionId?: string;
    status?: string;
  }): Promise<Enrollment[]> => (await api.get("/enrollments", { params })).data,
  confirm: async (id: string) =>
    (await api.patch(`/enrollments/${id}/confirm`)).data,
  cancel: async (id: string) =>
    (await api.patch(`/enrollments/${id}/cancel`)).data,
  updateStatus: async (id: string, status: string) =>
    (await api.patch(`/enrollments/${id}`, { status })).data,
};
