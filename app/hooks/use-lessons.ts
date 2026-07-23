import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { lessonsApi, LessonPayload } from "@/app/lib/api/lessons.api";

export function useLessons(courseId: string) {
  return useQuery({
    queryKey: ["lessons", courseId],
    queryFn: () => lessonsApi.getByCourse(courseId),
    enabled: !!courseId,
  });
}

export function useCreateLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: LessonPayload) => lessonsApi.create(payload),
    onSuccess: (_d, v) =>
      qc.invalidateQueries({ queryKey: ["lessons", v.courseId] }),
  });
}

export function useUpdateLesson(courseId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<LessonPayload>;
    }) => lessonsApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lessons", courseId] }),
  });
}

export function useDeleteLesson(courseId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => lessonsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lessons", courseId] }),
  });
}
