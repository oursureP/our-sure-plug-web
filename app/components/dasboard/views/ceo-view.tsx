/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  DollarSign,
  Building2,
  Briefcase,
  Users,
  TrendingUp,
  GraduationCap,
  AlertCircle,
  Receipt,
  CheckCircle2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import {
  fallbackCeoDashboard,
  useCeoDashboard,
} from "@/app/hooks/use-dashboard";
import { StatCard, Card, EmptyState, naira } from "../../dasboard/widgets";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { useState } from "react";
import { PeriodFilter } from "../period-filter";

export function CeoView() {
  const now = new Date();
  const [period, setPeriod] = useState({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });

  const { data: dash, isLoading } = useCeoDashboard(period);
  const data = dash ?? fallbackCeoDashboard;
  if (isLoading || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl border border-border bg-card dark:bg-[#161427]"
          />
        ))}
      </div>
    );
  }

  const revenueData = [
    { name: "Last Month", value: data.revenue.lastMonth },
    { name: "This Month", value: data.revenue.thisMonth },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-foreground">
          Overview —{" "}
          {new Date(period.year, period.month - 1).toLocaleDateString("en-NG", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <PeriodFilter
          month={period.month}
          year={period.year}
          onChange={(month, year) => setPeriod({ month, year })}
        />
      </div>
      {/* Top stats */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Revenue"
          value={naira(data.revenue.total)}
          icon={DollarSign}
        />
        <StatCard
          label="This Month"
          value={naira(data.revenue.thisMonth)}
          change={`${data.revenue.growth >= 0 ? "+" : ""}${data.revenue.growth}%`}
          tone={data.revenue.growth >= 0 ? "positive" : "negative"}
          icon={TrendingUp}
        />
        <StatCard
          label="Conversion Rate"
          value={`${data.sales.conversionRate}%`}
          change={`${data.sales.closedWon}/${data.sales.totalLeads} leads`}
          icon={CheckCircle2}
        />
        <StatCard
          label="Active Clients"
          value={String(data.clients.total)}
          icon={Building2}
        />
        <StatCard
          label="Total Staff"
          value={String(data.staff.total)}
          icon={Users}
        />
        <StatCard
          label="Active Enrollments"
          value={String(data.lms.activeEnrollments)}
          icon={GraduationCap}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue chart */}
        <div className="lg:col-span-2">
          <Card title="Revenue — This Month vs Last">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={revenueData}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.3 }}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v: ValueType | any) => [
                    naira(Number(v)),
                    "Revenue",
                  ]}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {revenueData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={
                        i === 1 ? "var(--brand-green)" : "var(--brand-purple)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Project + invoice summary */}
        <div className="space-y-4">
          <StatCard
            label="Pending Projects"
            value={String(data.projects.pending)}
            icon={Briefcase}
          />
          <StatCard
            label="Completed Projects"
            value={String(data.projects.completed)}
            icon={CheckCircle2}
            tone="positive"
          />
          <StatCard
            label="Outstanding Invoices"
            value={naira(data.invoices.outstanding)}
            change={`${data.invoices.overdueCount} overdue`}
            tone="negative"
            icon={Receipt}
          />
        </div>
      </div>

      {/* Projects due this week */}
      <Card title="Projects Due This Week">
        {data.projects.dueThisWeek.length > 0 ? (
          <div className="space-y-2">
            {data.projects.dueThisWeek.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                <div>
                  <div className="text-[13.5px] font-semibold text-foreground">
                    {p.title}
                  </div>
                  <div className="text-[11.5px] text-muted-foreground">
                    {p.client?.user
                      ? `${p.client.user.firstName} ${p.client.user.lastName}`
                      : "No client"}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11.5px] font-medium text-primary">
                  <AlertCircle size={13} />
                  {new Date(p.dueDate).toLocaleDateString("en-NG", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState text="No projects due this week." />
        )}
      </Card>
    </div>
  );
}
