"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { contactApi } from "@/app/lib/api/contact.api";

function resolveMessage(message: unknown): string {
  if (Array.isArray(message))
    return String(message[0] ?? "Something went wrong");
  if (typeof message === "string") return message;
  return "Something went wrong. Please try again.";
}

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.message) {
      toast.error("Please fill in your name, email and message");
      return;
    }
    if (form.message.length < 10) {
      toast.error("Please write a slightly longer message");
      return;
    }

    setLoading(true);
    try {
      const res = await contactApi.submit({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone || undefined,
        subject: form.subject || undefined,
        message: form.message,
      });
      toast.success(res?.message ?? "Message sent! We'll be in touch soon.");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: unknown }>;
      toast.error(resolveMessage(axiosError.response?.data?.message));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-[13.5px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-md shadow-black/4 dark:bg-[#161427] dark:shadow-none sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
            First Name *
          </label>
          <input
            value={form.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            className={inputClass}
            placeholder="John"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
            Last Name *
          </label>
          <input
            value={form.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            className={inputClass}
            placeholder="Doe"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
            Email *
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputClass}
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
            className={inputClass}
            placeholder="+234 800 000 0000"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
          Subject
        </label>
        <input
          value={form.subject}
          onChange={(e) => update("subject", e.target.value)}
          className={inputClass}
          placeholder="How can we help?"
        />
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
          Message *
        </label>
        <textarea
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          rows={5}
          className={`${inputClass} resize-none`}
          placeholder="Tell us about your project or inquiry..."
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-60">
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Sending...
          </>
        ) : (
          <>
            Send Message <Send size={15} />
          </>
        )}
      </button>
    </div>
  );
}
