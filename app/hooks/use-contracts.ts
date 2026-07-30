import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contractsApi, ContractPayload } from "@/app/lib/api/contracts.api";

export function useContracts(clientId?: string) {
  return useQuery({
    queryKey: ["contracts", clientId ?? "all"],
    queryFn: () => contractsApi.getAll(clientId),
  });
}

export function useContract(id: string) {
  return useQuery({
    queryKey: ["contract", id],
    queryFn: () => contractsApi.getOne(id),
    enabled: !!id,
  });
}

export function useCreateContract() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ContractPayload) => contractsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contracts"] }),
  });
}

export function useCancelContract() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contractsApi.cancel(id),
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: ["contracts"] });
      qc.invalidateQueries({ queryKey: ["contract", id] });
    },
  });
}

export function useGenerateContractInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contractsApi.generateInvoice(id),
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: ["contract", id] });
      qc.invalidateQueries({ queryKey: ["contracts"] });
      qc.invalidateQueries({ queryKey: ["invoices"] });
      qc.invalidateQueries({ queryKey: ["invoice-revenue"] });
    },
  });
}
