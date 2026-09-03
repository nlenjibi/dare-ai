import { z } from "zod";
import { EVIDENCE_TYPES, VERIFICATION_STATUSES } from "@/shared/enum";

export const addEvidenceSchema = z.object({
  type: z.enum(EVIDENCE_TYPES),
  claim: z.string().min(1, "Claim is required"),
  source: z.string().optional(),
  reference: z.string().optional(),
  confidence: z.number().min(0).max(1).default(0.5),
  verificationStatus: z.enum(VERIFICATION_STATUSES).default("UNVERIFIED"),
});

export type AddEvidenceInput = z.infer<typeof addEvidenceSchema>;
