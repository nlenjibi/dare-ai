import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { ok, fail } from "@/common/util/api-response";
import { toApiError } from "@/common/exception/app-error";
import { archiveProject, unarchiveProject } from "@/backend/module/project/repository/project.repository";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session?.user) return fail("Unauthorized", 401);
  const { id } = await params;
  const userId = (session.user as { id: string }).id;
  try {
    const project = await archiveProject(id, userId);
    if (!project) return fail("Project not found", 404);
    return ok(project);
  } catch (err) {
    const { message, statusCode } = toApiError(err);
    return fail(message, statusCode);
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session?.user) return fail("Unauthorized", 401);
  const { id } = await params;
  const userId = (session.user as { id: string }).id;
  try {
    const project = await unarchiveProject(id, userId);
    if (!project) return fail("Project not found", 404);
    return ok(project);
  } catch (err) {
    const { message, statusCode } = toApiError(err);
    return fail(message, statusCode);
  }
}
