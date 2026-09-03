import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/backend/database/mongoose";
import { ProjectModel } from "@/backend/database/model/project.model";
import { SolutionModel } from "@/backend/database/model/solution.model";
import { DecisionForm } from "@/frontend/module/dare/decision/component/decision-form";

type Params = { params: Promise<{ projectId: string }> };

export default async function NewDecisionPage({ params }: Params) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { projectId } = await params;
  await connectDB();

  const userId = (session.user as { id: string }).id;
  const project = await ProjectModel.findOne({ _id: projectId, userId }).lean();
  if (!project) notFound();

  const solutions = await SolutionModel.find({ projectId }).lean();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center gap-3">
        <Link href={`/projects/${projectId}`} className="text-sm text-muted-foreground hover:text-foreground">
          ← {project.name}
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium">Record decision</span>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Record decision</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Commit to a course of action based on evidence gathered during DARE.
          </p>
        </div>
        <DecisionForm
          projectId={projectId}
          solutions={solutions.map((s) => ({ id: s._id.toString(), name: s.name }))}
        />
      </main>
    </div>
  );
}
