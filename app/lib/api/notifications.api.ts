import api from "../api";
import { Notification } from "@/app/interfaces/notification";

export interface CreateNotificationPayload {
  userId: string;
  type: string;
  title: string;
  body: string;
  link?: string;
}

export const notificationsApi = {
  getAll: async (): Promise<Notification[]> =>
    (await api.get("/notifications")).data,
  unreadCount: async (): Promise<{ count: number } | number> =>
    (await api.get("/notifications/unread-count")).data,
  markRead: async (id: string) =>
    (await api.patch(`/notifications/${id}/read`)).data,
  markAllRead: async () =>
    (await api.patch("/notifications/mark-all-read")).data,
  remove: async (id: string) => (await api.delete(`/notifications/${id}`)).data,
  create: async (payload: CreateNotificationPayload) =>
    (await api.post("/notifications", payload)).data,
};
