"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  ArrowLeft,
  Repeat,
  Calendar,
  Wallet,
  Building2,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useContracts } from "@/app/hooks/use-contracts";
import { ContractModal } from "@/app/components/invoices/contract-modal";

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
function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: "bg-green-500/15 text-green-600 dark:text-green-400",
  EXPIRED: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  CANCELLED: "bg-slate-500/15 text-slate-500",
};

export default function ContractsPage() {
  const router = useRouter();
  const { data: contracts, isLoading } = useContracts();
  const [modalOpen, setModalOpen] = useState(false);

  const list = contracts ?? [];
  const activeTotal = list
    .filter((c) => c.status === "ACTIVE")
    .reduce((sum, c) => sum + Number(c.amount), 0);

  return (
    <div>
      <Link
        href="/dashboard/invoices"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary">
        <ArrowLeft size={15} /> Back to invoices
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Maintenance Contracts
          </h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">
            Recurring retainers — invoices generate automatically each month.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:-translate-y-0.5 hover:opacity-90">
          <Plus size={17} /> New Contract
        </button>
      </div>

      {/* Recurring revenue summary */}
      {list.length > 0 && (
        <div className="mb-6 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/13 text-primary">
              <Repeat size={19} />
            </div>
            <div>
              <div className="text-xl font-extrabold text-foreground">
                {naira(activeTotal)}
              </div>
              <div className="text-[12.5px] text-muted-foreground">
                Monthly recurring revenue ·{" "}
                {list.filter((c) => c.status === "ACTIVE").length} active
                contract
                {list.filter((c) => c.status === "ACTIVE").length === 1
                  ? ""
                  : "s"}
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : list.length > 0 ? (
        <div className="space-y-3">
          {list.map((c) => (
            <button
              key={c.id}
              onClick={() =>
                router.push(`/dashboard/invoices/contracts/${c.id}`)
              }
              className="group cursor-pointer flex w-full flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md">
              <div>
                <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
                  <span className="text-[15px] font-bold text-foreground">
                    {c.title}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase",
                      STATUS_BADGE[c.status],
                    )}>
                    {c.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Building2 size={12} />{" "}
                    {c.client?.company ??
                      (c.client?.user
                        ? `${c.client.user.firstName} ${c.client.user.lastName}`
                        : "—")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} /> Bills {ordinal(c.billingDay)} monthly
                  </span>
                  {c.lastBilledAt && (
                    <span>Last billed {fmtDate(c.lastBilledAt)}</span>
                  )}
                  {c._count?.invoices != null && (
                    <span>
                      {c._count.invoices} invoice
                      {c._count.invoices === 1 ? "" : "s"}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-[16px] font-extrabold text-foreground">
                    <Wallet size={15} className="text-primary" />{" "}
                    {naira(c.amount)}
                  </div>
                  <div className="text-[11.5px] text-muted-foreground">
                    per month
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-16 text-center">
          <Repeat size={32} className="mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-[14px] font-semibold text-foreground">
            No contracts yet
          </p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Set up a retainer to bill a client automatically each month.
          </p>
        </div>
      )}

      {modalOpen && <ContractModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
