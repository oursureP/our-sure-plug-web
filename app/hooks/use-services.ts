import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesApi, ServicePayload } from "../lib/api/services.api";

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: servicesApi.getAll,
    staleTime: 1000 * 60 * 10,
  });
}

export function useService(id: string) {
  return useQuery({
    queryKey: ["services", id],
    queryFn: () => servicesApi.getOne(id),
    enabled: !!id,
  });
}

export function useServicesAdmin() {
  return useQuery({ queryKey: ["services"], queryFn: servicesApi.getAll });
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ServicePayload) => servicesApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ServicePayload }) =>
      servicesApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => servicesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
}

export function useToggleService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => servicesApi.toggleActive(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
}
