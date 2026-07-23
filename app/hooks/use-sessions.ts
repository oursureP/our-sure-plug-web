// hooks/use-sessions.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionsApi, SessionPayload } from "@/app/lib/api/sessions.api";

export function useSessions(courseId?: string) {
  return useQuery({
    queryKey: ["sessions", courseId ?? "all"],
    queryFn: () => sessionsApi.getAll(courseId),
  });
}

export function useCreateSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SessionPayload) => sessionsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sessions"] }),
  });
}

export function useUpdateSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<SessionPayload>;
    }) => sessionsApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sessions"] }),
  });
}

export function useToggleSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, activate }: { id: string; activate: boolean }) =>
      activate ? sessionsApi.activate(id) : sessionsApi.deactivate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sessions"] }),
  });
}

export function useDeleteSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sessionsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sessions"] }),
  });
}
