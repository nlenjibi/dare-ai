import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/frontend/layout/app-shell";
import { ProfileForm } from "@/frontend/module/settings/component/profile-form";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as { id: string; email?: string | null; name?: string | null };

  return (
    <AppShell userEmail={user.email ?? undefined}>
      <main className="max-w-xl mx-auto px-6 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your profile.</p>
        </div>
        <div className="rounded-lg border border-border p-6">
          <h2 className="text-sm font-semibold mb-4">Profile</h2>
          <ProfileForm email={user.email ?? ""} name={user.name ?? undefined} />
        </div>
      </main>
    </AppShell>
  );
}
