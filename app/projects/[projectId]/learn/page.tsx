import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/backend/database/mongoose";
import { ProjectModel } from "@/backend/database/model/project.model";
import { ExperimentModel } from "@/backend/database/model/experiment.model";
import { AssumptionModel } from "@/backend/database/model/assumption.model";
import { Badge } from "@/frontend/component/badge";

type Params = { params: Promise<{ projectId: string }> };

function outcomeVariant(outcome: string) {
  if (outcome === "VALIDATED") return "success";
  if (outcome === "REJECTED") return "danger";
  if (outcome === "PARTIALLY_VALIDATED") return "warning";
  return "default";
}

export default async function LearnPage({ params }: Params) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { projectId } = await params;
  await connectDB();

  const userId = (session.user as { id: string }).id;
  const project = await ProjectModel.findOne({ _id: projectId, userId }).lean();
  if (!project) notFound();

  const [experiments, assumptions] = await Promise.all([
    ExperimentModel.find({ projectId }).lean(),
    AssumptionModel.find({ projectId }).sort({ loadBearingScore: -1 }).lean(),
  ]);

  const completed = experiments.filter((e) => e.result);
  const pending = experiments.filter((e) => !e.result);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center gap-3">
        <Link href={`/projects/${projectId}`} className="text-sm text-muted-foreground hover:text-foreground">
          ← {project.name}
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium">Learn (L)</span>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        <div>
          <h1 className="text-2xl font-semibold">Learning stage</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {completed.length} of {experiments.length} experiments completed.
          </p>
        </div>

        {completed.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-semibold">Completed experiments</h2>
            <div className="space-y-4">
              {completed.map((e) => (
                <div key={e._id.toString()} className="rounded-lg border border-border p-5 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm font-medium italic">&ldquo;{e.hypothesis}&rdquo;</p>
                    {e.result && (
                      <Badge variant={outcomeVariant(e.result.outcome)}>
                        {e.result.outcome.replace(/_/g, " ")}
                      </Badge>
                    )}
                  </div>
                  {e.result && (
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground text-xs uppercase tracking-wide">Observations</span>
                        <p className="mt-0.5">{e.result.observations}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs uppercase tracking-wide">Conclusion</span>
                        <p className="mt-0.5">{e.result.conclusion}</p>
                      </div>
                    </div>
                  )}
                  <Link
                    href={`/projects/${projectId}/experiment/${e._id.toString()}`}
                    className="text-xs underline text-muted-foreground hover:text-foreground"
                  >
                    View experiment →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {pending.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-semibold text-muted-foreground">Pending experiments</h2>
            <div className="space-y-2">
              {pending.map((e) => (
                <div key={e._id.toString()} className="rounded-lg border border-border/50 p-4 flex items-center justify-between gap-4">
                  <p className="text-sm italic text-muted-foreground truncate">&ldquo;{e.hypothesis}&rdquo;</p>
                  <Link
                    href={`/projects/${projectId}/experiment/${e._id.toString()}`}
                    className="shrink-0 text-xs rounded-md border border-border px-3 py-1.5 hover:bg-muted"
                  >
                    Record result →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {assumptions.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-semibold">Assumption status</h2>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-muted/50">
                  <tr className="text-left text-muted-foreground">
                    <th className="px-4 py-2 font-medium">Statement</th>
                    <th className="px-4 py-2 font-medium">Load</th>
                    <th className="px-4 py-2 font-medium">Lifecycle</th>
                  </tr>
                </thead>
                <tbody>
                  {assumptions.map((a) => (
                    <tr key={a._id.toString()} className="border-t border-border/50">
                      <td className="px-4 py-2 max-w-xs">{a.statement}</td>
                      <td className="px-4 py-2 font-bold tabular-nums">{a.loadBearingScore}/5</td>
                      <td className="px-4 py-2">
                        <Badge
                          variant={
                            a.lifecycle === "SUPPORTED" ? "success"
                              : a.lifecycle === "REJECTED" ? "danger"
                              : a.lifecycle === "TESTING" ? "warning"
                              : "default"
                          }
                        >
                          {a.lifecycle}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <div className="flex gap-3">
          <Link
            href={`/projects/${projectId}/decisions/new`}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Record decision →
          </Link>
          <Link
            href={`/projects/${projectId}`}
            className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
          >
            Back to project
          </Link>
        </div>
      </main>
    </div>
  );
}
