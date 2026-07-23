"use client";

import {
  //   CheckSquare,
  AlertTriangle,
  CheckCircle2,
  Briefcase,
  Clock,
} from "lucide-react";
import { useStaffDashboard, fallbackStaff } from "@/app/hooks/use-dashboard";
import { StatCard, Card, EmptyState } from "../widgets";
import { cn } from "@/lib/utils";

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "text-slate-500 bg-slate-500/10",
  MEDIUM: "text-blue-600 bg-blue-500/10 dark:text-blue-400",
  HIGH: "text-amber-600 bg-amber-500/10 dark:text-amber-400",
  CRITICAL: "text-red-600 bg-red-500/10 dark:text-red-400",
};

export function StaffView() {
  const { data } = useStaffDashboard();
  const dash = data ?? fallbackStaff;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Due Today"
          value={String(dash.tasks.dueToday.length)}
          icon={Clock}
        />
        <StatCard
          label="Overdue"
          value={String(dash.tasks.overdueCount)}
          icon={AlertTriangle}
          tone="negative"
        />
        <StatCard
          label="Completed This Week"
          value={String(dash.tasks.completedThisWeek)}
          icon={CheckCircle2}
          tone="positive"
        />
        <StatCard
          label="My Projects"
          value={String(dash.projects.length)}
          icon={Briefcase}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* My pending tasks */}
        <Card title="My Tasks">
          {dash.tasks.pending.length > 0 ? (
            <div className="space-y-2">
              {dash.tasks.pending.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-semibold text-foreground">
                      {t.title}
                    </div>
                    <div className="text-[11.5px] text-muted-foreground">
                      {t.project?.title}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase",
                      PRIORITY_COLORS[t.priority] ?? PRIORITY_COLORS.MEDIUM,
                    )}>
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text="No pending tasks. Great job!" />
          )}
        </Card>

        {/* My projects */}
        <Card title="My Projects">
          {dash.projects.length > 0 ? (
            <div className="space-y-2">
              {dash.projects.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                  <div>
                    <div className="text-[13px] font-semibold text-foreground">
                      {p.title}
                    </div>
                    <div className="text-[11.5px] text-muted-foreground">
                      {p.client?.user
                        ? `${p.client.user.firstName} ${p.client.user.lastName}`
                        : "No client"}
                    </div>
                  </div>
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                    {p.status.replace(/_/g, " ")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text="No projects assigned yet." />
          )}
        </Card>
      </div>
    </div>
  );
}
