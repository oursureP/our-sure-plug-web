"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Repeat,
  Calendar,
  Wallet,
  Building2,
  Briefcase,
  Ban,
  FileText,
  Zap,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";
import {
  useContract,
  useCancelContract,
  useGenerateContractInvoice,
} from "@/app/hooks/use-contracts";
import { ConfirmDialog } from "@/app/components/dasboard/confirm-dialog";

function resolveMessage(m: unknown): string {
  if (Array.isArray(m)) return String(m[0] ?? "Something went wrong");
  if (typeof m === "string") return m;
  return "Something went wrong. Please try again.";
}
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
const INVOICE_BADGE: Record<string, string> = {
  DRAFT: "bg-slate-500/15 text-slate-600 dark:text-slate-400",
  SENT: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  PARTIALLY_PAID: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  PAID: "bg-green-500/15 text-green-600 dark:text-green-400",
  OVERDUE: "bg-red-500/15 text-red-600 dark:text-red-400",
  CANCELLED: "bg-slate-500/15 text-slate-500",
};

const card = "rounded-2xl border border-border bg-card p-6";

export default function SingleContractPage() {
  const { id } = useParams<{ id: string }>();
  const { data: contract, isLoading } = useContract(id);
  const cancelMut = useCancelContract();
  const generateMut = useGenerateContractInvoice();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmGenerate, setConfirmGenerate] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }
  if (!contract) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-bold text-foreground">Contract not found</p>
        <Link
          href="/dashboard/invoices/contracts"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft size={15} /> Back to contracts
        </Link>
      </div>
    );
  }

  const err = (e: unknown) =>
    toast.error(
      resolveMessage(
        (e as AxiosError<{ message?: unknown }>).response?.data?.message,
      ),
    );
  const isActive = contract.status === "ACTIVE";
  const invoices = contract.invoices ?? [];
  const billed = invoices.reduce((sum, i) => sum + Number(i.total), 0);

  const handleCancel = async () => {
    try {
      await cancelMut.mutateAsync(contract.id);
      toast.success("Contract cancelled");
      setConfirmCancel(false);
    } catch (e) {
      err(e);
    }
  };
  const handleGenerate = async () => {
    try {
      await generateMut.mutateAsync(contract.id);
      toast.success("Invoice generated");
      setConfirmGenerate(false);
    } catch (e) {
      err(e);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/dashboard/invoices/contracts"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary">
        <ArrowLeft size={15} /> Back to contracts
      </Link>

      {/* Header */}
      <div className={cn(card, "mb-6")}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                {contract.title}
              </h1>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase",
                  STATUS_BADGE[contract.status],
                )}>
                {contract.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Building2 size={13} />
                {contract.client?.company ??
                  (contract.client?.user
                    ? `${contract.client.user.firstName} ${contract.client.user.lastName}`
                    : "—")}
              </span>
              {contract.project && (
                <Link
                  href={`/dashboard/projects/${contract.project.id}`}
                  className="flex items-center gap-1.5 hover:text-primary">
                  <Briefcase size={13} /> {contract.project.title}
                </Link>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {isActive && (
              <>
                <button
                  onClick={() => setConfirmGenerate(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-bold text-primary-foreground hover:opacity-90">
                  <Zap size={14} /> Generate Invoice
                </button>
                <button
                  onClick={() => setConfirmCancel(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-destructive/30 px-4 py-2 text-[13px] font-semibold text-destructive hover:bg-destructive/10">
                  <Ban size={14} /> Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {contract.description && (
          <p className="mt-4 border-t border-border pt-4 text-[13.5px] leading-relaxed text-muted-foreground">
            {contract.description}
          </p>
        )}
      </div>

      {/* Terms */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Monthly Amount",
            value: naira(contract.amount),
            icon: Wallet,
          },
          {
            label: "Billing Day",
            value: `${ordinal(contract.billingDay)} of month`,
            icon: Repeat,
          },
          {
            label: "Started",
            value: fmtDate(contract.startDate),
            icon: Calendar,
          },
          {
            label: "Ends",
            value: contract.endDate ? fmtDate(contract.endDate) : "Ongoing",
            icon: Clock,
          },
        ].map((t) => (
          <div
            key={t.label}
            className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/13 text-primary">
              <t.icon size={17} />
            </div>
            <div className="text-[15px] font-extrabold text-foreground">
              {t.value}
            </div>
            <div className="text-[12.5px] text-muted-foreground">{t.label}</div>
          </div>
        ))}
      </div>

      {/* Billing history */}
      <div className={card}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[15px] font-bold text-foreground">
            Billing History
          </h2>
          <div className="text-[12.5px] text-muted-foreground">
            {contract.lastBilledAt ? (
              <>Last billed {fmtDate(contract.lastBilledAt)} · </>
            ) : null}
            {invoices.length} invoice{invoices.length === 1 ? "" : "s"} ·{" "}
            {naira(billed)} total
          </div>
        </div>

        {invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-2 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Invoice
                  </th>
                  <th className="px-2 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Issued
                  </th>
                  <th className="px-2 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Due
                  </th>
                  <th className="px-2 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Amount
                  </th>
                  <th className="px-2 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-b border-border last:border-0 hover:bg-foreground/2">
                    <td className="px-2 py-3">
                      <Link
                        href={`/dashboard/invoices/${inv.id}`}
                        className="text-[13.5px] font-semibold text-foreground hover:text-primary">
                        {inv.invoiceNo}
                      </Link>
                    </td>
                    <td className="px-2 py-3 text-[13px] text-muted-foreground">
                      {fmtDate(inv.createdAt)}
                    </td>
                    <td className="px-2 py-3 text-[13px] text-muted-foreground">
                      {fmtDate(inv.dueDate)}
                    </td>
                    <td className="px-2 py-3 text-[13px] font-semibold text-foreground">
                      {naira(inv.total)}
                    </td>
                    <td className="px-2 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase",
                          INVOICE_BADGE[inv.status] ??
                            "bg-slate-500/15 text-slate-500",
                        )}>
                        {inv.status.replace(/_/g, " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-10 text-center">
            <FileText
              size={28}
              className="mx-auto mb-3 text-muted-foreground/40"
            />
            <p className="text-[13.5px] font-semibold text-foreground">
              No invoices generated yet
            </p>
            <p className="mt-1 text-[12.5px] text-muted-foreground">
              The first invoice generates automatically on the{" "}
              {ordinal(contract.billingDay)}.
            </p>
          </div>
        )}
      </div>

      {confirmGenerate && (
        <ConfirmDialog
          title="Generate invoice now?"
          message={`Create a ${naira(contract.amount)} invoice for this contract immediately, outside the normal billing cycle.`}
          confirmLabel="Generate"
          loading={generateMut.isPending}
          onConfirm={handleGenerate}
          onClose={() => setConfirmGenerate(false)}
        />
      )}
      {confirmCancel && (
        <ConfirmDialog
          title="Cancel contract?"
          message="No further invoices will be generated. Existing invoices are unaffected. This cannot be undone."
          confirmLabel="Cancel Contract"
          loading={cancelMut.isPending}
          onConfirm={handleCancel}
          onClose={() => setConfirmCancel(false)}
        />
      )}
    </div>
  );
}
