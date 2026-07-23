"use client";

import { TrendingUp, Target, Phone, FileText } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  useMarketingDashboard,
  fallbackMarketing,
} from "@/app/hooks/use-dashboard";
import {
  StatCard,
  Card,
  EmptyState,
  //   naira,
} from "../widgets";

const STAGE_LABELS: Record<string, string> = {
  NEW_LEAD: "New",
  CONTACTED: "Contacted",
  PROPOSAL_SENT: "Proposal",
  NEGOTIATION: "Negotiation",
  CLOSED_WON: "Won",
  CLOSED_LOST: "Lost",
};

export function MarketingView() {
  const { data } = useMarketingDashboard();
  const dash = data ?? fallbackMarketing;

  const pipelineChart = dash.pipeline.map((p) => ({
    name: STAGE_LABELS[p.stage] ?? p.stage,
    count: p.count,
  }));

  const acceptedProposals =
    dash.proposals.find((p) => p.isAccepted)?._count.id ?? 0;
  const totalProposals = dash.proposals.reduce((s, p) => s + p._count.id, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="New Leads This Week"
          value={String(dash.leads.newThisWeek)}
          icon={TrendingUp}
        />
        <StatCard
          label="Conversion Rate"
          value={`${dash.leads.conversionRate}%`}
          icon={Target}
          tone="positive"
        />
        <StatCard
          label="Won This Month"
          value={String(dash.leads.closedWonThisMonth)}
          icon={Target}
          tone="positive"
        />
        <StatCard
          label="Proposals Accepted"
          value={`${acceptedProposals}/${totalProposals}`}
          icon={FileText}
        />
      </div>

      <Card title="Sales Pipeline">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={pipelineChart}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
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
            <Bar
              dataKey="count"
              fill="var(--brand-purple)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Follow-ups Due Today">
          {dash.followUpsDueToday.length > 0 ? (
            <div className="space-y-2">
              {dash.followUpsDueToday.map((f) => (
                <div
                  key={f.id}
                  className="flex items-start gap-3 rounded-xl border border-border px-4 py-3">
                  <Phone size={15} className="mt-0.5 text-primary" />
                  <div>
                    <div className="text-[13px] font-semibold text-foreground">
                      {f.lead.firstName} {f.lead.lastName}
                      {f.lead.company && (
                        <span className="text-muted-foreground">
                          {" "}
                          · {f.lead.company}
                        </span>
                      )}
                    </div>
                    <div className="text-[11.5px] text-muted-foreground">
                      {f.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text="No follow-ups due today." />
          )}
        </Card>

        <Card title="Recent Activity">
          {dash.recentActivities.length > 0 ? (
            <div className="space-y-3">
              {dash.recentActivities.map((a) => (
                <div key={a.id} className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div>
                    <p className="text-[13px] text-foreground">
                      <span className="font-semibold">
                        {a.lead.firstName} {a.lead.lastName}
                      </span>{" "}
                      — {a.description}
                    </p>
                    <p className="text-[11.5px] capitalize text-muted-foreground">
                      {a.type} ·{" "}
                      {new Date(a.createdAt).toLocaleDateString("en-NG", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text="No recent activity." />
          )}
        </Card>
      </div>
    </div>
  );
}
