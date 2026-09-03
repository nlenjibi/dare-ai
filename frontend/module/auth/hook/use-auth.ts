"use client";
import { useSession, signOut } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const userId = (session?.user as { id?: string } | undefined)?.id;

  return { session, status, isLoading, isAuthenticated, userId, signOut };
}
