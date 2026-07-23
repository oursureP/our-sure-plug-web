import { Service } from "@/app/interfaces/lms.interface";
import api from "../api";
export interface ServicePayload {
  name: string;
  description?: string;
  tagline?: string;
  features?: string[];
  isActive?: boolean;
  image?: string;
}

// Backend LMS "Service" = Training Category
export const servicesApi = {
  getAll: async (): Promise<Service[]> => (await api.get("/services")).data,
  getOne: async (id: string): Promise<Service> =>
    (await api.get(`/services/${id}`)).data,
  create: async (payload: ServicePayload): Promise<Service> =>
    (await api.post("/services", payload)).data,
  update: async (id: string, payload: ServicePayload): Promise<Service> =>
    (await api.patch(`/services/${id}`, payload)).data,
  remove: async (id: string): Promise<void> => {
    await api.delete(`/services/${id}`);
  },
  toggleActive: async (id: string): Promise<Service> =>
    (await api.put(`/services/${id}/toggle-active-service`)).data,
};
