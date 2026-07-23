import Link from "next/link";
import Image from "next/image";
import { ArrowRight, GraduationCap } from "lucide-react";
import { Service } from "@/app/interfaces/lms.interface";
import { getServiceVisual } from "@/app/lib/service-visuals";

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
    description: "Grow your audience and drive real engagement.",
    isActive: true,
    createdAt: "",
    updatedAt: "",
    _count: { courses: 3 },
  },
  {
    id: "fb4",
    name: "Digital Marketing",
    description: "Ads, SEO and strategy that scale your reach.",
    isActive: true,
    createdAt: "",
    updatedAt: "",
    _count: { courses: 3 },
  },
  {
    id: "fb5",
    name: "Graphics Design",
    description: "Brand identity, UI design and motion that stand out.",
    isActive: true,
    createdAt: "",
    updatedAt: "",
    _count: { courses: 2 },
  },
];

export function Services({ services }: { services?: Service[] }) {
  const list =
    services && services.length > 0
      ? services.filter((s) => s.isActive).slice(0, 5)
      : fallbackServices;
  // console.log("Services list:", list);
  return (
    <section className="bg-card/80 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
            What We Do
          </span>
          <h2 className="mb-3 text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
            Everything your brand needs to{" "}
            <span className="text-primary">win online</span>
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            From pixel-perfect websites to AI-powered systems —{" "}
            <span className="font-bold  text-primary">one team</span>, every
            digital solution.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((service) => {
            const visual = getServiceVisual(service.name);
            const Icon = visual.icon;
            return (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-md shadow-black/4 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/12 dark:shadow-none">
                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-muted">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Icon size={34} className="text-muted-foreground/40" />
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="mb-1.5 text-[15px] font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {service.name}
                  </h3>

                  {service.tagline ? (
                    <p className="mb-3 text-[13px] font-medium text-primary">
                      {service.tagline}
                    </p>
                  ) : service.description ? (
                    <p className="mb-3 line-clamp-2 text-[13px] text-muted-foreground">
                      {service.description}
                    </p>
                  ) : null}

                  <div className="mt-auto flex items-center justify-between pt-2">
                    {service._count?.courses ? (
                      <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                        <GraduationCap size={13} className="text-primary" />
                        {service._count.courses} course
                        {service._count.courses === 1 ? "" : "s"}
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
          })}
        </div>

        {/* View all */}
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-bold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/50">
            View All Services <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
