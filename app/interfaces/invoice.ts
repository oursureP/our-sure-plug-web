export type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";
export type PaymentMethod = "ONLINE" | "BANK_TRANSFER";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: string;
  total: string;
  invoiceId: string;
}
export interface InvoiceClientUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}
export interface Invoice {
  id: string;
  invoiceNo: string;
  clientId: string;
  projectId?: string | null;
  contractId?: string | null;
  status: InvoiceStatus;
  invoiceType?: string;
  paymentMethod?: PaymentMethod;
  serviceType?: string | null;
  subtotal: string;
  tax: string;
  total: string;
  notes?: string | null;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  items?: InvoiceItem[];
  client?: { id: string; company?: string | null; user?: InvoiceClientUser };
  project?: { id: string; title: string; status: string } | null;
  payment?: {
    id: string;
    status: string;
    amount: string;
    paidAt?: string | null;
    channel?: string;
  } | null;
  _count?: { items?: number };
  proofOfPayment?: ProofOfPayment | null;
}
export interface RevenueStats {
  totalRevenue: string | number;
  outstanding: string | number;
  paidInvoicesCount: number;
  overdueInvoicesCount: number;
}
export interface ProofOfPayment {
  id: string;
  fileUrl: string;
  isVerified: boolean;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
  notes?: string | null;
  createdAt: string;
  invoiceId: string;
}
