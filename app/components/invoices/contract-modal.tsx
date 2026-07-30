"use client";

import { useState } from "react";
import { X, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useCreateContract } from "@/app/hooks/use-contracts";
import { useClients } from "@/app/hooks/use-clients";
import { useProjects } from "@/app/hooks/use-projects";

function resolveMessage(m: unknown): string {
  if (Array.isArray(m)) return String(m[0] ?? "Something went wrong");
  if (typeof m === "string") return m;
  return "Something went wrong. Please try again.";
}

export function ContractModal({ onClose }: { onClose: () => void }) {
  const createMut = useCreateContract();
  const { data: clients } = useClients();
  const { data: projects } = useProjects();

  const [form, setForm] = useState({
    title: "",
    description: "",
    amount: "",
    billingDay: "1",
    startDate: "",
    endDate: "",
    clientId: "",
    projectId: "",
  });

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  // only projects belonging to the chosen client
  const clientProjects = (projects ?? []).filter(
    (p) => p.clientId === form.clientId,
  );

  const save = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.clientId) {
      toast.error("Select a client");
      return;
    }
    if (!form.amount || Number(form.amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    const day = Number(form.billingDay);
    if (!day || day < 1 || day > 28) {
      toast.error("Billing day must be between 1 and 28");
      return;
    }
    if (!form.startDate) {
      toast.error("Start date is required");
      return;
    }
    if (form.endDate && new Date(form.endDate) < new Date(form.startDate)) {
      toast.error("End date cannot be before the start date");
      return;
    }

    try {
      await createMut.mutateAsync({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        amount: Number(form.amount),
        billingDay: day,
        startDate: new Date(form.startDate).toISOString(),
        endDate: form.endDate
          ? new Date(form.endDate).toISOString()
          : undefined,
        clientId: form.clientId,
        projectId: form.projectId || undefined,
      });
      toast.success("Contract created");
      onClose();
    } catch (error) {
      toast.error(
        resolveMessage(
          (error as AxiosError<{ message?: unknown }>).response?.data?.message,
        ),
      );
    }
  };

  const input =
    "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-[13.5px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";
  const label = "mb-1.5 block text-[12.5px] font-semibold text-foreground";

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
      onClick={() => !createMut.isPending && onClose()}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-popover shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-popover px-6 py-4">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-foreground">
              New Contract
            </h3>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              Invoices generate automatically each month.
            </p>
          </div>
          <button
            onClick={() => !createMut.isPending && onClose()}
            className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div>
            <label className={label}>Title *</label>
            <input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className={input}
              placeholder="e.g. Website maintenance retainer"
              autoFocus
            />
          </div>

          <div>
            <label className={label}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={2}
              className={`${input} resize-none`}
              placeholder="What this retainer covers..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Client *</label>
              <select
                value={form.clientId}
                onChange={(e) => {
                  update("clientId", e.target.value);
                  update("projectId", "");
                }}
                className={input}>
                <option value="">Select client...</option>
                {(clients ?? []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company ??
                      (c.user
                        ? `${c.user.firstName} ${c.user.lastName}`
                        : "Unknown")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Project</label>
              <select
                value={form.projectId}
                onChange={(e) => update("projectId", e.target.value)}
                className={input}
                disabled={!form.clientId}>
                <option value="">None</option>
                {clientProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Monthly Amount (₦) *</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => update("amount", e.target.value)}
                className={input}
                placeholder="150000"
              />
            </div>
            <div>
              <label className={label}>Billing Day *</label>
              <input
                type="number"
                min={1}
                max={28}
                value={form.billingDay}
                onChange={(e) => update("billingDay", e.target.value)}
                className={input}
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Day of month (1–28)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Start Date *</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => update("startDate", e.target.value)}
                className={input}
              />
            </div>
            <div>
              <label className={label}>End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => update("endDate", e.target.value)}
                className={input}
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Leave blank for ongoing
              </p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-border bg-popover px-6 py-4">
          <button
            onClick={() => !createMut.isPending && onClose()}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-foreground/4">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={createMut.isPending}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60">
            {createMut.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={16} /> Create Contract
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
