import { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { ok, created, fail } from "@/common/util/api-response";
import {
  findUserProjects,
  createProject,
} from "@/backend/module/project/repository/project.repository";

const createSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  mode: z.string().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user) return fail("Unauthorized", 401);

  const projects = await findUserProjects((session.user as { id: string }).id);
  return ok(projects);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return fail("Unauthorized", 401);

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  const project = await createProject((session.user as { id: string }).id, parsed.data);
  return created(project);
}
