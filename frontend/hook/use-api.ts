"use client";
import { useState, useCallback } from "react";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string;
}

export function useApi<T = unknown>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: "",
  });

  const execute = useCallback(async (url: string, options?: RequestInit): Promise<T | null> => {
    setState((s) => ({ ...s, loading: true, error: "" }));
    try {
      const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...options,
      });
      const json = await res.json();
      if (!json.success) {
        setState({ data: null, loading: false, error: json.error ?? "Request failed" });
        return null;
      }
      setState({ data: json.data as T, loading: false, error: "" });
      return json.data as T;
    } catch {
      setState({ data: null, loading: false, error: "Network error" });
      return null;
    }
  }, []);

  const reset = useCallback(() => setState({ data: null, loading: false, error: "" }), []);

  return { ...state, execute, reset };
}
