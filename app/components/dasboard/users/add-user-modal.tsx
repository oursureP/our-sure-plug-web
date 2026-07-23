"use client";

import { useState } from "react";
import { X, Loader2, UserPlus, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/app/lib/api/auth.api";
import { useDepartments } from "@/app/hooks/use-departments";

function resolveMessage(message: unknown): string {
  if (Array.isArray(message))
    return String(message[0] ?? "Something went wrong");
  if (typeof message === "string") return message;
  return "Something went wrong. Please try again.";
}

export function AddUserModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const { data: departments } = useDepartments();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "Nigeria",
    state: "",
    gender: "Male",
    address: "",
    password: "",
    departmentId: "",
  });

  const mut = useMutation({
    mutationFn: () =>
      authApi.register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        country: form.country,
        state: form.state,
        gender: form.gender as "Male" | "Female",
        address: form.address,
        password: form.password,
        phone: form.phone,
        departmentId: form.departmentId || undefined,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });

  const update = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    const required = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "country",
      "state",
      "address",
      "password",
    ] as const;
    for (const field of required) {
      if (!form[field].trim()) {
        toast.error("Please fill in all required fields");
        return;
      }
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      await mut.mutateAsync();
      toast.success("User created — a verification email has been sent");
      onClose();
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: unknown }>;
      toast.error(resolveMessage(axiosError.response?.data?.message));
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-[13.5px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";
  const label = "mb-1.5 block text-[12.5px] font-semibold text-foreground";

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
      onClick={() => !mut.isPending && onClose()}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-popover shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-popover px-6 py-4">
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            Add New User
          </h3>
          <button
            onClick={() => !mut.isPending && onClose()}
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

          <div>
            <label className={label}>Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={inputClass}
              placeholder="john@example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Phone *</label>
              <input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={inputClass}
                placeholder="+234..."
              />
            </div>
            <div>
              <label className={label}>Gender *</label>
              <select
                value={form.gender}
                onChange={(e) => update("gender", e.target.value)}
                className={inputClass}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Country *</label>
              <input
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={label}>State *</label>
              <input
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
                className={inputClass}
                placeholder="Rivers"
              />
            </div>
          </div>

          <div>
            <label className={label}>Address *</label>
            <input
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={label}>Department</label>
            <select
              value={form.departmentId}
              onChange={(e) => update("departmentId", e.target.value)}
              className={inputClass}>
              <option value="">None</option>
              {(departments ?? []).map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={label}>Initial Password *</label>
            <div className="flex items-center gap-2.5 rounded-lg border border-border bg-background px-3.5 focus-within:border-primary">
              <input
                type={show ? "text" : "password"}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                className="w-full bg-transparent py-2.5 text-[13.5px] text-foreground outline-none"
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="text-muted-foreground hover:text-foreground">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="mt-1.5 text-[11.5px] text-muted-foreground">
              The user will verify their email, then can change this password.
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-border bg-popover px-6 py-4">
          <button
            onClick={() => !mut.isPending && onClose()}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-foreground/4">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={mut.isPending}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60">
            {mut.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Creating...
              </>
            ) : (
              <>
                <UserPlus size={16} /> Create User
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
