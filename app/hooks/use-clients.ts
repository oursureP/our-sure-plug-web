import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientsApi, ClientUpdatePayload } from "@/app/lib/api/clients.api";

export function useClients() {
  return useQuery({ queryKey: ["clients"], queryFn: clientsApi.getAll });
}
export function useClient(id: string) {
  return useQuery({
    queryKey: ["client", id],
    queryFn: () => clientsApi.getOne(id),
    enabled: !!id,
  });
}
export function useUpdateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ClientUpdatePayload;
    }) => clientsApi.update(id, payload),
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      qc.invalidateQueries({ queryKey: ["client", v.id] });
    },
  });
}
// Messages
export function useClientMessages(id: string) {
  return useQuery({
    queryKey: ["client-messages", id],
    queryFn: () => clientsApi.getMessages(id),
    enabled: !!id,
    refetchInterval: 30000, // light polling so new client-portal messages appear
  });
}
export function useSendMessage(clientId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => clientsApi.sendMessage(clientId, content),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["client-messages", clientId] }),
  });
}
export function useDeleteMessage(clientId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (messageId: string) => clientsApi.deleteMessage(messageId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["client-messages", clientId] }),
  });
}
// Files
export function useUploadClientFile(clientId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { base64: string; name: string; type: string }) =>
      clientsApi.uploadFile(clientId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["client", clientId] }),
  });
}
export function useDeleteClientFile(clientId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (fileId: string) => clientsApi.deleteFile(fileId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["client", clientId] }),
  });
}
