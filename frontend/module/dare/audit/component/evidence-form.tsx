"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ErrorBanner } from "@/frontend/component/error-banner";
import { EVIDENCE_TYPES } from "@/shared/enum";

interface EvidenceFormProps {
  assumptionId: string;
  onCancel: () => void;
}

export function EvidenceForm({ assumptionId, onCancel }: EvidenceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/assumptions/${assumptionId}/evidence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: fd.get("type"),
        claim: fd.get("claim"),
        source: fd.get("source") || undefined,
        reference: fd.get("reference") || undefined,
        confidence: Number(fd.get("confidence")),
        verificationStatus: fd.get("verificationStatus"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!data.success) return setError(data.error ?? "Failed to save evidence");
    router.refresh();
    onCancel();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 rounded-lg border border-border bg-muted/30">
      {error && <ErrorBanner message={error} />}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium">Evidence type *</label>
          <select name="type" required
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring">
            {EVIDENCE_TYPES.map((t) => (
              <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium">Verification status</label>
          <select name="verificationStatus" defaultValue="UNVERIFIED"
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring">
            {["UNVERIFIED", "PARTIALLY_SUPPORTED", "SUPPORTED", "DISPUTED", "REJECTED"].map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium">Claim *</label>
        <textarea name="claim" required rows={2}
          placeholder="What evidence have you found?"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium">Source</label>
          <input type="text" name="source" placeholder="Author, institution…"
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium">Reference / URL</label>
          <input type="text" name="reference" placeholder="Link or citation"
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium">Confidence (0–1): <span className="font-mono">0.5</span></label>
        <input type="range" name="confidence" min="0" max="1" step="0.1" defaultValue="0.5"
          className="w-full accent-primary" />
      </div>

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel}
          className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted">
          Cancel
        </button>
        <button type="submit" disabled={loading}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
          {loading ? "Saving…" : "Add evidence"}
        </button>
      </div>
    </form>
  );
}
