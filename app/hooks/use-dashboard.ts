import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/app/lib/api/dashboard.api";
import { useAuthStore } from "@/app/stores/auth.store";
import {
  CeoDashboard,
  MarketingDashboard,
  OperationsDashboard,
  StaffDashboard,
} from "../interfaces/dashboard";

export const fallbackCeoDashboard: CeoDashboard = {
  revenue: { total: 4250000, thisMonth: 850000, lastMonth: 620000, growth: 37 },
  clients: { total: 24 },
  projects: {
    pending: 12,
    completed: 38,
    dueThisWeek: [
      {
        id: "1",
        title: "TechNova Website Redesign",
        dueDate: "2026-07-04T00:00:00Z",
        status: "IN_PROGRESS",
        client: { user: { firstName: "Michael", lastName: "Adeyemi" } },
      },
      {
        id: "2",
        title: "GreenLeaf Brand Identity",
        dueDate: "2026-07-06T00:00:00Z",
        status: "IN_REVIEW",
        client: { user: { firstName: "Chioma", lastName: "Okafor" } },
      },
      {
        id: "3",
        title: "Apex Realty Mobile App",
        dueDate: "2026-07-07T00:00:00Z",
        status: "IN_PROGRESS",
        client: { user: { firstName: "Kelvin", lastName: "Eze" } },
      },
    ],
  },
  staff: { total: 15 },
  invoices: { outstanding: 1200000, overdueCount: 3 },
  sales: { totalLeads: 142, closedWon: 38, conversionRate: 27 },
  lms: { activeEnrollments: 156 },
};

export const fallbackOperations: OperationsDashboard = {
  departments: [
    {
      id: "1",
      name: "Web Development",
      staffCount: 5,
      projectCount: 18,
      completedProjects: 12,
      activeProjects: 4,
    },
    {
      id: "2",
      name: "Design",
      staffCount: 3,
      projectCount: 11,
      completedProjects: 8,
      activeProjects: 2,
    },
    {
      id: "3",
      name: "Marketing",
      staffCount: 4,
      projectCount: 9,
      completedProjects: 6,
      activeProjects: 3,
    },
  ],
  delayedProjects: [
    {
      id: "1",
      title: "PrimeBank Portal",
      dueDate: "2026-06-20T00:00:00Z",
      status: "IN_PROGRESS",
      client: { user: { firstName: "Aisha", lastName: "Mohammed" } },
      department: { id: "1", name: "Web Development" },
    },
    {
      id: "2",
      title: "UrbanWear Store",
      dueDate: "2026-06-25T00:00:00Z",
      status: "IN_REVIEW",
      client: { user: { firstName: "David", lastName: "Okon" } },
      department: { id: "2", name: "Design" },
    },
  ],
  tasks: {
    stats: [
      { status: "PENDING", _count: { id: 14 } },
      { status: "IN_PROGRESS", _count: { id: 9 } },
      { status: "IN_REVIEW", _count: { id: 5 } },
      { status: "COMPLETED", _count: { id: 42 } },
      { status: "OVERDUE", _count: { id: 3 } },
    ],
    completedThisWeek: 18,
  },
  staffPerformance: [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      department: { id: "1", name: "Web Development" },
      _count: { assignedTasks: 12 },
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      department: { id: "2", name: "Design" },
      _count: { assignedTasks: 9 },
    },
    {
      id: "3",
      firstName: "Mike",
      lastName: "Johnson",
      department: { id: "3", name: "Marketing" },
      _count: { assignedTasks: 7 },
    },
  ],
};

