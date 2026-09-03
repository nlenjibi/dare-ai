import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { ok, fail } from "@/common/util/api-response";
import {
  findProjectById,
  updateProject,
  archiveProject,
  deleteProject,
} from "@/backend/module/project/repository/project.repository";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) return fail("Unauthorized", 401);
  const { id } = await params;
  const project = await findProjectById(id, (session.user as { id: string }).id);
  if (!project) return fail("Not found", 404);
  return ok(project);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) return fail("Unauthorized", 401);
  const { id } = await params;
  const body = await req.json();
  const updated = await updateProject(id, (session.user as { id: string }).id, body);
  if (!updated) return fail("Not found", 404);
  return ok(updated);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) return fail("Unauthorized", 401);
  const { id } = await params;
  await deleteProject(id, (session.user as { id: string }).id);
  return ok({ deleted: true });
}
