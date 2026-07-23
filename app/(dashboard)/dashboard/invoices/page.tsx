"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  X,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useInvoices, useRevenueStats } from "@/app/hooks/use-invoices";

function naira(n: string | number) {
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

const STATUS_BADGE: Record<string, string> = {
  DRAFT: "bg-slate-500/15 text-slate-600 dark:text-slate-400",
  SENT: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  PAID: "bg-green-500/15 text-green-600 dark:text-green-400",
  OVERDUE: "bg-red-500/15 text-red-600 dark:text-red-400",
  CANCELLED: "bg-slate-500/15 text-slate-500",
};

export default function InvoicesPage() {
  const router = useRouter();
  const { data: invoices, isLoading } = useInvoices();
  const { data: stats } = useRevenueStats();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const list = invoices ?? [];
  const filtered = list.filter((inv) => {
    const name = inv.client?.user
      ? `${inv.client.user.firstName} ${inv.client.user.lastName}`
      : "";
    const matchesSearch =
      inv.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      (inv.client?.company ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statCards = [
    {
      label: "Total Revenue",
      value: stats ? naira(stats.totalRevenue) : "—",
      icon: Wallet,
      tint: "text-green-600 dark:text-green-400 bg-green-500/[0.12]",
    },
    {
      label: "Outstanding",
      value: stats ? naira(stats.outstanding) : "—",
      icon: TrendingUp,
      tint: "text-amber-600 dark:text-amber-400 bg-amber-500/[0.12]",
    },
    {
      label: "Paid Invoices",
      value: stats?.paidInvoicesCount ?? "—",
      icon: CheckCircle2,
      tint: "text-primary bg-primary/[0.13]",
    },
    {
      label: "Overdue",
      value: stats?.overdueInvoicesCount ?? "—",
      icon: AlertCircle,
      tint: "text-red-600 dark:text-red-400 bg-red-500/[0.12]",
    },
  ];
  const selectClass =
    "rounded-lg border border-border bg-card px-3 py-2.5 text-[13px] font-medium text-foreground outline-none focus:border-primary";

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Invoices
          </h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">
            Bill clients and track payments.
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/invoices/new")}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:-translate-y-0.5 hover:opacity-90">
          <Plus size={17} /> New Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
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

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 sm:max-w-xs sm:flex-1">
          <Search size={16} className="text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent py-2.5 text-[13.5px] text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="Search invoice # or client..."
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-muted-foreground hover:text-foreground">
              <X size={15} />
            </button>
          )}
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={selectClass}>
          <option value="ALL">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="SENT">Sent</option>
          <option value="PAID">Paid</option>
          <option value="OVERDUE">Overdue</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Invoice
                </th>
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Client
                </th>
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Amount
                </th>
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Due Date
                </th>
                <th className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-5 py-4" colSpan={5}>
                      <div className="h-8 w-full animate-pulse rounded bg-muted" />
                    </td>
                  </tr>
                ))
              ) : filtered.length > 0 ? (
                filtered.map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => router.push(`/dashboard/invoices/${inv.id}`)}
                    className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-foreground/2">
                    <td className="px-5 py-4">
                      <span className="text-[13.5px] font-bold text-foreground">
                        {inv.invoiceNo}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-muted-foreground">
                      {inv.client?.user
                        ? `${inv.client.user.firstName} ${inv.client.user.lastName}`
                        : (inv.client?.company ?? "—")}
                    </td>
                    <td className="px-5 py-4 text-[13px] font-semibold text-foreground">
                      {naira(inv.total)}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-muted-foreground">
                      {fmtDate(inv.dueDate)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase",
                          STATUS_BADGE[inv.status],
                        )}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <FileText
                      size={32}
                      className="mx-auto mb-3 text-muted-foreground/40"
                    />
                    <p className="text-[14px] font-semibold text-foreground">
                      No invoices found
                    </p>
                    <p className="mt-1 text-[13px] text-muted-foreground">
                      Create your first invoice to bill a client.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
