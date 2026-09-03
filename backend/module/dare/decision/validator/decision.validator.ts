import { z } from "zod";

export const recordDecisionSchema = z.object({
  decision: z.string().min(1, "Decision statement is required"),
  selectedSolutionId: z.string().optional(),
  confidence: z.number().min(0).max(1).default(0.7),
  evidenceSummary: z.string().optional(),
  rejectedAlternatives: z.array(z.string()).default([]),
  reasoningSummary: z.string().optional(),
  reviewDate: z.string().datetime().optional(),
});

export type RecordDecisionInput = z.infer<typeof recordDecisionSchema>;
