import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: { label: string; href: string };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-border p-12 text-center">
      <p className="font-medium text-muted-foreground">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
      {action && (
        <Link href={action.href} className="mt-4 inline-block text-sm underline hover:text-foreground">
          {action.label}
        </Link>
      )}
    </div>
  );
}
