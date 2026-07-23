"use client";

import { useState } from "react";
import {
  ArrowRight,
  X,
  Loader2,
  Monitor,
  MapPin,
  Calendar,
  Infinity,
} from "lucide-react";
import { toast } from "sonner";
import { Course, CourseSession } from "@/app/interfaces/lms.interface";
import { paymentsApi } from "@/app/lib/api/payments.api";
import { AxiosError } from "axios";
import { formatError, resolveMessage } from "@/app/utils/helper";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function EnrollButton({
  course,
  sessions,
  label,
  className,
}: {
  course: Pick<Course, "id" | "title" | "courseType">;
  sessions: CourseSession[];
  label?: string;
  className?: string;
}) {
  const isPersonal = sessions.length === 0;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    sessionId: sessions[0]?.id ?? "",
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.phone) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!isPersonal && !form.sessionId) {
      toast.error("Please select a session");
      return;
    }

    setLoading(true);
    try {
      const res = await paymentsApi.initializeCoursePayment({
        courseId: course.id,
        ...(isPersonal ? {} : { sessionId: form.sessionId }),
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
      });
      window.location.href = res.authorizationUrl;
    } catch (error) {
      const axiosError = error as AxiosError;
      const formatted = formatError(axiosError);
      toast.error(resolveMessage(formatted.message));
      setLoading(false);
    }
  };

  const isOnline = course.courseType === "ONLINE";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`group flex ${className ?? "w-full"} items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:opacity-90 cursor-pointer`}>
        {label ?? "Enroll Now"}
        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-1"
        />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center p-4"
          onClick={() => !loading && setOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div
            className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-popover shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border p-5">
              <div>
                <h3 className="text-lg font-bold tracking-tight text-foreground">
                  Enroll in this course
                </h3>
                <p className="mt-0.5 line-clamp-1 text-[12.5px] text-muted-foreground">
                  {course.title}
                </p>
              </div>
              <button
                onClick={() => !loading && setOpen(false)}
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Close">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 p-5">
              {sessions.length > 0 ? (
                <div>
                  <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
                    Select Session
                  </label>
                  <div className="space-y-2">
                    {sessions.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => update("sessionId", s.id)}
                        className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-colors ${form.sessionId === s.id ? "border-primary bg-primary/6" : "border-border hover:border-primary/40"}`}>
                        <div>
                          <div className="text-[13px] font-semibold text-foreground">
                            {s.title}
                          </div>
                          <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                            <Calendar size={11} className="text-primary" />
                            Register by {formatDate(s.endDate)}
                          </div>
                        </div>
                        <span className="text-primary">
                          {isOnline ? (
                            <Monitor size={14} />
                          ) : (
                            <MapPin size={14} />
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 rounded-xl border border-primary/25 bg-primary/5 p-3">
                  <Infinity size={16} className="shrink-0 text-primary" />
                  <p className="text-[12.5px] text-foreground">
                    Self-paced course — start learning immediately after
                    payment.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
                    First Name
                  </label>
                  <input
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
                    Last Name
                  </label>
                  <input
                    value={form.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
                  Phone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                  placeholder="+234 800 000 0000"
                />
              </div>

              <p className="text-[11.5px] leading-relaxed text-muted-foreground">
                You&apos;ll be redirected to a secure Paystack page to complete
                payment.{" "}
                {isOnline &&
                  "Your login details will be emailed after payment."}
              </p>
            </div>

            {/* Footer */}
            <div className="border-t border-border p-5">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-60">
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    Proceed to Payment <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
