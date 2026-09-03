import { createDecision, findProjectDecisions } from "../repository/decision.repository";
import type { RecordDecisionDto } from "../dto/record-decision.dto";

export async function listDecisions(projectId: string) {
  return findProjectDecisions(projectId);
}

export async function recordDecision(
  projectId: string,
  decisionMakerId: string,
  data: RecordDecisionDto
) {
  return createDecision(projectId, decisionMakerId, data);
}