export const fallbackMarketing: MarketingDashboard = {
  pipeline: [
    { stage: "NEW_LEAD", count: 24, totalValue: 4800000 },
    { stage: "CONTACTED", count: 18, totalValue: 3600000 },
    { stage: "PROPOSAL_SENT", count: 12, totalValue: 2400000 },
    { stage: "NEGOTIATION", count: 8, totalValue: 1600000 },
    { stage: "CLOSED_WON", count: 15, totalValue: 3000000 },
    { stage: "CLOSED_LOST", count: 6, totalValue: 0 },
  ],
  leads: {
    newThisWeek: 9,
    closedWonThisMonth: 5,
    closedLostThisMonth: 2,
    conversionRate: 71,
  },
  followUpsDueToday: [
    {
      id: "1",
      message: "Call to discuss proposal",
      scheduledAt: "2026-06-30T14:00:00Z",
      lead: {
        id: "1",
        firstName: "Samuel",
        lastName: "Bello",
        company: "BrightMedia",
      },
    },
    {
      id: "2",
      message: "Send updated quote",
      scheduledAt: "2026-06-30T16:00:00Z",
      lead: {
        id: "2",
        firstName: "Grace",
        lastName: "Eze",
        company: "SwiftLogistics",
      },
    },
  ],
  recentActivities: [
    {
      id: "1",
      type: "call",
      description: "Discussed project scope",
      createdAt: "2026-06-30T10:00:00Z",
      lead: { id: "1", firstName: "Samuel", lastName: "Bello" },
    },
    {
      id: "2",
      type: "email",
      description: "Sent proposal document",
      createdAt: "2026-06-30T09:00:00Z",
      lead: { id: "2", firstName: "Grace", lastName: "Eze" },
    },
  ],
  proposals: [
    { isAccepted: true, _count: { id: 15 } },
    { isAccepted: false, _count: { id: 23 } },
  ],
};

export const fallbackStaff: StaffDashboard = {
  tasks: {
    dueToday: [
      {
        id: "1",
        title: "Finalize homepage design",
        status: "IN_PROGRESS",
        priority: "HIGH",
        deadline: "2026-06-30T17:00:00Z",
        project: { id: "1", title: "TechNova Website" },
      },
      {
        id: "2",
        title: "Review API integration",
        status: "PENDING",
        priority: "MEDIUM",
        deadline: "2026-06-30T18:00:00Z",
        project: { id: "2", title: "PrimeBank Portal" },
      },
    ],
    overdueCount: 2,
    completedThisWeek: 8,
    pending: [
      {
        id: "1",
        title: "Finalize homepage design",
        status: "IN_PROGRESS",
        priority: "HIGH",
        deadline: "2026-06-30T17:00:00Z",
        project: { id: "1", title: "TechNova Website" },
      },
      {
        id: "2",
        title: "Review API integration",
        status: "PENDING",
        priority: "MEDIUM",
        deadline: "2026-07-01T18:00:00Z",
        project: { id: "2", title: "PrimeBank Portal" },
      },
      {
        id: "3",
        title: "Write documentation",
        status: "IN_REVIEW",
        priority: "LOW",
        deadline: "2026-07-03T12:00:00Z",
        project: { id: "1", title: "TechNova Website" },
      },
    ],
  },
  projects: [
    {
      id: "1",
      title: "TechNova Website",
      status: "IN_PROGRESS",
      dueDate: "2026-07-04T00:00:00Z",
      client: { user: { firstName: "Michael", lastName: "Adeyemi" } },
    },
    {
      id: "2",
      title: "PrimeBank Portal",
      status: "IN_REVIEW",
      dueDate: "2026-07-10T00:00:00Z",
      client: { user: { firstName: "Aisha", lastName: "Mohammed" } },
    },
  ],
};

export function useCeoDashboard(params?: { month?: number; year?: number }) {
  const role = useAuthStore((s) => s.user?.role);
  return useQuery({
    queryKey: ["dashboard", "ceo", params?.month, params?.year],
    queryFn: () => dashboardApi.ceo(params),
    enabled: role === "CEO",
    retry: false,
  });
}
export function useStaffDashboard() {
  const role = useAuthStore((s) => s.user?.role);
  return useQuery({
    queryKey: ["dashboard", "staff"],
    queryFn: dashboardApi.staff,
    enabled: !!role && role !== "CLIENT", // all staff have a staff dashboard
  });
}

export function useOperationsDashboard() {
  const role = useAuthStore((s) => s.user?.role);
  return useQuery({
    queryKey: ["dashboard", "operations"],
    queryFn: dashboardApi.operations,
    enabled: role === "CEO" || role === "HEAD_OF_OPERATIONS",
  });
}

export function useMarketingDashboard() {
  const role = useAuthStore((s) => s.user?.role);
  return useQuery({
    queryKey: ["dashboard", "marketing"],
    queryFn: dashboardApi.marketing,
    enabled:
      role === "CEO" ||
      role === "HEAD_OF_OPERATIONS" ||
      role === "DEPARTMENT_HEAD",
  });
}
