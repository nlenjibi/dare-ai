import { ExperimentOutcome } from "@/shared/enum";

export interface RecordResultDto {
  outcome: ExperimentOutcome;
  observations: string;
  metrics?: Record<string, unknown>;
  conclusion: string;
}
