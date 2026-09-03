import Link from "next/link";
import { NewProjectForm } from "@/frontend/module/project/component/new-project-form";

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
          ← Dashboard
        </Link>
      </header>
      <main className="max-w-lg mx-auto px-6 py-10 space-y-6">
        <h1 className="text-2xl font-semibold">New project</h1>
        <NewProjectForm />
      </main>
    </div>
  );
}
