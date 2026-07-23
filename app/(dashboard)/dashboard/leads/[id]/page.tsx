"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Pencil,
  Building2,
  Mail,
  Phone,
  User as UserIcon,
  TrendingUp,
  Plus,
  Check,
  Calendar,
  FileText,
  Phone as PhoneIcon,
  Users,
  ArrowRight,
  CheckCircle2,
  Clock,
  //   X,
  DollarSign,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";
// import { Lead } from "@/app/interfaces/lead";
import { LeadStage } from "@/app/interfaces/enums";
import {
  useLead,
  useUpdateLeadStage,
  useConvertLead,
  useAddActivity,
  useAddFollowUp,
  useMarkFollowUpDone,
  useCreateProposal,
  useAddContactPerson,
} from "@/app/hooks/use-leads";
import { LeadModal } from "@/app/components/leeds/lead-modal";

function resolveMessage(m: unknown): string {
  if (Array.isArray(m)) return String(m[0] ?? "Something went wrong");
  if (typeof m === "string") return m;
  return "Something went wrong. Please try again.";
}
function naira(n: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
function fmtDateTime(d: string) {
  return new Date(d).toLocaleString("en-NG", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STAGES: LeadStage[] = [
  "NEW_LEAD",
  "CONTACTED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "CLOSED_WON",
  "CLOSED_LOST",
];
const STAGE_BADGE: Record<string, string> = {
  NEW_LEAD: "bg-slate-500/15 text-slate-600 dark:text-slate-400",
  CONTACTED: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  PROPOSAL_SENT: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  NEGOTIATION: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  CLOSED_WON: "bg-green-500/15 text-green-600 dark:text-green-400",
  CLOSED_LOST: "bg-red-500/15 text-red-600 dark:text-red-400",
};
const ACTIVITY_ICON: Record<string, typeof PhoneIcon> = {
  call: PhoneIcon,
  email: Mail,
  meeting: Users,
  note: FileText,
};

export default function SingleLeadPage() {
  const { id } = useParams<{ id: string }>();
  //   const router = useRouter();
  const { data: lead, isLoading } = useLead(id);

  const stageMut = useUpdateLeadStage();
  const convertMut = useConvertLead();
  const activityMut = useAddActivity();
  const followUpMut = useAddFollowUp();
  const markDoneMut = useMarkFollowUpDone(id);
  const proposalMut = useCreateProposal();
  const contactMut = useAddContactPerson();

  const [editOpen, setEditOpen] = useState(false);
  const [stageValue, setStageValue] = useState("");
  const [lostReason, setLostReason] = useState("");
  const [actType, setActType] = useState("call");
  const [actDesc, setActDesc] = useState("");
  const [fuMsg, setFuMsg] = useState("");
  const [fuDate, setFuDate] = useState("");
  const [showProposal, setShowProposal] = useState(false);
  const [prop, setProp] = useState({
    title: "",
    content: "",
    amount: "",
    expiresAt: "",
  });
  const [showContact, setShowContact] = useState(false);
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
  });

  if (isLoading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  if (!lead)
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-bold text-foreground">Lead not found</p>
        <Link
          href="/dashboard/leads"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft size={15} /> Back to leads
        </Link>
      </div>
    );

  const isClosed = lead.stage === "CLOSED_WON" || lead.stage === "CLOSED_LOST";
  const err = (e: unknown) =>
    toast.error(
      resolveMessage(
        (e as AxiosError<{ message?: unknown }>).response?.data?.message,
      ),
    );

  const handleStage = async () => {
    if (!stageValue || stageValue === lead.stage) return;
    if (stageValue === "CLOSED_LOST" && !lostReason.trim()) {
      toast.error("Lost reason is required");
      return;
    }
    try {
      await stageMut.mutateAsync({
        id: lead.id,
        stage: stageValue,
        lostReason: lostReason || undefined,
      });
      toast.success("Stage updated");
      setStageValue("");
      setLostReason("");
    } catch (e) {
      err(e);
    }
  };
  const handleActivity = async () => {
    if (!actDesc.trim()) {
      toast.error("Description is required");
      return;
    }
    try {
      await activityMut.mutateAsync({
        leadId: lead.id,
        type: actType,
        description: actDesc,
      });
      toast.success("Activity logged");
      setActDesc("");
    } catch (e) {
      err(e);
    }
  };
  const handleFollowUp = async () => {
    if (!fuMsg.trim() || !fuDate) {
      toast.error("Message and date are required");
      return;
    }
    try {
      await followUpMut.mutateAsync({
        leadId: lead.id,
        message: fuMsg,
        scheduledAt: new Date(fuDate).toISOString(),
      });
      toast.success("Follow-up scheduled");
      setFuMsg("");
      setFuDate("");
    } catch (e) {
      err(e);
    }
  };
  const handleProposal = async () => {
    if (!prop.title.trim() || !prop.content.trim() || !prop.amount) {
      toast.error("Title, content and amount are required");
      return;
    }
    try {
      await proposalMut.mutateAsync({
        leadId: lead.id,
        payload: {
          title: prop.title,
          content: prop.content,
          amount: Number(prop.amount),
          expiresAt: prop.expiresAt
            ? new Date(prop.expiresAt).toISOString()
            : undefined,
        },
      });
      toast.success("Proposal created");
      setProp({ title: "", content: "", amount: "", expiresAt: "" });
      setShowProposal(false);
    } catch (e) {
      err(e);
    }
  };
  const handleContact = async () => {
    if (!contact.firstName.trim() || !contact.lastName.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      await contactMut.mutateAsync({
        leadId: lead.id,
        payload: {
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email || undefined,
          phone: contact.phone || undefined,
          position: contact.position || undefined,
        },
      });
      toast.success("Contact person added");
      setContact({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        position: "",
      });
      setShowContact(false);
    } catch (e) {
      err(e);
    }
  };
  const handleConvert = async () => {
    try {
      const res = await convertMut.mutateAsync(lead.id);
      toast.success(res?.message ?? "Converted to client");
    } catch (e) {
      err(e);
    }
  };

  const card = "rounded-2xl border border-border bg-card p-6";
  const input =
    "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-[13px] text-foreground outline-none focus:border-primary";

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/dashboard/leads"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary">
        <ArrowLeft size={15} /> Back to leads
      </Link>

      {/* Header */}
      <div className={cn(card, "mb-6")}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                {lead.firstName} {lead.lastName}
              </h1>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase",
                  STAGE_BADGE[lead.stage],
                )}>
                {lead.stage.replace(/_/g, " ")}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-muted-foreground">
              {lead.company && (
                <span className="flex items-center gap-1.5">
                  <Building2 size={13} /> {lead.company}
                </span>
              )}
              {lead.email && (
                <span className="flex items-center gap-1.5">
                  <Mail size={13} /> {lead.email}
                </span>
              )}
              {lead.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone size={13} /> {lead.phone}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-[13px] font-semibold text-foreground hover:bg-foreground/4">
            <Pencil size={14} /> Edit
          </button>
        </div>
        {lead.estimatedValue ? (
          <div className="mt-4 flex items-center gap-1.5 text-[14px] font-bold text-primary">
            <DollarSign size={15} /> {naira(lead.estimatedValue)} estimated
            value
          </div>
        ) : null}
        {lead.lostReason && (
          <div className="mt-3 rounded-lg bg-destructive/6 p-3 text-[12.5px] text-destructive">
            Lost reason: {lead.lostReason}
          </div>
        )}
        {lead.client && (
          <div className="mt-3 rounded-lg bg-green-500/8 p-3 text-[12.5px] text-green-600 dark:text-green-400">
            ✓ Converted to client
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* LEFT */}
        <div className="space-y-6">
          {/* Notes */}
          {lead.notes && (
            <div className={card}>
              <h2 className="mb-2 text-[15px] font-bold text-foreground">
                Notes
              </h2>
              <p className="text-[13.5px] leading-relaxed text-muted-foreground whitespace-pre-line">
                {lead.notes}
              </p>
            </div>
          )}

          {/* Activities */}
          <div className={card}>
            <h2 className="mb-4 text-[15px] font-bold text-foreground">
              Activity Timeline
            </h2>
            {/* Add activity */}
            <div className="mb-4 rounded-xl border border-border p-3">
              <div className="mb-2 flex gap-2">
                <select
                  value={actType}
                  onChange={(e) => setActType(e.target.value)}
                  className={cn(input, "w-32")}>
                  <option value="call">Call</option>
                  <option value="email">Email</option>
                  <option value="meeting">Meeting</option>
                  <option value="note">Note</option>
                </select>
                <input
                  value={actDesc}
                  onChange={(e) => setActDesc(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleActivity()}
                  className={input}
                  placeholder="What happened?"
                />
                <button
                  onClick={handleActivity}
                  disabled={activityMut.isPending}
                  className="flex items-center rounded-lg bg-primary px-3 text-primary-foreground hover:opacity-90 disabled:opacity-60">
                  {activityMut.isPending ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Plus size={15} />
                  )}
                </button>
              </div>
            </div>
            {lead.activities && lead.activities.length > 0 ? (
              <div className="space-y-3">
                {lead.activities.map((a) => {
                  const Icon = ACTIVITY_ICON[a.type] ?? FileText;
                  return (
                    <div key={a.id} className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/13 text-primary">
                        <Icon size={14} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-semibold capitalize text-foreground">
                            {a.type}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {fmtDateTime(a.createdAt)}
                          </span>
                        </div>
                        <p className="text-[13px] text-muted-foreground">
                          {a.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[13px] text-muted-foreground">
                No activities yet.
              </p>
            )}
          </div>

          {/* Proposals */}
          <div className={card}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-foreground">
                Proposals
              </h2>
              <button
                onClick={() => setShowProposal((s) => !s)}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[12px] font-semibold text-foreground hover:bg-foreground/4">
                <Plus size={13} /> New
              </button>
            </div>
            {showProposal && (
              <div className="mb-4 space-y-2 rounded-xl border border-border p-3">
                <input
                  value={prop.title}
                  onChange={(e) => setProp({ ...prop, title: e.target.value })}
                  className={input}
                  placeholder="Proposal title"
                />
                <textarea
                  value={prop.content}
                  onChange={(e) =>
                    setProp({ ...prop, content: e.target.value })
                  }
                  rows={3}
                  className={cn(input, "resize-none")}
                  placeholder="Proposal content..."
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={prop.amount}
                    onChange={(e) =>
                      setProp({ ...prop, amount: e.target.value })
                    }
                    className={input}
                    placeholder="Amount (₦)"
                  />
                  <input
                    type="date"
                    value={prop.expiresAt}
                    onChange={(e) =>
                      setProp({ ...prop, expiresAt: e.target.value })
                    }
                    className={input}
                  />
                </div>
                <button
                  onClick={handleProposal}
                  disabled={proposalMut.isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2 text-[13px] font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60">
                  {proposalMut.isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}{" "}
                  Create Proposal
                </button>
              </div>
            )}
            {lead.proposals && lead.proposals.length > 0 ? (
              <div className="space-y-2">
                {lead.proposals.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-xl border border-border p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-foreground">
                        {p.title}
                      </span>
                      <span className="text-[13px] font-bold text-primary">
                        {naira(p.amount)}
                      </span>
                    </div>
                    <p className="mt-1 text-[12.5px] text-muted-foreground line-clamp-2">
                      {p.content}
                    </p>
                    {p.expiresAt && (
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Expires {fmtDate(p.expiresAt)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-muted-foreground">
                No proposals yet.
              </p>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* Stage advancement */}
          {!isClosed && (
            <div className={card}>
              <h2 className="mb-3 flex items-center gap-2 text-[15px] font-bold text-foreground">
                <TrendingUp size={16} className="text-primary" /> Update Stage
              </h2>
              <select
                value={stageValue || lead.stage}
                onChange={(e) => setStageValue(e.target.value)}
                className={input}>
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              {stageValue === "CLOSED_LOST" && (
                <input
                  value={lostReason}
                  onChange={(e) => setLostReason(e.target.value)}
                  className={cn(input, "mt-2")}
                  placeholder="Reason for loss (required)"
                />
              )}
              <button
                onClick={handleStage}
                disabled={
                  !stageValue || stageValue === lead.stage || stageMut.isPending
                }
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-[13px] font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50">
                {stageMut.isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <ArrowRight size={14} />
                )}{" "}
                Update Stage
              </button>
            </div>
          )}

          {/* Convert to client */}
          {lead.stage === "CLOSED_WON" && !lead.client && (
            <div className={card}>
              <h2 className="mb-2 flex items-center gap-2 text-[15px] font-bold text-foreground">
                <CheckCircle2 size={16} className="text-primary" /> Convert to
                Client
              </h2>
              <p className="mb-3 text-[12.5px] text-muted-foreground">
                Create a client account and send login credentials by email.
              </p>
              <button
                onClick={handleConvert}
                disabled={convertMut.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-[13px] font-bold text-white hover:opacity-90 disabled:opacity-60">
                {convertMut.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Converting...
                  </>
                ) : (
                  <>Convert to Client</>
                )}
              </button>
            </div>
          )}

          {/* Contact person */}
          <div className={card}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-[15px] font-bold text-foreground">
                <UserIcon size={16} className="text-primary" /> Contact Person
              </h2>
              {!lead.contactPerson && (
                <button
                  onClick={() => setShowContact((s) => !s)}
                  className="text-[12px] font-semibold text-primary hover:underline">
                  Add
                </button>
              )}
            </div>
            {lead.contactPerson ? (
              <div className="rounded-xl border border-border p-3">
                <div className="text-[13px] font-semibold text-foreground">
                  {lead.contactPerson.firstName} {lead.contactPerson.lastName}
                </div>
                {lead.contactPerson.position && (
                  <div className="text-[11.5px] text-muted-foreground">
                    {lead.contactPerson.position}
                  </div>
                )}
                {lead.contactPerson.email && (
                  <div className="mt-1 text-[12px] text-muted-foreground">
                    {lead.contactPerson.email}
                  </div>
                )}
                {lead.contactPerson.phone && (
                  <div className="text-[12px] text-muted-foreground">
                    {lead.contactPerson.phone}
                  </div>
                )}
              </div>
            ) : showContact ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    value={contact.firstName}
                    onChange={(e) =>
                      setContact({ ...contact, firstName: e.target.value })
                    }
                    className={input}
                    placeholder="First name"
                  />
                  <input
                    value={contact.lastName}
                    onChange={(e) =>
                      setContact({ ...contact, lastName: e.target.value })
                    }
                    className={input}
                    placeholder="Last name"
                  />
                </div>
                <input
                  value={contact.position}
                  onChange={(e) =>
                    setContact({ ...contact, position: e.target.value })
                  }
                  className={input}
                  placeholder="Position"
                />
                <input
                  value={contact.email}
                  onChange={(e) =>
                    setContact({ ...contact, email: e.target.value })
                  }
                  className={input}
                  placeholder="Email"
                />
                <input
                  value={contact.phone}
                  onChange={(e) =>
                    setContact({ ...contact, phone: e.target.value })
                  }
                  className={input}
                  placeholder="Phone"
                />
                <button
                  onClick={handleContact}
                  disabled={contactMut.isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2 text-[13px] font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60">
                  {contactMut.isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    "Add Contact"
                  )}
                </button>
              </div>
            ) : (
              <p className="text-[13px] text-muted-foreground">
                No contact person yet.
              </p>
            )}
          </div>

          {/* Follow-ups */}
          <div className={card}>
            <h2 className="mb-3 flex items-center gap-2 text-[15px] font-bold text-foreground">
              <Clock size={16} className="text-primary" /> Follow-ups
            </h2>
            <div className="mb-3 space-y-2">
              <input
                value={fuMsg}
                onChange={(e) => setFuMsg(e.target.value)}
                className={input}
                placeholder="Follow-up note"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={fuDate}
                  onChange={(e) => setFuDate(e.target.value)}
                  className={input}
                />
                <button
                  onClick={handleFollowUp}
                  disabled={followUpMut.isPending}
                  className="flex items-center rounded-lg bg-primary px-3 text-primary-foreground hover:opacity-90 disabled:opacity-60">
                  {followUpMut.isPending ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Plus size={15} />
                  )}
                </button>
              </div>
            </div>
            {lead.followUps && lead.followUps.length > 0 ? (
              <div className="space-y-2">
                {lead.followUps.map((f) => (
                  <div
                    key={f.id}
                    className={cn(
                      "flex items-start justify-between gap-2 rounded-xl border p-3",
                      f.isDone
                        ? "border-border bg-muted/30 opacity-60"
                        : "border-border",
                    )}>
                    <div>
                      <p
                        className={cn(
                          "text-[13px]",
                          f.isDone
                            ? "text-muted-foreground line-through"
                            : "text-foreground",
                        )}>
                        {f.message}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Calendar size={10} /> {fmtDate(f.scheduledAt)}
                      </p>
                    </div>
                    {!f.isDone && (
                      <button
                        onClick={() => markDoneMut.mutate(f.id)}
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground hover:border-primary hover:text-primary"
                        title="Mark done">
                        <Check size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-muted-foreground">
                No follow-ups scheduled.
              </p>
            )}
          </div>
        </div>
      </div>

      {editOpen && <LeadModal lead={lead} onClose={() => setEditOpen(false)} />}
    </div>
  );
}
