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
import { StageRunModel } from "@/backend/database/model/stage-run.model";

const STAGES = [
  { key: "D", label: "Decompose" },
  { key: "A", label: "Audit" },
  { key: "R", label: "Recombine" },
  { key: "E", label: "Experiment" },
  { key: "L", label: "Learn" },
] as const;

type Params = { params: Promise<{ projectId: string }> };

export default async function ProjectPage({ params }: Params) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { projectId } = await params;
  await connectDB();

  const userId = (session.user as { id: string }).id;
  const project = await ProjectModel.findOne({ _id: projectId, userId }).lean();
  if (!project) notFound();

  const [problem, components, assumptions, solutions, experiments, tokenStats] = await Promise.all([
    ProblemModel.findOne({ projectId }).lean(),
    ComponentModel.find({ projectId }).lean(),
    AssumptionModel.find({ projectId }).sort({ loadBearingScore: -1 }).lean(),
    SolutionModel.find({ projectId }).lean(),
    ExperimentModel.find({ projectId }).lean(),
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

      {/* DARE progress bar */}
      <div className="border-b border-border px-6 py-3">
        <div className="flex items-center gap-1 max-w-lg">
          {STAGES.map((s, i) => {
            const isCompleted = STAGES.slice(0, i).map(x => x.key).includes(project.currentStage as never) || project.currentStage === s.key && project.status === "COMPLETED";
            const isCurrent = project.currentStage === s.key;
            return (
              <div key={s.key} className="flex items-center gap-1">
                {i > 0 && <div className="h-px w-6 bg-border" />}
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold border-2 ${
                  isCompleted ? "bg-primary border-primary text-primary-foreground" :
                  isCurrent ? "border-primary text-primary" :
                  "border-muted text-muted-foreground"
                }`}>
                  {s.key}
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Current: <strong>{project.currentStage}</strong> — {project.status.replace(/_/g, " ")}
        </p>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8 grid gap-6 lg:grid-cols-3">
        {/* Left: problem + components */}
        <div className="lg:col-span-2 space-y-6">
          {/* Problem */}
          <section className="rounded-lg border border-border p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Problem</h2>
              <Link href={`/projects/${projectId}/problem`}
                className="text-xs text-muted-foreground hover:underline">Edit</Link>
            </div>
            {problem ? (
              <p className="text-sm">{problem.statement}</p>
            ) : (
              <div className="text-sm text-muted-foreground">
                <Link href={`/projects/${projectId}/problem`} className="underline">Define your problem</Link> to begin.
              </div>
            )}
          </section>

          {/* Decompose */}
          {components.length > 0 && (
            <section className="rounded-lg border border-border p-5 space-y-3">
              <h2 className="font-semibold">Components ({components.length})</h2>
              <ul className="space-y-1">
                {components.slice(0, 6).map((c) => (
                  <li key={c._id.toString()} className="text-sm">
                    <span className="font-medium">{c.name}</span>
                    {c.dimension && <span className="ml-2 text-xs text-muted-foreground">({c.dimension})</span>}
                    <p className="text-xs text-muted-foreground">{c.description}</p>
                  </li>
                ))}
                {components.length > 6 && (
                  <li className="text-xs text-muted-foreground">+{components.length - 6} more</li>
                )}
              </ul>
            </section>
          )}

          {/* Assumptions */}
          {assumptions.length > 0 && (
            <section className="rounded-lg border border-border p-5 space-y-3">
              <h2 className="font-semibold">Top Assumptions</h2>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-muted-foreground border-b border-border">
                    <th className="pb-2 pr-3">Statement</th>
                    <th className="pb-2 pr-3">Type</th>
                    <th className="pb-2 pr-3">Load</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assumptions.slice(0, 5).map((a) => (
                    <tr key={a._id.toString()} className="border-b border-border/50 last:border-0">
                      <td className="py-1.5 pr-3 max-w-xs truncate">{a.statement}</td>
                      <td className="py-1.5 pr-3 font-mono">{a.type}</td>
                      <td className="py-1.5 pr-3 font-bold">{a.loadBearingScore}/5</td>
                      <td className="py-1.5">{a.lifecycle}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {/* Solutions */}
          {solutions.length > 0 && (
            <section className="rounded-lg border border-border p-5 space-y-3">
              <h2 className="font-semibold">Solutions ({solutions.length})</h2>
              <div className="space-y-3">
                {solutions.map((s) => (
                  <div key={s._id.toString()} className="rounded-md bg-muted/50 p-3 space-y-1">
                    <p className="font-medium text-sm">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.description}</p>
                    <p className="text-xs text-destructive/80">⚠ {s.biggestFailurePoint}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Experiments */}
          {experiments.length > 0 && (
            <section className="rounded-lg border border-border p-5 space-y-3">
              <h2 className="font-semibold">Experiments ({experiments.length})</h2>
              <ul className="space-y-2">
                {experiments.map((e) => (
                  <li key={e._id.toString()} className="text-sm border-b border-border/50 pb-2 last:border-0">
                    <p className="font-medium">{e.hypothesis}</p>
                    <p className="text-xs text-muted-foreground">Pass: {e.passThreshold} · Fail: {e.failThreshold}</p>
                    <span className="inline-block mt-1 rounded bg-muted px-1.5 py-0.5 text-xs">{e.status}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right: actions + stats */}
        <aside className="space-y-4">
          <div className="rounded-lg border border-border p-4 space-y-3">
            <h3 className="font-semibold text-sm">DARE Actions</h3>
            <div className="space-y-2">
              {!problem && (
                <Link href={`/projects/${projectId}/problem`}
                  className="block w-full rounded-md bg-primary px-3 py-2 text-sm text-center font-medium text-primary-foreground hover:bg-primary/90">
                  1. Define problem
                </Link>
              )}
              {problem && (
                <DareActionButton projectId={projectId} stage="decompose" label="Run Decompose (D)" />
              )}
              {components.length > 0 && (
                <DareActionButton projectId={projectId} stage="audit" label="Run Audit (A)" />
              )}
              {assumptions.length > 0 && (
                <DareActionButton projectId={projectId} stage="recombine" label="Run Recombine (R)" />
              )}
              {solutions.length > 0 && (
                <DareActionButton projectId={projectId} stage="experiment" label="Design Experiments (E)" solutions={solutions.map(s => s._id.toString())} />
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border p-4 space-y-2">
            <h3 className="font-semibold text-sm">Token Usage</h3>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>Input: <span className="text-foreground font-mono">{stats.totalInput.toLocaleString()}</span></p>
              <p>Output: <span className="text-foreground font-mono">{stats.totalOutput.toLocaleString()}</span></p>
              <p>Est. cost: <span className="text-foreground font-mono">${stats.totalCost.toFixed(4)}</span></p>
            </div>
          </div>

          <div className="rounded-lg border border-border p-4 space-y-1 text-xs text-muted-foreground">
            <p>Components: {components.length}</p>
            <p>Assumptions: {assumptions.length}</p>
            <p>Solutions: {solutions.length}</p>
            <p>Experiments: {experiments.length}</p>
          </div>
        </aside>
      </main>
    </div>
  );
}

function DareActionButton({
  projectId, stage, label, solutions,
}: {
  projectId: string;
  stage: string;
  label: string;
  solutions?: string[];
}) {
  return (
    <form action={`/api/projects/${projectId}/dare/${stage}`} method="POST">
      {solutions && solutions.map((id) => (
        <input key={id} type="hidden" name="solutionIds" value={id} />
      ))}
      <button type="submit"
        className="w-full rounded-md border border-border px-3 py-2 text-sm hover:bg-muted transition-colors">
        {label}
      </button>
    </form>
  );
}
