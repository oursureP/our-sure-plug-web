"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { X, Loader2, Save, Camera, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Service } from "@/app/interfaces/lms.interface";
import { useCreateService, useUpdateService } from "@/app/hooks/use-services";

function resolveMessage(message: unknown): string {
  if (Array.isArray(message))
    return String(message[0] ?? "Something went wrong");
  if (typeof message === "string") return message;
  return "Something went wrong. Please try again.";
}

export function ServiceModal({
  service,
  onClose,
}: {
  service?: Service | null;
  onClose: () => void;
}) {
  const isEdit = !!service;
  const createMut = useCreateService();
  const updateMut = useUpdateService();
  const fileRef = useRef<HTMLInputElement>(null);
  const saving = createMut.isPending || updateMut.isPending;

  // image holds either an existing Cloudinary URL, a new base64 string, or null
  const [image, setImage] = useState<string | null>(service?.image ?? null);
  const [form, setForm] = useState({
    name: service?.name ?? "",
    tagline: service?.tagline ?? "",
    description: service?.description ?? "",
    isActive: service?.isActive ?? true,
  });
  const [features, setFeatures] = useState<string[]>(service?.features ?? []);
  const [featureInput, setFeatureInput] = useState("");

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const addFeature = () => {
    const v = featureInput.trim();
    if (!v) return;
    setFeatures((f) => [...f, v]);
    setFeatureInput("");
  };
  const removeFeature = (i: number) =>
    setFeatures((f) => f.filter((_, idx) => idx !== i));

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string); // base64
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Service name is required");
      return;
    }
    const payload = {
      name: form.name,
      tagline: form.tagline || undefined,
      description: form.description || undefined,
      features,
      isActive: form.isActive,
      ...(image ? { image } : {}), // base64 (new) or existing URL — backend decides
    };
    try {
      if (isEdit && service) {
        await updateMut.mutateAsync({ id: service.id, payload });
        toast.success("Service updated");
      } else {
        await createMut.mutateAsync(payload);
        toast.success("Service created");
      }
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
      onClick={() => !saving && onClose()}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-popover shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-popover px-6 py-4">
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            {isEdit ? "Edit Service" : "New Service"}
          </h3>
          <button
            onClick={() => !saving && onClose()}
            className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 p-6">
          {/* Image */}
          <div>
            <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
              Image
            </label>
            <div className="relative h-36 w-full overflow-hidden rounded-xl border border-border bg-muted">
              {image ? (
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized={image.startsWith("data:")}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[12.5px] text-muted-foreground">
                  No image selected
                </div>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-lg bg-background/90 px-3 py-1.5 text-[12px] font-semibold text-foreground backdrop-blur-sm hover:bg-background">
                <Camera size={13} /> {image ? "Change" : "Upload"}
              </button>
              {image && (
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-lg bg-background/90 px-3 py-1.5 text-[12px] font-semibold text-destructive backdrop-blur-sm hover:bg-background">
                  <Trash2 size={13} /> Remove
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
              Name *
            </label>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className={inputClass}
              placeholder="e.g. Web Development"
              autoFocus
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
              Tagline
            </label>
            <input
              value={form.tagline}
              onChange={(e) => update("tagline", e.target.value)}
              className={inputClass}
              placeholder="A short punchy one-liner"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Full description shown on the service page..."
            />
          </div>

          {/* Features */}
          <div>
            <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
              What&apos;s Included
            </label>
            <div className="mb-2 flex gap-2">
              <input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addFeature();
                  }
                }}
                className={inputClass}
                placeholder="e.g. Custom responsive design"
              />
              <button
                type="button"
                onClick={addFeature}
                disabled={!featureInput.trim()}
                className="flex items-center rounded-lg bg-primary px-4 text-[13px] font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60">
                <Plus size={15} />
              </button>
            </div>
            {features.length > 0 && (
              <div className="space-y-1.5">
                {features.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                    <span className="text-[13px] text-foreground">{f}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(i)}
                      className="text-muted-foreground hover:text-destructive">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => update("isActive", e.target.checked)}
              className="h-4 w-4 rounded border-border accent-(--brand-purple)"
            />
            <span className="text-[13px] font-medium text-foreground">
              Active (visible on the website)
            </span>
          </label>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-border bg-popover px-6 py-4">
          <button
            onClick={() => !saving && onClose()}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-foreground/4">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60">
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={16} /> {isEdit ? "Update" : "Create"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
