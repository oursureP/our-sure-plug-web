"use client";

import { useCountUp } from "@/app/hooks/use-count-up";
import { useEffect, useRef, useState } from "react";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { value: 100, suffix: "+", label: "Happy Clients" },
  { value: 250, suffix: "+", label: "Projects Delivered" },
  { value: 5, suffix: "+", label: "Years of Experience" },
  { value: 24, suffix: "/7", label: "Support & Care" },
];

function StatItem({ stat, visible }: { stat: Stat; visible: boolean }) {
  const count = useCountUp(stat.value, 2000, visible);
  return (
    <div className="text-center">
      <div className="mb-1.5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
        {count}
        <span className="dark:text-primary">{stat.suffix}</span>
      </div>
      <div className="text-[13px] font-medium uppercase tracking-wider text-white/65">
        {stat.label}
      </div>
    </div>
  );
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-16 lg:py-20"
      style={{ backgroundColor: "var(--brand-purple)" }}>
      {/* Signature diagonal slash accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-10 top-0 h-full w-40 opacity-[0.15]"
        style={{
          background:
            "repeating-linear-gradient(115deg, var(--brand-green) 0 2px, transparent 2px 22px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 bottom-0 h-full w-40 opacity-[0.15]"
        style={{
          background:
            "repeating-linear-gradient(115deg, var(--brand-green) 0 2px, transparent 2px 22px)",
        }}
      />
      {/* Soft green glow center */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, var(--brand-green), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s) => (
            <StatItem key={s.label} stat={s} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
