import { auth } from "@/auth";
import { ok, fail } from "@/common/util/api-response";
import { toApiError } from "@/common/exception/app-error";
import { runAudit } from "../service/audit.service";

export const AuditController = {
  async run(projectId: string) {
    const session = await auth();
    if (!session?.user) return fail("Unauthorized", 401);
    try {
      const result = await runAudit(projectId, (session.user as { id: string }).id);
      return ok(result);
    } catch (err) {
      const { message, statusCode } = toApiError(err);
      return fail(message, statusCode);
    }
  },
};
