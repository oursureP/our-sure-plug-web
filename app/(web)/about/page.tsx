import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Target,
  Eye,
  Heart,
  Zap,
  Users,
  Award,
  Globe,
} from "lucide-react";
import { TeamSection } from "@/app/components/web/Team";

export const metadata: Metadata = {
  title: "About Us | OurSurePlug",
  description:
    "OurSurePlug is a Nigerian digital agency and training institute in Port Harcourt — helping businesses grow with web, AI, and digital strategy. Meet our team.",
  openGraph: {
    title: "About OurSurePlug",
    description:
      "A Nigerian digital agency and training institute helping brands grow online.",
    type: "website",
  },
};

const values = [
  {
    icon: Zap,
    title: "Client-Centric",
    desc: "Our clients are at the heart of everything we do. We listen, understand their goals, and create solutions tailored to their success.",
  },
  {
    icon: Heart,
    title: "Integrity",
    desc: "Trust is the foundation of every partnership. We operate with honesty, professionalism, and strong ethical standards in every interaction.",
  },
  {
    icon: Users,
    title: "Accountability",
    desc: "We take ownership of our work. From planning to delivery, we remain responsible, reliable, and committed to achieving outstanding results.",
  },
  {
    icon: Globe,

    title: "Transparency",
    desc: "We embrace creativity and emerging technologies. By continuously evolving, we deliver forward-thinking solutions that keep our clients ahead.",
  },
  {
    icon: Award,
    title: "Innovation",
    desc: "Open communication builds lasting relationships. We believe in keeping our clients informed through honesty, clarity, and collaboration at every stage.",
  },
];

// const team = [
//   {
//     name: "Samuel Okoro",
//     role: "Founder & CEO",
//     initials: "SO",
//     accent: "green",
//   },
//   {
//     name: "Grace Effiong",
//     role: "Head of Operations",
//     initials: "GE",
//     accent: "purple",
//   },
//   {
//     name: "Daniel Uche",
//     role: "Lead Developer",
//     initials: "DU",
//     accent: "green",
//   },
//   {
//     name: "Blessing Ada",
//     role: "Creative Director",
//     initials: "BA",
//     accent: "purple",
//   },
// ] as const;

// function avatarClasses(accent: "green" | "purple") {
//   return accent === "green"
//     ? "bg-primary text-primary-foreground"
//     : "bg-secondary text-secondary-foreground";
// }

export default function AboutPage() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16 lg:pt-32 lg:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 right-0 h-96 w-96 rounded-full opacity-50"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklch, var(--primary) 18%, transparent), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
            About OurSurePlug
          </span>
          <h1 className="mb-5 text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
            Driven by Purpose. Committed to{" "}
            <span className="text-primary">Excellence.</span>
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            At OurSurePlug, we believe exceptional digital solutions begin with
            understanding people, solving real problems, and delivering
            measurable value. Every website we build, every strategy we create,
            every AI solution we develop, and every course we deliver is guided
            by one mission—to help businesses and individuals thrive in a
            rapidly evolving digital world.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative">
              <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-border">
                <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#430b83] via-[#5a1ba3] to-[#2d5a3a]">
                  {/* <span className="text-sm font-medium text-white/40">
                    Our Story / Office Photo
                  </span> */}
                  <Image
                    src="/teams/team.png"
                    alt="The OurSurePlug team at our Port Harcourt office"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 flex items-center gap-3 rounded-2xl border border-border bg-popover px-5 py-4 shadow-xl shadow-black/20 dark:shadow-black/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-2xl font-extrabold text-primary-foreground">
                  5+
                </div>
                <div>
                  <div className="text-[14px] font-extrabold text-foreground">
                    Years
                  </div>
                  <div className="text-[13px] text-muted-foreground">
                    Driving growth
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
                Our Story
              </span>
              <h2 className="mb-5 text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
                Built on a passion for digital growth
              </h2>
              <div className="space-y-4 text-[14.5px] leading-relaxed text-muted-foreground">
                <p>
                  OurSurePlug was established with a vision to bridge the gap
                  between innovation and opportunity. We partner with
                  businesses, entrepreneurs, and organizations to build digital
                  solutions that solve real problems, strengthen brands, and
                  accelerate growth.
                </p>
                <p>
                  Over the years, we&apos;ve grown into a multidisciplinary team
                  of strategists, designers, developers, marketers, and trainers
                  united by one mission—to create meaningful digital experiences
                  and empower people with the skills needed to thrive in a
                  technology-driven world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-8 dark:bg-[#161427]">
              <div className="mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-primary/13 p-3 text-primary">
                <Target size={26} />
              </div>
              <h3 className="mb-3 text-xl font-bold tracking-tight text-foreground">
                Our Mission
              </h3>
              <p className="text-[14px] leading-relaxed text-muted-foreground">
                Empowering businesses and individuals through innovative digital
                solutions and comprehensive training programs.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-8 dark:bg-[#161427]">
              <div className="mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-secondary/20 p-3 text-secondary dark:text-[#a78bfa]">
                <Eye size={26} />
              </div>
              <h3 className="mb-3 text-xl font-bold tracking-tight text-foreground">
                Our Vision
              </h3>
              <p className="text-[14px] leading-relaxed text-muted-foreground">
                Creating a world where businesses and young people harness the
                power of digital technologies to achieve their dreams and drive
                societal progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-card/40 py-16 dark:bg-[#0b0a16] lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
              What We Stand For
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Our core values
            </h2>
            <p className="text-center">
              At OurSurePlug, our values define who we are and how we work. They
              shape every decision we make, every solution we create, and every
              relationship we build. By combining innovation, integrity, and a
              client-first mindset, we deliver meaningful digital experiences
              that create lasting value.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-border bg-card p-6 text-center dark:bg-[#161427]">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/13 text-primary">
                  <v.icon size={22} />
                </div>
                <h3 className="mb-2 text-base font-bold tracking-tight text-foreground">
                  {v.title}
                </h3>
                <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      {/* <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
              Meet The Team
            </span>
            <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              The people behind the work
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              A passionate team of creatives, developers and strategists.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div
                key={member.name}
                className="group rounded-2xl border border-border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-xl dark:bg-[#161427] dark:shadow-none">
                <div
                  className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full text-xl font-bold ${avatarClasses(member.accent)}`}>
                  {member.initials}
                </div>
                <h3 className="mb-1 text-base font-bold tracking-tight text-foreground">
                  {member.name}
                </h3>
                <p className="mb-4 text-[12.5px] text-muted-foreground">
                  {member.role}
                </p>
                <div className="flex justify-center gap-2">
                  {[LinkedinIcon, TwitterIcon, Globe].map((Icon, i) => (
                    <span
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:bg-primary/[0.08] hover:text-primary">
                      <Icon size={14} />
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
      <TeamSection />

      {/* CTA */}
      <section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12"
            style={{ backgroundColor: "var(--brand-purple)" }}>
            <div
              aria-hidden
              className="pointer-events-none absolute -left-10 top-0 h-full w-48 opacity-[0.12]"
              style={{
                background:
                  "repeating-linear-gradient(115deg, var(--brand-green) 0 2px, transparent 2px 24px)",
              }}
            />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Want to work with us?
              </h2>
              <p className="mx-auto mb-8 max-w-lg text-[15px] leading-relaxed text-white/75">
                Let&apos;s talk about how we can help your brand grow.
              </p>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-4 text-sm font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:opacity-90">
                Get In Touch{" "}
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
