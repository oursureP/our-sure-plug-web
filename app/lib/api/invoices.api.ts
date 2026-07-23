import api from "../api";
import { Invoice, RevenueStats } from "@/app/interfaces/invoice";

export interface InvoiceItemPayload {
  description: string;
  quantity: number;
  unitPrice: number;
}
export interface InvoicePayload {
  clientId: string;
  projectId?: string;
  dueDate: string;
  tax?: number;
  notes?: string;
  serviceType: string;
  paymentMethod: "ONLINE" | "BANK_TRANSFER";
  items: InvoiceItemPayload[];
}

export const invoicesApi = {
  getAll: async (params?: {
    status?: string;
    clientId?: string;
  }): Promise<Invoice[]> => (await api.get("/invoices", { params })).data,
  getOne: async (id: string): Promise<Invoice> =>
    (await api.get(`/invoices/${id}`)).data,
  getOverdue: async (): Promise<Invoice[]> =>
    (await api.get("/invoices/overdue-invoices")).data,
  revenueStats: async (): Promise<RevenueStats> =>
    (await api.get("/invoices/invoice-revenue-stats")).data,
  create: async (payload: InvoicePayload): Promise<Invoice> =>
    (await api.post("/invoices", payload)).data,
  update: async (
    id: string,
    payload: { status?: string; dueDate?: string; notes?: string },
  ): Promise<Invoice> => (await api.patch(`/invoices/${id}`, payload)).data,
  send: async (id: string) =>
    (await api.patch(`/invoices/${id}/send-invoice`)).data,
  verifyProof: async (id: string, notes?: string) =>
    (await api.patch(`/invoices/${id}/proof-of-payment/verify`, { notes }))
      .data,
};
