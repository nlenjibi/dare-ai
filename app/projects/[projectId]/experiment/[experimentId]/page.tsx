import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/backend/database/mongoose";
import { ExperimentModel } from "@/backend/database/model/experiment.model";
import { ProjectModel } from "@/backend/database/model/project.model";
import { ResultForm } from "@/frontend/module/dare/experiment/component/result-form";

type Params = { params: Promise<{ projectId: string; experimentId: string }> };

export default async function ExperimentResultPage({ params }: Params) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { projectId, experimentId } = await params;
  await connectDB();

  const userId = (session.user as { id: string }).id;
  const [project, experiment] = await Promise.all([
    ProjectModel.findOne({ _id: projectId, userId }).lean(),
    ExperimentModel.findById(experimentId).lean(),
  ]);

  if (!project || !experiment) notFound();
  if (experiment.projectId.toString() !== projectId) notFound();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center gap-3">
        <Link href={`/projects/${projectId}`} className="text-sm text-muted-foreground hover:text-foreground">
          ← {project.name}
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium">Record result</span>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Experiment result</h1>
          <p className="mt-1 text-sm text-muted-foreground italic">&ldquo;{experiment.hypothesis}&rdquo;</p>
        </div>

        <div className="rounded-lg bg-muted/50 border border-border p-4 space-y-3 text-sm">
          <div>
            <span className="text-muted-foreground text-xs uppercase tracking-wide">Procedure</span>
            <p className="mt-0.5">{experiment.procedure}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs uppercase tracking-wide">Metric</span>
            <p className="mt-0.5">{experiment.metric}</p>
          </div>
          <div className="flex gap-6">
            <div>
              <span className="text-muted-foreground text-xs uppercase tracking-wide">Pass</span>
              <p className="mt-0.5 text-green-600 dark:text-green-400">{experiment.passThreshold}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs uppercase tracking-wide">Fail</span>
              <p className="mt-0.5 text-destructive">{experiment.failThreshold}</p>
            </div>
          </div>
        </div>

        {experiment.result ? (
          <div className="rounded-lg border border-border p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Result recorded</span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-mono">
                {experiment.result.outcome.replace(/_/g, " ")}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{experiment.result.observations}</p>
            <Link href={`/projects/${projectId}`} className="inline-block text-sm underline text-muted-foreground hover:text-foreground">
              Back to project
            </Link>
          </div>
        ) : (
          <ResultForm experimentId={experimentId} projectId={projectId} />
        )}
      </main>
    </div>
  );
}
