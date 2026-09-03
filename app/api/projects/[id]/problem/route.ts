import { NextRequest } from "next/server";
import { ProjectController } from "@/backend/module/project/controller/project.controller";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  return ProjectController.upsertProblem(req, id);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  return ProjectController.selectObjective(req, id);
}
