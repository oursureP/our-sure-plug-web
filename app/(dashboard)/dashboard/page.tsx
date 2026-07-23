"use client";

import { CeoView } from "@/app/components/dasboard/views/ceo-view";
import { MarketingView } from "@/app/components/dasboard/views/marketing-view";
import { OperationsView } from "@/app/components/dasboard/views/operations-view";
import { StaffView } from "@/app/components/dasboard/views/staff-view";
import { useAuthStore } from "@/app/stores/auth.store";

export default function DashboardOverview() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          Welcome back, {user.firstName}
        </h1>
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          Your business at a glance.
        </p>
      </div>

      {user.role === "CEO" && <CeoView />}
      {user.role === "HEAD_OF_OPERATIONS" && <OperationsView />}
      {user.role === "DEPARTMENT_HEAD" && <MarketingView />}
      {(user.role === "STAFF" || user.role === "TRAINER") && <StaffView />}
      {/* <CeoView /> */}
    </div>
  );
}
