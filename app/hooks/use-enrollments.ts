import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enrollmentsApi } from "@/app/lib/api/enrollments.api";

export function useEnrollments(params?: {
  courseId?: string;
  sessionId?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ["enrollments", params],
    queryFn: () => enrollmentsApi.getAll(params),
  });
}

export function useConfirmEnrollment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => enrollmentsApi.confirm(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["enrollments"] }),
  });
}

export function useCancelEnrollment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => enrollmentsApi.cancel(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["enrollments"] }),
  });
}
