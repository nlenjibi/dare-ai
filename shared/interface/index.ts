import type {
  ProjectStage, StageStatus, ProjectMode,
  AssumptionType, AssumptionLifecycle,
  EvidenceType, VerificationStatus,
  ExperimentOutcome,
} from "@/shared/enum";

export interface IUser {
  _id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt: Date;
}

export interface IProject {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  mode: ProjectMode;
  currentStage: ProjectStage;
  status: StageStatus;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProblem {
  _id: string;
  projectId: string;
  statement: string;
  objective?: string;
  deeperObjective?: string;
  selectedObjective?: "ORIGINAL" | "DEEPER";
  context?: string;
  constraints?: string;
}

export interface IComponent {
  _id: string;
  projectId: string;
  parentId?: string;
  name: string;
  description: string;
  dimension?: string;
  relationships: string[];
  sortOrder: number;
}

export interface IAssumption {
  _id: string;
  projectId: string;
  componentId?: string;
  statement: string;
  type: AssumptionType;
  lifecycle: AssumptionLifecycle;
  status: VerificationStatus;
  confidence: number;
  loadBearingScore: number;
  impactIfFalse?: string;
  inversion?: string;
  createdAt: Date;
}

export interface IEvidence {
  _id: string;
  projectId: string;
  assumptionId?: string;
  type: EvidenceType;
  claim: string;
  source?: string;
  reference?: string;
  confidence: number;
  verificationStatus: VerificationStatus;
  verifiedAt?: Date;
  verifiedBy?: string;
  createdAt: Date;
}

export interface ISolution {
  _id: string;
  projectId: string;
  name: string;
  description: string;
  structure: string;
  rejectedConventions: string[];
  newAssumptions: string[];
  biggestFailurePoint: string;
  status: StageStatus;
  createdAt: Date;
}

export interface IExperiment {
  _id: string;
  projectId: string;
  solutionId?: string;
  assumptionId?: string;
  hypothesis: string;
  procedure: string;
  metric: string;
  passThreshold: string;
  failThreshold: string;
  estimatedCost?: string;
  estimatedDuration?: string;
  risk?: string;
  status: StageStatus;
  createdAt: Date;
}

export interface IExperimentResult {
  _id: string;
  experimentId: string;
  outcome: ExperimentOutcome;
  observations: string;
  metrics?: Record<string, unknown>;
  conclusion: string;
  createdAt: Date;
}

export interface IDecision {
  _id: string;
  projectId: string;
  decision: string;
  selectedSolutionId?: string;
  confidence?: number;
  evidenceSummary?: string;
  decisionMakerId: string;
  reviewDate?: Date;
  createdAt: Date;
}

export interface IStageRun {
  _id: string;
  projectId: string;
  stage: ProjectStage;
  promptVersion: string;
  model: string;
  inputTokenCount: number;
  outputTokenCount: number;
  estimatedCost: number;
  status: string;
  error?: string;
  createdAt: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
