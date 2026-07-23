"use client";

import { Search, PenTool, Code2, Rocket } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Search,
    title: "Discover",
    desc: "We immerse ourselves in your business, uncover opportunities, and define a strategy that aligns with your goals, audience, and long-term vision.",
  },
  {
    num: "02",
    icon: PenTool,
    title: "Design",
    desc: "We craft intuitive, visually compelling experiences that elevate your brand, engage your audience, and inspire confidence.",
  },
  {
    num: "03",
    icon: Code2,
    title: "Build",
    desc: "Using modern technologies and best practices, we develop secure, scalable, and high-performance digital solutions built for the future.",
  },
  {
    num: "04",
    icon: Rocket,
    title: "Launch & Grow",
    desc: "Going live is only the beginning. We optimize, monitor, and continuously refine your digital presence to maximize growth and long-term success.",
  },
];

export function Process() {
  return (
    <section className="relative overflow-hidden bg-card/95 py-10 dark:bg-[#0b0a16]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto mb-16 max-w-xl text-center">
          <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
            How We Work
          </span>
          <h2 className="mb-3 text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
            From idea to impact in{" "}
            <span className="text-primary">four steps</span>
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Every successful project follows a proven framework—designed to
            transform ideas into high-performing digital experiences with
            clarity, precision, and measurable impact.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* Connecting line (desktop only) */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px lg:block"
            style={{
              background:
                "linear-gradient(90deg, transparent, color-mix(in oklch, var(--primary) 40%, transparent) 20%, color-mix(in oklch, var(--primary) 40%, transparent) 80%, transparent)",
            }}
          />

          {steps.map((step) => (
            <div key={step.num} className="relative text-center lg:text-left">
              {/* Number circle */}
              <div className="relative z-10 mb-6 flex justify-center lg:justify-start">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background shadow-sm">
                  <step.icon size={22} className="text-primary" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-extrabold text-primary-foreground">
                    {step.num}
                  </span>
                </div>
              </div>

              <h3 className="mb-2 text-lg font-bold tracking-tight text-foreground">
                {step.title}
              </h3>
              <p className="mx-auto max-w-60 text-[13px] leading-relaxed text-muted-foreground lg:mx-0">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
