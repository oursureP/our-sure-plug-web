import { Department } from "@/app/interfaces/department.interface";
import api from "../api";

export interface DepartmentPayload {
  name: string;
  description?: string;
}

export const departmentsApi = {
  getAll: async (): Promise<Department[]> => {
    const res = await api.get("/departments");
    return res.data;
  },
  getOne: async (id: string): Promise<Department> => {
    const res = await api.get(`/departments/${id}`);
    return res.data;
  },
  create: async (payload: DepartmentPayload): Promise<Department> => {
    const res = await api.post("/departments", payload);
    return res.data;
  },
  update: async (
    id: string,
    payload: DepartmentPayload,
  ): Promise<Department> => {
    const res = await api.patch(`/departments/${id}`, payload);
    return res.data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/departments/${id}`);
  },
  addUser: async (departmentId: string, userId: string) =>
    (await api.patch(`/departments/${departmentId}/add-user/${userId}`)).data,
  removeUser: async (departmentId: string, userId: string) =>
    (await api.patch(`/departments/${departmentId}/remove-user/${userId}`))
      .data,
};
