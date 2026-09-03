"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ProblemPage() {
  const params = useParams<{ projectId: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [existing, setExisting] = useState<{ statement: string; objective?: string; context?: string; constraints?: string } | null>(null);

  useEffect(() => {
    fetch(`/api/projects/${params.projectId}`)
      .then((r) => r.json())
      .then((d) => d.data && setExisting(d.data.problem ?? null));
  }, [params.projectId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/projects/${params.projectId}/problem`, {
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
    router.push(`/projects/${params.projectId}`);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <Link href={`/projects/${params.projectId}`} className="text-sm text-muted-foreground hover:text-foreground">
          ← Project
        </Link>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Problem intake</h1>
          <p className="mt-1 text-sm text-muted-foreground">Describe your problem before DARE begins decomposing it.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{error}</p>}
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
      </main>
    </div>
  );
}
