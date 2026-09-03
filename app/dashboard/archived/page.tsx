import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/backend/database/mongoose";
import { findArchivedProjects } from "@/backend/module/project/repository/project.repository";
import { AppShell } from "@/frontend/layout/app-shell";
import { ArchivedProjectCard } from "@/frontend/module/project/component/archived-project-card";
import { EmptyState } from "@/frontend/component/empty-state";

export default async function ArchivedPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await connectDB();
  const userId = (session.user as { id: string }).id;
  const projects = await findArchivedProjects(userId);

  return (
    <AppShell userEmail={(session.user as { email?: string }).email ?? undefined}>
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Archived projects</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Restore a project to make it active again.</p>
          </div>
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            ← Active projects
          </Link>
        </div>

        {projects.length === 0 ? (
          <EmptyState
            title="No archived projects"
            description="Projects you archive will appear here."
            action={{ label: "Go to dashboard", href: "/dashboard" }}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ArchivedProjectCard
                key={p._id.toString()}
                id={p._id.toString()}
                name={p.name}
                description={p.description}
                mode={p.mode}
                currentStage={p.currentStage}
                archivedAt={p.archivedAt!}
              />
            ))}
          </div>
        )}
      </main>
    </AppShell>
  );
}
