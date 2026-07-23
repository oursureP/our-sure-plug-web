import {
  LayoutDashboard,
  UserCog,
  Building2,
  TrendingUp,
  Briefcase,
  CheckSquare,
  Receipt,
  Layers,
  GraduationCap,
  BookOpen,
  FileBarChart,
  UserCircle,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { Role } from "@/app/interfaces";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
}

const ALL_STAFF: Role[] = [
  "CEO",
  "HEAD_OF_OPERATIONS",
  "DEPARTMENT_HEAD",
  "STAFF",
  "TRAINER",
];
const LEADERSHIP: Role[] = ["CEO", "HEAD_OF_OPERATIONS"];
const MANAGERS: Role[] = ["CEO", "HEAD_OF_OPERATIONS", "DEPARTMENT_HEAD"];

export const dashboardNav: NavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ALL_STAFF,
  },
  {
    label: "Leads",
    href: "/dashboard/leads",
    icon: TrendingUp,
    roles: MANAGERS,
  },
  {
    label: "Clients",
    href: "/dashboard/clients",
    icon: Building2,
    roles: MANAGERS,
  },
  {
    label: "Projects",
    href: "/dashboard/projects",
    icon: Briefcase,
    roles: ALL_STAFF,
  },
  {
    label: "Tasks",
    href: "/dashboard/tasks",
    icon: CheckSquare,
    roles: ALL_STAFF,
  },
  {
    label: "Invoices",
    href: "/dashboard/invoices",
    icon: Receipt,
    roles: MANAGERS,
  },
  {
    label: "Services",
    href: "/dashboard/services",
    icon: Layers,
    roles: MANAGERS,
  },
  {
    label: "Courses",
    href: "/dashboard/courses",
    icon: GraduationCap,
    roles: MANAGERS,
  },
  { label: "Blog", href: "/dashboard/blog", icon: BookOpen, roles: MANAGERS },
  {
    label: "Departments",
    href: "/dashboard/departments",
    icon: Layers,
    roles: LEADERSHIP,
  },
  {
    label: "Staff",
    href: "/dashboard/users",
    icon: UserCog,
    roles: MANAGERS,
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    icon: FileBarChart,
    roles: LEADERSHIP,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: UserCircle,
    roles: ALL_STAFF,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ALL_STAFF,
  },
];
