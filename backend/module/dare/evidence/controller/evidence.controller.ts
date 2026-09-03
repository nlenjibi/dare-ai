import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { ok, created, fail } from "@/common/util/api-response";
import { toApiError } from "@/common/exception/app-error";
import { addEvidenceSchema } from "../validator/evidence.validator";
import { listAssumptionEvidence, recordEvidence } from "../service/evidence.service";
import { AssumptionModel } from "@/backend/database/model/assumption.model";
import { connectDB } from "@/backend/database/mongoose";
import { ProjectModel } from "@/backend/database/model/project.model";

function uid(user: object): string {
  return (user as { id: string }).id;
}

export const EvidenceController = {
  async list(assumptionId: string) {
    const session = await auth();
    if (!session?.user) return fail("Unauthorized", 401);
    try {
      const evidence = await listAssumptionEvidence(assumptionId);
      return ok(evidence);
    } catch (err) {
      const { message, statusCode } = toApiError(err);
      return fail(message, statusCode);
    }
  },

  async add(req: NextRequest, assumptionId: string) {
    const session = await auth();
    if (!session?.user) return fail("Unauthorized", 401);

    await connectDB();
    const assumption = await AssumptionModel.findById(assumptionId).lean();
    if (!assumption) return fail("Assumption not found", 404);

    const project = await ProjectModel.findOne({
      _id: assumption.projectId,
      userId: uid(session.user),
    }).lean();
    if (!project) return fail("Forbidden", 403);

    const body = await req.json();
    const parsed = addEvidenceSchema.safeParse(body);
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    try {
      const evidence = await recordEvidence(
        assumption.projectId.toString(),
        assumptionId,
        parsed.data
      );
      return created(evidence);
    } catch (err) {
      const { message, statusCode } = toApiError(err);
      return fail(message, statusCode);
    }
  },
};
