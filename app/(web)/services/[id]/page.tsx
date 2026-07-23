import type { Metadata } from "next";
import { serverFetch } from "@/app/lib/api/server";
import { Service } from "@/app/interfaces/lms.interface";
import { ServiceDetailClient } from "@/app/components/web/service-detail-client";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ id: string }>;
}

const fallbackService: Service = {
  id: "preview",
  name: "Web Development",
  description:
    "Responsive, lightning-fast websites and web apps that turn visitors into loyal customers. We build with modern tools for speed, scale and results.",
  isActive: true,
  createdAt: "",
  updatedAt: "",
  _count: { courses: 3 },
  courses: [
    {
      id: "c1",
      title: "HTML, CSS & JavaScript Foundations",
      price: "85000",
      courseType: "PHYSICAL",
      isPublished: true,
      _count: { enrollments: 18 },
    },
    {
      id: "c2",
      title: "React & Next.js Mastery",
      price: "150000",
      courseType: "ONLINE",
      isPublished: true,
      _count: { enrollments: 24 },
    },
    {
      id: "c3",
      title: "Full-Stack with Node.js",
      price: "180000",
      courseType: "PHYSICAL",
      isPublished: true,
      _count: { enrollments: 12 },
    },
  ],
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const service = await serverFetch<Service>(`/services/${id}`, {
    revalidate: 300,
  });
  if (!service) return { title: "Service | OurSurePlug" };
  return {
    title: `${service.name} | OurSurePlug`,
    description:
      service.tagline ??
      service.description ??
      `Learn more about ${service.name} at OurSurePlug.`,
    openGraph: {
      title: service.name,
      description: service.tagline ?? service.description ?? "",
      images: service.image ? [{ url: service.image }] : [],
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const fetched = await serverFetch<Service>(`/services/${id}`, {
    revalidate: 300,
  });
  const service = fetched ?? fallbackService;

  return <ServiceDetailClient service={service} />;
}
