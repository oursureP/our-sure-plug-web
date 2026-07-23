import api from "../api";
import { Lead, PipelineSummary } from "@/app/interfaces/lead";

export interface LeadPayload {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  source?: string;
  estimatedValue?: number;
  notes?: string;
  assignedToId?: string;
}

export const leadsApi = {
  getAll: async (params?: {
    stage?: string;
    assignedToId?: string;
  }): Promise<Lead[]> => (await api.get("/leads", { params })).data,
  getOne: async (id: string): Promise<Lead> =>
    (await api.get(`/leads/${id}`)).data,
  pipelineSummary: async (): Promise<PipelineSummary[]> =>
    (await api.get("/leads/pipeline-summary")).data,
  create: async (payload: LeadPayload): Promise<Lead> =>
    (await api.post("/leads", payload)).data,
  update: async (id: string, payload: Partial<LeadPayload>): Promise<Lead> =>
    (await api.patch(`/leads/${id}`, payload)).data,
  updateStage: async (id: string, stage: string, lostReason?: string) =>
    (
      await api.patch(`/leads/${id}/stage`, {
        stage,
        ...(lostReason ? { lostReason } : {}),
      })
    ).data,
  addActivity: async (leadId: string, type: string, description: string) =>
    (await api.post(`/leads/${leadId}/add-activities`, { type, description }))
      .data,
  addFollowUp: async (leadId: string, message: string, scheduledAt: string) =>
    (await api.post(`/leads/${leadId}/follow-ups`, { message, scheduledAt }))
      .data,
  markFollowUpDone: async (leadId: string, followUpId: string) =>
    (await api.patch(`/leads/${leadId}/follow-ups/${followUpId}/done`)).data,
  createProposal: async (
    leadId: string,
    payload: {
      title: string;
      content: string;
      amount: number;
      expiresAt?: string;
    },
  ) => (await api.post(`/leads/${leadId}/proposals`, payload)).data,
  addContactPerson: async (
    leadId: string,
    payload: {
      firstName: string;
      lastName: string;
      email?: string;
      phone?: string;
      position?: string;
    },
  ) => (await api.post(`/leads/${leadId}/contact-person`, payload)).data,
  convertToClient: async (leadId: string) =>
    (await api.patch(`/leads/${leadId}/convert`)).data,
};
