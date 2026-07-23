"use client";

import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useService } from "@/app/hooks/use-services";
import { ServiceForm } from "@/app/components/services/service-form";

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>();
  const { data: service, isLoading } = useService(id);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }
  if (!service) {
    return (
      <div className="py-20 text-center text-foreground">
        Service not found.
      </div>
    );
  }

  return <ServiceForm service={service} />;
}
