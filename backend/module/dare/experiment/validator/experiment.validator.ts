import { z } from "zod";

export const runExperimentSchema = z.object({
  solutionIds: z.array(z.string()).min(1, "Select at least one solution"),
});

export type RunExperimentInput = z.infer<typeof runExperimentSchema>;
