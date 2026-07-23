"use client";

import { useState } from "react";
import { GraduationCap, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { CoursesTab } from "@/app/components/courses/courses-tab";
import { SessionsTab } from "@/app/components/courses/sessions-tab";

type Tab = "courses" | "sessions";

export default function CoursesPage() {
  const [tab, setTab] = useState<Tab>("courses");

  const tabs: { key: Tab; label: string; icon: typeof GraduationCap }[] = [
    { key: "courses", label: "Courses", icon: GraduationCap },
    { key: "sessions", label: "Sessions", icon: CalendarDays },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          Courses & Sessions
        </h1>
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          Manage your training courses and their scheduled sessions.
        </p>
      </div>

      {/* Top-level tabs */}
      <div className="mb-6 flex gap-1 border-b border-border bg-card px-1 w-max rounded-lg">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex items-center gap-2 border-b-2 px-4 py-2.5 text-[13.5px] font-semibold transition-colors",
              tab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}>
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "courses" && <CoursesTab />}
      {tab === "sessions" && <SessionsTab />}
    </div>
  );
}
