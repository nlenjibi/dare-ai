import { ProjectCard } from "./project-card";
import { EmptyState } from "@/frontend/component/empty-state";

interface Project {
  _id: { toString(): string };
  name: string;
  description?: string;
  currentStage: string;
  mode: string;
  status: string;
}

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <EmptyState
        title="No projects yet."
        action={{ label: "Create your first project", href: "/projects/new" }}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <ProjectCard
          key={p._id.toString()}
          id={p._id.toString()}
          name={p.name}
          description={p.description}
          currentStage={p.currentStage}
          mode={p.mode}
          status={p.status}
        />
      ))}
    </div>
  );
}
