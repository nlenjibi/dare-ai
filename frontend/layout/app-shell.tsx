"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface AppShellProps {
  children: React.ReactNode;
  userEmail?: string;
  title?: string;
  backHref?: string;
  backLabel?: string;
}

export function AppShell({ children, userEmail, title, backHref, backLabel }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center gap-4">
        {backHref ? (
          <>
            <Link href={backHref} className="text-sm text-muted-foreground hover:text-foreground">
              ← {backLabel ?? "Back"}
            </Link>
            {title && (
              <>
                <span className="text-muted-foreground">/</span>
                <span className="font-semibold text-sm">{title}</span>
              </>
            )}
          </>
        ) : (
          <Link href="/dashboard" className="text-xl font-bold">DARE</Link>
        )}
        {userEmail && (
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{userEmail}</span>
            <button onClick={() => signOut({ callbackUrl: "/login" })} className="text-sm hover:underline">
              Sign out
            </button>
          </div>
        )}
      </header>
      {children}
    </div>
  );
}
