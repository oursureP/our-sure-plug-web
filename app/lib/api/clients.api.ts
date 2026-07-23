import api from "../api";
import { Client, ClientMessage, ClientFile } from "@/app/interfaces/client";

export interface ClientUpdatePayload {
  company?: string;
  address?: string;
  notes?: string;
}

export const clientsApi = {
  getAll: async (): Promise<Client[]> => (await api.get("/clients")).data,
  getOne: async (id: string): Promise<Client> =>
    (await api.get(`/clients/${id}`)).data,
  update: async (id: string, payload: ClientUpdatePayload): Promise<Client> =>
    (await api.patch(`/clients/${id}`, payload)).data,
  // messages
  getMessages: async (id: string): Promise<ClientMessage[]> =>
    (await api.get(`/clients/${id}/client-messages`)).data,
  sendMessage: async (id: string, content: string): Promise<ClientMessage> =>
    (await api.post(`/clients/${id}/message-client`, { content })).data,
  deleteMessage: async (messageId: string) =>
    (await api.delete(`/clients/message/${messageId}`)).data,
  markMessageRead: async (messageId: string) =>
    (await api.patch(`/clients/messages/${messageId}/read`)).data,
  // files
  uploadFile: async (
    id: string,
    payload: { base64: string; name: string; type: string },
  ): Promise<ClientFile> =>
    (await api.post(`/clients/${id}/upload-client-files`, payload)).data,
  deleteFile: async (fileId: string) =>
    (await api.delete(`/clients/files/${fileId}`)).data,
};
