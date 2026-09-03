import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="text-5xl font-bold tracking-tight">DARE</h1>
      <p className="mt-3 text-xl text-muted-foreground max-w-md">
        A first-principles reasoning platform.<br />
        Decompose. Audit. Recombine. Experiment. Learn.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/register"
          className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Get started
        </Link>
        <Link href="/login"
          className="rounded-md border border-border px-6 py-2.5 text-sm font-medium hover:bg-muted">
          Sign in
        </Link>
      </div>
    </div>
  );
}
