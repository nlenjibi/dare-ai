import { AssumptionModel } from "@/backend/database/model/assumption.model";
import { connectDB } from "@/backend/database/mongoose";
import {
  addEvidence,
  findEvidenceForAssumption,
} from "../repository/evidence.repository";
import type { AddEvidenceDto } from "../dto/add-evidence.dto";

export async function listAssumptionEvidence(assumptionId: string) {
  return findEvidenceForAssumption(assumptionId);
}

export async function recordEvidence(
  projectId: string,
  assumptionId: string,
  data: AddEvidenceDto
) {
  await connectDB();
  const assumption = await AssumptionModel.findOne({ _id: assumptionId, projectId });
  if (!assumption) throw new Error("ASSUMPTION_NOT_FOUND");

  const evidence = await addEvidence(projectId, assumptionId, data);

  // Promote lifecycle from UNVERIFIED to TESTING once first evidence is added
  if (assumption.lifecycle === "UNVERIFIED") {
    await AssumptionModel.findByIdAndUpdate(assumptionId, { lifecycle: "TESTING" });
  }

  return evidence;
}
