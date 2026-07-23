"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { authApi } from "@/app/lib/api/auth.api";
import { useAuthStore } from "@/app/stores/auth.store";
import { getRedirectPath } from "@/app/lib/auth-redirect";
import { usersApi } from "@/app/lib/api/users.api";

function resolveMessage(message: unknown): string {
  if (Array.isArray(message)) return String(message[0] ?? "Login failed");
  if (typeof message === "string") return message;
  return "Login failed. Please try again.";
}

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const setUser = useAuthStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please enter your email and password");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.login(form.email, form.password);
      setAuth(res.user, res.token);
      try {
        const fullProfile = await usersApi.getProfile();
        setUser(fullProfile);
      } catch {
        console.log("error");
        setLoading(false);
      }
      toast.success("Welcome back!");
      router.push(getRedirectPath(res.user.role));
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
      {/* Email */}
      <div>
        <label className="mb-1.5 block text-[13px] font-semibold text-foreground">
          Email
        </label>
        <div className={inputWrap}>
          <Mail size={17} className="text-muted-foreground" />
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputEl}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-[13px] font-semibold text-foreground">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-[12px] font-semibold text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className={inputWrap}>
          <Lock size={17} className="text-muted-foreground" />
          <input
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            className={inputEl}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-60">
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Signing in...
          </>
        ) : (
          <>
            Sign In <ArrowRight size={16} />
          </>
        )}
      </button>
    </form>
  );
}
