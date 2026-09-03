import { NextRequest } from "next/server";
import { DecisionController } from "@/backend/module/dare/decision/controller/decision.controller";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  return DecisionController.list(id);
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  return DecisionController.create(req, id);
}
