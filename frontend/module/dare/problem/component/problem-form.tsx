"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ErrorBanner } from "@/frontend/component/error-banner";
import { Spinner } from "@/frontend/component/spinner";

interface ProblemData {
  statement: string;
  objective?: string;
  context?: string;
  constraints?: string;
}

interface ProblemFormProps {
  projectId: string;
}

export function ProblemForm({ projectId }: ProblemFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [existing, setExisting] = useState<ProblemData | null>(null);

  useEffect(() => {
    fetch(`/api/projects/${projectId}`)
      .then((r) => r.json())
      .then((d) => { if (d.data) setExisting(d.data.problem ?? null); })
      .finally(() => setFetching(false));
  }, [projectId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/projects/${projectId}/problem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        statement: fd.get("statement"),
        objective: fd.get("objective"),
        context: fd.get("context"),
        constraints: fd.get("constraints"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!data.success) return setError(data.error ?? "Save failed");
    router.push(`/projects/${projectId}`);
    router.refresh();
  }

  if (fetching) return <Spinner label="Loading…" />;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <ErrorBanner message={error} />}

      <div className="space-y-1">
        <label className="text-sm font-medium">Problem statement *</label>
        <textarea name="statement" required rows={4} defaultValue={existing?.statement}
          placeholder="What is the problem you are trying to solve?"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Objective</label>
        <textarea name="objective" rows={2} defaultValue={existing?.objective}
          placeholder="What does success look like?"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Context</label>
        <textarea name="context" rows={3} defaultValue={existing?.context}
          placeholder="Background, domain, current situation…"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Constraints</label>
        <textarea name="constraints" rows={2} defaultValue={existing?.constraints}
          placeholder="Budget, time, technical limits, non-negotiables…"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
      </div>

      <button type="submit" disabled={loading}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
        {loading ? "Saving…" : "Save problem"}
      </button>
    </form>
  );
}
