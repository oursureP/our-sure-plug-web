import { useQuery } from "@tanstack/react-query";
import { blogApi } from "../lib/api/blog.api";

export function useBlogPosts() {
  return useQuery({
    queryKey: ["blog"],
    queryFn: blogApi.getAll,
    staleTime: 1000 * 60 * 5,
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ["blog", slug],
    queryFn: () => blogApi.getBySlug(slug),
    enabled: !!slug,
  });
}
