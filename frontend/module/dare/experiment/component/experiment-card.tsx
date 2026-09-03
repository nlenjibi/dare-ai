import Link from "next/link";
import { Badge } from "@/frontend/component/badge";

interface Experiment {
  _id: { toString(): string };
  hypothesis: string;
  passThreshold: string;
  failThreshold: string;
  status: string;
  result?: { outcome: string };
}

interface ExperimentListProps {
  experiments: Experiment[];
  projectId: string;
}

export function ExperimentList({ experiments, projectId }: ExperimentListProps) {
  return (
    <section className="rounded-lg border border-border p-5 space-y-3">
      <h2 className="font-semibold">Experiments ({experiments.length})</h2>
      <ul className="space-y-3">
        {experiments.map((e) => (
          <li key={e._id.toString()} className="border-b border-border/50 pb-3 last:border-0 last:pb-0 space-y-1.5">
            <p className="text-sm font-medium">{e.hypothesis}</p>
            <p className="text-xs text-muted-foreground">
              Pass: {e.passThreshold} · Fail: {e.failThreshold}
            </p>
            <div className="flex items-center gap-3">
              <Badge>
                {e.result ? e.result.outcome.replace(/_/g, " ") : e.status.replace(/_/g, " ")}
              </Badge>
              {!e.result && (
                <Link
                  href={`/projects/${projectId}/experiment/${e._id}`}
                  className="text-xs underline text-muted-foreground hover:text-foreground"
                >
                  Record result →
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
