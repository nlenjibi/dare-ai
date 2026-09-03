import { connectDB } from "@/backend/database/mongoose";
import { DecisionModel } from "@/backend/database/model/decision.model";
import type { RecordDecisionDto } from "../dto/record-decision.dto";

export async function findProjectDecisions(projectId: string) {
  await connectDB();
  return DecisionModel.find({ projectId }).sort({ createdAt: -1 }).lean();
}

export async function createDecision(
  projectId: string,
  decisionMakerId: string,
  data: RecordDecisionDto
) {
  await connectDB();
  return DecisionModel.create({
    projectId,
    decisionMakerId,
    ...data,
    reviewDate: data.reviewDate ? new Date(data.reviewDate) : undefined,
  });
}
