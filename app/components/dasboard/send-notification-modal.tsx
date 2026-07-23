"use client";

import { useState } from "react";
import { X, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { notificationsApi } from "@/app/lib/api/notifications.api";

function resolveMessage(message: unknown): string {
  if (Array.isArray(message))
    return String(message[0] ?? "Something went wrong");
  if (typeof message === "string") return message;
  return "Something went wrong. Please try again.";
}

const TYPES = [
  "GENERAL",
  "PROJECT_UPDATE",
  "TASK_ASSIGNED",
  "INVOICE_GENERATED",
];

export function SendNotificationModal({
  userId,
  userName,
  onClose,
}: {
  userId: string;
  userName: string;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    title: "",
    body: "",
    type: "GENERAL",
    link: "",
  });
  const mut = useMutation({
    mutationFn: () =>
      notificationsApi.create({
        userId,
        type: form.type,
        title: form.title,
        body: form.body,
        link: form.link || undefined,
      }),
  });

  const update = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSend = async () => {
    if (!form.title.trim() || !form.body.trim()) {
      toast.error("Title and message are required");
      return;
    }
    try {
      await mut.mutateAsync();
      toast.success(`Notification sent to ${userName}`);
      onClose();
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: unknown }>;
      toast.error(resolveMessage(axiosError.response?.data?.message));
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-[13.5px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
      onClick={() => !mut.isPending && onClose()}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-popover shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-foreground">
              Send Notification
            </h3>
            <p className="text-[12px] text-muted-foreground">To {userName}</p>
          </div>
          <button
            onClick={() => !mut.isPending && onClose()}
            className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div>
            <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
              Type
            </label>
            <select
              value={form.type}
              onChange={(e) => update("type", e.target.value)}
              className={inputClass}>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
              Title *
            </label>
            <input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className={inputClass}
              placeholder="Notification title"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
              Message *
            </label>
            <textarea
              value={form.body}
              onChange={(e) => update("body", e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Write your message..."
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
              Link (optional)
            </label>
            <input
              value={form.link}
              onChange={(e) => update("link", e.target.value)}
              className={inputClass}
              placeholder="/dashboard/projects/..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
          <button
            onClick={() => !mut.isPending && onClose()}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-foreground/4">
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={mut.isPending}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60">
            {mut.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Sending...
              </>
            ) : (
              <>
                <Send size={15} /> Send
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
