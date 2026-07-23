"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export function CTABanner() {
  return (
    <section className="bg-background py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-12 lg:py-20"
          style={{ backgroundColor: "var(--brand-purple)" }}>
          {/* Signature slash accents */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-10 top-0 h-full w-48 opacity-[0.12]"
            style={{
              background:
                "repeating-linear-gradient(115deg, var(--brand-green) 0 2px, transparent 2px 24px)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 bottom-0 h-full w-48 opacity-[0.12]"
            style={{
              background:
                "repeating-linear-gradient(115deg, var(--brand-green) 0 2px, transparent 2px 24px)",
            }}
          />
          {/* Glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/3 rounded-full opacity-25"
            style={{
              background:
                "radial-gradient(circle, var(--brand-green), transparent 70%)",
            }}
          />

          <div className="relative mx-auto max-w-2xl">
            <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
              Let&apos;s work together
            </span>
            <h2 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ready to grow your business?
            </h2>
            <p className="mx-auto mb-9 max-w-lg text-[15px] leading-relaxed text-white/75">
              Let&apos;s build something remarkable together. Tell us about your
              project and we&apos;ll show you what&apos;s possible.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 py-4 text-sm font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:opacity-90 sm:w-auto">
                Start Your Project
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <a
                href="https://wa.me/2347071749878"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-7 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10 sm:w-auto">
                <MessageCircle size={16} /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
