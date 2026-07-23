/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, MapPin, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { serverFetch } from "@/app/lib/api/server";
import { Service } from "@/app/interfaces/lms.interface";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Courses", href: "/courses" },
];
// const serviceLinks = [
//   { label: "Web Development", href: "/services" },
//   { label: "Social Media", href: "/services" },
//   { label: "AI Integration", href: "/services" },
//   { label: "Digital Marketing", href: "/services" },
// ];

const socials = [
  {
    href: "https://www.facebook.com/share/1CHytYsrVK/",
    label: "Facebook",
    path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  },
  {
    href: "#",
    label: "X",
    path: "M4 4l6.5 8L4 20h2l5.5-6.5L16 20h4l-7-8.5L20 4h-2l-5 6L9 4H4z",
  },
  {
    href: "https://www.linkedin.com/company/oursureplug/",
    label: "LinkedIn",
    path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
  },
  {
    href: "https://www.instagram.com/oursureplug",
    label: "Instagram",
    path: "M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    (async () => {
      const data = await serverFetch<Service[]>("/services", {
        revalidate: 300,
      });
      if (data) {
        setServices(data ?? []);
      }
    })();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Subscribed! Watch your inbox for updates.");
    setEmail("");
  };

  return (
    <footer className="relative border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="mb-4 flex items-end ">
              <div className="flex h-20 w-20 items-center justify-center rounded-lg ">
                <img src="/images/logo.png" alt="logo" />
              </div>
              <span className="text-[15px] font-bold text-foreground mb-3.5 -ml-3">
                Our<span className="text-primary">Sure</span>Plug
              </span>
            </Link>
            <p className="mb-5 max-w-xs text-[13.5px] leading-relaxed text-muted-foreground">
              A modern digital agency delivering web, AI, and growth-driven
              solutions that transform brands into market leaders.
            </p>
            <div className="flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:bg-primary/8 hover:text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-4 text-[13px] font-bold uppercase tracking-wider text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[13.5px] text-muted-foreground transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 text-[13px] font-bold uppercase tracking-wider text-foreground">
              Services
            </h4>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.id}>
                  <Link
                    href={"/services"}
                    className="text-[13.5px] text-muted-foreground transition-colors hover:text-primary">
                    {s?.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + newsletter */}
          <div>
            <h4 className="mb-4 text-[13px] font-bold uppercase tracking-wider text-foreground">
              Get In Touch
            </h4>
            <ul className="mb-5 space-y-3">
              <li className="flex items-start gap-2.5 text-[13px] text-muted-foreground">
                <MapPin size={15} className="mt-0.5 shrink-0 text-primary" />
                14 Obiwale Road, By Market Junction, Rumuigbo, Port Harcourt,
                Rivers State
              </li>
              <li>
                <a
                  href="mailto:contact@oursureplug.com"
                  className="flex items-center gap-2.5 text-[13px] text-muted-foreground transition-colors hover:text-primary">
                  <Mail size={15} className="shrink-0 text-primary" />
                  oursureplug@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+2347071749878"
                  className="flex items-center gap-2.5 text-[13px] text-muted-foreground transition-colors hover:text-primary">
                  <Phone size={15} className="shrink-0 text-primary" />
                  +234 707 174 9878
                </a>
              </li>
            </ul>

            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90">
                <ArrowRight size={17} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-[12.5px] text-muted-foreground">
            © {new Date().getFullYear()} OurSurePlug. All Rights Reserved.
          </p>
          <div className="flex gap-5">
            <Link
              href="/privacy"
              className="text-[12.5px] text-muted-foreground transition-colors hover:text-primary">
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-[12.5px] text-muted-foreground transition-colors hover:text-primary">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
