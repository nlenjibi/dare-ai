"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/frontend/component/badge";

interface ArchivedProjectCardProps {
  id: string;
  name: string;
  description?: string;
  mode: string;
  currentStage: string;
  archivedAt: Date | string;
}

export function ArchivedProjectCard({
  id, name, description, mode, currentStage, archivedAt,
}: ArchivedProjectCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleUnarchive() {
    setLoading(true);
    await fetch(`/api/projects/${id}/archive`, { method: "DELETE" });
    router.refresh();
  }

  const date = new Date(archivedAt).toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric",
  });

  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-3 opacity-75 hover:opacity-100 transition-opacity">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link href={`/projects/${id}`} className="font-medium hover:underline">{name}</Link>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{description}</p>
          )}
        </div>
        <Badge variant="mono">{currentStage}</Badge>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex gap-2">
          <Badge>{mode}</Badge>
          <span>Archived {date}</span>
        </div>
        <button
          onClick={handleUnarchive}
          disabled={loading}
          className="text-xs underline hover:text-foreground disabled:opacity-50"
        >
          {loading ? "Restoring…" : "Restore"}
        </button>
      </div>
    </div>
  );
}
