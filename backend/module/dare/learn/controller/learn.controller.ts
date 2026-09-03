import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { ok, fail } from "@/common/util/api-response";
import { toApiError } from "@/common/exception/app-error";
import { connectDB } from "@/backend/database/mongoose";
import { ExperimentModel } from "@/backend/database/model/experiment.model";
import { recordExperimentResult } from "../service/learn.service";
import { recordResultSchema } from "../validator/learn.validator";

export const LearnController = {
  async recordResult(req: NextRequest, experimentId: string) {
    const session = await auth();
    if (!session?.user) return fail("Unauthorized", 401);

    await connectDB();
    const exp = await ExperimentModel.findById(experimentId).lean();
    if (!exp) return fail("Experiment not found", 404);

    const body = await req.json();
    const parsed = recordResultSchema.safeParse(body);
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    try {
      const result = await recordExperimentResult({
        projectId: exp.projectId.toString(),
        userId: (session.user as { id: string }).id,
        experimentId,
        ...parsed.data,
      });
      return ok(result);
    } catch (err) {
      const { message, statusCode } = toApiError(err);
      return fail(message, statusCode);
    }
  },
};
