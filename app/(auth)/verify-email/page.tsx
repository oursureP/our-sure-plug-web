import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmailClient } from "@/app/components/auth/verify-email-client";
import { AuthBrandPanel } from "@/app/components/auth/auth-brand-panel";

export const metadata: Metadata = {
  title: "Verify Email | OurSurePlug",
  robots: { index: false },
};

export default function VerifyEmailPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthBrandPanel
        title="Verify your email"
        subtitle="We're confirming your email address to activate your account."
      />
      <div className="flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-sm">
          <Suspense
            fallback={
              <div className="text-sm text-muted-foreground">Loading...</div>
            }>
            <VerifyEmailClient />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
