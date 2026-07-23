"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Users,
  Building2,
  Briefcase,
  FileText,
  ChevronRight,
} from "lucide-react";
import { useClients } from "@/app/hooks/use-clients";

export default function ClientsPage() {
  const router = useRouter();
  const { data: clients, isLoading } = useClients();
  const [search, setSearch] = useState("");

  const list = clients ?? [];
  const filtered = list.filter((c) => {
    const name = c.user ? `${c.user.firstName} ${c.user.lastName}` : "";
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      (c.company ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (c.user?.email ?? "").toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          Clients
        </h1>
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          Your active clients and their engagements.
        </p>
      </div>

      <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 sm:max-w-xs">
        <Search size={16} className="text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent py-2.5 text-[13.5px] text-foreground outline-none placeholder:text-muted-foreground"
          placeholder="Search clients..."
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-muted-foreground hover:text-foreground">
            <X size={15} />
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => router.push(`/dashboard/clients/${c.id}`)}
              className="group flex flex-col rounded-2xl border border-border bg-card p-5 text-left transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
              <div className="mb-3 flex items-center gap-3">
                {c.user?.image ? (
                  <Image
                    src={c.user.image}
                    alt=""
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-[14px] font-bold text-primary-foreground">
                    {c.user
                      ? `${c.user.firstName[0]}${c.user.lastName[0]}`
                      : "?"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-bold text-foreground">
                    {c.user
                      ? `${c.user.firstName} ${c.user.lastName}`
                      : "Unknown"}
                  </div>
                  {c.company && (
                    <div className="flex items-center gap-1 truncate text-[12px] text-muted-foreground">
                      <Building2 size={11} /> {c.company}
                    </div>
                  )}
                </div>
                <ChevronRight
                  size={16}
                  className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                />
              </div>
              <div className="mt-auto flex items-center gap-4 border-t border-border pt-3 text-[12px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Briefcase size={13} className="text-primary" />{" "}
                  {c._count?.projects ?? 0} projects
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText size={13} className="text-primary" />{" "}
                  {c._count?.invoices ?? 0} invoices
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-16 text-center">
          <Users size={32} className="mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-[14px] font-semibold text-foreground">
            No clients yet
          </p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Clients appear here when you convert a won lead.
          </p>
        </div>
      )}
    </div>
  );
}
