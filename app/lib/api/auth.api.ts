import { AuthUser } from "@/app/stores/auth.store";
import api from "../api";

// export interface LoginPayload {
//   email: string;
//   password: string;
// }
interface LoginResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    image?: string;
  };
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  state: string;
  gender: "Male" | "Female";
  address: string;
  password: string;
  phone: string;
  departmentId?: string;
}
export const authApi = {
  register: async (payload: RegisterPayload): Promise<{ message: string }> => {
    const res = await api.post("/auth/register", payload);
    return res.data;
  },
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data;
  },

  resetPassword: async (
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> => {
    const res = await api.patch("/auth/reset-password", { token, newPassword });
    return res.data;
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const res = await api.get(`/auth/verify-email?token=${token}`);
    return res.data;
  },
  // register: async (payload: RegisterPayload) => {
  //   const response = await api.post("/auth/signup", payload);
  //   return response.data;
  // },

  // verifyEmail: async (token: string) => {
  //   const response = await api.get(`/auth/verify-email?token=${token}`);
  //   return response.data;
  // },

  // forgotPassword: async (email: string) => {
  //   const response = await api.post("/auth/forgot-password", { email });
  //   return response.data;
  // },

  // resetPassword: async (payload: {
  //   token: string;
  //   newPassword: string;
  //   confirmPassword: string;
  // }) => {
  //   const response = await api.patch("/auth/reset-password", payload);
  //   return response.data;
  // },

  changePassword: async (payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const response = await api.patch("/auth/change-password", payload);
    return response.data;
  },
};
