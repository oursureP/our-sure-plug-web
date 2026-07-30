"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Send,
  Printer,
  CheckCircle2,
  //   XCircle,
  Ban,
  Building2,
  Mail,
  FileText,
  ShieldCheck,
  ExternalLink,
  Receipt,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";
import {
  useInvoice,
  useSendInvoice,
  useUpdateInvoice,
  useVerifyProof,
} from "@/app/hooks/use-invoices";
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
    maximumFractionDigits: 2,
  }).format(Number(n));
}
function fmtDate(d?: string | null) {
  return d
    ? new Date(d).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
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

export default function SingleInvoicePage() {
  const { id } = useParams<{ id: string }>();
  const { data: invoice, isLoading } = useInvoice(id);
  const sendMut = useSendInvoice();
  const updateMut = useUpdateInvoice();
  const verifyMut = useVerifyProof();

  const [confirmSend, setConfirmSend] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmVerify, setConfirmVerify] = useState(false);

  if (isLoading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  if (!invoice)
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-bold text-foreground">Invoice not found</p>
        <Link
          href="/dashboard/invoices"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft size={15} /> Back to invoices
        </Link>
      </div>
    );

  const err = (e: unknown) =>
    toast.error(
      resolveMessage(
        (e as AxiosError<{ message?: unknown }>).response?.data?.message,
      ),
    );
  const u = invoice.client?.user;
  const isBankTransfer = invoice.paymentMethod === "BANK_TRANSFER";
  const canEdit = invoice.status !== "PAID" && invoice.status !== "CANCELLED";

  const handleSend = async () => {
    try {
      await sendMut.mutateAsync(invoice.id);
      toast.success("Invoice sent");
      setConfirmSend(false);
    } catch (e) {
      err(e);
    }
  };
  const handleCancel = async () => {
    try {
      await updateMut.mutateAsync({
        id: invoice.id,
        payload: { status: "CANCELLED" },
      });
      toast.success("Invoice cancelled");
      setConfirmCancel(false);
    } catch (e) {
      err(e);
    }
  };
  const handleMarkPaid = async () => {
    try {
      await updateMut.mutateAsync({
        id: invoice.id,
        payload: { status: "PAID" },
      });
      toast.success("Marked as paid");
    } catch (e) {
      err(e);
    }
  };
  const handleVerify = async () => {
    try {
      const res = await verifyMut.mutateAsync({ id: invoice.id });
      toast.success(res?.message ?? "Payment verified");
      setConfirmVerify(false);
    } catch (e) {
      err(e);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-center justify-between print:hidden">
        <Link
          href="/dashboard/invoices"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary">
          <ArrowLeft size={15} /> Back to invoices
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-[13px] font-semibold text-foreground hover:bg-foreground/4">
          <Printer size={14} /> Print
        </button>
      </div>

      {/* Action bar */}
      <div className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card p-3 print:hidden">
        <span
          className={cn(
            "rounded-full px-3 py-1.5 text-[11px] font-bold uppercase",
            STATUS_BADGE[invoice.status],
          )}>
          {invoice.status}
        </span>
        <div className="ml-auto flex flex-wrap gap-2">
          {invoice.status === "DRAFT" && (
            <button
              onClick={() => setConfirmSend(true)}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-bold text-primary-foreground hover:opacity-90">
              <Send size={14} /> Send to Client
            </button>
          )}
          {/* {isBankTransfer &&
            invoice.status !== "PAID" &&
            invoice.status !== "CANCELLED" && (
              <button
                onClick={() => setConfirmVerify(true)}
                className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-[13px] font-bold text-white hover:opacity-90">
                <ShieldCheck size={14} /> Verify Payment
              </button>
            )} */}

          {isBankTransfer &&
            invoice.status !== "PAID" &&
            invoice.status !== "CANCELLED" &&
            (invoice.proofOfPayment ? (
              <button
                onClick={() => setConfirmVerify(true)}
                className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-[13px] font-bold text-white hover:opacity-90">
                <ShieldCheck size={14} /> Verify Payment
              </button>
            ) : (
              <span className="rounded-lg border border-dashed border-border px-4 py-2 text-[12.5px] text-muted-foreground">
                Awaiting client&apos;s proof of payment
              </span>
            ))}
          {!isBankTransfer &&
            (invoice.status === "SENT" || invoice.status === "OVERDUE") && (
              <button
                onClick={handleMarkPaid}
                disabled={updateMut.isPending}
                className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-[13px] font-bold text-white hover:opacity-90 disabled:opacity-60">
                <CheckCircle2 size={14} /> Mark Paid
              </button>
            )}
          {canEdit && (
            <button
              onClick={() => setConfirmCancel(true)}
              className="flex items-center gap-1.5 rounded-lg border border-destructive/30 px-4 py-2 text-[13px] font-semibold text-destructive hover:bg-destructive/10">
              <Ban size={14} /> Cancel
            </button>
          )}
        </div>
        {/* Proof of payment — bank transfers only */}
        {isBankTransfer && invoice.proofOfPayment && (
          <div className="mb-6 rounded-2xl border border-border bg-card p-5 print:hidden">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/13 text-primary">
                  <Receipt size={17} />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-foreground">
                    Proof of Payment
                  </h3>
                  <p className="text-[12px] text-muted-foreground">
                    Uploaded {fmtDate(invoice.proofOfPayment.createdAt)}
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase",
                  invoice.proofOfPayment.isVerified
                    ? "bg-green-500/15 text-green-600 dark:text-green-400"
                    : "bg-amber-500/15 text-amber-600 dark:text-amber-400",
                )}>
                {invoice.proofOfPayment.isVerified
                  ? "Verified"
                  : "Awaiting verification"}
              </span>
            </div>

            {/* The document itself */}
            <ProofPreview url={invoice.proofOfPayment.fileUrl} />

            {invoice.proofOfPayment.notes && (
              <p className="mt-3 rounded-lg bg-muted/40 px-3 py-2 text-[12.5px] text-muted-foreground">
                <span className="font-semibold text-foreground">Note:</span>{" "}
                {invoice.proofOfPayment.notes}
              </p>
            )}

            {invoice.proofOfPayment.isVerified &&
              invoice.proofOfPayment.verifiedAt && (
                <p className="mt-3 text-[12px] text-muted-foreground">
                  Verified {fmtDate(invoice.proofOfPayment.verifiedAt)}
                </p>
              )}
          </div>
        )}
      </div>

      {/* Invoice document */}
      <div className="rounded-2xl border border-border bg-card p-8 print:border-0 print:shadow-none sm:p-10">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-1 text-2xl font-extrabold tracking-tight text-foreground">
              OurSurePlug
            </div>
            <p className="text-[12px] text-muted-foreground">
              No 7 Road E, Kingscourt Estate,
              <br />
              Elelenwo, Port Harcourt, Rivers State
            </p>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              Invoice
            </div>
            <div className="text-lg font-extrabold text-foreground">
              {invoice.invoiceNo}
            </div>
            <span
              className={cn(
                "mt-1 inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase",
                STATUS_BADGE[invoice.status],
              )}>
              {invoice.status}
            </span>
          </div>
        </div>

        {/* Bill to + meta */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2">
          <div>
            <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              Bill To
            </div>
            <div className="text-[14px] font-bold text-foreground">
              {u ? `${u.firstName} ${u.lastName}` : "—"}
            </div>
            {invoice.client?.company && (
              <div className="flex items-center gap-1 text-[12.5px] text-muted-foreground">
                <Building2 size={11} /> {invoice.client.company}
              </div>
            )}
            {u?.email && (
              <div className="flex items-center gap-1 text-[12.5px] text-muted-foreground">
                <Mail size={11} /> {u.email}
              </div>
            )}
          </div>
          <div className="sm:text-right">
            <div className="mb-1 text-[12.5px]">
              <span className="text-muted-foreground">Issue Date: </span>
              <span className="font-semibold text-foreground">
                {fmtDate(invoice.createdAt)}
              </span>
            </div>
            <div className="mb-1 text-[12.5px]">
              <span className="text-muted-foreground">Due Date: </span>
              <span className="font-semibold text-foreground">
                {fmtDate(invoice.dueDate)}
              </span>
            </div>
            {invoice.serviceType && (
              <div className="mb-1 text-[12.5px]">
                <span className="text-muted-foreground">Service: </span>
                <span className="font-semibold text-foreground">
                  {invoice.serviceType}
                </span>
              </div>
            )}
            <div className="text-[12.5px]">
              <span className="text-muted-foreground">Payment: </span>
              <span className="font-semibold text-foreground">
                {invoice.paymentMethod === "BANK_TRANSFER"
                  ? "Bank Transfer"
                  : "Online"}
              </span>
            </div>
          </div>
        </div>

        {invoice.project && (
          <div className="mb-6 rounded-lg bg-muted/40 px-3 py-2 text-[12.5px] text-muted-foreground">
            Project:{" "}
            <Link
              href={`/dashboard/projects/${invoice.project.id}`}
              className="font-semibold text-primary hover:underline">
              {invoice.project.title}
            </Link>
          </div>
        )}

        {/* Line items */}
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left">
                <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  Description
                </th>
                <th className="px-4 py-2.5 text-right text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  Qty
                </th>
                <th className="px-4 py-2.5 text-right text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  Unit Price
                </th>
                <th className="px-4 py-2.5 text-right text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {(invoice.items ?? []).map((it) => (
                <tr
                  key={it.id}
                  className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-[13px] text-foreground">
                    {it.description}
                  </td>
                  <td className="px-4 py-3 text-right text-[13px] text-muted-foreground">
                    {it.quantity}
                  </td>
                  <td className="px-4 py-3 text-right text-[13px] text-muted-foreground">
                    {naira(it.unitPrice)}
                  </td>
                  <td className="px-4 py-3 text-right text-[13px] font-semibold text-foreground">
                    {naira(it.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-5 flex justify-end">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between text-[13px]">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-foreground">
                {naira(invoice.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-muted-foreground">
                Tax ({Number(invoice.tax)}%)
              </span>
              <span className="font-semibold text-foreground">
                {naira((Number(invoice.subtotal) * Number(invoice.tax)) / 100)}
              </span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-[16px]">
              <span className="font-bold text-foreground">Total</span>
              <span className="font-extrabold text-primary">
                {naira(invoice.total)}
              </span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-8 border-t border-border pt-4">
            <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              Notes
            </div>
            <p className="text-[13px] leading-relaxed text-muted-foreground whitespace-pre-line">
              {invoice.notes}
            </p>
          </div>
        )}

        <div className="mt-8 border-t border-border pt-4 text-center text-[11.5px] text-muted-foreground">
          Thank you for your business.
        </div>
      </div>

      {confirmSend && (
        <ConfirmDialog
          title="Send invoice?"
          message={`Send ${invoice.invoiceNo} to the client? They'll be notified by email.`}
          confirmLabel="Send"
          loading={sendMut.isPending}
          onConfirm={handleSend}
          onClose={() => setConfirmSend(false)}
        />
      )}
      {confirmCancel && (
        <ConfirmDialog
          title="Cancel invoice?"
          message={`Cancel ${invoice.invoiceNo}? This cannot be undone.`}
          confirmLabel="Cancel Invoice"
          loading={updateMut.isPending}
          onConfirm={handleCancel}
          onClose={() => setConfirmCancel(false)}
        />
      )}
      {confirmVerify && (
        <ConfirmDialog
          title="Verify payment?"
          message="Confirm you've verified the client's proof of payment. This marks the invoice as PAID."
          confirmLabel="Verify & Mark Paid"
          loading={verifyMut.isPending}
          onConfirm={handleVerify}
          onClose={() => setConfirmVerify(false)}
        />
      )}
    </div>
  );
}

function ProofPreview({ url }: { url: string }) {
  const isPdf = url.toLowerCase().includes(".pdf");

  if (isPdf) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between rounded-xl border border-border p-4 transition-colors hover:border-primary/50">
        <span className="flex items-center gap-3 text-[13.5px] font-semibold text-foreground">
          <FileText size={18} className="text-primary" /> View payment receipt
          (PDF)
        </span>
        <ExternalLink size={15} className="text-muted-foreground" />
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block">
      <div className="relative h-72 w-full overflow-hidden rounded-xl border border-border bg-muted">
        <Image
          src={url}
          alt="Proof of payment"
          fill
          className="object-contain"
          unoptimized
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
          <span className="rounded-lg bg-background/90 px-3 py-1.5 text-[12px] font-semibold text-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            Open full size
          </span>
        </div>
      </div>
    </a>
  );
}
