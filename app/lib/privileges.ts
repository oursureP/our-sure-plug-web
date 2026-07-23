import { Role } from "@/app/interfaces";

export const PRIVILEGES = {
  MANAGE_STAFF: "MANAGE_STAFF",
  DELETE_STAFF: "DELETE_STAFF",
  BLOCK_USER: "BLOCK_USER",
  ASSIGN_ROLE: "ASSIGN_ROLE",
  MANAGE_PRIVILEGES: "MANAGE_PRIVILEGES",
  MANAGE_DEPARTMENTS: "MANAGE_DEPARTMENTS",
  // ...mirror the rest as needed
} as const;

// Mirror of backend ROLE_PRIVILEGES (keep in sync). CEO = everything.
const ROLE_PRIVILEGES: Record<Role, string[]> = {
  CEO: Object.values(PRIVILEGES),
  HEAD_OF_OPERATIONS: [
    PRIVILEGES.MANAGE_STAFF,
    PRIVILEGES.BLOCK_USER,
    PRIVILEGES.MANAGE_DEPARTMENTS,
  ],
  DEPARTMENT_HEAD: [],
  STAFF: [],
  TRAINER: [],
  CLIENT: [],
};

export function hasPrivilege(
  user: { role: Role; privileges?: string[] } | null,
  privilege: string,
): boolean {
  if (!user) return false;
  const base = ROLE_PRIVILEGES[user.role] ?? [];
  const effective = new Set([...base, ...(user.privileges ?? [])]);
  return effective.has(privilege);
}
