import type { Metadata } from "next";
import { MapPin, Mail, Phone, MessageCircle, Clock } from "lucide-react";
import { ContactForm } from "@/app/components/web/contact-form";
import { OfficeMap } from "@/app/components/web/office-map";
import {
  LinkedinIcon,
  InstagramIcon,
  FacebookIcon,
  XIcon,
} from "@/app/components/web/social-icons";

export const metadata: Metadata = {
  title: "Contact Us | OurSurePlug",
  description:
    "Get in touch with OurSurePlug — visit our Port Harcourt office, call, email or send us a message. We respond within one business day.",
  openGraph: {
    title: "Contact OurSurePlug",
    description: "Reach our team — we respond within one business day.",
    type: "website",
  },
};

const contactMethods = [
  {
    icon: MapPin,
    label: "Visit Us",
    value:
      "14 Obiwale Road, By Market Junction, Rumuigbo, Port Harcourt, Rivers State",
    href: null,
  },
  {
    icon: Mail,
    label: "Email Us",
    value: "oursureplug@gmail.com",
    href: "mailto:oursureplug@gmail.com",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+234 707 174 9878",
    href: "tel:+2347071749878",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Chat with us instantly",
    href: `https://wa.me/2347071749878?text=${encodeURIComponent(
      "Hi OurSurePlug, I'd like to know more about your courses.",
    )}`,
  },
];

const socials = [
  { Icon: LinkedinIcon, href: "https://www.linkedin.com/company/oursureplug/" },
  {
    Icon: InstagramIcon,
    href: "https://www.instagram.com/oursureplug?igsh=MTJkZzR2cHYzcm1oaA==",
  },
  { Icon: FacebookIcon, href: "https://www.facebook.com/share/18jVcDA4sV" },
  { Icon: XIcon, href: "https://x.com/oursureplug" },
];

export default function ContactPage() {
  return (
    <div className="bg-background pt-28 pb-20 lg:pt-32 lg:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
            Get In Touch
          </span>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Let&apos;s build something{" "}
            <span className="text-primary">great together</span>
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Have a project in mind or a question? Reach out — we typically
            respond within one business day.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
          {/* LEFT — info */}
          <div>
            <div className="space-y-4">
              {contactMethods.map((m) => {
                const content = (
                  <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/50 dark:bg-[#161427]">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/13 text-primary">
                      <m.icon size={20} />
                    </div>
                    <div>
                      <div className="mb-0.5 text-[13px] font-bold text-foreground">
                        {m.label}
                      </div>
                      <div className="text-[13px] leading-relaxed text-muted-foreground">
                        {m.value}
                      </div>
                    </div>
                  </div>
                );
                return m.href ? (
                  <a
                    key={m.label}
                    href={m.href}
                    target={m.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="block">
                    {content}
                  </a>
                ) : (
                  <div key={m.label}>{content}</div>
                );
              })}
            </div>

            {/* Office hours */}
            <div className="mt-4 flex items-start gap-4 rounded-2xl border border-border bg-card p-5 dark:bg-[#161427]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/13 text-primary">
                <Clock size={20} />
              </div>
              <div>
                <div className="mb-0.5 text-[13px] font-bold text-foreground">
                  Office Hours
                </div>
                <div className="text-[13px] leading-relaxed text-muted-foreground">
                  Monday – Friday: 9:00 AM – 5:00 PM
                  <br />
                  Saturday – Sunday: Closed
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className="mt-6">
              <div className="mb-3 text-[12.5px] font-semibold text-foreground">
                Follow us
              </div>
              <div className="flex gap-2">
                {socials.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:bg-primary/8 hover:text-primary">
                    <s.Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — form */}
          <ContactForm />
        </div>

        {/* Map */}
        <div className="mt-14">
          <OfficeMap className="h-100" />
        </div>
      </div>
    </div>
  );
}
