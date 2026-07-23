"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Save,
  Camera,
  Plus,
  Trash2,
  ArrowLeft,
  X,
  // ChevronDown,
  // ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  Service,
  HowItWorksStep,
  FaqItem,
} from "@/app/interfaces/lms.interface";
import { useCreateService, useUpdateService } from "@/app/hooks/use-services";

function resolveMessage(m: unknown): string {
  if (Array.isArray(m)) return String(m[0] ?? "Something went wrong");
  if (typeof m === "string") return m;
  return "Something went wrong. Please try again.";
}

export function ServiceForm({ service }: { service?: Service | null }) {
  const isEdit = !!service;
  const router = useRouter();
  const createMut = useCreateService();
  const updateMut = useUpdateService();
  const fileRef = useRef<HTMLInputElement>(null);
  const saving = createMut.isPending || updateMut.isPending;

  const [image, setImage] = useState<string | null>(service?.image ?? null);
  const [form, setForm] = useState({
    name: service?.name ?? "",
    tagline: service?.tagline ?? "",
    badge: service?.badge ?? "",
    description: service?.description ?? "",
    whoItsFor: service?.whoItsFor ?? "",
    ctaText: service?.ctaText ?? "",
    isActive: service?.isActive ?? true,
  });
  const [problems, setProblems] = useState<string[]>(service?.problems ?? []);
  const [problemInput, setProblemInput] = useState("");
  const [features, setFeatures] = useState<string[]>(service?.features ?? []);
  const [featureInput, setFeatureInput] = useState("");
  const [howItWorks, setHowItWorks] = useState<HowItWorksStep[]>(
    service?.howItWorks ?? [],
  );
  const [faq, setFaq] = useState<FaqItem[]>(service?.faq ?? []);
  const [testimonial, setTestimonial] = useState({
    quote: service?.testimonial?.quote ?? "",
    author: service?.testimonial?.author ?? "",
  });

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const addProblem = () => {
    if (problemInput.trim()) {
      setProblems((a) => [...a, problemInput.trim()]);
      setProblemInput("");
    }
  };
  const addFeature = () => {
    if (featureInput.trim()) {
      setFeatures((a) => [...a, featureInput.trim()]);
      setFeatureInput("");
    }
  };
  const addStep = () =>
    setHowItWorks((s) => [
      ...s,
      { step: s.length + 1, title: "", subtitle: "" },
    ]);
  const updateStep = (i: number, patch: Partial<HowItWorksStep>) =>
    setHowItWorks((s) =>
      s.map((st, idx) => (idx === i ? { ...st, ...patch } : st)),
    );
  const removeStep = (i: number) =>
    setHowItWorks((s) =>
      s
        .filter((_, idx) => idx !== i)
        .map((st, idx) => ({ ...st, step: idx + 1 })),
    );
  const addFaq = () => setFaq((f) => [...f, { question: "", answer: "" }]);
  const updateFaq = (i: number, patch: Partial<FaqItem>) =>
    setFaq((f) => f.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const removeFaq = (i: number) =>
    setFaq((f) => f.filter((_, idx) => idx !== i));

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Service name is required");
      return;
    }
    const cleanSteps = howItWorks
      .filter((s) => s.title.trim())
      .map((s, i) => ({
        step: i + 1,
        title: s.title.trim(),
        subtitle: s.subtitle?.trim() || undefined,
      }));
    const cleanFaq = faq.filter((f) => f.question.trim() && f.answer.trim());
    const payload = {
      name: form.name,
      tagline: form.tagline || undefined,
      badge: form.badge || undefined,
      description: form.description || undefined,
      whoItsFor: form.whoItsFor || undefined,
      ctaText: form.ctaText || undefined,
      isActive: form.isActive,
      problems,
      features,
      howItWorks: cleanSteps,
      faq: cleanFaq,
      ...(testimonial.quote.trim() && testimonial.author.trim()
        ? { testimonial }
        : {}),
      ...(image ? { image } : {}),
    };
    try {
      if (isEdit && service) {
        await updateMut.mutateAsync({ id: service.id, payload });
        toast.success("Service updated");
      } else {
        await createMut.mutateAsync(payload);
        toast.success("Service created");
      }
      router.push("/dashboard/services");
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

  const listBuilder = (
    title: string,
    hint: string,
    list: string[],
    setList: (v: string[]) => void,
    inp: string,
    setInp: (v: string) => void,
    add: () => void,
    ph: string,
  ) => (
    <div className={card}>
      <h2 className="mb-1 text-[15px] font-bold text-foreground">{title}</h2>
      <p className="mb-4 text-[12.5px] text-muted-foreground">{hint}</p>
      <div className="mb-3 flex gap-2">
        <input
          value={inp}
          onChange={(e) => setInp(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          className={input}
          placeholder={ph}
        />
        <button
          type="button"
          onClick={add}
          disabled={!inp.trim()}
          className="flex items-center rounded-lg bg-primary px-4 text-primary-foreground hover:opacity-90 disabled:opacity-60">
          <Plus size={15} />
        </button>
      </div>
      {list.length > 0 ? (
        <div className="space-y-2">
          {list.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-border px-3.5 py-2.5">
              <span className="flex items-center gap-2 text-[13px] text-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/13 text-[10px] font-bold text-primary">
                  {i + 1}
                </span>
                {item}
              </span>
              <button
                type="button"
                onClick={() => setList(list.filter((_, idx) => idx !== i))}
                className="text-muted-foreground hover:text-destructive">
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-border py-6 text-center text-[12.5px] text-muted-foreground">
          None added yet.
        </p>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => router.push("/dashboard/services")}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary">
        <ArrowLeft size={15} /> Back to services
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          {isEdit ? "Edit Service" : "New Service"}
        </h1>
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          Create a service with full public-page content.
        </p>
      </div>

      <div className="space-y-6">
        {/* Image */}
        <div className={card}>
          <label className={label}>Hero Image (used as page background)</label>
          <div className="relative h-52 w-full overflow-hidden rounded-xl border border-border bg-muted">
            {image ? (
              <Image
                src={image}
                alt=""
                fill
                className="object-cover"
                unoptimized={image.startsWith("data:")}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <Camera size={26} className="opacity-40" />
                <span className="text-[12.5px]">No image selected</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-background/90 px-3.5 py-2 text-[12.5px] font-semibold text-foreground backdrop-blur-sm hover:bg-background">
              <Camera size={14} /> {image ? "Change" : "Upload"}
            </button>
            {image && (
              <button
                type="button"
                onClick={() => setImage(null)}
                className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-background/90 px-3.5 py-2 text-[12.5px] font-semibold text-destructive backdrop-blur-sm hover:bg-background">
                <Trash2 size={14} /> Remove
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

        {/* Hero content */}
        <div className={card}>
          <h2 className="mb-4 text-[15px] font-bold text-foreground">Hero</h2>
          <div className="space-y-4">
            <div>
              <label className={label}>Service Name *</label>
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className={input}
                placeholder="Social Media Management"
              />
            </div>
            <div>
              <label className={label}>Badge</label>
              <input
                value={form.badge}
                onChange={(e) => update("badge", e.target.value)}
                className={input}
                placeholder="Digital Excellence, Customized for You"
              />
            </div>
            <div>
              <label className={label}>Tagline</label>
              <input
                value={form.tagline}
                onChange={(e) => update("tagline", e.target.value)}
                className={input}
                placeholder="Consistent, strategic content that turns followers into customers."
              />
            </div>
          </div>
        </div>

        {/* Overview + who it's for */}
        <div className={card}>
          <h2 className="mb-4 text-[15px] font-bold text-foreground">
            Overview
          </h2>
          <div className="space-y-4">
            <div>
              <label className={label}>Service Overview (description)</label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={3}
                className={`${input} resize-none`}
                placeholder="We plan, create, and manage your social media presence..."
              />
            </div>
            <div>
              <label className={label}>Who This Is For</label>
              <textarea
                value={form.whoItsFor}
                onChange={(e) => update("whoItsFor", e.target.value)}
                rows={2}
                className={`${input} resize-none`}
                placeholder="This service is built for business owners who..."
              />
            </div>
          </div>
        </div>

        {/* Problems */}
        {listBuilder(
          "The Problem",
          'Pain points your audience feels (the "Struggling to..." list).',
          problems,
          setProblems,
          problemInput,
          setProblemInput,
          addProblem,
          "e.g. Inconsistent posting that confuses your audience",
        )}

        {/* How it works */}
        <div className={card}>
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-foreground">
              How It Works
            </h2>
            <button
              type="button"
              onClick={addStep}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[12px] font-semibold text-foreground hover:bg-foreground/4">
              <Plus size={13} /> Add Step
            </button>
          </div>
          <p className="mb-4 text-[12.5px] text-muted-foreground">
            The numbered process flow (Discovery → Strategy → Creation...).
          </p>
          {howItWorks.length > 0 ? (
            <div className="space-y-2">
              {howItWorks.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-border p-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/13 text-[12px] font-bold text-primary">
                    {i + 1}
                  </span>
                  <div className="flex flex-1 gap-2">
                    <input
                      value={s.title}
                      onChange={(e) => updateStep(i, { title: e.target.value })}
                      className={input}
                      placeholder="Step title (e.g. Discovery call)"
                    />
                    <input
                      value={s.subtitle ?? ""}
                      onChange={(e) =>
                        updateStep(i, { subtitle: e.target.value })
                      }
                      className={input}
                      placeholder="Subtitle (e.g. Brand audit)"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeStep(i)}
                    className="text-muted-foreground hover:text-destructive">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-border py-6 text-center text-[12.5px] text-muted-foreground">
              No steps added.
            </p>
          )}
        </div>

        {/* Features */}
        {listBuilder(
          "What's Included",
          "The deliverables clients get.",
          features,
          setFeatures,
          featureInput,
          setFeatureInput,
          addFeature,
          "e.g. Monthly content calendar & strategy",
        )}

        {/* Testimonial */}
        <div className={card}>
          <h2 className="mb-4 text-[15px] font-bold text-foreground">
            Testimonial
          </h2>
          <div className="space-y-3">
            <textarea
              value={testimonial.quote}
              onChange={(e) =>
                setTestimonial({ ...testimonial, quote: e.target.value })
              }
              rows={2}
              className={`${input} resize-none`}
              placeholder="A real client quote or result..."
            />
            <input
              value={testimonial.author}
              onChange={(e) =>
                setTestimonial({ ...testimonial, author: e.target.value })
              }
              className={input}
              placeholder="Client name, business"
            />
          </div>
        </div>

        {/* FAQ */}
        <div className={card}>
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-foreground">FAQ</h2>
            <button
              type="button"
              onClick={addFaq}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[12px] font-semibold text-foreground hover:bg-foreground/4">
              <Plus size={13} /> Add FAQ
            </button>
          </div>
          <p className="mb-4 text-[12.5px] text-muted-foreground">
            Common questions and answers.
          </p>
          {faq.length > 0 ? (
            <div className="space-y-3">
              {faq.map((item, i) => (
                <div key={i} className="rounded-xl border border-border p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <input
                      value={item.question}
                      onChange={(e) =>
                        updateFaq(i, { question: e.target.value })
                      }
                      className={input}
                      placeholder="Question"
                    />
                    <button
                      type="button"
                      onClick={() => removeFaq(i)}
                      className="text-muted-foreground hover:text-destructive">
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <textarea
                    value={item.answer}
                    onChange={(e) => updateFaq(i, { answer: e.target.value })}
                    rows={2}
                    className={`${input} resize-none`}
                    placeholder="Answer"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-border py-6 text-center text-[12.5px] text-muted-foreground">
              No FAQs added.
            </p>
          )}
        </div>

        {/* CTA + status */}
        <div className={card}>
          <div className="mb-4">
            <label className={label}>CTA Subtitle</label>
            <input
              value={form.ctaText}
              onChange={(e) => update("ctaText", e.target.value)}
              className={input}
              placeholder="Stop guessing. Let's build a presence that actually converts."
            />
          </div>
          <label className="flex cursor-pointer items-center justify-between border-t border-border pt-4">
            <div>
              <div className="text-[14px] font-semibold text-foreground">
                Active
              </div>
              <div className="text-[12.5px] text-muted-foreground">
                Visible on the public website.
              </div>
            </div>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => update("isActive", e.target.checked)}
              className="h-5 w-5 rounded border-border accent-(--brand-purple)"
            />
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => router.push("/dashboard/services")}
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
                {isEdit ? "Update Service" : "Create Service"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
