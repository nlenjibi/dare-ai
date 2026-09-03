"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ErrorBanner } from "@/frontend/component/error-banner";
import { Spinner } from "@/frontend/component/spinner";

interface Solution {
  id: string;
  name: string;
}

interface DareActionsProps {
  projectId: string;
  hasProblem: boolean;
  hasComponents: boolean;
  hasAssumptions: boolean;
  hasExperiments: boolean;
  solutions: Solution[];
}

export function DareActions({
  projectId, hasProblem, hasComponents, hasAssumptions, hasExperiments, solutions,
}: DareActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string[]>(solutions.map((s) => s.id));

  async function runStage(stage: string, body: object = {}) {
    setLoading(stage);
    setError("");
    try {
      const res = await fetch(`/api/projects/${projectId}/dare/${stage}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) setError(data.error ?? `${stage} failed`);
      else router.refresh();
    } catch {
      setError("Network error — check your connection.");
    } finally {
      setLoading(null);
    }
  }

  const busy = !!loading;

  return (
    <div className="space-y-2">
      {error && <ErrorBanner message={error} />}

      {!hasProblem && (
        <Link href={`/projects/${projectId}/problem`}
          className="block w-full rounded-md bg-primary px-3 py-2 text-sm text-center font-medium text-primary-foreground hover:bg-primary/90">
          1. Define problem
        </Link>
      )}

      {hasProblem && (
        <button onClick={() => runStage("decompose")} disabled={busy}
          className="w-full rounded-md border border-border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50 transition-colors flex items-center justify-between">
          <span>Run Decompose (D)</span>
          {loading === "decompose" && <Spinner size="sm" />}
        </button>
      )}

      {hasComponents && (
        <button onClick={() => runStage("audit")} disabled={busy}
          className="w-full rounded-md border border-border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50 transition-colors flex items-center justify-between">
          <span>Run Audit (A)</span>
          {loading === "audit" && <Spinner size="sm" />}
        </button>
      )}

      {hasAssumptions && (
        <button onClick={() => runStage("recombine")} disabled={busy}
          className="w-full rounded-md border border-border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50 transition-colors flex items-center justify-between">
          <span>Run Recombine (R)</span>
          {loading === "recombine" && <Spinner size="sm" />}
        </button>
      )}

      {hasExperiments && (
        <Link href={`/projects/${projectId}/learn`}
          className="block w-full rounded-md border border-border px-3 py-2 text-sm text-center hover:bg-muted transition-colors">
          View Learn (L)
        </Link>
      )}

      {hasExperiments && (
        <Link href={`/projects/${projectId}/decisions/new`}
          className="block w-full rounded-md border border-border px-3 py-2 text-sm text-center hover:bg-muted transition-colors">
          Record decision
        </Link>
      )}

      {solutions.length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="text-xs text-muted-foreground font-medium">Select solutions to experiment:</p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {solutions.map((s) => (
              <label key={s.id} className="flex items-center gap-2 text-xs cursor-pointer select-none">
                <input type="checkbox" checked={selected.includes(s.id)} className="accent-primary"
                  onChange={(e) => setSelected((prev) =>
                    e.target.checked ? [...prev, s.id] : prev.filter((id) => id !== s.id)
                  )} />
                <span className="truncate">{s.name}</span>
              </label>
            ))}
          </div>
          <button onClick={() => runStage("experiment", { solutionIds: selected })}
            disabled={busy || selected.length === 0}
            className="w-full rounded-md border border-border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50 transition-colors flex items-center justify-between">
            <span>Design Experiments (E)</span>
            {loading === "experiment" && <Spinner size="sm" />}
          </button>
        </div>
      )}
    </div>
  );
}
