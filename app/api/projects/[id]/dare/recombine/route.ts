import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { ok, fail } from "@/common/util/api-response";
import { toApiError } from "@/common/exception/app-error";
import { runRecombine } from "@/backend/module/dare/recombine/service/recombine.service";

type Params = { params: Promise<{ id: string }> };

export async function POST(_: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) return fail("Unauthorized", 401);
  const { id } = await params;
  try {
    const result = await runRecombine(id, (session.user as { id: string }).id);
    return ok(result);
  } catch (err) {
    const { message, statusCode } = toApiError(err);
    return fail(message, statusCode);
  }
}
