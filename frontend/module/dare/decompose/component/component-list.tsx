import { Badge } from "@/frontend/component/badge";

interface Component {
  _id: { toString(): string };
  name: string;
  description: string;
  dimension?: string;
}

interface ComponentListProps {
  components: Component[];
  limit?: number;
}

export function ComponentList({ components, limit = 6 }: ComponentListProps) {
  const visible = components.slice(0, limit);

  return (
    <section className="rounded-lg border border-border p-5 space-y-3">
      <h2 className="font-semibold">Components ({components.length})</h2>
      <ul className="space-y-3">
        {visible.map((c) => (
          <li key={c._id.toString()}>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{c.name}</span>
              {c.dimension && <Badge variant="mono">{c.dimension}</Badge>}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{c.description}</p>
          </li>
        ))}
        {components.length > limit && (
          <li className="text-xs text-muted-foreground">+{components.length - limit} more</li>
        )}
      </ul>
    </section>
  );
}
