import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/app/components/auth/reset-password-form";
import { AuthBrandPanel } from "@/app/components/auth/auth-brand-panel";

export const metadata: Metadata = {
  title: "Reset Password | OurSurePlug",
  robots: { index: false },
};

export default function ResetPasswordPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthBrandPanel
        title="Set a new password"
        subtitle="Choose a strong password to keep your account secure. You'll be signed in right after."
      />
      <div className="flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md p-2 s-card bg-card rounded-2xl border border-primary">
          <div className="mb-8">
            <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-foreground">
              New password
            </h2>
            <p className="text-[13.5px] text-muted-foreground">
              Enter and confirm your new password below.
            </p>
          </div>
          <Suspense
            fallback={
              <div className="text-sm text-muted-foreground">Loading...</div>
            }>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
