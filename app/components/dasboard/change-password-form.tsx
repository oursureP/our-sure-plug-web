"use client";

import { useState } from "react";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import api from "@/app/lib/api";

function resolveMessage(message: unknown): string {
  if (Array.isArray(message))
    return String(message[0] ?? "Something went wrong");
  if (typeof message === "string") return message;
  return "Something went wrong. Please try again.";
}

export function ChangePasswordForm() {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });

  const update = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.currentPassword || !form.newPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (form.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (form.newPassword !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.patch("/auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success("Password changed successfully");
      setForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: unknown }>;
      toast.error(resolveMessage(axiosError.response?.data?.message));
    } finally {
      setLoading(false);
    }
  };

  const wrap =
    "flex items-center gap-2.5 rounded-lg border border-border bg-background px-3.5 transition-colors focus-within:border-primary";
  const el =
    "w-full bg-transparent py-2.5 text-[13.5px] text-foreground outline-none placeholder:text-muted-foreground";

  return (
    <div className="max-w-md space-y-4">
      <div>
        <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
          Current Password
        </label>
        <div className={wrap}>
          <Lock size={16} className="text-muted-foreground" />
          <input
            type={show ? "text" : "password"}
            value={form.currentPassword}
            onChange={(e) => update("currentPassword", e.target.value)}
            className={el}
            placeholder="••••••••"
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
          New Password
        </label>
        <div className={wrap}>
          <Lock size={16} className="text-muted-foreground" />
          <input
            type={show ? "text" : "password"}
            value={form.newPassword}
            onChange={(e) => update("newPassword", e.target.value)}
            className={el}
            placeholder="At least 6 characters"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="text-muted-foreground hover:text-foreground">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
          Confirm New Password
        </label>
        <div className={wrap}>
          <Lock size={16} className="text-muted-foreground" />
          <input
            type={show ? "text" : "password"}
            value={form.confirm}
            onChange={(e) => update("confirm", e.target.value)}
            className={el}
            placeholder="Re-enter new password"
          />
        </div>
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-60">
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Updating...
          </>
        ) : (
          "Update Password"
        )}
      </button>
    </div>
  );
}
