import { BlogPost } from "@/app/interfaces/blog.interface";
import api from "../api";

export const blogApi = {
  getAll: async (): Promise<BlogPost[]> => {
    const res = await api.get("/blog");
    return res.data;
  },

  getBySlug: async (slug: string): Promise<BlogPost> => {
    const res = await api.get(`/blog/slug/${slug}`);
    return res.data;
  },
};
