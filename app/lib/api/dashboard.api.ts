import api from "../api";
import {
  CeoDashboard,
  OperationsDashboard,
  MarketingDashboard,
  StaffDashboard,
} from "@/app/interfaces/dashboard";

export interface DashboardParams {
  month?: number;
  year?: number;
}

export const dashboardApi = {
  ceo: async (params?: DashboardParams): Promise<CeoDashboard> => {
    const res = await api.get("/dashboard/ceo", { params });
    return res.data;
  },
  operations: async (): Promise<OperationsDashboard> =>
    (await api.get("/dashboard/operations")).data,
  marketing: async (): Promise<MarketingDashboard> =>
    (await api.get("/dashboard/marketing")).data,
  staff: async (): Promise<StaffDashboard> =>
    (await api.get("/dashboard/staff")).data,
  department: async (id: string) =>
    (await api.get(`/dashboard/department/${id}`)).data,
};
