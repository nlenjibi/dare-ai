import type { StageStatus, ProjectStage } from "@/shared/enum";
import { PROJECT_STAGES } from "@/shared/enum";

const VALID_TRANSITIONS: Record<StageStatus, StageStatus[]> = {
  NOT_STARTED:      ["IN_PROGRESS"],
  IN_PROGRESS:      ["WAITING_FOR_USER", "COMPLETED", "BLOCKED", "NEEDS_REVISION"],
  WAITING_FOR_USER: ["IN_PROGRESS", "COMPLETED"],
  NEEDS_REVISION:   ["IN_PROGRESS"],
  BLOCKED:          ["IN_PROGRESS"],
  COMPLETED:        ["IN_PROGRESS"], // users may revisit any stage (PRD FR-003)
};

export function canTransition(from: StageStatus, to: StageStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export function nextStage(current: ProjectStage): ProjectStage | null {
  const idx = PROJECT_STAGES.indexOf(current);
  return idx >= 0 && idx < PROJECT_STAGES.length - 1 ? PROJECT_STAGES[idx + 1] : null;
}

export function assertTransition(from: StageStatus, to: StageStatus): void {
  if (!canTransition(from, to)) {
    throw new Error(`INVALID_STAGE_TRANSITION: ${from} → ${to}`);
  }
}
