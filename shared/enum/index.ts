export const PROJECT_STAGES = ["D", "A", "R", "E", "L"] as const;
export type ProjectStage = (typeof PROJECT_STAGES)[number];

export const STAGE_STATUSES = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "WAITING_FOR_USER",
  "COMPLETED",
  "BLOCKED",
  "NEEDS_REVISION",
] as const;
export type StageStatus = (typeof STAGE_STATUSES)[number];

export const PROJECT_MODES = [
  "BUSINESS", "PRODUCT", "ENGINEERING", "RESEARCH",
  "STRATEGY", "CAREER", "ARCHITECTURE", "DECISION", "GENERAL",
] as const;
export type ProjectMode = (typeof PROJECT_MODES)[number];

export const ASSUMPTION_TYPES = ["FACT", "CONVENTION", "UNKNOWN", "ASSUMPTION"] as const;
export type AssumptionType = (typeof ASSUMPTION_TYPES)[number];

export const ASSUMPTION_LIFECYCLE = [
  "DISCOVERED", "UNVERIFIED", "TESTING", "SUPPORTED",
  "REJECTED", "DISPUTED", "INCONCLUSIVE", "SUPERSEDED",
] as const;
export type AssumptionLifecycle = (typeof ASSUMPTION_LIFECYCLE)[number];

export const EVIDENCE_TYPES = [
  "USER_ASSERTION",     // E0
  "AI_INFERENCE",       // E1
  "DOCUMENTED_SOURCE",  // E2
  "EXTERNAL_EVIDENCE",  // E3
  "DIRECT_OBSERVATION", // E4
  "EXPERIMENT_RESULT",  // E5
] as const;
export type EvidenceType = (typeof EVIDENCE_TYPES)[number];

export const VERIFICATION_STATUSES = [
  "UNVERIFIED", "PARTIALLY_SUPPORTED", "SUPPORTED", "DISPUTED", "REJECTED",
] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export const EXPERIMENT_OUTCOMES = [
  "VALIDATED", "PARTIALLY_VALIDATED", "INCONCLUSIVE", "REJECTED",
] as const;
export type ExperimentOutcome = (typeof EXPERIMENT_OUTCOMES)[number];

export const AI_DEPTHS = ["QUICK", "BALANCED", "DEEP"] as const;
export type AIDepth = (typeof AI_DEPTHS)[number];
