interface Solution {
  _id: { toString(): string };
  name: string;
  description: string;
  biggestFailurePoint?: string;
  rejectedConventions?: string[];
}

interface SolutionCardProps {
  solutions: Solution[];
}

export function SolutionList({ solutions }: SolutionCardProps) {
  return (
    <section className="rounded-lg border border-border p-5 space-y-3">
      <h2 className="font-semibold">Solutions ({solutions.length})</h2>
      <div className="space-y-3">
        {solutions.map((s) => (
          <div key={s._id.toString()} className="rounded-md bg-muted/50 p-3 space-y-1.5">
            <p className="font-medium text-sm">{s.name}</p>
            <p className="text-xs text-muted-foreground">{s.description}</p>
            {s.biggestFailurePoint && (
              <p className="text-xs text-destructive/80">⚠ {s.biggestFailurePoint}</p>
            )}
            {s.rejectedConventions && s.rejectedConventions.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Rejects: {s.rejectedConventions.join(", ")}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
