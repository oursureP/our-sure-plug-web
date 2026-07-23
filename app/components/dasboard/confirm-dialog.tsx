"use client";

import { Loader2, AlertTriangle } from "lucide-react";

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Delete",
  loading = false,
  onConfirm,
  onClose,
  action,
}: {
  title: string;
  action?: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-110 flex items-center justify-center p-4"
      onClick={() => !loading && onClose()}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-sm rounded-2xl border border-border bg-popover p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle size={22} className="text-destructive" />
        </div>
        <h3 className="mb-1.5 text-lg font-bold text-foreground">{title}</h3>
        <p className="mb-6 text-[13.5px] leading-relaxed text-muted-foreground">
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => !loading && onClose()}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/4">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex items-center gap-2 rounded-xl ${confirmLabel === "Delete" ? "bg-destructive" : "bg-warning"} px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60`}>
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />{" "}
                {action !== "delete" ? "Waiting... " : "Deleting..."}
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
