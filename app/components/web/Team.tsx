/* eslint-disable @next/next/no-img-element */
import { Globe, MessageCircle } from "lucide-react";
import { FacebookIcon, InstagramIcon, LinkedinIcon } from "./social-icons";

const team = [
  {
    name: "Chike",
    role: "CEO",
    image: "/teams/chike.jpg",
    socials: [
      {
        icon: Globe,
        link: "",
      },
      {
        icon: MessageCircle,
        link: "",
      },
      {
        icon: LinkedinIcon,
        link: "",
      },
      {
        icon: InstagramIcon,
        link: "",
      },
      {
        icon: FacebookIcon,
        link: "",
      },
    ],
  },
  {
    name: "Ceejay",
    role: "Head Of Operations",
    image: "/teams/ceejay.jpg",
    socials: [
      {
        icon: Globe,
        link: "",
      },
      {
        icon: MessageCircle,
        link: "",
      },
      {
        icon: LinkedinIcon,
        link: "",
      },
      {
        icon: InstagramIcon,
        link: "",
      },
      {
        icon: FacebookIcon,
        link: "",
      },
    ],
  },
  {
    name: "Nkwocha Nicholas",
    role: "IT Head",
    image: "/teams/mee.jpg",
    socials: [
      {
        icon: Globe,
        link: "https://nl-tech.vercel.app/",
      },
      {
        icon: MessageCircle,
        link: `https://wa.me/2348143230439?text=${encodeURIComponent(
          "Hi Nicholas, I'd like to know more about your services.",
        )}`,
      },
      {
        icon: LinkedinIcon,
        link: "https://www.linkedin.com/in/nicholas-lechi/",
      },
      {
        icon: InstagramIcon,
        link: "https://www.instagram.com/nikxin100/",
      },
      {
        icon: FacebookIcon,
        link: "https://web.facebook.com/nicholas.lechi.9",
      },
    ],
  },
  {
    name: "Awe Oluwabukunmi",
    role: "Web Developer",
    image: "/teams/awe.jpg",
    socials: [
      {
        icon: Globe,
        link: "",
      },
      {
        icon: MessageCircle,
        link: "",
      },
      {
        icon: LinkedinIcon,
        link: "",
      },
      {
        icon: InstagramIcon,
        link: "",
      },
      {
        icon: FacebookIcon,
        link: "",
      },
    ],
  },
];

export function TeamSection() {
  return (
    <section className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Our Team
          </span>
          <h2 className="mt-3 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            The people behind the magic
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            United by expertise and driven by excellence, our team creates
            innovative digital solutions that empower businesses and transform
            ideas into impact.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <div
              key={member.name}
              className="group overflow-hidden rounded-2xl border border-border bg-card">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className={`${member.role === "CEO" || member.role === "Head Of Operations" ? "h-140 " : "size-full"} w-full object-cover transition-transform duration-500 group-hover:scale-105`}
                />
                <div className="absolute inset-0 bg-linear-to-t from-primary via-transparent to-transparent opacity-50" />
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 md:opacity-0 opacity-100 transition-all duration-300 group-hover:bottom-4 group-hover:opacity-100">
                  {member.socials?.map(({ icon: Icon, link }, i) => (
                    <a
                      key={i}
                      href={link || "#"}
                      target="_blank"
                      aria-label={`${member.name} social link`}
                      className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground transition-transform  hover:scale-110">
                      <Icon className="size-4" />
                    </a>
                  ))}
                </div>
              </div>
              <div className="p-5 text-center">
                <h3 className="font-bold">{member.name}</h3>
                <p className="mt-1 text-sm text-primary">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
