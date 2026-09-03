import { z } from "zod";
import { PROJECT_MODES } from "@/shared/enum";

export const createProjectSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  mode: z.enum(PROJECT_MODES).optional().default("GENERAL"),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  mode: z.enum(PROJECT_MODES).optional(),
});

export const upsertProblemSchema = z.object({
  statement: z.string().min(10, "Statement must be at least 10 characters"),
  objective: z.string().optional(),
  context: z.string().optional(),
  constraints: z.string().optional(),
});

export const selectObjectiveSchema = z.object({
  choice: z.union([z.literal("ORIGINAL"), z.literal("DEEPER")]),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type UpsertProblemInput = z.infer<typeof upsertProblemSchema>;
