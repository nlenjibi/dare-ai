import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { ok, fail } from "@/common/util/api-response";
import { toApiError } from "@/common/exception/app-error";
import { runExperimentDesign } from "../service/experiment.service";
import { runExperimentSchema } from "../validator/experiment.validator";

export const ExperimentController = {
  async run(req: NextRequest, projectId: string) {
    const session = await auth();
    if (!session?.user) return fail("Unauthorized", 401);
    const body = await req.json();
    const parsed = runExperimentSchema.safeParse(body);
    if (!parsed.success) return fail(parsed.error.issues[0].message);
    try {
      const result = await runExperimentDesign(
        projectId,
        (session.user as { id: string }).id,
        parsed.data.solutionIds
      );
      return ok(result);
    } catch (err) {
      const { message, statusCode } = toApiError(err);
      return fail(message, statusCode);
    }
  },
};
