import { useQuery, useMutation } from "@tanstack/react-query";
import { reportsApi, DateRange } from "@/app/lib/api/reports.api";

export function useRevenueReport(range: DateRange, enabled = true) {
  return useQuery({
    queryKey: ["report-revenue", range],
    queryFn: () => reportsApi.revenue(range),
    enabled: enabled && !!range.startDate && !!range.endDate,
  });
}

export function useLeadReport(range: DateRange, enabled = true) {
  return useQuery({
    queryKey: ["report-leads", range],
    queryFn: () => reportsApi.leads(range),
    enabled: enabled && !!range.startDate && !!range.endDate,
  });
}

// Mutation, not a query — each call writes a StaffReport row,
// so it only runs when the user explicitly asks for it.
export function useGenerateStaffReport() {
  return useMutation({
    mutationFn: ({ staffId, range }: { staffId: string; range: DateRange }) =>
      reportsApi.staff(staffId, range),
  });
}

export function useExportReport() {
  return useMutation({
    mutationFn: ({
      type,
      range,
      staffId,
    }: {
      type: "staff" | "revenue" | "leads";
      range: DateRange;
      staffId?: string;
    }) => reportsApi.exportCsv(type, range, staffId),
  });
}
