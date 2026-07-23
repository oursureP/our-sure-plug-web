export interface Department {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  createdById?: string | null;
  _count?: {
    users?: number;
    projects?: number;
  };
  users?: Array<{
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    image?: string | null;
  }>;
}
