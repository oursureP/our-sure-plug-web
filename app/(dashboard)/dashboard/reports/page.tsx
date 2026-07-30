"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Users,
  Download,
  Loader2,
  Wallet,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";
import {
  useRevenueReport,
  useLeadReport,
  useGenerateStaffReport,
  useExportReport,
} from "@/app/hooks/use-reports";
import { useClients } from "@/app/hooks/use-clients";
import { useProjects } from "@/app/hooks/use-projects";
import { useUsers } from "@/app/hooks/use-users";
import { useAuthStore } from "@/app/stores/auth.store";
import { StaffReport } from "@/app/interfaces/report";

function resolveMessage(m: unknown): string {
  if (Array.isArray(m)) return String(m[0] ?? "Something went wrong");
  if (typeof m === "string") return m;
  return "Something went wrong. Please try again.";
}
function naira(n: number | string) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(n));
}
function fmtDate(d?: string | null) {
  return d
    ? new Date(d).toLocaleDateString("en-NG", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";
}
function isoDay(d: Date) {
  return d.toISOString().slice(0, 10);
}

const STAGE_BADGE: Record<string, string> = {
  NEW_LEAD: "bg-slate-500/15 text-slate-600 dark:text-slate-400",
  CONTACTED: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  PROPOSAL_SENT: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  NEGOTIATION: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  CLOSED_WON: "bg-green-500/15 text-green-600 dark:text-green-400",
  CLOSED_LOST: "bg-red-500/15 text-red-600 dark:text-red-400",
};

type Tab = "revenue" | "leads" | "staff";
const card = "rounded-2xl border border-border bg-card p-6";

export default function ReportsPage() {
  const me = useAuthStore((s) => s.user);
  const canSeeRevenue = me?.role === "CEO" || me?.role === "HEAD_OF_OPERATIONS";

  const [tab, setTab] = useState<Tab>(canSeeRevenue ? "revenue" : "leads");

  // default range: start of this year → today
  const today = new Date();
  const [range, setRange] = useState({
    startDate: isoDay(new Date(today.getFullYear(), 0, 1)),
    endDate: isoDay(today),
  });

  const { data: revenue, isLoading: loadingRevenue } = useRevenueReport(
    range,
    tab === "revenue" && canSeeRevenue,
  );
  const { data: leads, isLoading: loadingLeads } = useLeadReport(
    range,
    tab === "leads",
  );
  const exportMut = useExportReport();

  const tabs: {
    key: Tab;
    label: string;
    icon: typeof BarChart3;
    hidden?: boolean;
  }[] = [
    { key: "revenue", label: "Revenue", icon: Wallet, hidden: !canSeeRevenue },
    { key: "leads", label: "Leads", icon: Target },
    { key: "staff", label: "Staff", icon: Users },
  ];

  const handleExport = async (type: Tab, staffId?: string) => {
    try {
      await exportMut.mutateAsync({ type, range, staffId });
      toast.success("Report downloaded");
    } catch (e) {
      toast.error(
        resolveMessage(
          (e as AxiosError<{ message?: unknown }>).response?.data?.message,
        ),
      );
    }
  };

  const input =
    "rounded-lg border border-border bg-card px-3 py-2.5 text-[13px] font-medium text-foreground outline-none focus:border-primary";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          Reports
        </h1>
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          Revenue, pipeline and team performance.
        </p>
      </div>

      {/* Date range */}
      <div className="mb-6 flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-card p-4">
        <div>
          <label className="mb-1.5 block text-[11.5px] font-semibold text-muted-foreground">
            From
          </label>
          <input
            type="date"
            value={range.startDate}
            onChange={(e) =>
              setRange((r) => ({ ...r, startDate: e.target.value }))
            }
            className={input}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[11.5px] font-semibold text-muted-foreground">
            To
          </label>
          <input
            type="date"
            value={range.endDate}
            onChange={(e) =>
              setRange((r) => ({ ...r, endDate: e.target.value }))
            }
            className={input}
          />
        </div>
        <div className="flex gap-2">
          {[
            {
              label: "This month",
              from: new Date(today.getFullYear(), today.getMonth(), 1),
            },
            { label: "This year", from: new Date(today.getFullYear(), 0, 1) },
          ].map((p) => (
            <button
              key={p.label}
              onClick={() =>
                setRange({ startDate: isoDay(p.from), endDate: isoDay(today) })
              }
              className="rounded-lg border border-border px-3 py-2.5 text-[12.5px] font-semibold text-muted-foreground hover:border-primary/50 hover:text-foreground">
              {p.label}
            </button>
          ))}
        </div>
        {tab !== "staff" && (
          <button
            onClick={() => handleExport(tab)}
            disabled={exportMut.isPending}
            className="ml-auto flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-[13px] font-semibold text-foreground hover:border-primary/50 disabled:opacity-60">
            {exportMut.isPending ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Download size={15} />
            )}{" "}
            Export CSV
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-border">
        {tabs
          .filter((t) => !t.hidden)
          .map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2.5 text-[13.5px] font-semibold transition-colors",
                tab === t.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}>
              <t.icon size={16} /> {t.label}
            </button>
          ))}
      </div>

      {tab === "revenue" && (
        <RevenueTab data={revenue} loading={loadingRevenue} />
      )}
      {tab === "leads" && <LeadsTab data={leads} loading={loadingLeads} />}
      {tab === "staff" && (
        <StaffTab
          range={range}
          onExport={(staffId) => handleExport("staff", staffId)}
          exporting={exportMut.isPending}
        />
      )}
    </div>
  );
}

