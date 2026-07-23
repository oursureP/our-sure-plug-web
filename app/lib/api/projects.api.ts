import api from "../api";
import { Project, ProjectStats } from "@/app/interfaces/project";

export interface ProjectPayload {
  title: string;
  description: string;
  departmentId: string;
  clientId: string;
  startDate: string;
  dueDate: string;
  budget: string;
}

export const projectsApi = {
  getAll: async (params?: {
    status?: string;
    departmentId?: string;
    clientId?: string;
  }): Promise<Project[]> => (await api.get("/projects", { params })).data,
  getOne: async (id: string): Promise<Project> =>
    (await api.get(`/projects/${id}`)).data,
  stats: async (): Promise<ProjectStats> =>
    (await api.get("/projects/project-stats")).data,
  create: async (payload: ProjectPayload): Promise<Project> =>
    (await api.post("/projects", payload)).data,
  update: async (
    id: string,
    payload: Partial<ProjectPayload> & { status?: string },
  ): Promise<Project> => (await api.patch(`/projects/${id}`, payload)).data,
  remove: async (id: string) => {
    await api.delete(`/projects/${id}`);
  },
  // members
  addMember: async (id: string, userId: string, role: string) =>
    (await api.post(`/projects/${id}/add-member`, { userId, role })).data,
  removeMember: async (id: string, userId: string) =>
    (await api.delete(`/projects/${id}/members/${userId}/remove`)).data,
  // milestones
  addMilestone: async (id: string, title: string, dueDate: string) =>
    (await api.post(`/projects/${id}/milestones`, { title, dueDate })).data,
  completeMilestone: async (milestoneId: string) =>
    (await api.patch(`/projects/milestones/${milestoneId}/complete`)).data,
  // files
  uploadFile: async (
    id: string,
    payload: { base64: string; name: string; isDesign?: boolean },
  ) => (await api.post(`/projects/${id}/upload-project-files`, payload)).data,
  approveFile: async (fileId: string, isApproved: boolean, feedback?: string) =>
    (
      await api.patch(`/projects/files/${fileId}/approve`, null, {
        params: { isApproved, ...(feedback ? { feedback } : {}) },
      })
    ).data,
  deleteFile: async (projectId: string, fileId: string) =>
    (await api.delete(`/projects/${projectId}/files/${fileId}`)).data,
};
