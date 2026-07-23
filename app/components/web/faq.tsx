"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ArrowRight } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How much does a website or project cost?",
    answer:
      "Every project is unique, so pricing depends on scope, features and timeline. We offer flexible packages for businesses of all sizes and always provide a clear quote upfront — no hidden fees. Reach out for a free consultation and tailored estimate.",
  },
  {
    question: "How long does it take to complete a project?",
    answer:
      "Timelines vary by complexity. A standard business website typically takes 2–4 weeks, while larger web apps or custom systems take longer. We agree on clear milestones at the start so you always know what to expect and when.",
  },
  {
    question: "Do you offer ongoing support after launch?",
    answer:
      "Yes. We provide maintenance and support packages to keep your site fast, secure and up to date. Our team stays reachable long after launch — we see every client as a long-term partner, not a one-off job.",
  },
  {
    question: "What services do you actually offer?",
    answer:
      "We handle web design and development, AI integration, social media management, digital marketing, graphics design, and business automation. We also run hands-on training programs through our skills institute.",
  },
  {
    question: "How does the training program work?",
    answer:
      "Our courses run both online, and physically at our Port Harcourt centre. You can browse categories, pick a course, view upcoming session dates and enroll directly online. Each course is practical, project-based and certified on completion.",
  },
  {
    question: "What payment options are available?",
    answer:
      "We accept secure online payments via card and bank transfer through Paystack. For projects, we typically work with a milestone-based payment structure, and course fees can be paid per session intake.",
  },
];

function FAQRow({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left">
        <span className="text-[15px] font-semibold text-foreground">
          {item.question}
        </span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary transition-transform duration-300 ${
            isOpen ? "rotate-45" : ""
          }`}>
          <Plus size={16} />
        </span>
      </button>
      <div
        className="grid transition-all duration-300 ease-out"
        style={{
          gridTemplateRows: isOpen ? "1fr" : "0fr",
        }}>
        <div className="overflow-hidden">
          <p className="pb-5 pr-10 text-[13.5px] leading-relaxed text-muted-foreground">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* Left — heading + CTA */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
              FAQ
            </span>
            <h2 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
              Questions?{" "}
              <span className="text-primary">We&apos;ve got answers</span>
            </h2>
            <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
              Everything you need to know about working with us. Can&apos;t find
              what you&apos;re looking for? Just reach out.
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:opacity-90">
              Contact Us
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Right — accordion */}
          <div className="bg-card rounded-2xl p-3">
            {faqs.map((item, i) => (
              <FAQRow
                key={i}
                item={item}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
