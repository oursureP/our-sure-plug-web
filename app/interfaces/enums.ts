export type Role =
  | "CEO"
  | "HEAD_OF_OPERATIONS"
  | "DEPARTMENT_HEAD"
  | "STAFF"
  | "CLIENT"
  | "TRAINER";

export type GenderEnum = "Male" | "Female";

export type LeadStage =
  | "NEW_LEAD"
  | "CONTACTED"
  | "PROPOSAL_SENT"
  | "NEGOTIATION"
  | "CLOSED_WON"
  | "CLOSED_LOST";

export type ProjectStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "ON_HOLD"
  | "IN_REVIEW"
  | "COMPLETED"
  | "CANCELLED";

export type TaskStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "COMPLETED"
  | "OVERDUE";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type InvoiceStatus =
  | "DRAFT"
  | "SENT"
  | "PARTIALLY_PAID"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

export type NotificationType =
  | "TASK_ASSIGNED"
  | "TASK_DUE_SOON"
  | "TASK_OVERDUE"
  | "PROJECT_UPDATE"
  | "INVOICE_GENERATED"
  | "PAYMENT_RECEIVED"
  | "NEW_CLIENT"
  | "NEW_LEAD"
  | "GENERAL";

export type EnrollmentStatus =
  | "ACTIVE"
  | "COMPLETED"
  | "DROPPED"
  | "PENDING_PAYMENT";

export type PaymentType = "INVOICE" | "COURSE";

export type CourseType = "ONLINE" | "PHYSICAL";

export type PaymentMethod = "ONLINE" | "BANK_TRANSFER";

export type InvoiceType = "ONE_TIME" | "MAINTENANCE" | "RENEWAL";

export type ContractStatus = "ACTIVE" | "EXPIRED" | "CANCELLED";
