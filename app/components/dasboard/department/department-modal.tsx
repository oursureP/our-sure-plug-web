"use client";

import { useState } from "react";
import { X, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  useCreateDepartment,
  useUpdateDepartment,
} from "@/app/hooks/use-departments";
import { Department } from "@/app/interfaces/department.interface";

function resolveMessage(message: unknown): string {
  if (Array.isArray(message))
    return String(message[0] ?? "Something went wrong");
  if (typeof message === "string") return message;
  return "Something went wrong. Please try again.";
}

export function DepartmentModal({
  department,
  onClose,
}: {
  department?: Department | null; // present = edit mode
  onClose: () => void;
}) {
  const isEdit = !!department;
  const createMut = useCreateDepartment();
  const updateMut = useUpdateDepartment();
  const saving = createMut.isPending || updateMut.isPending;

  const [form, setForm] = useState({
    name: department?.name ?? "",
    description: department?.description ?? "",
  });

  const update = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Department name is required");
      return;
    }
    try {
      if (isEdit && department) {
        await updateMut.mutateAsync({
          id: department.id,
          payload: {
            name: form.name,
            description: form.description || undefined,
          },
        });
        toast.success("Department updated");
      } else {
        await createMut.mutateAsync({
          name: form.name,
          description: form.description || undefined,
        });
        toast.success("Department created");
      }
      onClose();
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: unknown }>;
      toast.error(resolveMessage(axiosError.response?.data?.message));
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-[13.5px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
      onClick={() => !saving && onClose()}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-popover shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            {isEdit ? "Edit Department" : "New Department"}
          </h3>
          <button
            onClick={() => !saving && onClose()}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div>
            <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
              Name *
            </label>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className={inputClass}
              placeholder="e.g. Web Development"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="What this department does..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
          <button
            onClick={() => !saving && onClose()}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/4">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-60">
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
