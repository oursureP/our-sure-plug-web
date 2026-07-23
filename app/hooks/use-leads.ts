import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leadsApi, LeadPayload } from "@/app/lib/api/leads.api";

export function useLeads(params?: { stage?: string; assignedToId?: string }) {
  return useQuery({
    queryKey: ["leads", params],
    queryFn: () => leadsApi.getAll(params),
  });
}
export function useLead(id: string) {
  return useQuery({
    queryKey: ["lead", id],
    queryFn: () => leadsApi.getOne(id),
    enabled: !!id,
  });
}
export function usePipelineSummary() {
  return useQuery({
    queryKey: ["leads", "pipeline"],
    queryFn: leadsApi.pipelineSummary,
  });
}

export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: LeadPayload) => leadsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leads"] }),
  });
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<LeadPayload>;
    }) => leadsApi.update(id, payload),
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["lead", v.id] });
    },
  });
}

export function useUpdateLeadStage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      stage,
      lostReason,
    }: {
      id: string;
      stage: string;
      lostReason?: string;
    }) => leadsApi.updateStage(id, stage, lostReason),
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["lead", v.id] });
    },
  });
}
export function useConvertLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (leadId: string) => leadsApi.convertToClient(leadId),
    onSuccess: (_d, leadId) => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["lead", leadId] });
    },
  });
}
export function useAddActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      leadId,
      type,
      description,
    }: {
      leadId: string;
      type: string;
      description: string;
    }) => leadsApi.addActivity(leadId, type, description),
    onSuccess: (_d, v) =>
      qc.invalidateQueries({ queryKey: ["lead", v.leadId] }),
  });
}
export function useAddFollowUp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      leadId,
      message,
      scheduledAt,
    }: {
      leadId: string;
      message: string;
      scheduledAt: string;
    }) => leadsApi.addFollowUp(leadId, message, scheduledAt),
    onSuccess: (_d, v) =>
      qc.invalidateQueries({ queryKey: ["lead", v.leadId] }),
  });
}
export function useMarkFollowUpDone(leadId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (followUpId: string) =>
      leadsApi.markFollowUpDone(leadId, followUpId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lead", leadId] }),
  });
}
export function useCreateProposal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      leadId,
      payload,
    }: {
      leadId: string;
      payload: {
        title: string;
        content: string;
        amount: number;
        expiresAt?: string;
      };
    }) => leadsApi.createProposal(leadId, payload),
    onSuccess: (_d, v) =>
      qc.invalidateQueries({ queryKey: ["lead", v.leadId] }),
  });
}
export function useAddContactPerson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      leadId,
      payload,
    }: {
      leadId: string;
      payload: {
        firstName: string;
        lastName: string;
        email?: string;
        phone?: string;
        position?: string;
      };
    }) => leadsApi.addContactPerson(leadId, payload),
    onSuccess: (_d, v) =>
      qc.invalidateQueries({ queryKey: ["lead", v.leadId] }),
  });
}
