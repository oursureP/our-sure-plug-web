import Cookies from "js-cookie";

export const TOKEN_KEY = "__osp_token";

export const authCookies = {
  setToken(token: string) {
    Cookies.set(TOKEN_KEY, token, {
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  },
  getToken() {
    return Cookies.get(TOKEN_KEY);
  },
  clearToken() {
    Cookies.remove(TOKEN_KEY, { path: "/" });
  },
};
