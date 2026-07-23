import { Role, GenderEnum } from "./enums";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string | null;
  country?: string | null;
  state?: string | null;
  lga?: string | null;
  dob?: string | null;
  phone?: string | null;
  image?: string | null;
  bio?: string | null;
  address?: string | null;
  privileges: string[];
  gender?: GenderEnum | null;
  role: Role;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: string | null;
  departmentId?: string | null;
  createdAt: string;
  updatedAt: string;

  // departments?: Department | null;
  departments?: Array<{ id: string; name: string }> | null;
}

export interface Department {
  id: string;
  name: string;
  description?: string | null;
  createdById?: string | null;
  createdAt: string;
  updatedAt: string;

  createdBy?: Pick<User, "id" | "firstName" | "lastName"> | null;
  users?: User[];
  _count?: {
    users?: number;
    projects?: number;
  };
}
