"use client";

import { useState } from "react";
import { X, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Lead } from "@/app/interfaces/lead";
import { useCreateLead, useUpdateLead } from "@/app/hooks/use-leads";
import { useUsers } from "@/app/hooks/use-users";

function resolveMessage(m: unknown): string {
  if (Array.isArray(m)) return String(m[0] ?? "Something went wrong");
  if (typeof m === "string") return m;
  return "Something went wrong. Please try again.";
}

export function LeadModal({
  lead,
  onClose,
}: {
  lead?: Lead | null;
  onClose: () => void;
}) {
  const isEdit = !!lead;
  const createMut = useCreateLead();
  const updateMut = useUpdateLead();
  const saving = createMut.isPending || updateMut.isPending;

  const { data: users } = useUsers();
  const staff = (users ?? []).filter((u) => u.role !== "CLIENT");

  const [form, setForm] = useState({
    firstName: lead?.firstName ?? "",
    lastName: lead?.lastName ?? "",
    email: lead?.email ?? "",
    phone: lead?.phone ?? "",
    company: lead?.company ?? "",
    source: lead?.source ?? "",
    estimatedValue:
      lead?.estimatedValue != null ? String(lead.estimatedValue) : "",
    notes: lead?.notes ?? "",
    assignedToId: lead?.assignedToId ?? "",
  });
  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error("First and last name are required");
      return;
    }
    if (!isEdit && !form.assignedToId) {
      toast.error("Please assign this lead to a staff member");
      return;
    }

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email || undefined,
      phone: form.phone || undefined,
      company: form.company || undefined,
      source: form.source || undefined,
      estimatedValue: form.estimatedValue
        ? Number(form.estimatedValue)
        : undefined,
      notes: form.notes || undefined,
      assignedToId: form.assignedToId || undefined,
    };

    try {
      if (isEdit && lead) {
        await updateMut.mutateAsync({ id: lead.id, payload });
        toast.success("Lead updated");
      } else {
        await createMut.mutateAsync(payload);
        toast.success("Lead created");
      }
      onClose();
    } catch (error) {
      toast.error(
        resolveMessage(
          (error as AxiosError<{ message?: unknown }>).response?.data?.message,
        ),
      );
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-[13.5px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";
  const label = "mb-1.5 block text-[12.5px] font-semibold text-foreground";

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
      onClick={() => !saving && onClose()}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-popover shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-popover px-6 py-4">
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            {isEdit ? "Edit Lead" : "New Lead"}
          </h3>
          <button
            onClick={() => !saving && onClose()}
            className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>First Name *</label>
              <input
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                className={inputClass}
                placeholder="John"
                autoFocus
              />
            </div>
            <div>
              <label className={label}>Last Name *</label>
              <input
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                className={inputClass}
                placeholder="Doe"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={inputClass}
                placeholder="john@company.com"
              />
            </div>
            <div>
              <label className={label}>Phone</label>
              <input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={inputClass}
                placeholder="+234..."
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Company</label>
              <input
                value={form.company}
                onChange={(e) => update("company", e.target.value)}
                className={inputClass}
                placeholder="Acme Inc."
              />
            </div>
            <div>
              <label className={label}>Source</label>
              <input
                value={form.source}
                onChange={(e) => update("source", e.target.value)}
                className={inputClass}
                placeholder="Referral, Website..."
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Estimated Value (₦)</label>
              <input
                type="number"
                value={form.estimatedValue}
                onChange={(e) => update("estimatedValue", e.target.value)}
                className={inputClass}
                placeholder="500000"
              />
            </div>
            <div>
              <label className={label}>Assign To {!isEdit && "*"}</label>
              <select
                value={form.assignedToId}
                onChange={(e) => update("assignedToId", e.target.value)}
                className={inputClass}>
                <option value="">Select staff...</option>
                {staff.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.firstName} {u.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={label}>Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Any details about this lead..."
            />
          </div>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-border bg-popover px-6 py-4">
          <button
            onClick={() => !saving && onClose()}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-foreground/4">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60">
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={16} /> {isEdit ? "Update" : "Create"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
