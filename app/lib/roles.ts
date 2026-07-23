import { Role } from "@/app/interfaces";

// Staff roles that can access the dashboard
export const STAFF_ROLES: Role[] = [
  "CEO",
  "HEAD_OF_OPERATIONS",
  "DEPARTMENT_HEAD",
  "STAFF",
  "TRAINER",
];

// Roles that can access the client/student portal
export const PORTAL_ROLES: Role[] = ["CLIENT"];
