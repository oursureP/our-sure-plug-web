"use client";

import { useState } from "react";
import Image from "next/image";
const brands = [
  "/brands/br1.png",
  "/brands/br2.png",
  "/brands/br3.jpg",
  "/brands/br4.jpg",
  "/brands/br5.jpg",
  "/brands/br6.jpg",
  "/brands/br7.jpg",
  "/brands/br8.png",
  "/brands/br9.png",
  "/brands/br10.png",
  "/brands/br11.webp",
  "/brands/br12.png",
  "/brands/br13.png",
  "/brands/br14.png",
  "/brands/br15.png",
  "/brands/br16.png",
];

export function TrustStrip() {
  const [paused, setPaused] = useState(false);

  return (
    <section className="border-y border-border bg-card/40 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-[12px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          Trusted by 100+ brands across Nigeria
        </p>

        {/* Marquee */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}>
          {/* Edge fade masks */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-linear-to-r from-card/40 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-linear-to-l from-card/40 to-transparent" />

          <div
            className="flex w-max items-center gap-14"
            style={{
              animation: "marquee 32s linear infinite",
              animationPlayState: paused ? "paused" : "running",
            }}>
            {[...brands, ...brands].map((brand, i) => (
              <Image
                key={`${brand}-${i}`}
                src={brand}
                alt={`Brand ${i + 1}`}
                width={100}
                height={70}
                className="whitespace-nowrap text-[19px] w-auto h-auto font-bold tracking-tight text-foreground/75  transition-all duration-300 hover:text-primary hover:scale-105"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
