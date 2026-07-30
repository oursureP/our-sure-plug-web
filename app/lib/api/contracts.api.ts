import api from "../api";
import { MaintenanceContract } from "@/app/interfaces/contract";

export interface ContractPayload {
  title: string;
  description?: string;
  amount: number;
  billingDay: number;
  startDate: string;
  endDate?: string;
  clientId: string;
  projectId?: string;
}

export const contractsApi = {
  getAll: async (clientId?: string): Promise<MaintenanceContract[]> =>
    (
      await api.get("/invoices/contracts", {
        params: clientId ? { clientId } : {},
      })
    ).data,
  getOne: async (id: string): Promise<MaintenanceContract> =>
    (await api.get(`/invoices/contracts/${id}`)).data,
  create: async (payload: ContractPayload): Promise<MaintenanceContract> =>
    (await api.post("/invoices/contracts", payload)).data,
  cancel: async (id: string) =>
    (await api.patch(`/invoices/contracts/${id}/cancel`)).data,
  generateInvoice: async (id: string) =>
    (await api.post(`/invoices/contracts/${id}/generate-invoice`)).data,
};
