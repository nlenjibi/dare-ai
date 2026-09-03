import { z } from "zod";

export const DecompositionSchema = z.object({
  deeperObjective: z.string().nullable(),
  requiresUserChoice: z.boolean(),
  components: z.array(
    z.object({
      id: z.string(),
      parentId: z.string().nullable(),
      name: z.string(),
      description: z.string(),
      dimension: z.string().nullable(),
      relationships: z.array(z.string()),
    })
  ),
});
export type DecompositionResult = z.infer<typeof DecompositionSchema>;

export const AuditSchema = z.object({
  assumptions: z.array(
    z.object({
      id: z.string(),
      componentId: z.string().nullable(),
      statement: z.string(),
      type: z.union([z.literal("FACT"), z.literal("CONVENTION"), z.literal("UNKNOWN"), z.literal("ASSUMPTION")]),
      confidence: z.number().min(0).max(1),
      loadBearingScore: z.number().min(0).max(5),
      ifRemoved: z.string(),
      ifInverted: z.string(),
      evidenceNotes: z.string().optional(),
    })
  ),
});
export type AuditResult = z.infer<typeof AuditSchema>;

export const RecombineSchema = z.object({
  solutions: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      structure: z.string(),
      buildingBlockIds: z.array(z.string()),
      rejectedConventions: z.array(z.string()),
      newAssumptions: z.array(z.string()),
      biggestFailurePoint: z.string(),
    })
  ),
});
export type RecombineResult = z.infer<typeof RecombineSchema>;

export const ExperimentSchema = z.object({
  experiments: z.array(
    z.object({
      id: z.string(),
      hypothesis: z.string(),
      targetAssumptionId: z.string(),
      procedure: z.string(),
      metric: z.string(),
      passThreshold: z.string(),
      failThreshold: z.string(),
      estimatedCost: z.string(),
      estimatedDuration: z.string(),
      risk: z.string(),
      expectedLearning: z.string(),
    })
  ),
});
export type ExperimentDesignResult = z.infer<typeof ExperimentSchema>;

export const LearningSchema = z.object({
  assumptionUpdates: z.array(
    z.object({
      assumptionId: z.string(),
      newLifecycle: z.union([z.literal("SUPPORTED"), z.literal("REJECTED"), z.literal("INCONCLUSIVE"), z.literal("DISPUTED")]),
      reasoning: z.string(),
    })
  ),
  nextRecommendedAction: z.string(),
  summary: z.string(),
});
export type LearningResult = z.infer<typeof LearningSchema>;

export function extractAndParse<T>(raw: string, schema: z.ZodSchema<T>): T {
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("AI_SCHEMA_VALIDATION_FAILED: no JSON found in response");
  const parsed = JSON.parse(jsonMatch[0]);
  return schema.parse(parsed);
}
