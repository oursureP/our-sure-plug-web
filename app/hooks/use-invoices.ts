import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invoicesApi, InvoicePayload } from "@/app/lib/api/invoices.api";

export function useInvoices(params?: { status?: string; clientId?: string }) {
  return useQuery({
    queryKey: ["invoices", params],
    queryFn: () => invoicesApi.getAll(params),
  });
}
export function useInvoice(id: string) {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: () => invoicesApi.getOne(id),
    enabled: !!id,
  });
}
export function useRevenueStats() {
  return useQuery({
    queryKey: ["invoice-revenue"],
    queryFn: invoicesApi.revenueStats,
  });
}
export function useCreateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: InvoicePayload) => invoicesApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
      qc.invalidateQueries({ queryKey: ["invoice-revenue"] });
    },
  });
}
export function useUpdateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { status?: string; dueDate?: string; notes?: string };
    }) => invoicesApi.update(id, payload),
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
      qc.invalidateQueries({ queryKey: ["invoice", v.id] });
      qc.invalidateQueries({ queryKey: ["invoice-revenue"] });
    },
  });
}
export function useSendInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => invoicesApi.send(id),
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
      qc.invalidateQueries({ queryKey: ["invoice", id] });
    },
  });
}
export function useVerifyProof() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      invoicesApi.verifyProof(id, notes),
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["invoice", v.id] });
      qc.invalidateQueries({ queryKey: ["invoices"] });
      qc.invalidateQueries({ queryKey: ["invoice-revenue"] });
    },
  });
}
