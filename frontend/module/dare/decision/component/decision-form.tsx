"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ErrorBanner } from "@/frontend/component/error-banner";

interface Solution {
  id: string;
  name: string;
}

interface DecisionFormProps {
  projectId: string;
  solutions: Solution[];
}

export function DecisionForm({ projectId, solutions }: DecisionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alternatives, setAlternatives] = useState<string[]>([""]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/projects/${projectId}/decisions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        decision: fd.get("decision"),
        selectedSolutionId: fd.get("selectedSolutionId") || undefined,
        confidence: Number(fd.get("confidence")),
        evidenceSummary: fd.get("evidenceSummary") || undefined,
        rejectedAlternatives: alternatives.filter(Boolean),
        reasoningSummary: fd.get("reasoningSummary") || undefined,
        reviewDate: fd.get("reviewDate") ? new Date(fd.get("reviewDate") as string).toISOString() : undefined,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!data.success) return setError(data.error ?? "Failed to record decision");
    router.push(`/projects/${projectId}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <ErrorBanner message={error} />}

      <div className="space-y-1">
        <label className="text-sm font-medium">Decision statement *</label>
        <textarea name="decision" required rows={3}
          placeholder="We will proceed with…"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
      </div>

      {solutions.length > 0 && (
        <div className="space-y-1">
          <label className="text-sm font-medium">Selected solution</label>
          <select name="selectedSolutionId"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="">None / TBD</option>
            {solutions.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium">Evidence summary</label>
        <textarea name="evidenceSummary" rows={2}
          placeholder="Key evidence that supports this decision…"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Reasoning summary</label>
        <textarea name="reasoningSummary" rows={2}
          placeholder="Why this option over alternatives…"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Rejected alternatives</label>
        {alternatives.map((alt, i) => (
          <div key={i} className="flex gap-2">
            <input type="text" value={alt} placeholder={`Alternative ${i + 1}`}
              onChange={(e) => setAlternatives((prev) => prev.map((a, j) => j === i ? e.target.value : a))}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            {alternatives.length > 1 && (
              <button type="button" onClick={() => setAlternatives((prev) => prev.filter((_, j) => j !== i))}
                className="text-xs text-muted-foreground hover:text-destructive">✕</button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => setAlternatives((prev) => [...prev, ""])}
          className="text-xs underline text-muted-foreground hover:text-foreground">
          + Add alternative
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Confidence: <span className="font-mono">0.7</span></label>
          <input type="range" name="confidence" min="0" max="1" step="0.05" defaultValue="0.7"
            className="w-full accent-primary" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Review date</label>
          <input type="date" name="reviewDate"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
      </div>

      <button type="submit" disabled={loading}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
        {loading ? "Recording…" : "Record decision"}
      </button>
    </form>
  );
}
