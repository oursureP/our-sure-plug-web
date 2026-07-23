import type { Metadata } from "next";
import { LoginForm } from "@/app/components/auth/login-form";
import { AuthBrandPanel } from "@/app/components/auth/auth-brand-panel";

export const metadata: Metadata = {
  title: "Login | OurSurePlug",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthBrandPanel
        title="Welcome back to OurSurePlug"
        subtitle="Sign in to manage your projects, track progress, access your courses and stay connected with your team."
      />

      <div className="flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md p-2 s-card bg-card rounded-2xl border border-primary">
          <div className="mb-8">
            <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-foreground">
              Sign in
            </h2>
            <p className="text-[13.5px] text-muted-foreground">
              Enter your credentials to access your account.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
    // <div className="flex min-h-screen items-center justify-center px-4 py-20">

    //   <div
    //     aria-hidden
    //     className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full opacity-30"
    //     style={{
    //       background:
    //         "radial-gradient(circle, color-mix(in oklch, var(--primary) 22%, transparent), transparent 70%)",
    //     }}
    //   />

    //   <div className="relative w-full max-w-md">
    //     <div className="rounded-3xl border border-border bg-card p-8 shadow-xl shadow-black/5 dark:bg-[#161427] dark:shadow-none sm:p-10">
    //       <div className="mb-8 text-center">
    //         <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-foreground">
    //           Welcome back
    //         </h1>
    //         <p className="text-[13.5px] text-muted-foreground">
    //           Sign in to your OurSurePlug account
    //         </p>
    //       </div>
    //       <LoginForm />
    //     </div>
    //   </div>
    // </div>
  );
}
