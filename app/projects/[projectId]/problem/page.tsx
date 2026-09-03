import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ProblemForm } from "@/frontend/module/dare/problem/component/problem-form";

type Params = { params: Promise<{ projectId: string }> };

export default async function ProblemPage({ params }: Params) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { projectId } = await params;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <Link href={`/projects/${projectId}`} className="text-sm text-muted-foreground hover:text-foreground">
          ← Project
        </Link>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Problem intake</h1>
          <p className="mt-1 text-sm text-muted-foreground">Describe your problem before DARE begins decomposing it.</p>
        </div>
        <ProblemForm projectId={projectId} />
      </main>
    </div>
  );
}
