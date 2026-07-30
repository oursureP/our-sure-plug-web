"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { useProject } from "@/app/hooks/use-projects";
import { ProjectForm } from "@/app/components/projects/project-form";

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading } = useProject(id);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }
  if (!project) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-bold text-foreground">Project not found</p>
        <Link
          href="/dashboard/projects"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft size={15} /> Back to projects
        </Link>
      </div>
    );
  }

  return <ProjectForm project={project} />;
}
