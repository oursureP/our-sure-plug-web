import type { Metadata } from "next";
import { serverFetch } from "@/app/lib/api/server";
import { Service } from "@/app/interfaces/lms.interface";
import { ServiceDetailClient } from "@/app/components/web/service-detail-client";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await serverFetch<Service>(`/services/slug/${slug}`, {
    revalidate: 300,
  });
  if (!service) return { title: "Service | OurSurePlug" };
  return {
    title: `${service.name} | OurSurePlug`,
    description: service.tagline ?? service.description ?? "",
    openGraph: {
      title: service.name,
      description: service.tagline ?? "",
      images: service.image ? [{ url: service.image }] : [],
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = await serverFetch<Service>(`/services/slug/${slug}`, {
    revalidate: 300,
  });
  return <ServiceDetailClient service={service} />;
}
