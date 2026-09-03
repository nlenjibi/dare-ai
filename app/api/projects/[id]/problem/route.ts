import { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { ok, fail } from "@/common/util/api-response";
import {
  upsertProblem,
  selectObjective,
} from "@/backend/module/project/repository/project.repository";

type Params = { params: Promise<{ id: string }> };

const problemSchema = z.object({
  statement: z.string().min(10),
  objective: z.string().optional(),
  context: z.string().optional(),
  constraints: z.string().optional(),
});

export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) return fail("Unauthorized", 401);
  const { id } = await params;

  const body = await req.json();
  const parsed = problemSchema.safeParse(body);
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  const problem = await upsertProblem(id, parsed.data);
  return ok(problem);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) return fail("Unauthorized", 401);
  const { id } = await params;

  const { choice } = await req.json() as { choice: "ORIGINAL" | "DEEPER" };
  if (!["ORIGINAL", "DEEPER"].includes(choice)) return fail("Invalid choice");

  const project = await selectObjective(id, choice);
  return ok(project);
}
