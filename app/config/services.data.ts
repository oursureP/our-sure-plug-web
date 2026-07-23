import { AgencyService } from "../interfaces/marketing.interface";

export const agencyServices: AgencyService[] = [
  {
    id: "1",
    slug: "web-development",
    title: "Web Design & Development",
    shortDesc:
      "Responsive, lightning-fast websites and web apps that turn visitors into loyal customers.",
    image: "",
    icon: "Globe",
    fallbackGradient: "from-[#1e3a5f] to-[#2d5a8c]",
    isFlagship: true,
  },
  {
    id: "2",
    slug: "ai-integration",
    title: "AI Integration",
    shortDesc:
      "Automate workflows and embed intelligence into your operations.",
    image: "",
    icon: "Bot",
    fallbackGradient: "from-[#3d1f6b] to-[#6b21d6]",
  },
  {
    id: "3",
    slug: "social-media",
    title: "Social Media Management",
    shortDesc: "Grow your audience and drive real engagement.",
    image: "",
    icon: "Smartphone",
    fallbackGradient: "from-[#1a5c3a] to-[#2d8c5a]",
  },
  {
    id: "4",
    slug: "digital-marketing",
    title: "Digital Marketing",
    shortDesc: "Ads, SEO and strategy that scale your reach.",
    image: "",
    icon: "BarChart3",
    fallbackGradient: "from-[#5f1e4a] to-[#8c2d6b]",
  },
  {
    id: "5",
    slug: "training",
    title: "Skills Training",
    shortDesc: "Practical digital skills, certified and career-ready.",
    image: "",
    icon: "GraduationCap",
    fallbackGradient: "from-[#5f4a1e] to-[#8c7a2d]",
    isTraining: true,
  },
];
