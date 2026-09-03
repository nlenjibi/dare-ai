import { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { ok, fail } from "@/common/util/api-response";
import { toApiError } from "@/common/exception/app-error";
import { runExperimentDesign } from "@/backend/module/dare/experiment/service/experiment.service";

type Params = { params: Promise<{ id: string }> };

const schema = z.object({ solutionIds: z.array(z.string()).min(1) });

export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) return fail("Unauthorized", 401);
  const { id } = await params;

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  try {
    const result = await runExperimentDesign(id, (session.user as { id: string }).id, parsed.data.solutionIds);
    return ok(result);
  } catch (err) {
    const { message, statusCode } = toApiError(err);
    return fail(message, statusCode);
  }
}
