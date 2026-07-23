import { LeadStage, ProjectStatus, TaskStatus } from "./enums";

// Shared
export interface DueProject {
  id: string;
  title: string;
  dueDate: string;
  status: ProjectStatus;
  client?: { user?: { firstName: string; lastName: string } };
}

// CEO
export interface CeoDashboard {
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  clients: { total: number };
  projects: { pending: number; completed: number; dueThisWeek: DueProject[] };
  staff: { total: number };
  invoices: { outstanding: number; overdueCount: number };
  sales: { totalLeads: number; closedWon: number; conversionRate: number };
  lms: { activeEnrollments: number };
}

// Operations
export interface DepartmentStat {
  id: string;
  name: string;
  staffCount: number;
  projectCount: number;
  completedProjects: number;
  activeProjects: number;
}
export interface OperationsDashboard {
  departments: DepartmentStat[];
  delayedProjects: Array<{
    id: string;
    title: string;
    dueDate: string;
    status: ProjectStatus;
    client?: { user?: { firstName: string; lastName: string } };
    department?: { id: string; name: string } | null;
  }>;
  tasks: {
    stats: Array<{ status: TaskStatus; _count: { id: number } }>;
    completedThisWeek: number;
  };
  staffPerformance: Array<{
    id: string;
    firstName: string;
    lastName: string;
    department?: { id: string; name: string } | null;
    _count: { assignedTasks: number };
  }>;
}

// Marketing
export interface MarketingDashboard {
  pipeline: Array<{ stage: LeadStage; count: number; totalValue: number }>;
  leads: {
    newThisWeek: number;
    closedWonThisMonth: number;
    closedLostThisMonth: number;
    conversionRate: number;
  };
  followUpsDueToday: Array<{
    id: string;
    message: string;
    scheduledAt: string;
    lead: {
      id: string;
      firstName: string;
      lastName: string;
      company?: string | null;
    };
  }>;
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    createdAt: string;
    lead: { id: string; firstName: string; lastName: string };
  }>;
  proposals: Array<{ isAccepted: boolean; _count: { id: number } }>;
}

// Staff
export interface StaffTask {
  id: string;
  title: string;
  status: TaskStatus;
  priority: string;
  deadline: string;
  project?: { id: string; title: string };
}
export interface StaffDashboard {
  tasks: {
    dueToday: StaffTask[];
    overdueCount: number;
    completedThisWeek: number;
    pending: StaffTask[];
  };
  projects: Array<{
    id: string;
    title: string;
    status: ProjectStatus;
    dueDate?: string | null;
    client?: { user?: { firstName: string; lastName: string } };
  }>;
}
