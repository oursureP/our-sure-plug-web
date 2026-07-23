import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CoursePayload, coursesApi } from "../lib/api/courses.api";

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: coursesApi.getAll,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ["courses", id],
    queryFn: () => coursesApi.getOne(id),
    enabled: !!id,
  });
}

export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CoursePayload) => coursesApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["courses"] }),
  });
}

export function useUpdateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CoursePayload>;
    }) => coursesApi.update(id, payload),
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["courses"] });
      qc.invalidateQueries({ queryKey: ["course", v.id] });
    },
  });
}

export function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => coursesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["courses"] }),
  });
}

export function useToggleCoursePublish() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, publish }: { id: string; publish: boolean }) =>
      publish ? coursesApi.publish(id) : coursesApi.unpublish(id),
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["courses"] });
      qc.invalidateQueries({ queryKey: ["course", v.id] });
    },
  });
}

export function usePublishCourseWithNoSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => coursesApi.publishCourseWithNoSession(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["courses"] }),
  });
}
