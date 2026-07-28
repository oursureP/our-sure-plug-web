import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ServiceNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 pt-28 text-center">
      <h1 className="mb-3 text-3xl font-extrabold text-foreground">
        Service not found
      </h1>
      <p className="mb-8 max-w-md text-sm text-muted-foreground">
        The service you&apos;re looking for doesn&apos;t exist or may have been
        moved.
      </p>
      <Link
        href="/services"
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:opacity-90">
        <ArrowLeft size={16} /> Back to Services
      </Link>
    </div>
  );
}
