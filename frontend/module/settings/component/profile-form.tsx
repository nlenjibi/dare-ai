"use client";
import { useState } from "react";
import { ErrorBanner } from "@/frontend/component/error-banner";

interface ProfileFormProps {
  email: string;
  name?: string;
}

export function ProfileForm({ email, name }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: fd.get("name") }),
    });
    const data = await res.json();
    setLoading(false);
    if (!data.success) return setError(data.error ?? "Update failed");
    setSuccess(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <ErrorBanner message={error} />}
      {success && (
        <p className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 px-3 py-2 rounded-md">
          Profile updated.
        </p>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Display name</label>
        <input
          type="text"
          name="name"
          defaultValue={name}
          placeholder="Your name"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
