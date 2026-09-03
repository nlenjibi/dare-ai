"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ErrorBanner } from "@/frontend/component/error-banner";
import { EXPERIMENT_OUTCOMES } from "@/shared/enum";

interface ResultFormProps {
  experimentId: string;
  projectId: string;
}

export function ResultForm({ experimentId, projectId }: ResultFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/experiments/${experimentId}/result`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        outcome: fd.get("outcome"),
        observations: fd.get("observations"),
        conclusion: fd.get("conclusion"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!data.success) return setError(data.error ?? "Failed to record result");
    router.push(`/projects/${projectId}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <ErrorBanner message={error} />}
      <div className="space-y-1">
        <label className="text-sm font-medium">Outcome *</label>
        <select name="outcome" required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          {EXPERIMENT_OUTCOMES.map((o) => (
            <option key={o} value={o}>{o.replace(/_/g, " ")}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Observations *</label>
        <textarea name="observations" required rows={4} minLength={10}
          placeholder="What did you observe during the experiment?"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Conclusion *</label>
        <textarea name="conclusion" required rows={3} minLength={10}
          placeholder="What does this result tell you about your assumption?"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
      </div>
      <button type="submit" disabled={loading}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
        {loading ? "Recording…" : "Record result & synthesize learning"}
      </button>
    </form>
  );
}
