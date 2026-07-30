export interface StaffReport {
  id: string;
  periodStart: string;
  periodEnd: string;
  tasksAssigned: number;
  tasksCompleted: number;
  tasksOverdue: number;
  avgCompletionDays?: number | null;
  productivityScore?: number | null;
  generatedAt: string;
  staffId: string;
  staff?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    departments?: { id: string; name: string }[];
  };
}

export interface RevenueReport {
  totalRevenue: number;
  byMonth: Record<string, number>;
  byClient: { clientId: string; total: number; invoiceCount: number }[];
  byProject: { projectId: string | null; total: number }[];
}

export interface LeadReport {
  totalLeads: number;
  byStage: { stage: string; count: number; totalValue: number }[];
  closedWon: {
    count: number;
    avgDaysToClose: number;
    leads: {
      id: string;
      firstName: string;
      lastName: string;
      estimatedValue?: string | null;
      createdAt: string;
      closedAt: string;
    }[];
  };
  closedLost: {
    count: number;
    reasons: { lostReason: string | null; _count: { id: number } }[];
  };
  conversionRate: number;
  recentLeads: {
    id: string;
    firstName: string;
    lastName: string;
    stage: string;
    estimatedValue?: string | null;
    createdAt: string;
    assignedTo?: { firstName: string; lastName: string } | null;
  }[];
}
