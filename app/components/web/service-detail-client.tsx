"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  ChevronDown,
  GraduationCap,
} from "lucide-react";
import { Service } from "@/app/interfaces/lms.interface";

export function ServiceDetailClient({ service }: { service: Service | null }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!service) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Service not found
        </h1>
        <Link
          href="/services"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft size={15} /> Back to services
        </Link>
      </div>
    );
  }
  const problems = service.problems ?? [];
  const features = service.features ?? [];
  const howItWorks = service.howItWorks ?? [];
  const faq = service.faq ?? [];
  const courseCount = service._count?.courses ?? 0;

  return (
    <div className="min-h-screen bg-background">
      {/* HERO — image as background */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--brand-purple)" }}>
        {service.image && (
          <div className="absolute inset-0">
            <Image
              src={service.image}
              alt=""
              fill
              aria-hidden
              className="object-cover opacity-30"
            />
            {/* <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(67,11,131,0.85), rgba(67,11,131,0.95))",
              }}
            /> */}
          </div>
        )}
        <div className="relative mx-auto max-w-4xl px-5 py-20 text-center md:py-28">
          <Link
            href="/services"
            className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-white/70 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" /> All services
          </Link>
          {service.badge && (
            <div className="mb-5">
              <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur">
                {service.badge}
              </span>
            </div>
          )}
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
            {service.name}
          </h1>
          {service.tagline && (
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
              {service.tagline}
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="rounded-xl bg-(--brand-green) px-6 py-3 font-semibold text-(--brand-purple) transition hover:opacity-90">
              Get started
            </Link>
            {courseCount > 0 && (
              <Link
                href={`/courses?service=${service.slug}`}
                className="rounded-xl border border-white/25 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20">
                View {courseCount} course{courseCount === 1 ? "" : "s"}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Overview */}
      {service.description && (
        <section className="bg-card">
          <div className="mx-auto max-w-5xl px-5 py-14 md:py-16">
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
              Service Overview
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              {service.description}
            </p>
          </div>
        </section>
      )}

      {/* Who it's for */}
      {service.whoItsFor && (
        <section className="bg-muted/30">
          <div className="mx-auto max-w-5xl px-5 py-12">
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
              Who This Is For
            </p>
            <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/4 p-5">
              <p className="text-[14.5px] leading-relaxed text-foreground/80">
                {service.whoItsFor}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Problems */}
      {problems.length > 0 && (
        <section className="bg-background">
          <div className="mx-auto max-w-5xl px-5 py-14 md:py-16">
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
              The Problem
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Struggling with these?
            </h2>
            <div className="mt-6 space-y-3">
              {problems.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive">
                    <X size={14} />
                  </span>
                  <span className="text-[14px] text-foreground/80">{p}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      {howItWorks.length > 0 && (
        <section className="bg-muted/30">
          <div className="mx-auto max-w-5xl px-5 py-14 md:py-16">
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
              How It Works
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {howItWorks.map((s, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-card p-5 text-center">
                  <span className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-(--brand-purple) text-[13px] font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="text-[13.5px] font-bold text-foreground">
                    {s.title}
                  </p>
                  {s.subtitle && (
                    <p className="mt-1 text-[11.5px] text-muted-foreground">
                      {s.subtitle}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* What's included */}
      {features.length > 0 && (
        <section className="bg-background">
          <div className="mx-auto max-w-5xl px-5 py-14 md:py-16">
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
              What&apos;s Included
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--brand-green)/20 text-(--brand-green)">
                    <Check size={13} />
                  </span>
                  <span className="text-[14px] text-foreground">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonial */}
      {service.testimonial?.quote && (
        <section className="bg-background pb-4">
          <div className="mx-auto max-w-4xl px-5 py-6">
            <div
              className="rounded-3xl px-8 py-12 text-center"
              style={{ background: "var(--brand-purple)" }}>
              <p className="text-lg font-medium italic text-white md:text-xl">
                &ldquo;{service.testimonial.quote}&rdquo;
              </p>
              <p className="mt-4 text-[13px] font-semibold text-(--brand-green)">
                — {service.testimonial.author}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faq.length > 0 && (
        <section className="bg-muted/30">
          <div className="mx-auto max-w-5xl px-5 py-14 md:py-16">
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
              FAQ
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Common questions
            </h2>
            <div className="mt-8 space-y-3">
              {faq.map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    className="overflow-hidden rounded-2xl border border-border bg-card">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 p-4 text-left">
                      <span className="text-[14px] font-semibold text-foreground">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                      <div className="overflow-hidden">
                        <p className="border-t border-border px-4 pb-4 pt-3 text-[13.5px] leading-relaxed text-muted-foreground">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-background pb-20 pt-6">
        <div className="mx-auto max-w-5xl px-5">
          <div
            className="relative overflow-hidden rounded-3xl px-8 py-14 text-center md:px-16"
            style={{ background: "var(--brand-green)" }}>
            <h2
              className="text-3xl font-bold tracking-tight md:text-4xl"
              style={{ color: "var(--brand-purple)" }}>
              Ready to get started?
            </h2>
            {service.ctaText && (
              <p
                className="mx-auto mt-4 max-w-xl font-medium"
                style={{ color: "var(--brand-purple)", opacity: 0.8 }}>
                {service.ctaText}
              </p>
            )}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="rounded-xl px-8 py-3 font-semibold text-white transition hover:opacity-90"
                style={{ background: "var(--brand-purple)" }}>
                Book a free call <ArrowRight className="ml-1 inline h-4 w-4" />
              </Link>
              {courseCount > 0 && (
                <Link
                  href={`/courses?service=${service.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border-2 px-8 py-3 font-semibold transition hover:opacity-80"
                  style={{
                    borderColor: "var(--brand-purple)",
                    color: "var(--brand-purple)",
                  }}>
                  <GraduationCap size={16} /> Learn this skill
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
