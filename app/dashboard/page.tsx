import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/backend/database/mongoose";
import { ProjectModel } from "@/backend/database/model/project.model";

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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">DARE</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{session.user.email}</span>
          <Link href="/api/auth/signout" className="text-sm hover:underline">Sign out</Link>
        </div>
      </header>

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

        {projects.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">No projects yet.</p>
            <Link href="/projects/new" className="mt-3 inline-block text-sm underline">
              Create your first project
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <Link
                key={p._id.toString()}
                href={`/projects/${p._id}`}
                className="rounded-lg border border-border bg-card p-5 hover:border-primary/50 transition-colors space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium leading-snug">{p.name}</h3>
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-mono">
                    {p.currentStage}
                  </span>
                </div>
                {p.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded bg-muted px-1.5 py-0.5">{p.mode}</span>
                  <span className="rounded bg-muted px-1.5 py-0.5">{p.status}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
