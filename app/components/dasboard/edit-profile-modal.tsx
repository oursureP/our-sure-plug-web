"use client";

import { useState } from "react";
import { X, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useAuthStore, AuthUser } from "@/app/stores/auth.store";
import { usersApi } from "@/app/lib/api/users.api";

function resolveMessage(message: unknown): string {
  if (Array.isArray(message))
    return String(message[0] ?? "Something went wrong");
  if (typeof message === "string") return message;
  return "Something went wrong. Please try again.";
}

export function EditProfileModal({
  user,
  onClose,
}: {
  user: AuthUser;
  onClose: () => void;
}) {
  const setUser = useAuthStore((s) => s.setUser);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    phone: user.phone ?? "",
    bio: user.bio ?? "",
    address: user.address ?? "",
    country: user.country ?? "",
    state: user.state ?? "",
    lga: user.lga ?? "",
    gender: user.gender ?? "",
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await usersApi.updateProfile(user.id, {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone || undefined,
        bio: form.bio || undefined,
        address: form.address || undefined,
        country: form.country || undefined,
        state: form.state || undefined,
        lga: form.lga || undefined,
        gender: (form.gender as "Male" | "Female") || undefined,
      });
      setUser({ ...user, ...updated });
      toast.success("Profile updated");
      onClose();
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: unknown }>;
      toast.error(resolveMessage(axiosError.response?.data?.message));
    } finally {
      setSaving(false);
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
            Edit Profile
          </h3>
          <button
            onClick={() => !saving && onClose()}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
                First Name
              </label>
              <input
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
                Last Name
              </label>
              <input
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
                Phone
              </label>
              <input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={inputClass}
                placeholder="+234..."
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
                Gender
              </label>
              <select
                value={form.gender}
                onChange={(e) => update("gender", e.target.value)}
                className={inputClass}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
              Address
            </label>
            <input
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
                Country
              </label>
              <input
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
                State
              </label>
              <input
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
                LGA
              </label>
              <input
                value={form.lga}
                onChange={(e) => update("lga", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
              Bio
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => update("bio", e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="A short bio..."
            />
          </div>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-border bg-popover px-6 py-4">
          <button
            onClick={() => !saving && onClose()}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/4">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-60">
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={16} /> Save
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
