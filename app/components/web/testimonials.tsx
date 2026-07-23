"use client";

import { useState, useEffect, useCallback } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  initials: string;
  accent: "green" | "purple";
}

const testimonials: Testimonial[] = [
  {
    name: "Michael Adeyemi",
    role: "CEO, V2 PolarTech",
    quote:
      "OurSurePlug completely transformed our online presence. Our new website is fast, beautiful, and brought in leads within the first week. Truly professional team.",
    initials: "MA",
    accent: "green",
  },
  {
    name: "Chioma Okafor",
    role: "Founder, Kidron Foods",
    quote:
      "Their social media management took our brand to a whole new level. Engagement tripled and our community genuinely grew. I could not recommend them more.",
    initials: "CO",
    accent: "purple",
  },
  {
    name: "Kelvin Eze",
    role: "Director, Manjero Links",
    quote:
      "From strategy to execution, the team was thorough and reliable. They delivered exactly what they promised, on time, and the results speak for themselves.",
    initials: "KE",
    accent: "green",
  },
  {
    name: "Timothy",
    role: "CEO, Goziri",
    quote:
      "The training program was hands-on and practical. My team gained real skills they use every day. OurSurePlug clearly knows their craft.",
    initials: "AM",
    accent: "purple",
  },
  {
    name: "Mrs Calista",
    role: "CEO, Rosecrownmart",
    quote:
      "They built our e-commerce store from the ground up. Sales are up, the site is lightning fast, and managing products is effortless. Worth every naira.",
    initials: "DO",
    accent: "green",
  },
];

function avatarClasses(accent: "green" | "purple") {
  return accent === "green"
    ? "bg-primary text-primary-foreground"
    : "bg-secondary text-secondary-foreground";
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="relative h-full overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-md shadow-black/4 dark:border-white/10 dark:bg-[#161427] dark:shadow-none">
      <Quote
        size={40}
        className="absolute right-5 top-5 text-primary/10"
        fill="currentColor"
      />
      <div className="mb-4 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={15} className="fill-primary text-primary" />
        ))}
      </div>
      <p className="relative mb-6 text-[14px] leading-relaxed text-foreground/85">
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full text-[13px] font-bold ${avatarClasses(
            t.accent,
          )}`}>
          {t.initials}
        </div>
        <div>
          <div className="text-[14px] font-bold text-foreground">{t.name}</div>
          <div className="text-[12px] text-muted-foreground">{t.role}</div>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const [perView, setPerView] = useState(2);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Responsive cards-per-view
  useEffect(() => {
    const update = () => setPerView(window.innerWidth < 768 ? 1 : 2);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - perView);
  const safeIndex = Math.min(index, maxIndex);
  // Clamp index when perView changes
  //   useEffect(() => {
  //     setIndex((i) => Math.min(i, maxIndex));
  //   }, [maxIndex]);
  // const maxIndex = Math.max(0, testimonials.length - perView);
  const next = useCallback(() => {
    setIndex((i) => (i >= maxIndex ? 0 : i + 1));
  }, [maxIndex]);

  const prev = () => setIndex((i) => (i <= 0 ? maxIndex : i - 1));

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, next]);

  return (
    <section className="relative overflow-hidden bg-card/40 py-20 lg:py-28 dark:bg-[#0b0a16]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading + arrows */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
              Client Stories
            </span>
            <h2 className="mb-3 text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
              Loved by brands{" "}
              <span className="text-primary">across Nigeria</span>
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Don&apos;t just take our word for it — here&apos;s what our
              clients have to say.
            </p>
          </div>

          {/* Arrows */}
          <div className="flex gap-2">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground dark:bg-[#161427]">
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground dark:bg-[#161427]">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Carousel viewport */}
        <div
          className="overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}>
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${index * (100 / perView)}%)`,
            }}>
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="shrink-0 px-3 first:pl-0 last:pr-0"
                style={{ width: `${100 / perView}%` }}>
                <TestimonialCard t={t} />
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === safeIndex
                  ? "w-7 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
