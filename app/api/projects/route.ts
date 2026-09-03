import { NextRequest } from "next/server";
import { ProjectController } from "@/backend/module/project/controller/project.controller";

export async function GET() {
  return ProjectController.list();
}

export async function POST(req: NextRequest) {
  return ProjectController.create(req);
}
