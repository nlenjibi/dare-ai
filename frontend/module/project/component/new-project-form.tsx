"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ErrorBanner } from "@/frontend/component/error-banner";
import { PROJECT_MODES } from "@/shared/enum";

export function NewProjectForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: fd.get("name"), description: fd.get("description"), mode: fd.get("mode") }),
    });
    const data = await res.json();
    setLoading(false);
    if (!data.success) return setError(data.error ?? "Failed to create project");
    router.push(`/projects/${data.data._id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorBanner message={error} />}
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium">Project name *</label>
        <input id="name" name="name" required placeholder="e.g. Financial app for SMBs"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <div className="space-y-1">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <textarea id="description" name="description" rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
      </div>
      <div className="space-y-1">
        <label htmlFor="mode" className="text-sm font-medium">Mode</label>
        <select id="mode" name="mode" defaultValue="GENERAL"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          {PROJECT_MODES.map((m) => (
            <option key={m} value={m}>{m.charAt(0) + m.slice(1).toLowerCase()}</option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={loading}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
        {loading ? "Creating…" : "Create project"}
      </button>
    </form>
  );
}
