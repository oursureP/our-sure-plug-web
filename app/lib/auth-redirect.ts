import { Role } from "@/app/interfaces";

export function getRedirectPath(role: Role): string {
  switch (role) {
    case "CLIENT":
      return "/portal";
    case "CEO":
    case "HEAD_OF_OPERATIONS":
    case "DEPARTMENT_HEAD":
    case "STAFF":
    case "TRAINER":
      return "/dashboard";
    default:
      return "/dashboard";
  }
}
