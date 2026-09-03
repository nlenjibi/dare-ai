import { Badge } from "@/frontend/component/badge";

interface AssumptionUpdate {
  assumptionId: string;
  newLifecycle: string;
  reasoning: string;
}

interface LearningSummaryProps {
  summary: string;
  nextRecommendedAction: string;
  assumptionUpdates: AssumptionUpdate[];
}

export function LearningSummary({ summary, nextRecommendedAction, assumptionUpdates }: LearningSummaryProps) {
  return (
    <section className="rounded-lg border border-border p-5 space-y-4">
      <h2 className="font-semibold">Learning Summary</h2>
      <p className="text-sm">{summary}</p>
      <div className="rounded-md bg-muted/50 px-4 py-3 text-sm">
        <span className="text-muted-foreground text-xs uppercase tracking-wide">Next action</span>
        <p className="mt-1">{nextRecommendedAction}</p>
      </div>
      {assumptionUpdates.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Assumption updates
          </p>
          <ul className="space-y-2">
            {assumptionUpdates.map((u) => (
              <li key={u.assumptionId} className="text-xs space-y-0.5">
                <div className="flex items-center gap-2">
                  <Badge variant="mono">{u.assumptionId.slice(-6)}</Badge>
                  <Badge>{u.newLifecycle}</Badge>
                </div>
                <p className="text-muted-foreground">{u.reasoning}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
