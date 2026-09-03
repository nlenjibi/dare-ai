import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/backend/database/mongoose";
import { ProjectModel } from "@/backend/database/model/project.model";
import { ProblemModel } from "@/backend/database/model/problem.model";
import { ComponentModel } from "@/backend/database/model/component.model";
import { AssumptionModel } from "@/backend/database/model/assumption.model";
import { SolutionModel } from "@/backend/database/model/solution.model";
import { ExperimentModel } from "@/backend/database/model/experiment.model";
import { DecisionModel } from "@/backend/database/model/decision.model";
import { StageRunModel } from "@/backend/database/model/stage-run.model";
import { StageProgress } from "@/frontend/module/dare/component/stage-progress";
import { DareActions } from "@/frontend/module/dare/component/dare-actions";
import { ComponentList } from "@/frontend/module/dare/decompose/component/component-list";
import { AssumptionTable } from "@/frontend/module/dare/audit/component/assumption-table";
import { SolutionList } from "@/frontend/module/dare/recombine/component/solution-card";
import { ExperimentList } from "@/frontend/module/dare/experiment/component/experiment-card";
import { ObjectiveSelector } from "@/frontend/module/dare/problem/component/objective-selector";

type Params = { params: Promise<{ projectId: string }> };

export default async function ProjectPage({ params }: Params) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { projectId } = await params;
  await connectDB();

  const userId = (session.user as { id: string }).id;
  const project = await ProjectModel.findOne({ _id: projectId, userId }).lean();
  if (!project) notFound();

  const [problem, components, assumptions, solutions, experiments, decisions, tokenStats] = await Promise.all([
    ProblemModel.findOne({ projectId }).lean(),
    ComponentModel.find({ projectId }).lean(),
    AssumptionModel.find({ projectId }).sort({ loadBearingScore: -1 }).lean(),
    SolutionModel.find({ projectId }).lean(),
    ExperimentModel.find({ projectId }).lean(),
    DecisionModel.find({ projectId }).sort({ createdAt: -1 }).lean(),
    StageRunModel.aggregate([
      { $match: { projectId: project._id } },
      { $group: { _id: null, totalInput: { $sum: "$inputTokenCount" }, totalOutput: { $sum: "$outputTokenCount" }, totalCost: { $sum: "$estimatedCost" } } },
    ]),
  ]);

  const stats = tokenStats[0] ?? { totalInput: 0, totalOutput: 0, totalCost: 0 };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">← Dashboard</Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="font-semibold">{project.name}</h1>
        <span className="ml-auto rounded bg-muted px-2 py-0.5 text-xs font-mono">{project.mode}</span>
      </header>

      <StageProgress currentStage={project.currentStage} status={project.status} />

      <main className="max-w-5xl mx-auto px-6 py-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-lg border border-border p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Problem</h2>
              <Link href={`/projects/${projectId}/problem`} className="text-xs text-muted-foreground hover:underline">Edit</Link>
            </div>
            {problem ? (
              <>
                <p className="text-sm">{problem.statement}</p>
                {problem.objective && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Objective:</span> {problem.objective}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                <Link href={`/projects/${projectId}/problem`} className="underline">Define your problem</Link> to begin.
              </p>
            )}
          </section>

          {project.status === "WAITING_FOR_USER" && problem?.deeperObjective && (
            <ObjectiveSelector
              projectId={projectId}
              originalStatement={problem.statement}
              deeperObjective={problem.deeperObjective}
            />
          )}

          {components.length > 0 && (
            <ComponentList components={components as Parameters<typeof ComponentList>[0]["components"]} />
          )}
          {assumptions.length > 0 && (
            <AssumptionTable assumptions={assumptions as Parameters<typeof AssumptionTable>[0]["assumptions"]} />
          )}
          {solutions.length > 0 && (
            <SolutionList solutions={solutions as Parameters<typeof SolutionList>[0]["solutions"]} />
          )}
          {experiments.length > 0 && (
            <ExperimentList
              experiments={experiments as Parameters<typeof ExperimentList>[0]["experiments"]}
              projectId={projectId}
            />
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-border p-4 space-y-3">
            <h3 className="font-semibold text-sm">DARE Actions</h3>
            <DareActions
              projectId={projectId}
              hasProblem={!!problem}
              hasComponents={components.length > 0}
              hasAssumptions={assumptions.length > 0}
              hasExperiments={experiments.length > 0}
              solutions={solutions.map((s) => ({ id: s._id.toString(), name: s.name }))}
            />
          </div>

          <div className="rounded-lg border border-border p-4 space-y-2">
            <h3 className="font-semibold text-sm">Token usage</h3>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>Input: <span className="text-foreground font-mono">{stats.totalInput.toLocaleString()}</span></p>
              <p>Output: <span className="text-foreground font-mono">{stats.totalOutput.toLocaleString()}</span></p>
              <p>Est. cost: <span className="text-foreground font-mono">${stats.totalCost.toFixed(4)}</span></p>
            </div>
          </div>

          <div className="rounded-lg border border-border p-4 space-y-1 text-xs text-muted-foreground">
            <p>Components: <span className="text-foreground">{components.length}</span></p>
            <p>Assumptions: <span className="text-foreground">{assumptions.length}</span></p>
            <p>Solutions: <span className="text-foreground">{solutions.length}</span></p>
            <p>Experiments: <span className="text-foreground">{experiments.length} ({experiments.filter((e) => e.result).length} done)</span></p>
            <p>Decisions: <span className="text-foreground">{decisions.length}</span></p>
          </div>
        </aside>
      </main>
    </div>
  );
}
