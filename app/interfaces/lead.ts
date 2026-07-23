import { LeadStage } from "./enums";

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  source?: string | null;
  stage: LeadStage;
  estimatedValue?: number | null;
  notes?: string | null;
  lostReason?: string | null;
  assignedToId?: string | null;
  createdById?: string | null;
  createdAt: string;
  updatedAt: string;
  closedAt?: string | null;
  assignedTo?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  } | null;
  contactPerson?: ContactPerson | null;
  activities?: LeadActivity[];
  followUps?: FollowUp[];
  proposals?: Proposal[];
  client?: { id: string; company?: string | null } | null;
  _count?: { activities?: number; followUps?: number; proposals?: number };
}

export interface ContactPerson {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  position?: string | null;
  leadId: string;
}
export interface LeadActivity {
  id: string;
  type: string;
  description: string;
  createdAt: string;
  leadId: string;
}
export interface FollowUp {
  id: string;
  message: string;
  scheduledAt: string;
  isDone: boolean;
  createdAt: string;
  leadId: string;
}
export interface Proposal {
  id: string;
  title: string;
  content: string;
  amount: number;
  isAccepted?: boolean;
  expiresAt?: string | null;
  createdAt: string;
  leadId: string;
}

export interface PipelineSummary {
  stage: LeadStage;
  count: number;
  totalEstimatedValue: number;
}
