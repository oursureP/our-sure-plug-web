/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/app/stores/auth.store";
import { getRedirectPath } from "@/app/lib/auth-redirect";
import { Role } from "@/app/interfaces";

export function RoleGuard({
  allow,
  children,
}: {
  allow: Role[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Not logged in → middleware should have caught this, but double-check
    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }
    // Logged in but wrong role → send to their correct home
    if (!allow.includes(user.role)) {
      router.replace(getRedirectPath(user.role));
      return;
    }
    setChecked(true);
  }, [isAuthenticated, user, allow, router]);

  // While checking, show a loader (prevents flash of wrong content)
  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
