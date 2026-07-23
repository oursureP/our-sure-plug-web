/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { authApi } from "@/app/lib/api/auth.api";

type Status = "verifying" | "success" | "error";

export function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("verifying");
  const [message, setMessage] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    if (!token) {
      setStatus("error");
      setMessage("No verification token found in the link.");
      return;
    }

    authApi
      .verifyEmail(token)
      .then((res) => {
        setStatus("success");
        setMessage(res?.message ?? "Your email has been verified.");
      })
      .catch((err) => {
        setStatus("error");
        const msg = err?.response?.data?.message;
        setMessage(
          Array.isArray(msg)
            ? msg[0]
            : typeof msg === "string"
              ? msg
              : "Verification failed or the link has expired.",
        );
      });
  }, [token]);

  if (status === "verifying") {
    return (
      <div className="text-center s-card bg-card p-3 rounded-2xl border border-border">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full  bg-primary/12">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-foreground">
          Verifying your email...
        </h2>
        <p className="text-[13.5px] text-muted-foreground">
          This will only take a moment.
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="text-center s-card bg-card p-3 rounded-2xl border border-primary">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/12 shadow-md">
          <CheckCircle2 size={34} className="text-primary" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-foreground">
          Email verified!
        </h2>
        <p className="mb-6 text-[13.5px] leading-relaxed text-muted-foreground">
          {message}
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:opacity-90">
          Continue to login <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center s-card bg-card p-3 rounded-2xl border border-primary">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 shadow-md  ">
        <AlertCircle size={34} className="text-destructive" />
      </div>
      <h2 className="mb-2 text-xl font-bold text-foreground">
        Verification failed
      </h2>
      <p className="mb-6 text-[13.5px] leading-relaxed text-muted-foreground">
        {message}
      </p>
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
        Go to login <ArrowRight size={15} />
      </Link>
    </div>
  );
}
