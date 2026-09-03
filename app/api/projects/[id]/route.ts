import { NextRequest } from "next/server";
import { ProjectController } from "@/backend/module/project/controller/project.controller";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  const { id } = await params;
  return ProjectController.getById(id);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  return ProjectController.update(req, id);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { id } = await params;
  return ProjectController.delete(id);
}
