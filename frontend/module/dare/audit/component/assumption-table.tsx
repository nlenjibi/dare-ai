"use client";
import { useState } from "react";
import { Badge } from "@/frontend/component/badge";
import { EvidenceForm } from "./evidence-form";

interface Assumption {
  _id: { toString(): string };
  statement: string;
  type: string;
  loadBearingScore: number;
  lifecycle: string;
  impactIfFalse?: string;
  inversion?: string;
}

interface AssumptionTableProps {
  assumptions: Assumption[];
  limit?: number;
}

export function AssumptionTable({ assumptions, limit = 5 }: AssumptionTableProps) {
  const visible = assumptions.slice(0, limit);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [addingEvidence, setAddingEvidence] = useState<string | null>(null);

  function toggleExpand(id: string) {
    setExpanded((prev) => (prev === id ? null : id));
    setAddingEvidence(null);
  }

  function lifecycleBadgeVariant(lifecycle: string) {
    if (lifecycle === "SUPPORTED") return "success";
    if (lifecycle === "REJECTED") return "danger";
    if (lifecycle === "TESTING") return "warning";
    return "default";
  }

  return (
    <section className="rounded-lg border border-border p-5 space-y-3">
      <h2 className="font-semibold">Top Assumptions</h2>
      <div className="space-y-0">
        {visible.map((a) => {
          const id = a._id.toString();
          const isExpanded = expanded === id;
          const isAddingEv = addingEvidence === id;

          return (
            <div key={id} className="border-b border-border/50 last:border-0">
              <div
                className="py-2 grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 cursor-pointer hover:bg-muted/30 px-1 rounded"
                onClick={() => toggleExpand(id)}
              >
                <span className="text-xs truncate max-w-xs">{a.statement}</span>
                <Badge variant="mono">{a.type}</Badge>
                <span className="text-xs font-bold tabular-nums">{a.loadBearingScore}/5</span>
                <Badge variant={lifecycleBadgeVariant(a.lifecycle)}>{a.lifecycle}</Badge>
              </div>

              {isExpanded && (
                <div className="px-2 pb-3 space-y-3">
                  {a.impactIfFalse && (
                    <div className="text-xs space-y-0.5">
                      <span className="text-muted-foreground uppercase tracking-wide text-[10px]">If removed</span>
                      <p>{a.impactIfFalse}</p>
                    </div>
                  )}
                  {a.inversion && (
                    <div className="text-xs space-y-0.5">
                      <span className="text-muted-foreground uppercase tracking-wide text-[10px]">If inverted</span>
                      <p>{a.inversion}</p>
                    </div>
                  )}

                  {isAddingEv ? (
                    <EvidenceForm
                      assumptionId={id}
                      onCancel={() => setAddingEvidence(null)}
                    />
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); setAddingEvidence(id); }}
                      className="text-xs underline text-muted-foreground hover:text-foreground"
                    >
                      + Add evidence
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {assumptions.length > limit && (
        <p className="text-xs text-muted-foreground">+{assumptions.length - limit} more assumptions</p>
      )}
    </section>
  );
}
