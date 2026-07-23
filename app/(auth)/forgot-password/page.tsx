import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/app/components/auth/forgot-password-form";
import { AuthBrandPanel } from "@/app/components/auth/auth-brand-panel";

export const metadata: Metadata = {
  title: "Forgot Password | OurSurePlug",
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthBrandPanel
        title="Forgot your password?"
        subtitle="No worries — it happens. Enter your email and we'll send you a link to reset it."
      />
      <div className="flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md s-card p-2 bg-card rounded-2xl border border-primary">
          <div className="mb-8">
            <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-foreground">
              Reset password
            </h2>
            <p className="text-[13.5px] text-muted-foreground">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
