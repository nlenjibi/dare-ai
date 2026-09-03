import { connectDB } from "@/backend/database/mongoose";
import { EvidenceModel } from "@/backend/database/model/evidence.model";
import type { AddEvidenceDto } from "../dto/add-evidence.dto";

export async function findEvidenceForAssumption(assumptionId: string) {
  await connectDB();
  return EvidenceModel.find({ assumptionId }).sort({ createdAt: -1 }).lean();
}

export async function addEvidence(
  projectId: string,
  assumptionId: string,
  data: AddEvidenceDto
) {
  await connectDB();
  return EvidenceModel.create({ projectId, assumptionId, ...data });
}

export async function deleteEvidence(id: string) {
  await connectDB();
  return EvidenceModel.findByIdAndDelete(id);
}
