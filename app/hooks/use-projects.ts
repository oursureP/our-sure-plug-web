import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi, ProjectPayload } from "@/app/lib/api/projects.api";

export function useProjects(params?: {
  status?: string;
  departmentId?: string;
  clientId?: string;
}) {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: () => projectsApi.getAll(params),
  });
}
export function useProject(id: string) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => projectsApi.getOne(id),
    enabled: !!id,
  });
}
export function useProjectStats() {
  return useQuery({ queryKey: ["project-stats"], queryFn: projectsApi.stats });
}
export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProjectPayload) => projectsApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["project-stats"] });
    },
  });
}
export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<ProjectPayload> & { status?: string };
    }) => projectsApi.update(id, payload),
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["project", v.id] });
      qc.invalidateQueries({ queryKey: ["project-stats"] });
    },
  });
}
export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["project-stats"] });
    },
  });
}
// sub-actions (used on the hub)
export function useAddMember(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      projectsApi.addMember(projectId, userId, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["project", projectId] }),
  });
}
export function useRemoveMember(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => projectsApi.removeMember(projectId, userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["project", projectId] }),
  });
}
export function useAddMilestone(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ title, dueDate }: { title: string; dueDate: string }) =>
      projectsApi.addMilestone(projectId, title, dueDate),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["project", projectId] }),
  });
}
export function useCompleteMilestone(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (milestoneId: string) =>
      projectsApi.completeMilestone(milestoneId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["project", projectId] }),
  });
}
export function useUploadProjectFile(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      base64: string;
      name: string;
      isDesign?: boolean;
    }) => projectsApi.uploadFile(projectId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["project", projectId] }),
  });
}
export function useApproveFile(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      fileId,
      isApproved,
      feedback,
    }: {
      fileId: string;
      isApproved: boolean;
      feedback?: string;
    }) => projectsApi.approveFile(fileId, isApproved, feedback),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["project", projectId] }),
  });
}
export function useDeleteProjectFile(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (fileId: string) => projectsApi.deleteFile(projectId, fileId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["project", projectId] }),
  });
}
