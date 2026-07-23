"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Loader2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
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

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email);
      toast.success(res?.message ?? "Reset link sent");
      setSent(true);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: unknown }>;
      toast.error(resolveMessage(axiosError.response?.data?.message));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/12">
          <CheckCircle2 size={34} className="text-primary" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-foreground">
          Check your email
        </h3>
        <p className="mb-6 text-[13.5px] leading-relaxed text-muted-foreground">
          If an account exists for{" "}
          <strong className="text-foreground">{email}</strong>, you&apos;ll
          receive a password reset link shortly.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft size={15} /> Back to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-[13px] font-semibold text-foreground">
          Email
        </label>
        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-background px-3.5 transition-colors focus-within:border-primary">
          <Mail size={17} className="text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent py-3 text-[14px] text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-60">
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Sending...
          </>
        ) : (
          <>
            Send Reset Link <ArrowRight size={16} />
          </>
        )}
      </button>

      <Link
        href="/login"
        className="flex items-center justify-center gap-1.5 text-[13px] font-semibold text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft size={14} /> Back to login
      </Link>
    </form>
  );
}
