"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useCreateInvoice } from "@/app/hooks/use-invoices";
import { useClients } from "@/app/hooks/use-clients";

function resolveMessage(m: unknown): string {
  if (Array.isArray(m)) return String(m[0] ?? "Something went wrong");
  if (typeof m === "string") return m;
  return "Something went wrong. Please try again.";
}
function naira(n: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(n);
}

interface ItemRow {
  description: string;
  quantity: string;
  unitPrice: string;
}

export function InvoiceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preClientId = searchParams.get("clientId") ?? "";
  const createMut = useCreateInvoice();
  const { data: clients } = useClients();

  const [form, setForm] = useState({
    clientId: preClientId,
    dueDate: "",
    tax: "",
    serviceType: "",
    paymentMethod: "ONLINE" as "ONLINE" | "BANK_TRANSFER",
    notes: "",
  });
  const [items, setItems] = useState<ItemRow[]>([
    { description: "", quantity: "1", unitPrice: "" },
  ]);

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));
  const updateItem = (i: number, k: keyof ItemRow, v: string) =>
    setItems((arr) =>
      arr.map((it, idx) => (idx === i ? { ...it, [k]: v } : it)),
    );
  const addItem = () =>
    setItems((arr) => [
      ...arr,
      { description: "", quantity: "1", unitPrice: "" },
    ]);
  const removeItem = (i: number) =>
    setItems((arr) =>
      arr.length > 1 ? arr.filter((_, idx) => idx !== i) : arr,
    );

  const { subtotal, taxAmount, total } = useMemo(() => {
    const sub = items.reduce(
      (s, it) => s + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0),
      0,
    );
    const taxPct = Number(form.tax) || 0;
    const taxAmt = (sub * taxPct) / 100;
    return { subtotal: sub, taxAmount: taxAmt, total: sub + taxAmt };
  }, [items, form.tax]);

  const handleSave = async () => {
    if (!form.clientId) {
      toast.error("Please select a client");
      return;
    }
    if (!form.dueDate) {
      toast.error("Due date is required");
      return;
    }
    if (!form.serviceType.trim()) {
      toast.error("Service type is required");
      return;
    }
    const validItems = items.filter(
      (it) =>
        it.description.trim() &&
        Number(it.quantity) > 0 &&
        Number(it.unitPrice) >= 0,
    );
    if (validItems.length === 0) {
      toast.error("Add at least one valid line item");
      return;
    }

    const payload = {
      clientId: form.clientId,
      dueDate: new Date(form.dueDate).toISOString(),
      tax: form.tax ? Number(form.tax) : undefined,
      serviceType: form.serviceType,
      paymentMethod: form.paymentMethod,
      notes: form.notes || undefined,
      items: validItems.map((it) => ({
        description: it.description,
        quantity: Number(it.quantity),
        unitPrice: Number(it.unitPrice),
      })),
    };

    try {
      const inv = await createMut.mutateAsync(payload);
      toast.success("Invoice created");
      router.push(`/dashboard/invoices/${inv.id}`);
    } catch (error) {
      toast.error(
        resolveMessage(
          (error as AxiosError<{ message?: unknown }>).response?.data?.message,
        ),
      );
    }
  };

  const input =
    "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-[13.5px] text-foreground outline-none focus:border-primary";
  const label = "mb-1.5 block text-[12.5px] font-semibold text-foreground";
  const card = "rounded-2xl border border-border bg-card p-6";

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => router.push("/dashboard/invoices")}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary">
        <ArrowLeft size={15} /> Back to invoices
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          New Invoice
        </h1>
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          Create an invoice to bill a client.
        </p>
      </div>

      <div className="space-y-6">
        {/* Client & meta */}
        <div className={card}>
          <h2 className="mb-4 text-[15px] font-bold text-foreground">
            Invoice Details
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Client *</label>
              <select
                value={form.clientId}
                onChange={(e) => update("clientId", e.target.value)}
                className={input}>
                <option value="">Select client...</option>
                {(clients ?? []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.user
                      ? `${c.user.firstName} ${c.user.lastName}`
                      : c.company}{" "}
                    {c.company ? `— ${c.company}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Due Date *</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => update("dueDate", e.target.value)}
                className={input}
              />
            </div>
            <div>
              <label className={label}>Service Type *</label>
              <input
                value={form.serviceType}
                onChange={(e) => update("serviceType", e.target.value)}
                className={input}
                placeholder="e.g. Web Development"
              />
            </div>
            <div>
              <label className={label}>Payment Method *</label>
              <select
                value={form.paymentMethod}
                onChange={(e) =>
                  update(
                    "paymentMethod",
                    e.target.value as "ONLINE" | "BANK_TRANSFER",
                  )
                }
                className={input}>
                <option value="ONLINE">Online (Paystack)</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Line items */}
        <div className={card}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-foreground">
              Line Items
            </h2>
            <button
              onClick={addItem}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[12px] font-semibold text-foreground hover:bg-foreground/4">
              <Plus size={13} /> Add Item
            </button>
          </div>
          <div className="space-y-3">
            {items.map((it, i) => {
              const lineTotal =
                (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0);
              return (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_auto_auto_auto_auto] items-end gap-2">
                  <div>
                    {i === 0 && (
                      <label className="mb-1.5 block text-[11px] font-semibold text-muted-foreground">
                        Description
                      </label>
                    )}
                    <input
                      value={it.description}
                      onChange={(e) =>
                        updateItem(i, "description", e.target.value)
                      }
                      className={input}
                      placeholder="Item description"
                    />
                  </div>
                  <div className="w-20">
                    {i === 0 && (
                      <label className="mb-1.5 block text-[11px] font-semibold text-muted-foreground">
                        Qty
                      </label>
                    )}
                    <input
                      type="number"
                      min={1}
                      value={it.quantity}
                      onChange={(e) =>
                        updateItem(i, "quantity", e.target.value)
                      }
                      className={input}
                    />
                  </div>
                  <div className="w-32">
                    {i === 0 && (
                      <label className="mb-1.5 block text-[11px] font-semibold text-muted-foreground">
                        Unit Price
                      </label>
                    )}
                    <input
                      type="number"
                      min={0}
                      value={it.unitPrice}
                      onChange={(e) =>
                        updateItem(i, "unitPrice", e.target.value)
                      }
                      className={input}
                      placeholder="0"
                    />
                  </div>
                  <div className="w-28 pb-2.5 text-right text-[13px] font-semibold text-foreground">
                    {naira(lineTotal)}
                  </div>
                  <button
                    onClick={() => removeItem(i)}
                    className="pb-2.5 text-muted-foreground hover:text-destructive">
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div className="mt-5 border-t border-border pt-4">
            <div className="ml-auto max-w-xs space-y-2">
              <div className="flex justify-between text-[13px]">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-foreground">
                  {naira(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="flex items-center gap-2 text-muted-foreground">
                  Tax (%)
                  <input
                    type="number"
                    min={0}
                    value={form.tax}
                    onChange={(e) => update("tax", e.target.value)}
                    className="w-16 rounded-md border border-border bg-background px-2 py-1 text-[12px] text-foreground outline-none focus:border-primary"
                    placeholder="0"
                  />
                </span>
                <span className="font-semibold text-foreground">
                  {naira(taxAmount)}
                </span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-[15px]">
                <span className="font-bold text-foreground">Total</span>
                <span className="font-extrabold text-primary">
                  {naira(total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className={card}>
          <label className={label}>Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            rows={3}
            className={`${input} resize-none`}
            placeholder="Payment terms, bank details, or a message to the client..."
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => router.push("/dashboard/invoices")}
            className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-foreground/4">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={createMut.isPending}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60">
            {createMut.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Creating...
              </>
            ) : (
              <>
                <Save size={16} /> Create Invoice
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
