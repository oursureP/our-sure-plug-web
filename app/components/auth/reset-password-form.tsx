"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { authApi } from "@/app/lib/api/auth.api";

function resolveMessage(message: unknown): string {
  if (Array.isArray(message))
    return String(message[0] ?? "Something went wrong");
  if (typeof message === "string") return message;
  return "Something went wrong. Please try again.";
}

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ password: "", confirm: "" });

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  // No token in URL — invalid link
  if (!token) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle size={34} className="text-destructive" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-foreground">
          Invalid reset link
        </h3>
        <p className="mb-6 text-[13.5px] leading-relaxed text-muted-foreground">
          This password reset link is invalid or has expired. Please request a
          new one.
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
          Request new link <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.password || !form.confirm) {
      toast.error("Please fill in both fields");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.resetPassword(token, form.password);
      toast.success(res?.message ?? "Password reset successful");
      router.push("/login");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: unknown }>;
      toast.error(resolveMessage(axiosError.response?.data?.message));
      setLoading(false);
    }
  };

  const inputWrap =
    "flex items-center gap-2.5 rounded-xl border border-border bg-background px-3.5 transition-colors focus-within:border-primary";
  const inputEl =
    "w-full bg-transparent py-3 text-[14px] text-foreground outline-none placeholder:text-muted-foreground";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* New password */}
      <div>
        <label className="mb-1.5 block text-[13px] font-semibold text-foreground">
          New Password
        </label>
        <div className={inputWrap}>
          <Lock size={17} className="text-muted-foreground" />
          <input
            type={show ? "text" : "password"}
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            className={inputEl}
            placeholder="At least 6 characters"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label={show ? "Hide password" : "Show password"}>
            {show ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </div>

      {/* Confirm */}
      <div>
        <label className="mb-1.5 block text-[13px] font-semibold text-foreground">
          Confirm Password
        </label>
        <div className={inputWrap}>
          <Lock size={17} className="text-muted-foreground" />
          <input
            type={show ? "text" : "password"}
            value={form.confirm}
            onChange={(e) => update("confirm", e.target.value)}
            className={inputEl}
            placeholder="Re-enter your password"
            autoComplete="new-password"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-60">
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Resetting...
          </>
        ) : (
          <>
            Reset Password <ArrowRight size={16} />
          </>
        )}
      </button>

      <Link
        href="/login"
        className="flex cursor-pointer items-center justify-center gap-1.5 text-[13px] font-semibold text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft size={14} /> Back to login
      </Link>
    </form>
  );
}
