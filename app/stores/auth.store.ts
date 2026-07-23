import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authCookies } from "@/app/lib/auth-cookies";
import { Role, GenderEnum } from "@/app/interfaces";

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  phone?: string | null;
  image?: string | null;
  bio?: string | null;
  address?: string | null;
  country?: string | null;
  state?: string | null;
  lga?: string | null;
  gender?: GenderEnum | null;
  isActive?: boolean;
  isEmailVerified?: boolean;
  departments?:
    | {
        id: string;
        name: string;
        description?: string | null;
      }[]
    | null;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  setUser: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        authCookies.setToken(token);
        set({ user, isAuthenticated: true });
      },
      setUser: (user) => set({ user }),
      logout: () => {
        authCookies.clearToken();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "osp-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
