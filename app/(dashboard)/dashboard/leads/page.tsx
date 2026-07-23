"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  MoreVertical,
  Eye,
  Pencil,
  X,
  TrendingUp,
  Table,
  LayoutGrid,
  Building2,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Lead } from "@/app/interfaces/lead";
import { LeadStage } from "@/app/interfaces/enums";
import { useLeads, usePipelineSummary } from "@/app/hooks/use-leads";
import { LeadModal } from "@/app/components/leeds/lead-modal";

const STAGES: { key: LeadStage; label: string; color: string }[] = [
  { key: "NEW_LEAD", label: "New", color: "bg-slate-500" },
  { key: "CONTACTED", label: "Contacted", color: "bg-blue-500" },
  { key: "PROPOSAL_SENT", label: "Proposal Sent", color: "bg-amber-500" },
  { key: "NEGOTIATION", label: "Negotiation", color: "bg-purple-500" },
  { key: "CLOSED_WON", label: "Won", color: "bg-green-500" },
  { key: "CLOSED_LOST", label: "Lost", color: "bg-red-500" },
];

const STAGE_BADGE: Record<string, string> = {
  NEW_LEAD: "bg-slate-500/15 text-slate-600 dark:text-slate-400",
  CONTACTED: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  PROPOSAL_SENT: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  NEGOTIATION: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  CLOSED_WON: "bg-green-500/15 text-green-600 dark:text-green-400",
  CLOSED_LOST: "bg-red-500/15 text-red-600 dark:text-red-400",
};

function naira(n: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
}

function RowActions({
  onView,
  onEdit,
}: {
  onView: () => void;
  onEdit: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-foreground/6 hover:text-foreground">
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-36 overflow-hidden rounded-xl border border-border bg-popover py-1 shadow-xl">
          <button
            onClick={() => {
              setOpen(false);
              onView();
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-foreground hover:bg-foreground/5">
            <Eye size={15} className="text-muted-foreground" /> View
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-foreground hover:bg-foreground/5">
            <Pencil size={15} className="text-muted-foreground" /> Edit
          </button>
        </div>
      )}
    </div>
  );
}

