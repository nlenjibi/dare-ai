import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { ok, created, fail } from "@/common/util/api-response";
import { toApiError } from "@/common/exception/app-error";
import { recordDecisionSchema } from "../validator/decision.validator";
import { listDecisions, recordDecision } from "../service/decision.service";

function uid(user: object): string {
  return (user as { id: string }).id;
}

export const DecisionController = {
  async list(projectId: string) {
    const session = await auth();
    if (!session?.user) return fail("Unauthorized", 401);
    try {
      const decisions = await listDecisions(projectId);
      return ok(decisions);
    } catch (err) {
      const { message, statusCode } = toApiError(err);
      return fail(message, statusCode);
    }
  },

  async create(req: NextRequest, projectId: string) {
    const session = await auth();
    if (!session?.user) return fail("Unauthorized", 401);
    const body = await req.json();
    const parsed = recordDecisionSchema.safeParse(body);
    if (!parsed.success) return fail(parsed.error.issues[0].message);
    try {
      const decision = await recordDecision(projectId, uid(session.user), parsed.data);
      return created(decision);
    } catch (err) {
      const { message, statusCode } = toApiError(err);
      return fail(message, statusCode);
    }
  },
};
