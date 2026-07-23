import axios from "axios";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "./auth-cookies";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token (from cookie) to every request as Bearer header
api.interceptors.request.use((config) => {
  const token = Cookies.get(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Routes that are protected — only these force a login redirect on 401
const PROTECTED_PREFIXES = ["/dashboard", "/portal", "/client", "/admin"];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const path = window.location.pathname;
      const isOnProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
        path.startsWith(prefix),
      );
      const hadToken = !!Cookies.get("token");

      if (isOnProtectedRoute && hadToken) {
        Cookies.remove("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