export default function LeadsPage() {
  const router = useRouter();
  const [view, setView] = useState<"table" | "pipeline">("table");
  const { data: leads, isLoading } = useLeads();
  const { data: pipeline } = usePipelineSummary();
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Lead | null>(null);

  const list = leads ?? [];
  const filtered = list.filter((l) => {
    const matchesSearch = `${l.firstName} ${l.lastName} ${l.company ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStage = stageFilter === "ALL" || l.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (l: Lead) => {
    setEditing(l);
    setModalOpen(true);
  };

  const stageSummary = (stage: LeadStage) =>
    pipeline?.find((p) => p.stage === stage);
  const selectClass =
    "rounded-lg border border-border bg-card px-3 py-2.5 text-[13px] font-medium text-foreground outline-none focus:border-primary";

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Leads
          </h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">
            Track and manage your sales pipeline.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:-translate-y-0.5 hover:opacity-90">
          <Plus size={17} /> New Lead
        </button>
      </div>

      {/* View toggle + filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          <button
            onClick={() => setView("table")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12.5px] font-semibold transition-colors",
              view === "table"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}>
            <Table size={14} /> Table
          </button>
          <button
            onClick={() => setView("pipeline")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12.5px] font-semibold transition-colors",
              view === "pipeline"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}>
            <LayoutGrid size={14} /> Pipeline
          </button>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 sm:max-w-xs sm:flex-1">
          <Search size={16} className="text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent py-2.5 text-[13.5px] text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="Search leads..."
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-muted-foreground hover:text-foreground">
              <X size={15} />
            </button>
          )}
        </div>
        {view === "table" && (
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className={selectClass}>
            <option value="ALL">All Stages</option>
            {STAGES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* TABLE VIEW */}
      {view === "table" && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                    Lead
                  </th>
                  <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                    Company
                  </th>
                  <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                    Stage
                  </th>
                  <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                    Value
                  </th>
                  <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                    Assigned
                  </th>
                  <th className="px-5 py-3.5 text-right text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr
                      key={i}
                      className="border-b border-border last:border-0">
                      <td className="px-5 py-4" colSpan={6}>
                        <div className="h-8 w-full animate-pulse rounded bg-muted" />
                      </td>
                    </tr>
                  ))
                ) : filtered.length > 0 ? (
                  filtered.map((l) => (
                    <tr
                      key={l.id}
                      className="border-b border-border transition-colors last:border-0 hover:bg-foreground/2">
                      <td className="px-5 py-4">
                        <div
                          className="cursor-pointer"
                          onClick={() =>
                            router.push(`/dashboard/leads/${l.id}`)
                          }>
                          <div className="text-[13.5px] font-semibold text-foreground">
                            {l.firstName} {l.lastName}
                          </div>
                          {l.email && (
                            <div className="text-[12px] text-muted-foreground">
                              {l.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[13px] text-muted-foreground">
                        {l.company ?? "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase",
                            STAGE_BADGE[l.stage],
                          )}>
                          {l.stage}
                          {/* {l.stage.replace(/_/g, " ")} */}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[13px] font-semibold text-foreground">
                        {l.estimatedValue ? naira(l.estimatedValue) : "—"}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-muted-foreground">
                        {l.assignedTo
                          ? `${l.assignedTo.firstName} ${l.assignedTo.lastName}`
                          : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <RowActions
                            onView={() =>
                              router.push(`/dashboard/leads/${l.id}`)
                            }
                            onEdit={() => openEdit(l)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <TrendingUp
                        size={32}
                        className="mx-auto mb-3 text-muted-foreground/40"
                      />
                      <p className="text-[14px] font-semibold text-foreground">
                        No leads found
                      </p>
                      <p className="mt-1 text-[13px] text-muted-foreground">
                        Create your first lead to start tracking.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* PIPELINE VIEW */}
      {view === "pipeline" && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4" style={{ minWidth: "max-content" }}>
            {STAGES.map((stage) => {
              const stageLeads = filtered.filter((l) => l.stage === stage.key);
              const summary = stageSummary(stage.key);
              return (
                <div key={stage.key} className="w-72 shrink-0">
                  <div className="mb-3 flex items-center justify-between rounded-xl border border-border bg-card px-3.5 py-2.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn("h-2.5 w-2.5 rounded-full", stage.color)}
                      />
                      <span className="text-[13px] font-bold text-foreground">
                        {stage.label}
                      </span>
                      <span className="text-[12px] text-muted-foreground">
                        {stageLeads.length}
                      </span>
                    </div>
                    {summary && summary.totalEstimatedValue > 0 && (
                      <span className="text-[11px] font-semibold text-primary">
                        {naira(Number(summary.totalEstimatedValue))}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {stageLeads.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => router.push(`/dashboard/leads/${l.id}`)}
                        className="group w-full rounded-xl border border-border bg-card p-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md">
                        <div className="mb-1.5 flex items-start justify-between">
                          <span className="text-[13px] font-semibold text-foreground">
                            {l.firstName} {l.lastName}
                          </span>
                          <ChevronRight
                            size={14}
                            className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                          />
                        </div>
                        {l.company && (
                          <div className="mb-2 flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                            <Building2 size={11} /> {l.company}
                          </div>
                        )}
                        {l.estimatedValue ? (
                          <div className="text-[12px] font-bold text-primary">
                            {naira(l.estimatedValue)}
                          </div>
                        ) : null}
                        {l.assignedTo && (
                          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                              {l.assignedTo.firstName[0]}
                              {l.assignedTo.lastName[0]}
                            </span>{" "}
                            {l.assignedTo.firstName}
                          </div>
                        )}
                      </button>
                    ))}
                    {stageLeads.length === 0 && (
                      <div className="rounded-xl border border-dashed border-border py-8 text-center text-[12px] text-muted-foreground">
                        No leads
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {modalOpen && (
        <LeadModal lead={editing} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}
