"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Project } from "@/app/interfaces/project";
import { useCreateProject, useUpdateProject } from "@/app/hooks/use-projects";
import { useClients } from "@/app/hooks/use-clients";
import { useDepartments } from "@/app/hooks/use-departments";

function resolveMessage(m: unknown): string {
  if (Array.isArray(m)) return String(m[0] ?? "Something went wrong");
  if (typeof m === "string") return m;
  return "Something went wrong. Please try again.";
}

const STATUSES = [
  { key: "NOT_STARTED", label: "Not Started" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "IN_REVIEW", label: "In Review" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED", label: "Cancelled" },
];

export function ProjectForm({ project }: { project?: Project | null }) {
  const isEdit = !!project;
  const router = useRouter();
  const createMut = useCreateProject();
  const updateMut = useUpdateProject();
  const saving = createMut.isPending || updateMut.isPending;

  const { data: clients } = useClients();
  const { data: departments } = useDepartments();

  const [form, setForm] = useState({
    title: project?.title ?? "",
    description: project?.description ?? "",
    clientId: project?.clientId ?? "",
    departmentId: project?.departmentId ?? "",
    startDate: project?.startDate ? project.startDate.slice(0, 10) : "",
    dueDate: project?.dueDate ? project.dueDate.slice(0, 10) : "",
    budget: project?.budget ?? "",
    status: project?.status ?? "NOT_STARTED",
  });

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!form.clientId) {
      toast.error("Select a client");
      return;
    }
    if (!form.departmentId) {
      toast.error("Select a department");
      return;
    }
    if (!form.startDate) {
      toast.error("Start date is required");
      return;
    }
    if (!form.dueDate) {
      toast.error("Due date is required");
      return;
    }
    if (new Date(form.dueDate) < new Date(form.startDate)) {
      toast.error("Due date cannot be before the start date");
      return;
    }
    if (!form.budget.trim()) {
      toast.error("Budget is required");
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      clientId: form.clientId,
      departmentId: form.departmentId,
      startDate: new Date(form.startDate).toISOString(),
      dueDate: new Date(form.dueDate).toISOString(),
      budget: form.budget,
    };

    try {
      if (isEdit && project) {
        await updateMut.mutateAsync({
          id: project.id,
          payload: { ...payload, status: form.status },
        });
        toast.success("Project updated");
        router.push(`/dashboard/projects/${project.id}`);
      } else {
        const created = await createMut.mutateAsync(payload);
        toast.success("Project created");
        router.push(`/dashboard/projects/${created.id}`);
      }
    } catch (error) {
      toast.error(
        resolveMessage(
          (error as AxiosError<{ message?: unknown }>).response?.data?.message,
        ),
      );
    }
  };

  const input =
    "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-[13.5px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";
  const label = "mb-1.5 block text-[12.5px] font-semibold text-foreground";
  const card = "rounded-2xl border border-border bg-card p-6";

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => router.push("/dashboard/projects")}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary">
        <ArrowLeft size={15} /> Back to projects
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          {isEdit ? "Edit Project" : "New Project"}
        </h1>
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          {isEdit
            ? "Update this project."
            : "Set up a project for a client. Members, milestones and files come after."}
        </p>
      </div>

      <div className="space-y-6">
        <div className={card}>
          <h2 className="mb-4 text-[15px] font-bold text-foreground">
            Project Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className={label}>Title *</label>
              <input
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                className={input}
                placeholder="e.g. Acme Corp website redesign"
                autoFocus
              />
            </div>
            <div>
              <label className={label}>Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={4}
                className={`${input} resize-none`}
                placeholder="What this project delivers, scope, key notes..."
              />
            </div>
          </div>
        </div>

        <div className={card}>
          <h2 className="mb-4 text-[15px] font-bold text-foreground">
            Assignment
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Client *</label>
              <select
                value={form.clientId}
                onChange={(e) => update("clientId", e.target.value)}
                className={input}>
                <option value="">Select client...</option>
                {(clients ?? []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company ??
                      (c.user
                        ? `${c.user.firstName} ${c.user.lastName}`
                        : "Unknown")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Department *</label>
              <select
                value={form.departmentId}
                onChange={(e) => update("departmentId", e.target.value)}
                className={input}>
                <option value="">Select department...</option>
                {(departments ?? []).map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            {isEdit && (
              <div className="sm:col-span-2">
                <label className={label}>Status</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    update("status", e.target.value as typeof form.status)
                  }
                  className={input}>
                  {STATUSES.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className={card}>
          <h2 className="mb-4 text-[15px] font-bold text-foreground">
            Timeline & Budget
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={label}>Start Date *</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => update("startDate", e.target.value)}
                className={input}
              />
            </div>
            <div>
              <label className={label}>Due Date *</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => update("dueDate", e.target.value)}
                className={input}
              />
            </div>
            <div>
              <label className={label}>Budget (₦) *</label>
              <input
                value={form.budget}
                onChange={(e) => update("budget", e.target.value)}
                className={input}
                placeholder="500000"
                inputMode="decimal"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => router.push("/dashboard/projects")}
            className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-foreground/4">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60">
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={16} />{" "}
                {isEdit ? "Update Project" : "Create Project"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
