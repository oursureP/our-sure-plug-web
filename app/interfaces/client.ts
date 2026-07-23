export interface Client {
  id: string;
  company?: string | null;
  address?: string | null;
  notes?: string | null;
  userId: string;
  leadId?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    image?: string | null;
    address?: string | null;
    country?: string | null;
    state?: string | null;
  };
  projects?: ClientProject[];
  invoices?: ClientInvoice[];
  messages?: ClientMessage[];
  files?: ClientFile[];
  _count?: {
    projects?: number;
    invoices?: number;
    files?: number;
    messages?: number;
  };
}

export interface ClientProject {
  id: string;
  title: string;
  status: string;
  startDate?: string | null;
  dueDate?: string | null;
}
export interface ClientInvoice {
  id: string;
  invoiceNo: string;
  status: string;
  total: string;
  dueDate?: string | null;
}
export interface ClientMessage {
  id: string;
  content: string;
  senderId: string;
  senderRole: string;
  isRead: boolean;
  createdAt: string;
  clientId: string;
}
export interface ClientFile {
  id: string;
  name: string;
  url: string;
  type: string;
  createdAt: string;
  clientId: string;
}
