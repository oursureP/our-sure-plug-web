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

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
  userId: string;
}
