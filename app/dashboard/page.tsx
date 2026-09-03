import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/backend/database/mongoose";
import { ProjectModel } from "@/backend/database/model/project.model";
import { AppShell } from "@/frontend/layout/app-shell";
import { ProjectGrid } from "@/frontend/module/project/component/project-grid";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await connectDB();
  const userId = (session.user as { id: string }).id;
  const projects = await ProjectModel.find({ userId, archivedAt: null })
    .sort({ updatedAt: -1 })
    .limit(20)
    .lean();

  return (
    <AppShell userEmail={session.user.email ?? undefined}>
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Projects</h2>
          <Link
            href="/projects/new"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            New project
          </Link>
        </div>
        <ProjectGrid projects={projects as Parameters<typeof ProjectGrid>[0]["projects"]} />
      </main>
    </AppShell>
  );
}
