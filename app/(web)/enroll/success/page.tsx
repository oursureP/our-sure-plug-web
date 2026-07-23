"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Mail,
  ArrowRight,
  Calendar,
  Loader2,
  //   Clock,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { paymentsApi, PaymentStatusResponse } from "@/app/lib/api/payments.api";

function formatDate(d?: string | null) {
  return d
    ? new Date(d).toLocaleDateString("en-NG", {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;
}

function SuccessContent() {
  const params = useSearchParams();
  const reference = params.get("reference") ?? params.get("trxref");

  const [status, setStatus] = useState<
    "checking" | "success" | "pending" | "notfound"
  >(reference ? "checking" : "notfound");
  const [data, setData] = useState<PaymentStatusResponse | null>(null);
  const [attempts, setAttempts] = useState(0);

  const check = useCallback(async () => {
    if (!reference) {
      setStatus("notfound");
      return;
    }
    try {
      const res = await paymentsApi.getStatus(reference);
      setData(res);
      if (res.status === "SUCCESS") {
        setStatus("success");
        return true;
      }
      if (!res.found) {
        setStatus("pending");
        return false;
      } // webhook may not have created it yet
      setStatus("pending");
      return false;
    } catch {
      setStatus("pending");
      return false;
    }
  }, [reference]);

  // Poll up to ~10 times (webhook usually lands in 1-3s)
  useEffect(() => {
    if (!reference) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const run = async () => {
      const done = await check();
      if (cancelled) return;
      if (!done && attempts < 10) {
        timer = setTimeout(() => setAttempts((a) => a + 1), 2000);
      }
    };
    run();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reference, attempts, check]);

  const isOnline = data?.courseType === "ONLINE";

  // --- No reference at all ---
  if (status === "notfound") {
    return (
      <Shell>
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/15">
          <AlertCircle size={40} className="text-amber-500" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Hmm, no payment reference
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] text-muted-foreground">
          If you just paid, check your email for confirmation. Otherwise, head
          back and try again.
        </p>
        <Actions />
      </Shell>
    );
  }

  // --- Still confirming ---
  if (status === "checking" || status === "pending") {
    return (
      <Shell>
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/12">
          <Loader2 size={38} className="animate-spin text-primary" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Confirming your payment…
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          This usually takes just a few seconds. Please don&apos;t close this
          page.
        </p>
        {attempts >= 10 && (
          <p className="mx-auto mt-4 max-w-md rounded-xl border border-border bg-card p-4 text-[13px] text-muted-foreground">
            Taking longer than expected? Your payment may still be processing.
            Check your email in a few minutes — if you were charged, your
            enrollment is secured. Reference: {reference}
          </p>
        )}
        <Actions />
      </Shell>
    );
  }

  // --- Confirmed success ---
  return (
    <Shell>
      <div
        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
        style={{ background: "var(--brand-green)" }}>
        <CheckCircle2 size={40} style={{ color: "var(--brand-purple)" }} />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
        You&apos;re enrolled! 🎉
      </h1>
      <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
        Your payment is confirmed
        {data?.courseTitle ? (
          <>
            {" "}
            for{" "}
            <span className="font-semibold text-foreground">
              {data.courseTitle}
            </span>
          </>
        ) : (
          ""
        )}
        . A confirmation email is on its way.
      </p>

      <div className="mx-auto mt-8 max-w-md space-y-3 rounded-2xl border border-border bg-card p-6 text-left">
        {data?.sessionTitle && (
          <div className="flex items-start gap-3">
            <Calendar size={18} className="mt-0.5 shrink-0 text-primary" />
            <div>
              <p className="text-[13.5px] font-semibold text-foreground">
                {data.sessionTitle}
              </p>
              {data.startDate && (
                <p className="text-[12.5px] text-muted-foreground">
                  Starts {formatDate(data.startDate)}
                </p>
              )}
            </div>
          </div>
        )}
        {!isOnline && data?.venue && (
          <div className="flex items-start gap-3 border-t border-border pt-3">
            <MapPin size={18} className="mt-0.5 shrink-0 text-primary" />
            <div>
              <p className="text-[13.5px] font-semibold text-foreground">
                Venue
              </p>
              <p className="text-[12.5px] text-muted-foreground">
                {data.venue}
              </p>
            </div>
          </div>
        )}
        <div className="flex items-start gap-3 border-t border-border pt-3">
          <Mail size={18} className="mt-0.5 shrink-0 text-primary" />
          <div>
            <p className="text-[13.5px] font-semibold text-foreground">
              Check your email
            </p>
            <p className="text-[12.5px] text-muted-foreground">
              {isOnline
                ? "Your login details and next steps have been sent."
                : "Your enrollment details have been sent."}{" "}
              (Check spam too.)
            </p>
          </div>
        </div>
      </div>

      {reference && (
        <p className="mt-4 text-[11.5px] text-muted-foreground">
          Reference: {reference}
        </p>
      )}
      <Actions />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background px-5 py-28">
      <div className="w-full max-w-lg text-center">{children}</div>
    </div>
  );
}

function Actions() {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
      <Link
        href="/courses"
        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90">
        Browse more courses <ArrowRight size={15} />
      </Link>
      <Link
        href="/"
        className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-foreground/4">
        Back home
      </Link>
    </div>
  );
}

export default function EnrollSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
