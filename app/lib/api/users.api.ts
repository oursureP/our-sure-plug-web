import { User } from "@/app/interfaces/user.interface";
import api from "../api";
import { AuthUser } from "@/app/stores/auth.store";

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  address?: string;
  country?: string;
  state?: string;
  lga?: string;
  gender?: "Male" | "Female";
}

export const usersApi = {
  getProfile: async (): Promise<AuthUser> => {
    const res = await api.get("/users/profile");
    return res.data;
  },

  updateProfile: async (
    id: string,
    payload: UpdateProfilePayload,
  ): Promise<AuthUser> => {
    const res = await api.patch(`/users/${id}`, payload);
    return res.data;
  },

  uploadProfilePicture: async (
    base64File: string,
  ): Promise<{ id: string; image: string }> => {
    const res = await api.patch("/users/profile/picture", { file: base64File });
    return res.data;
  },

  getAll: async (): Promise<User[]> => (await api.get("/users")).data,
  getOne: async (id: string): Promise<User> =>
    (await api.get(`/users/${id}`)).data,
  deactivate: async (id: string) =>
    (await api.patch(`/users/${id}/deactivate`)).data,
  reactivate: async (id: string) =>
    (await api.patch(`/users/${id}/reactivate`)).data,
  updateRole: async (id: string, role: string) =>
    (await api.patch(`/users/${id}/role`, { role })).data,

  addPrivilege: async (id: string, privilege: string) =>
    (await api.patch(`/users/${id}/privileges/add`, { privilege })).data,
  removePrivilege: async (id: string, privilege: string) =>
    (await api.patch(`/users/${id}/privileges/remove`, { privilege })).data,
  getPrivilegeList: async (): Promise<{ group: string; items: string[] }[]> =>
    (await api.get("/users/meta/privileges")).data,
};
