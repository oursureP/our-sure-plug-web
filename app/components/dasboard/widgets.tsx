"use client";

import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  tone?: "default" | "positive" | "negative";
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 dark:bg-[#161427]">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/13 text-primary">
        <Icon size={20} />
      </div>
      <div className="text-2xl font-extrabold tracking-tight text-foreground">
        {value}
      </div>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-[12.5px] text-muted-foreground">{label}</span>
        {change && (
          <span
            className={cn(
              "text-[11px] font-semibold",
              tone === "positive" && "text-green-600 dark:text-green-400",
              tone === "negative" && "text-destructive",
              tone === "default" && "text-primary",
            )}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

export function Card({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 dark:bg-[#161427]">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-foreground">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border py-8 text-center text-[13px] text-muted-foreground">
      {text}
    </div>
  );
}

export function naira(n: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
}
