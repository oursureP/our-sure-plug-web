import api from "../api";

export interface CoursePaymentPayload {
  courseId: string;
  sessionId?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface CoursePaymentResponse {
  authorizationUrl: string;
  reference: string;
  amount: string;
  courseTitle: string;
  sessionTitle: string;
  venue: string | null;
  startDate: string;
  endDate: string;
  courseType: "ONLINE" | "PHYSICAL";
  remainingSlots: number | null;
  email: string;
}

export interface PaymentStatusResponse {
  found: boolean;
  status: "PENDING" | "SUCCESS" | "FAILED" | string;
  amount?: string;
  serviceType?: string;
  type?: string;
  courseTitle?: string | null;
  sessionTitle?: string | null;
  startDate?: string | null;
  venue?: string | null;
  courseType?: string | null;
  enrollmentStatus?: string | null;
}

export const paymentsApi = {
  initializeCoursePayment: async (
    payload: CoursePaymentPayload,
  ): Promise<CoursePaymentResponse> => {
    const res = await api.post("/payments/course/initialize", payload);
    return res.data;
  },
  getStatus: async (reference: string): Promise<PaymentStatusResponse> =>
    (await api.get(`/payments/status/${reference}`)).data,
};
