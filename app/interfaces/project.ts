export type ProjectStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "COMPLETED"
  | "CANCELLED";

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    image?: string | null;
    role?: string;
  };
}
export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  isCompleted: boolean;
  completedAt?: string | null;
  projectId: string;
}
export interface ProjectFile {
  id: string;
  name: string;
  url: string;
  isDesign: boolean;
  isApproved?: boolean | null;
  feedback?: string | null;
  uploadedById: string;
  createdAt: string;
  projectId: string;
}
export interface ProjectTask {
  id: string;
  title: string;
  status: string;
  priority: string;
  deadline: string;
  assignedTo?: { id: string; firstName: string; lastName: string } | null;
}
export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  startDate?: string | null;
  dueDate?: string | null;
  budget?: string | null;
  clientId: string;
  departmentId: string;
  createdById?: string;
  createdAt: string;
  updatedAt: string;
  department?: { id: string; name: string };
  client?: {
    id: string;
    company?: string | null;
    user?: { id: string; firstName: string; lastName: string; email: string };
  };
  members?: ProjectMember[];
  milestones?: Milestone[];
  files?: ProjectFile[];
  tasks?: ProjectTask[];
  _count?: { tasks?: number };
}
export interface ProjectStats {
  total: number;
  notStarted: number;
  inProgress: number;
  inReview: number;
  completed: number;
  cancelled: number;
}
