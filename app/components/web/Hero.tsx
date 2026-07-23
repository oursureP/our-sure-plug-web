"use client";

import Link from "next/link";
import { ArrowRight, Play, TrendingUp, Zap } from "lucide-react";

const avatars = [
  { initials: "MA", className: "bg-primary text-primary-foreground" },
  { initials: "CO", className: "bg-secondary text-secondary-foreground" },
  { initials: "KE", className: "bg-[#6b21d6] text-white" },
  { initials: "AM", className: "bg-[#c4e34a] text-[#0c0a14]" },
];

const chartBars = [
  { height: "40%", accent: false },
  { height: "58%", accent: false },
  { height: "48%", accent: false },
  { height: "72%", accent: true },
  { height: "64%", accent: false },
  { height: "90%", accent: true },
  { height: "100%", accent: true },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-card/85 pt-28 pb-20 lg:pt-32 lg:pb-28">
      {/* Background glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-20 h-130 w-130 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--primary) 35%, transparent) 0%, transparent 68%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-28 h-105 w-105 rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--secondary) 25%, transparent) 0%, transparent 70%)",
        }}
      />
      {/* Grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.4] dark:opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in oklch, var(--foreground) 4%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklch, var(--foreground) 4%, transparent) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #000 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #000 40%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-9">
          {/* LEFT */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3.5 py-1.5 text-[11.5px] font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Nigeria&apos;s Premier Digital Agency
            </div>

            <h1 className="mb-5 text-[40px] font-extrabold leading-[1.06] tracking-tight text-foreground sm:text-5xl lg:text-[46px]">
              Build a brand that
              <span
                className="mx-1 -mb-1 inline-block h-9 w-1 rounded-sm align-middle"
                style={{
                  background:
                    "linear-gradient(var(--secondary), var(--primary))",
                  transform: "skewX(-12deg)",
                }}
              />
              <br />
              <span className="text-primary">dominates</span> digitally.
            </h1>

            <p className="mb-7 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              We design, develop and grow ambitious businesses with world-class
              websites, AI systems, and digital strategies that turn brands into
              market leaders.
            </p>

            <div className="mb-9 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:opacity-90">
                Start Your Project <ArrowRight size={16} />
              </Link>
              <Link
                href={
                  "https://youtube.com/shorts/hiuOInzBJwY?si=4tKw7kz6IqzFX0SA"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[10px] border border-border bg-foreground/3 px-5 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/[0.07]">
                <Play size={15} className="fill-current text-red-600" /> Watch
                Now
              </Link>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex">
                {avatars.map((a, i) => (
                  <span
                    key={a.initials}
                    className={`flex h-8.5 w-8.5 items-center justify-center rounded-full border-2 border-background text-[11px] font-bold ${a.className}`}
                    style={{ marginLeft: i === 0 ? 0 : "-10px" }}>
                    {a.initials}
                  </span>
                ))}
              </div>
              <p className="text-xs leading-snug text-muted-foreground">
                <strong className="block text-[13px] text-foreground">
                  100+ happy clients
                </strong>
                trust us to grow their brand
              </p>
            </div>
          </div>

          {/* RIGHT — browser mockup */}
          <div className="relative">
            <div className="overflow-hidden rounded-[14px] border border-border bg-card shadow-2xl shadow-black/30 dark:shadow-black/50">
              {/* Browser bar */}
              <div className="flex items-center gap-2 border-b border-border bg-foreground/2 px-3.5 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-2.5 flex-1 rounded-md bg-foreground/4 px-3 py-1.5 text-[11px] text-muted-foreground">
                  oursureplug.com/dashboard
                </span>
              </div>

              {/* Body */}
              <div className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[13px] font-bold text-foreground">
                    Client Growth
                  </span>
                  <span className="rounded-md bg-primary/15 px-2.5 py-1 text-[9.5px] font-bold text-primary">
                    ● LIVE
                  </span>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-2.5">
                  <div className="rounded-[9px] border border-border bg-foreground/3 p-3">
                    <div className="mb-1.5 text-[10px] text-muted-foreground">
                      Engagement
                    </div>
                    <div className="text-xl font-extrabold tracking-tight text-foreground">
                      340%
                      <span className="ml-1.5 text-[11px] font-bold text-primary">
                        ↑
                      </span>
                    </div>
                  </div>
                  <div className="rounded-[9px] border border-border bg-foreground/3 p-3">
                    <div className="mb-1.5 text-[10px] text-muted-foreground">
                      Page Speed
                    </div>
                    <div className="text-xl font-extrabold tracking-tight text-foreground">
                      98
                      <span className="ml-1.5 text-[11px] font-bold text-primary">
                        /100
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex h-18.5 items-end gap-1.5 pt-2">
                  {chartBars.map((bar, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t"
                      style={{
                        height: bar.height,
                        background: bar.accent
                          ? "linear-gradient(to top, #7a9219, var(--secondary))"
                          : "linear-gradient(to top, var(--primary), #6b21d6)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -top-5 -left-7 flex items-center gap-2.5 rounded-[11px] border border-border bg-popover px-3.5 py-3 shadow-xl shadow-black/20 dark:shadow-black/50">
              <div className="flex h-8.5 w-8.5 items-center justify-center rounded-[9px] bg-primary/15">
                <TrendingUp size={16} className="text-primary" />
              </div>
              <div>
                <strong className="block text-[15px] font-extrabold text-foreground">
                  +248%
                </strong>
                <span className="text-[10.5px] text-muted-foreground">
                  Revenue growth
                </span>
              </div>
            </div>

            <div className="absolute -bottom-5 -right-6 flex items-center gap-2.5 rounded-[11px] border border-border bg-popover px-3.5 py-3 shadow-xl shadow-black/20 dark:shadow-black/50">
              <div className="flex h-8.5 w-8.5 items-center justify-center rounded-[9px] bg-secondary/20">
                <Zap size={16} className="text-secondary dark:text-[#a78bfa]" />
              </div>
              <div>
                <strong className="block text-[15px] font-extrabold text-foreground">
                  2.1s
                </strong>
                <span className="text-[10.5px] text-muted-foreground">
                  Load time
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
