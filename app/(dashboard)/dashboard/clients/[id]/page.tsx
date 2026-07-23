"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Pencil,
  Building2,
  Mail,
  Phone,
  MapPin,
  LayoutGrid,
  Briefcase,
  FileText,
  MessageSquare,
  FolderOpen,
  Send,
  Trash2,
  Upload,
  Download,
  X,
  Save,
  Calendar,
  Paperclip,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";
import { Client } from "@/app/interfaces/client";
import {
  useClient,
  useUpdateClient,
  useClientMessages,
  useSendMessage,
  useDeleteMessage,
  useUploadClientFile,
  useDeleteClientFile,
} from "@/app/hooks/use-clients";
import { ConfirmDialog } from "@/app/components/dasboard/confirm-dialog";

function resolveMessage(m: unknown): string {
  if (Array.isArray(m)) return String(m[0] ?? "Something went wrong");
  if (typeof m === "string") return m;
  return "Something went wrong. Please try again.";
}
function naira(n: string | number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(n));
}
function fmtDate(d?: string | null) {
  return d
    ? new Date(d).toLocaleDateString("en-NG", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";
}
function fmtTime(d: string) {
  return new Date(d).toLocaleString("en-NG", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Tab = "overview" | "projects" | "invoices" | "messages" | "files";

const PROJECT_STATUS: Record<string, string> = {
  NOT_STARTED: "bg-slate-500/15 text-slate-600 dark:text-slate-400",
  IN_PROGRESS: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  COMPLETED: "bg-green-500/15 text-green-600 dark:text-green-400",
  CANCELLED: "bg-red-500/15 text-red-600 dark:text-red-400",
};
const INVOICE_STATUS: Record<string, string> = {
  PAID: "bg-green-500/15 text-green-600 dark:text-green-400",
  PENDING: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  OVERDUE: "bg-red-500/15 text-red-600 dark:text-red-400",
  CANCELLED: "bg-slate-500/15 text-slate-500",
};

// ---- Edit modal ----
function EditClientModal({
  client,
  onClose,
}: {
  client: Client;
  onClose: () => void;
}) {
  const updateMut = useUpdateClient();
  const [form, setForm] = useState({
    company: client.company ?? "",
    address: client.address ?? "",
    notes: client.notes ?? "",
  });
  const save = async () => {
    try {
      await updateMut.mutateAsync({ id: client.id, payload: form });
      toast.success("Client updated");
      onClose();
    } catch (e) {
      toast.error(
        resolveMessage(
          (e as AxiosError<{ message?: unknown }>).response?.data?.message,
        ),
      );
    }
  };
  const input =
    "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-[13.5px] text-foreground outline-none focus:border-primary";
  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
      onClick={() => !updateMut.isPending && onClose()}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-popover shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="text-lg font-bold text-foreground">Edit Client</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4 p-6">
          <div>
            <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
              Company
            </label>
            <input
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className={input}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
              Address
            </label>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className={input}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className={`${input} resize-none`}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-foreground/4">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={updateMut.isPending}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60">
            {updateMut.isPending ? (
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

// ---- Messages tab (chat) ----
function MessagesTab({ clientId }: { clientId: string }) {
  //   const me = useAuthStore((s) => s.user);
  const { data: messages, isLoading } = useClientMessages(clientId);
  const sendMut = useSendMessage(clientId);
  const deleteMut = useDeleteMessage(clientId);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!text.trim()) return;
    try {
      await sendMut.mutateAsync(text);
      setText("");
    } catch (e) {
      toast.error(
        resolveMessage(
          (e as AxiosError<{ message?: unknown }>).response?.data?.message,
        ),
      );
    }
  };
  const isClientMsg = (role: string) => role === "CLIENT";

  return (
    <div className="flex h-130 flex-col rounded-2xl border border-border bg-card">
      <div className="flex-1 space-y-3 overflow-y-auto p-5">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : messages && messages.length > 0 ? (
          messages.map((m) => {
            const fromClient = isClientMsg(m.senderRole);
            return (
              <div
                key={m.id}
                className={cn(
                  "flex",
                  fromClient ? "justify-start" : "justify-end",
                )}>
                <div
                  className={cn(
                    "group relative max-w-[75%] rounded-2xl px-4 py-2.5",
                    fromClient
                      ? "bg-muted text-foreground"
                      : "bg-primary text-primary-foreground",
                  )}>
                  <p className="text-[13.5px] leading-relaxed whitespace-pre-line">
                    {m.content}
                  </p>
                  <div
                    className={cn(
                      "mt-1 text-[10px]",
                      fromClient
                        ? "text-muted-foreground"
                        : "text-primary-foreground/70",
                    )}>
                    {fmtTime(m.createdAt)}
                  </div>
                  {!fromClient && (
                    <button
                      onClick={() => setDeleting(m.id)}
                      className="absolute -left-7 top-1/2 -translate-y-1/2 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100">
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <MessageSquare
              size={30}
              className="mb-3 text-muted-foreground/40"
            />
            <p className="text-[13.5px] font-semibold text-foreground">
              No messages yet
            </p>
            <p className="mt-1 text-[12.5px] text-muted-foreground">
              Start the conversation below.
            </p>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())
            }
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-[13.5px] text-foreground outline-none focus:border-primary"
            placeholder="Type a message..."
          />
          <button
            onClick={send}
            disabled={!text.trim() || sendMut.isPending}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50">
            {sendMut.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>
      {deleting && (
        <ConfirmDialog
          title="Delete message?"
          message="This message will be permanently removed."
          confirmLabel="Delete"
          loading={deleteMut.isPending}
          onConfirm={async () => {
            await deleteMut.mutateAsync(deleting);
            setDeleting(null);
          }}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

// ---- Files tab ----
function FilesTab({ client }: { client: Client }) {
  const uploadMut = useUploadClientFile(client.id);
  const deleteMut = useDeleteClientFile(client.id);
  const fileRef = useRef<HTMLInputElement>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const onSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await uploadMut.mutateAsync({
          base64: reader.result as string,
          name: file.name,
          type: file.type.includes("pdf")
            ? "document"
            : file.type.split("/")[0] || "file",
        });
        toast.success("File uploaded");
      } catch (err) {
        toast.error(
          resolveMessage(
            (err as AxiosError<{ message?: unknown }>).response?.data?.message,
          ),
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const files = client.files ?? [];
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[13px] text-muted-foreground">
          {files.length} file{files.length === 1 ? "" : "s"}
        </p>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploadMut.isPending}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60">
          {uploadMut.isPending ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Uploading...
            </>
          ) : (
            <>
              <Upload size={15} /> Upload File
            </>
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          onChange={onSelect}
          className="hidden"
        />
      </div>
      {files.length > 0 ? (
        <div className="space-y-2">
          {files.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/13 text-primary">
                  <Paperclip size={16} />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-foreground">
                    {f.name}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="capitalize">{f.type}</span> ·{" "}
                    <Calendar size={10} /> {fmtDate(f.createdAt)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-foreground/6 hover:text-primary">
                  <Download size={15} />
                </a>
                <button
                  onClick={() => setDeleting(f.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <FolderOpen
            size={30}
            className="mx-auto mb-3 text-muted-foreground/40"
          />
          <p className="text-[14px] font-semibold text-foreground">
            No files yet
          </p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Upload contracts, deliverables, or documents.
          </p>
        </div>
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete file?"
          message="This file will be permanently removed."
          confirmLabel="Delete"
          loading={deleteMut.isPending}
          onConfirm={async () => {
            await deleteMut.mutateAsync(deleting);
            setDeleting(null);
          }}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

// ---- Main page ----
export default function SingleClientPage() {
  const { id } = useParams<{ id: string }>();
  const { data: client, isLoading } = useClient(id);
  const [tab, setTab] = useState<Tab>("overview");
  const [editOpen, setEditOpen] = useState(false);

  if (isLoading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  if (!client)
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-bold text-foreground">Client not found</p>
        <Link
          href="/dashboard/clients"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft size={15} /> Back to clients
        </Link>
      </div>
    );

  const u = client.user;
  const tabs: {
    key: Tab;
    label: string;
    icon: typeof LayoutGrid;
    count?: number;
  }[] = [
    { key: "overview", label: "Overview", icon: LayoutGrid },
    {
      key: "projects",
      label: "Projects",
      icon: Briefcase,
      count: client._count?.projects,
    },
    {
      key: "invoices",
      label: "Invoices",
      icon: FileText,
      count: client._count?.invoices,
    },
    { key: "messages", label: "Messages", icon: MessageSquare },
    {
      key: "files",
      label: "Files",
      icon: FolderOpen,
      count: client._count?.files,
    },
  ];
  const card = "rounded-2xl border border-border bg-card p-6";

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/dashboard/clients"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary">
        <ArrowLeft size={15} /> Back to clients
      </Link>

      {/* Header */}
      <div className={cn(card, "mb-6")}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {u?.image ? (
              <Image
                src={u.image}
                alt=""
                width={64}
                height={64}
                className="h-16 w-16 rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">
                {u ? `${u.firstName[0]}${u.lastName[0]}` : "?"}
              </div>
            )}
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-foreground">
                {u ? `${u.firstName} ${u.lastName}` : "Unknown"}
              </h1>
              {client.company && (
                <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                  <Building2 size={13} /> {client.company}
                </div>
              )}
            </div>
          </div>
          <Link
            href={`/dashboard/invoices/new?clientId=${client.id}`}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-bold text-primary-foreground hover:opacity-90">
            <Plus size={15} /> New Invoice
          </Link>
          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-[13px] font-semibold text-foreground hover:bg-foreground/4">
            <Pencil size={14} /> Edit
          </button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-muted-foreground">
          {u?.email && (
            <span className="flex items-center gap-1.5">
              <Mail size={13} /> {u.email}
            </span>
          )}
          {u?.phone && (
            <span className="flex items-center gap-1.5">
              <Phone size={13} /> {u.phone}
            </span>
          )}
          {client.address && (
            <span className="flex items-center gap-1.5">
              <MapPin size={13} /> {client.address}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2.5 text-[13.5px] font-semibold transition-colors",
              tab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}>
            <t.icon size={16} /> {t.label}
            {t.count != null && t.count > 0 && (
              <span className="rounded-full bg-muted px-1.5 text-[10px] font-bold">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === "overview" && (
        <div className="space-y-6">
          <div className={card}>
            <h2 className="mb-4 text-[15px] font-bold text-foreground">
              Details
            </h2>
            <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2 text-[13.5px]">
              <div>
                <span className="text-muted-foreground">Company: </span>
                <span className="text-foreground">{client.company ?? "—"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Email: </span>
                <span className="text-foreground">{u?.email ?? "—"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Phone: </span>
                <span className="text-foreground">{u?.phone ?? "—"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Location: </span>
                <span className="text-foreground">
                  {[u?.state, u?.country].filter(Boolean).join(", ") || "—"}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-muted-foreground">Address: </span>
                <span className="text-foreground">
                  {client.address ?? u?.address ?? "—"}
                </span>
              </div>
            </div>
            {client.notes && (
              <div className="mt-4 border-t border-border pt-4">
                <h3 className="mb-1.5 text-[13px] font-semibold text-foreground">
                  Notes
                </h3>
                <p className="text-[13px] leading-relaxed text-muted-foreground whitespace-pre-line">
                  {client.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Projects */}
      {tab === "projects" && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {client.projects && client.projects.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Project
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Status
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Due
                  </th>
                </tr>
              </thead>
              <tbody>
                {client.projects.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-border last:border-0 hover:bg-foreground/2">
                    <td className="px-5 py-3">
                      <Link
                        href={`/dashboard/projects/${p.id}`}
                        className="text-[13.5px] font-semibold text-foreground hover:text-primary">
                        {p.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase",
                          PROJECT_STATUS[p.status] ??
                            "bg-slate-500/15 text-slate-500",
                        )}>
                        {p.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[13px] text-muted-foreground">
                      {fmtDate(p.dueDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <Briefcase
                size={30}
                className="mx-auto mb-3 text-muted-foreground/40"
              />
              <p className="text-[14px] font-semibold text-foreground">
                No projects yet
              </p>
            </div>
          )}
        </div>
      )}

      {/* Invoices */}
      {tab === "invoices" && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {client.invoices && client.invoices.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Invoice
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Amount
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Status
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Due
                  </th>
                </tr>
              </thead>
              <tbody>
                {client.invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-b border-border last:border-0 hover:bg-foreground/2">
                    <td className="px-5 py-3">
                      <Link
                        href={`/dashboard/invoices/${inv.id}`}
                        className="text-[13.5px] font-semibold text-foreground hover:text-primary">
                        {inv.invoiceNo}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-[13px] font-semibold text-foreground">
                      {naira(inv.total)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase",
                          INVOICE_STATUS[inv.status] ??
                            "bg-slate-500/15 text-slate-500",
                        )}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[13px] text-muted-foreground">
                      {fmtDate(inv.dueDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <FileText
                size={30}
                className="mx-auto mb-3 text-muted-foreground/40"
              />
              <p className="text-[14px] font-semibold text-foreground">
                No invoices yet
              </p>
            </div>
          )}
        </div>
      )}

      {tab === "messages" && <MessagesTab clientId={client.id} />}
      {tab === "files" && <FilesTab client={client} />}

      {editOpen && (
        <EditClientModal client={client} onClose={() => setEditOpen(false)} />
      )}
    </div>
  );
}
