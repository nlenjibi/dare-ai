"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/frontend/component/spinner";
import { ErrorBanner } from "@/frontend/component/error-banner";

interface ObjectiveSelectorProps {
  projectId: string;
  originalStatement: string;
  deeperObjective: string;
}

export function ObjectiveSelector({
  projectId,
  originalStatement,
  deeperObjective,
}: ObjectiveSelectorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<"ORIGINAL" | "DEEPER" | null>(null);
  const [error, setError] = useState("");

  async function choose(choice: "ORIGINAL" | "DEEPER") {
    setLoading(choice);
    setError("");
    const res = await fetch(`/api/projects/${projectId}/problem`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ choice }),
    });
    const data = await res.json();
    setLoading(null);
    if (!data.success) return setError(data.error ?? "Failed to select objective");
    router.refresh();
  }

  return (
    <section className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700 p-5 space-y-4">
      <div className="flex items-start gap-3">
        <span className="text-amber-500 mt-0.5 shrink-0">⚠</span>
        <div>
          <h2 className="font-semibold text-sm">Deeper objective detected</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            DARE identified a possible deeper problem behind your statement. Choose which one to analyze — this cannot be changed without re-running Decompose.
          </p>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      <div className="grid sm:grid-cols-2 gap-3">
        <button
          onClick={() => choose("ORIGINAL")}
          disabled={!!loading}
          className="text-left rounded-lg border border-border bg-background p-4 hover:border-primary/60 hover:bg-muted/40 disabled:opacity-50 transition-colors space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Original problem</span>
            {loading === "ORIGINAL" && <Spinner size="sm" />}
          </div>
          <p className="text-sm">{originalStatement}</p>
        </button>

        <button
          onClick={() => choose("DEEPER")}
          disabled={!!loading}
          className="text-left rounded-lg border-2 border-primary/40 bg-primary/5 p-4 hover:border-primary hover:bg-primary/10 disabled:opacity-50 transition-colors space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-primary">Deeper objective</span>
            {loading === "DEEPER" && <Spinner size="sm" />}
          </div>
          <p className="text-sm">{deeperObjective}</p>
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        Selecting the deeper objective often leads to more fundamental solutions. The original statement remains saved.
      </p>
    </section>
  );
}
