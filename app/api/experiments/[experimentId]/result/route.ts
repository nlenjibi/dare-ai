import { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { ok, fail } from "@/common/util/api-response";
import { toApiError } from "@/common/exception/app-error";
import { recordExperimentResult } from "@/backend/module/dare/learn/service/learn.service";
import { connectDB } from "@/backend/database/mongoose";
import { ExperimentModel } from "@/backend/database/model/experiment.model";
type Params = { params: Promise<{ experimentId: string }> };

const schema = z.object({
  outcome: z.union([z.literal("VALIDATED"), z.literal("PARTIALLY_VALIDATED"), z.literal("INCONCLUSIVE"), z.literal("REJECTED")]),
  observations: z.string().min(10),
  metrics: z.record(z.unknown()).optional(),
  conclusion: z.string().min(10),
});

export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) return fail("Unauthorized", 401);
  const { experimentId } = await params;

  await connectDB();
  const exp = await ExperimentModel.findById(experimentId).lean();
  if (!exp) return fail("Experiment not found", 404);

  const body = await req.json();
  const parsed = schema.safeParse(body);
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
}
