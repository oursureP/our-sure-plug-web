import {
  Globe,
  Bot,
  Smartphone,
  BarChart3,
  GraduationCap,
  Code,
  Palette,
  Megaphone,
  Settings,
  type LucideIcon,
} from "lucide-react";

const visualMap: Record<string, { icon: LucideIcon; gradient: string }> = {
  "web development": { icon: Code, gradient: "from-[#1e3a5f] to-[#2d5a8c]" },
  "web design & development": {
    icon: Globe,
    gradient: "from-[#1e3a5f] to-[#2d5a8c]",
  },
  "ai integration": { icon: Bot, gradient: "from-[#3d1f6b] to-[#6b21d6]" },
  "social media management": {
    icon: Smartphone,
    gradient: "from-[#1a5c3a] to-[#2d8c5a]",
  },
  "digital marketing": {
    icon: Megaphone,
    gradient: "from-[#5f1e4a] to-[#8c2d6b]",
  },
  "graphics design": { icon: Palette, gradient: "from-[#5f4a1e] to-[#8c7a2d]" },
  "business automation": {
    icon: Settings,
    gradient: "from-[#2d4a5f] to-[#2d6b8c]",
  },
  "skills training": {
    icon: GraduationCap,
    gradient: "from-[#5f4a1e] to-[#8c7a2d]",
  },
};

export function getServiceVisual(name: string) {
  return (
    visualMap[name.toLowerCase()] ?? {
      icon: BarChart3,
      gradient: "from-[#2d2d4a] to-[#43436b]",
    }
  );
}
