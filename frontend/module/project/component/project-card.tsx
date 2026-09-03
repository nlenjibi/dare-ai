"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/frontend/component/badge";

interface ProjectCardProps {
  id: string;
  name: string;
  description?: string;
  currentStage: string;
  mode: string;
  status: string;
}

export function ProjectCard({ id, name, description, currentStage, mode, status }: ProjectCardProps) {
  const router = useRouter();
  const [archiving, setArchiving] = useState(false);

  async function handleArchive(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Archive "${name}"? It will be hidden from the dashboard.`)) return;
    setArchiving(true);
    await fetch(`/api/projects/${id}/archive`, { method: "POST" });
    router.refresh();
  }

  return (
    <Link
      href={`/projects/${id}`}
      className="rounded-lg border border-border bg-card p-5 hover:border-primary/50 transition-colors space-y-2 block group relative"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium leading-snug">{name}</h3>
        <Badge variant="mono">{currentStage}</Badge>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge>{mode}</Badge>
          <Badge>{status.replace(/_/g, " ")}</Badge>
        </div>
        <button
          onClick={handleArchive}
          disabled={archiving}
          className="text-xs text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
          title="Archive project"
        >
          {archiving ? "…" : "Archive"}
        </button>
      </div>
    </Link>
  );
}
