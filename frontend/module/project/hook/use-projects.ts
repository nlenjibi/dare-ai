"use client";
import { useEffect } from "react";
import { useApi } from "@/frontend/hook/use-api";

export function useProjects() {
  const { data, loading, error, execute } = useApi<unknown[]>();

  useEffect(() => {
    execute("/api/projects");
  }, [execute]);

  return { projects: data ?? [], loading, error, refetch: () => execute("/api/projects") };
}
