import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  deadline: string;
  project?: { id: string; title: string } | null;
}

export function useUserTasks(userId: string) {
  return useQuery({
    queryKey: ["tasks", "by-user", userId],
    queryFn: async (): Promise<Task[]> => {
      const res = await api.get("/tasks", { params: { assignedToId: userId } });
      return res.data;
    },
    enabled: !!userId,
  });
}
export function useMyTasks() {
  return useQuery({
    queryKey: ["tasks", "mine"],
    queryFn: async (): Promise<Task[]> => {
      const res = await api.get("/tasks/my-tasks");
      return res.data;
    },
  });
}
