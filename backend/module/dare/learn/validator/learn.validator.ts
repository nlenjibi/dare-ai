import { z } from "zod";
import { EXPERIMENT_OUTCOMES } from "@/shared/enum";

export const recordResultSchema = z.object({
  outcome: z.enum(EXPERIMENT_OUTCOMES),
  observations: z.string().min(10, "Observations must be at least 10 characters"),
  metrics: z.record(z.string(), z.unknown()).optional(),
  conclusion: z.string().min(10, "Conclusion must be at least 10 characters"),
});

export type RecordResultInput = z.infer<typeof recordResultSchema>;
