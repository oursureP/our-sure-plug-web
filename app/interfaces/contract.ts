export type ContractStatus = "ACTIVE" | "EXPIRED" | "CANCELLED";

export interface ContractInvoice {
  id: string;
  invoiceNo: string;
  status: string;
  total: string;
  dueDate: string;
  createdAt: string;
}

export interface MaintenanceContract {
  id: string;
  title: string;
  description?: string | null;
  amount: string;
  billingDay: number;
  status: ContractStatus;
  startDate: string;
  endDate?: string | null;
  lastBilledAt?: string | null;
  createdAt: string;
  updatedAt: string;
  clientId: string;
  projectId?: string | null;
  client?: {
    id: string;
    company?: string | null;
    user?: { id: string; firstName: string; lastName: string; email: string };
  };
  project?: { id: string; title: string } | null;
  invoices?: ContractInvoice[];
  _count?: { invoices?: number };
}
