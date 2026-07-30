import api from "../api";
import {
  StaffReport,
  RevenueReport,
  LeadReport,
} from "@/app/interfaces/report";

export interface DateRange {
  startDate: string;
  endDate: string;
}

export const reportsApi = {
  staff: async (staffId: string, range: DateRange): Promise<StaffReport> =>
    (await api.get(`/reports/staff/${staffId}`, { params: range })).data,

  revenue: async (range: DateRange): Promise<RevenueReport> =>
    (await api.get("/reports/revenue", { params: range })).data,

  leads: async (range: DateRange): Promise<LeadReport> =>
    (await api.get("/reports/leads", { params: range })).data,

  exportCsv: async (
    type: "staff" | "revenue" | "leads",
    range: DateRange,
    staffId?: string,
  ): Promise<void> => {
    const res = await api.get("/reports/export", {
      params: { type, ...range, ...(staffId ? { staffId } : {}) },
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(
      new Blob([res.data], { type: "text/csv" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `${type}-report-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
