import { DARE_STAGES } from "@/common/constant";

interface StageProgressProps {
  currentStage: string;
  status: string;
}

export function StageProgress({ currentStage, status }: StageProgressProps) {
  const stageKeys = DARE_STAGES.map((s) => s.key);
  const currentIdx = stageKeys.indexOf(currentStage as (typeof stageKeys)[number]);

  return (
    <div className="border-b border-border px-6 py-3">
      <div className="flex items-center gap-1 max-w-lg">
        {DARE_STAGES.map((s, i) => {
          const isCompleted = i < currentIdx || (i === currentIdx && status === "COMPLETED");
          const isCurrent = i === currentIdx && status !== "COMPLETED";
          return (
            <div key={s.key} className="flex items-center gap-1">
              {i > 0 && <div className="h-px w-6 bg-border" />}
              <div
                title={s.label}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold border-2 transition-colors ${
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : isCurrent
                    ? "border-primary text-primary"
                    : "border-muted text-muted-foreground"
                }`}
              >
                {s.key}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Stage: <strong>{currentStage}</strong> — {status.replace(/_/g, " ")}
      </p>
    </div>
  );
}
