"use client";

import {
  Building2,
  AlertTriangle,
  CheckCircle2,
  Users,
  ListTodo,
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
  useOperationsDashboard,
  fallbackOperations,
} from "@/app/hooks/use-dashboard";
import { Card, EmptyState, StatCard } from "../widgets";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#94a3b8",
  IN_PROGRESS: "var(--brand-purple)",
  IN_REVIEW: "#f59e0b",
  COMPLETED: "var(--brand-green)",
  OVERDUE: "#ef4444",
};

export function OperationsView() {
  const { data } = useOperationsDashboard();
  const dash = data ?? fallbackOperations;

  const taskChart = dash.tasks.stats.map((s) => ({
    name: s.status.replace(/_/g, " "),
    value: s._count.id,
    status: s.status,
  }));

  const totalTasks = dash.tasks.stats.reduce((sum, s) => sum + s._count.id, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Departments"
          value={String(dash.departments.length)}
          icon={Building2}
        />
        <StatCard
          label="Total Tasks"
          value={String(totalTasks)}
          icon={ListTodo}
        />
        <StatCard
          label="Completed This Week"
          value={String(dash.tasks.completedThisWeek)}
          icon={CheckCircle2}
          tone="positive"
        />
        <StatCard
          label="Delayed Projects"
          value={String(dash.delayedProjects.length)}
          icon={AlertTriangle}
          tone="negative"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Task distribution chart */}
        <Card title="Task Distribution">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={taskChart} layout="vertical">
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)", opacity: 0.3 }}
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {taskChart.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={STATUS_COLORS[entry.status] ?? "#94a3b8"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Department performance */}
        <Card title="Department Performance">
          <div className="space-y-3">
            {dash.departments.map((d) => (
              <div key={d.id} className="rounded-xl border border-border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[13.5px] font-semibold text-foreground">
                    {d.name}
                  </span>
                  <span className="flex items-center gap-1 text-[11.5px] text-muted-foreground">
                    <Users size={12} /> {d.staffCount}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[11.5px] text-muted-foreground">
                  <span>{d.activeProjects} active</span>
                  <span className="text-primary">
                    {d.completedProjects} completed
                  </span>
                  <span>{d.projectCount} total</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Delayed projects */}
      <Card title="Delayed Projects">
        {dash.delayedProjects.length > 0 ? (
          <div className="space-y-2">
            {dash.delayedProjects.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/4 px-4 py-3">
                <div>
                  <div className="text-[13.5px] font-semibold text-foreground">
                    {p.title}
                  </div>
                  <div className="text-[11.5px] text-muted-foreground">
                    {p.department?.name} ·{" "}
                    {p.client?.user
                      ? `${p.client.user.firstName} ${p.client.user.lastName}`
                      : "No client"}
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-[11.5px] font-semibold text-destructive">
                  <AlertTriangle size={13} />
                  Due{" "}
                  {new Date(p.dueDate).toLocaleDateString("en-NG", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState text="No delayed projects. Everything's on track!" />
        )}
      </Card>
    </div>
  );
}
