"use client";
import { useState } from "react";

interface ErrorBannerProps {
  message: string;
  dismissible?: boolean;
}

export function ErrorBanner({ message, dismissible = true }: ErrorBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="flex items-start gap-3 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
      <span className="flex-1">{message}</span>
      {dismissible && (
        <button onClick={() => setDismissed(true)} className="shrink-0 font-bold leading-none hover:opacity-70">
          ×
        </button>
      )}
    </div>
  );
}
