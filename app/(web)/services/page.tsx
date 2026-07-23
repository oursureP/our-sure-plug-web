import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, GraduationCap } from "lucide-react";
import { Service } from "@/app/interfaces/lms.interface";
import { serverFetch } from "@/app/lib/api/server";

export const revalidate = 300; // ISR: regenerate every 5 minutes

export const metadata: Metadata = {
  title: "Our Services | OurSurePlug",
  description:
    "Web development, AI integration, social media management, digital marketing, graphics design and business automation — everything your brand needs to grow online.",
  openGraph: {
    title: "Our Services | OurSurePlug",
    description:
      "Everything your brand needs to grow online — design, technology and strategy under one roof.",
    type: "website",
  },
};

const fallbackServices: Service[] = [
  {
    id: "fb1",
    name: "Web Development",
    description:
      "Responsive, lightning-fast websites and web apps that turn visitors into loyal customers.",
    isActive: true,
    createdAt: "",
    updatedAt: "",
    _count: { courses: 4 },
  },
  {
    id: "fb2",
    name: "AI Integration",
    description:
      "Automate workflows and embed intelligence into your operations.",
    isActive: true,
    createdAt: "",
    updatedAt: "",
    _count: { courses: 2 },
  },
  {
    id: "fb3",
    name: "Social Media Management",
    description:
      "Grow your audience and drive real engagement across every platform.",
    isActive: true,
    createdAt: "",
    updatedAt: "",
    _count: { courses: 3 },
  },
  {
    id: "fb4",
    name: "Digital Marketing",
    description:
      "Ads, SEO and strategy that scale your reach and bring measurable results.",
    isActive: true,
    createdAt: "",
    updatedAt: "",
    _count: { courses: 3 },
  },
  {
    id: "fb5",
    name: "Graphics Design",
    description:
      "Brand identity, UI design and motion that make you stand out.",
    isActive: true,
    createdAt: "",
    updatedAt: "",
    _count: { courses: 2 },
  },
  {
    id: "fb6",
    name: "Business Automation",
    description:
      "Custom systems and ERP setups that run your operations smoothly.",
    isActive: true,
    createdAt: "",
    updatedAt: "",
    _count: { courses: 1 },
  },
];

export default async function ServicesPage() {
  // Server-side fetch — HTML arrives fully populated for SEO
  const data = await serverFetch<Service[]>("/services", { revalidate: 300 });
  const active =
    data && data.length > 0 ? data.filter((s) => s.isActive) : fallbackServices;

  return (
    <div className="bg-background pt-28 pb-10">
      <div className="mx-auto max-w-6xl px-5">
        <div className="w-full">
          <p className="text-[13px] font-bold uppercase tracking-wider text-primary">
            What we do
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-center tracking-tight text-foreground md:text-4xl">
            Services built to grow your brand
          </h1>
          <p className="mt-4 text-muted-foreground text-center">
            In a digital world full of noise, your business needs more than a
            website — it needs a strategy. We help businesses turn ideas into
            digital experiences that attract customers, build trust, and drive
            real growth. Whether it&apos;s a website built to perform,
            AI-powered solutions that simplify your operations, marketing that
            reaches the right people, branding that sticks, or training that
            upskills your team — we&apos;ve got you covered. We bring together
            strategy, creativity, and the right technology to deliver results
            you can measure. And because every business is different, every
            solution we build is tailored to your goals — so you don&apos;t just
            stand out, you keep growing in a market that never stops moving.
            Explore our services below to see how we can help you get there.
          </p>
        </div>

        {active.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border border-dashed border-border p-16 text-center">
            <p className="text-[15px] font-semibold text-foreground">
              No services listed yet
            </p>
            <p className="mt-1 text-[13.5px] text-muted-foreground">
              Check back soon.
            </p>
          </div>
        )}
      </div>
      <section className="bg-background pt-30 pb-10">
        <div className="mx-auto max-w-5xl">
          <div
            className="relative overflow-hidden rounded-3xl px-8 py-14 text-center md:px-16"
            style={{ background: "var(--brand-green)" }}>
            <h2
              className="text-3xl font-bold tracking-tight md:text-4xl"
              style={{ color: "var(--brand-purple)" }}>
              Ready to get started?
            </h2>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="rounded-xl px-8 py-3 font-semibold text-white transition hover:opacity-90"
                style={{ background: "var(--brand-purple)" }}>
                Book a free call <ArrowRight className="ml-1 inline h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const courseCount = service._count?.courses ?? 0;
  return (
    <Link
      href={`/services/${service.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl dark:shadow-none">
      <div className="relative h-44 overflow-hidden bg-muted">
        {service.image ? (
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background:
                "linear-gradient(120deg, var(--brand-purple), #6b21d6)",
            }}>
            <span className="text-2xl font-extrabold text-white/40">
              {service.name[0]}
            </span>
          </div>
        )}
        {service.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-bold text-foreground backdrop-blur">
            {service.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[16px] font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
          {service.name}
        </h3>
        {service.tagline ? (
          <p className="mt-2 text-[13px] text-muted-foreground line-clamp-2">
            {service.tagline}
          </p>
        ) : service.description ? (
          <p className="mt-2 text-[13px] text-muted-foreground line-clamp-2">
            {service.description}
          </p>
        ) : null}
        <div className="mt-auto flex items-center justify-between pt-4">
          {courseCount > 0 ? (
            <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <GraduationCap size={13} className="text-primary" /> {courseCount}{" "}
              course{courseCount === 1 ? "" : "s"}
            </span>
          ) : (
            <span className="text-[12px] text-muted-foreground">
              Learn more
            </span>
          )}
          <span className="flex items-center gap-1 text-[12px] font-semibold text-primary transition-all group-hover:gap-2">
            Explore <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}
