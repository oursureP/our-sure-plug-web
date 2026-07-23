"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users, Target, Headphones, Award } from "lucide-react";

const points = [
  {
    icon: Users,
    title: "Expert Team",
    desc: "Seasoned designers, developers and strategists under one roof.",
  },
  {
    icon: Target,
    title: "Results-Driven",
    desc: "Every decision is measured against real business growth.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "We stay with you long after launch — always reachable.",
  },
  {
    icon: Award,
    title: "Proven Track Record",
    desc: "100+ brands grown across Nigeria and beyond.",
  },
];

export function About() {
  return (
    <section className="bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* LEFT — content */}
          <div>
            <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
              Who We Are
            </span>
            <h2 className="mb-5 text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
              A digital partner built to{" "}
              <span className="text-primary">grow your brand</span>
            </h2>
            <p className="mb-8 text-[15px] leading-relaxed text-muted-foreground">
              OurSurePlug is a full-service digital agency empowering ambitious
              brands to grow, scale, and lead in the digital age. We create
              world-class websites, AI-powered solutions, digital marketing
              strategies, and practical training programs that transform ideas
              into measurable business success.
            </p>

            {/* Why us points */}
            <div className="mb-9 grid gap-5 sm:grid-cols-2">
              {points.map((p) => (
                <div key={p.title} className="flex gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/13 text-primary">
                    <p.icon size={18} />
                  </div>
                  <div>
                    <h3 className="mb-1 text-[14px] font-bold text-foreground">
                      {p.title}
                    </h3>
                    <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:opacity-90">
              More About Us
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* RIGHT — visual */}
          <div className="relative">
            {/* Main image area */}
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-border">
              {/* Replace this gradient block with a real <Image> when you have a photo */}
              {/* <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#430b83] via-[#5a1ba3] to-[#2d5a3a]">
                <span className="text-sm font-medium text-white/40">
                  Team / Office Photo
                </span>
              </div> */}

              <Image
                src="/teams/office.jpeg"
                alt="OurSurePlug team"
                fill
                className="object-cover"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
            </div>

            {/* Floating experience badge */}
            <div className="absolute -bottom-6 -left-6 flex items-center gap-3 rounded-2xl border border-border bg-popover px-5 py-4 shadow-xl shadow-black/20 dark:shadow-black/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-2xl font-extrabold text-primary-foreground">
                5+
              </div>
              <div>
                <div className="text-[14px] font-extrabold text-foreground">
                  Years of
                </div>
                <div className="text-[13px] text-muted-foreground">
                  Digital Excellence
                </div>
              </div>
            </div>

            {/* Decorative glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-8 -z-10 h-48 w-48 rounded-full opacity-40"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in oklch, var(--primary) 30%, transparent), transparent 70%)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
