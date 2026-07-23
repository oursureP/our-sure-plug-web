import { ThemeToggle } from "@/app/components/web/theme-toggle";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Top bar — just logo + theme toggle */}
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-primary text-[14px] font-extrabold tracking-tight text-primary-foreground">
            OS
          </div>
          <span className="text-[15px] font-bold tracking-tight text-foreground">
            Our<span className="text-primary">Sure</span>Plug
          </span>
        </Link>
        <ThemeToggle />
      </div>
      {children}
    </div>
  );
}