// ───────── Revenue ─────────
function RevenueTab({
  data,
  loading,
}: {
  data?: import("@/app/interfaces/report").RevenueReport;
  loading: boolean;
}) {
  const { data: clients } = useClients();
  const { data: projects } = useProjects();

  if (loading)
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Loader2 size={26} className="animate-spin text-primary" />
      </div>
    );
  if (!data) return null;

  const months = Object.entries(data.byMonth);
  const peak = Math.max(1, ...months.map(([, v]) => v));

  const clientName = (id: string) => {
    const c = (clients ?? []).find((x) => x.id === id);
    return (
      c?.company ??
      (c?.user ? `${c.user.firstName} ${c.user.lastName}` : "Unknown client")
    );
  };
  const projectName = (id: string | null) =>
    (projects ?? []).find((p) => p.id === id)?.title ?? "Unknown project";

  return (
    <div className="space-y-6">
      <div className={card}>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/12 text-green-600 dark:text-green-400">
            <Wallet size={20} />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-foreground">
              {naira(data.totalRevenue)}
            </div>
            <div className="text-[12.5px] text-muted-foreground">
              Total revenue collected in period
            </div>
          </div>
        </div>
      </div>

      {months.length > 0 && (
        <div className={card}>
          <h2 className="mb-5 text-[15px] font-bold text-foreground">
            Revenue by Month
          </h2>
          <div className="space-y-3">
            {months.map(([month, value]) => (
              <div key={month}>
                <div className="mb-1 flex items-center justify-between text-[12.5px]">
                  <span className="text-muted-foreground">{month}</span>
                  <span className="font-semibold text-foreground">
                    {naira(value)}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${(value / peak) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className={card}>
          <h2 className="mb-4 text-[15px] font-bold text-foreground">
            Top Clients
          </h2>
          {data.byClient.length > 0 ? (
            <div className="space-y-2">
              {data.byClient.map((c) => (
                <div
                  key={c.clientId}
                  className="flex items-center justify-between rounded-xl border border-border p-3">
                  <Link
                    href={`/dashboard/clients/${c.clientId}`}
                    className="text-[13px] font-semibold text-foreground hover:text-primary">
                    {clientName(c.clientId)}
                  </Link>
                  <div className="text-right">
                    <div className="text-[13px] font-bold text-foreground">
                      {naira(c.total)}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {c.invoiceCount} invoice{c.invoiceCount === 1 ? "" : "s"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-muted-foreground">
              No paid invoices in this period.
            </p>
          )}
        </div>

        <div className={card}>
          <h2 className="mb-4 text-[15px] font-bold text-foreground">
            Top Projects
          </h2>
          {data.byProject.length > 0 ? (
            <div className="space-y-2">
              {data.byProject.map((p) => (
                <div
                  key={p.projectId ?? "none"}
                  className="flex items-center justify-between rounded-xl border border-border p-3">
                  <span className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
                    <Briefcase size={13} className="text-primary" />{" "}
                    {projectName(p.projectId)}
                  </span>
                  <span className="text-[13px] font-bold text-foreground">
                    {naira(p.total)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-muted-foreground">
              No project revenue in this period.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ───────── Leads ─────────
function LeadsTab({
  data,
  loading,
}: {
  data?: import("@/app/interfaces/report").LeadReport;
  loading: boolean;
}) {
  if (loading)
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Loader2 size={26} className="animate-spin text-primary" />
      </div>
    );
  if (!data) return null;

  const stats = [
    {
      label: "Total Leads",
      value: data.totalLeads,
      icon: Target,
      tint: "text-primary bg-primary/13",
    },
    {
      label: "Conversion Rate",
      value: `${data.conversionRate}%`,
      icon: TrendingUp,
      tint: "text-green-600 dark:text-green-400 bg-green-500/12",
    },
    {
      label: "Closed Won",
      value: data.closedWon.count,
      icon: CheckCircle2,
      tint: "text-green-600 dark:text-green-400 bg-green-500/12",
    },
    {
      label: "Avg Days to Close",
      value: data.closedWon.avgDaysToClose,
      icon: Clock,
      tint: "text-amber-600 dark:text-amber-400 bg-amber-500/12",
    },
  ];
  const peak = Math.max(1, ...data.byStage.map((s) => s.count));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-card p-5">
            <div
              className={cn(
                "mb-3 flex h-9 w-9 items-center justify-center rounded-lg",
                s.tint,
              )}>
              <s.icon size={18} />
            </div>
            <div className="text-xl font-extrabold text-foreground">
              {s.value}
            </div>
            <div className="text-[12.5px] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className={card}>
        <h2 className="mb-5 text-[15px] font-bold text-foreground">
          Pipeline by Stage
        </h2>
        <div className="space-y-3">
          {data.byStage.map((s) => (
            <div key={s.stage}>
              <div className="mb-1 flex items-center justify-between text-[12.5px]">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                    STAGE_BADGE[s.stage],
                  )}>
                  {s.stage.replace(/_/g, " ")}
                </span>
                <span className="text-muted-foreground">
                  {s.count} · {naira(s.totalValue)}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(s.count / peak) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className={card}>
          <h2 className="mb-4 flex items-center gap-2 text-[15px] font-bold text-foreground">
            <AlertCircle size={16} className="text-destructive" /> Why We Lost (
            {data.closedLost.count})
          </h2>
          {data.closedLost.reasons.length > 0 ? (
            <div className="space-y-2">
              {data.closedLost.reasons.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-border p-3">
                  <span className="text-[13px] text-foreground">
                    {r.lostReason ?? "Not specified"}
                  </span>
                  <span className="text-[13px] font-bold text-foreground">
                    {r._count.id}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-muted-foreground">
              No lost leads in this period.
            </p>
          )}
        </div>

        <div className={card}>
          <h2 className="mb-4 text-[15px] font-bold text-foreground">
            Recent Leads
          </h2>
          {data.recentLeads.length > 0 ? (
            <div className="space-y-2">
              {data.recentLeads.map((l) => (
                <Link
                  key={l.id}
                  href={`/dashboard/leads/${l.id}`}
                  className="flex items-center justify-between rounded-xl border border-border p-3 hover:border-primary/50">
                  <div>
                    <div className="text-[13px] font-semibold text-foreground">
                      {l.firstName} {l.lastName}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {fmtDate(l.createdAt)}
                      {l.assignedTo &&
                        ` · ${l.assignedTo.firstName} ${l.assignedTo.lastName}`}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                      STAGE_BADGE[l.stage],
                    )}>
                    {l.stage.replace(/_/g, " ")}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-muted-foreground">
              No leads in this period.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ───────── Staff ─────────
function StaffTab({
  range,
  onExport,
  exporting,
}: {
  range: { startDate: string; endDate: string };
  onExport: (staffId: string) => void;
  exporting: boolean;
}) {
  const { data: users } = useUsers();
  const generateMut = useGenerateStaffReport();
  const [staffId, setStaffId] = useState("");
  const [report, setReport] = useState<StaffReport | null>(null);

  const staff = (users ?? []).filter((u) => u.role !== "CLIENT");

  const generate = async () => {
    if (!staffId) {
      toast.error("Select a staff member");
      return;
    }
    try {
      const r = await generateMut.mutateAsync({ staffId, range });
      setReport(r);
    } catch (e) {
      toast.error(
        resolveMessage(
          (e as AxiosError<{ message?: unknown }>).response?.data?.message,
        ),
      );
    }
  };

  const input =
    "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-[13.5px] text-foreground outline-none focus:border-primary";

  return (
    <div className="space-y-6">
      <div className={card}>
        <h2 className="mb-1 text-[15px] font-bold text-foreground">
          Generate Staff Report
        </h2>
        <p className="mb-4 text-[12.5px] text-muted-foreground">
          Task performance for the selected period. Each generation is saved to
          the staff&apos;s report history.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={staffId}
            onChange={(e) => {
              setStaffId(e.target.value);
              setReport(null);
            }}
            className={input}>
            <option value="">Select staff member...</option>
            {staff.map((u) => (
              <option key={u.id} value={u.id}>
                {u.firstName} {u.lastName}
              </option>
            ))}
          </select>
          <button
            onClick={generate}
            disabled={generateMut.isPending}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-[13px] font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60">
            {generateMut.isPending ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Generating...
              </>
            ) : (
              <>
                <BarChart3 size={15} /> Generate
              </>
            )}
          </button>
        </div>
      </div>

      {report && (
        <>
          <div className={card}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-bold text-foreground">
                  {report.staff
                    ? `${report.staff.firstName} ${report.staff.lastName}`
                    : "Staff"}
                </h2>
                <p className="text-[12.5px] text-muted-foreground">
                  {report.staff?.departments?.map((d) => d.name).join(", ") ||
                    "No department"}{" "}
                  · {fmtDate(report.periodStart)} – {fmtDate(report.periodEnd)}
                </p>
              </div>
              <button
                onClick={() => onExport(report.staffId)}
                disabled={exporting}
                className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-[13px] font-semibold text-foreground hover:border-primary/50 disabled:opacity-60">
                {exporting ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Download size={15} />
                )}{" "}
                Export CSV
              </button>
            </div>

            {/* Productivity score */}
            <div className="mb-6">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-foreground">
                  Productivity Score
                </span>
                <span className="text-[15px] font-extrabold text-primary">
                  {report.productivityScore ?? 0}/100
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${report.productivityScore ?? 0}%` }}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Assigned",
                  value: report.tasksAssigned,
                  icon: FileText,
                  tint: "text-primary bg-primary/13",
                },
                {
                  label: "Completed",
                  value: report.tasksCompleted,
                  icon: CheckCircle2,
                  tint: "text-green-600 dark:text-green-400 bg-green-500/12",
                },
                {
                  label: "Overdue",
                  value: report.tasksOverdue,
                  icon: AlertCircle,
                  tint: "text-red-600 dark:text-red-400 bg-red-500/12",
                },
                {
                  label: "Avg Days",
                  value: report.avgCompletionDays?.toFixed(1) ?? "0",
                  icon: Clock,
                  tint: "text-amber-600 dark:text-amber-400 bg-amber-500/12",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-border p-4">
                  <div
                    className={cn(
                      "mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg",
                      s.tint,
                    )}>
                    <s.icon size={16} />
                  </div>
                  <div className="text-lg font-extrabold text-foreground">
                    {s.value}
                  </div>
                  <div className="text-[12px] text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
