import { NextRequest } from "next/server";
import { LearnController } from "@/backend/module/dare/learn/controller/learn.controller";

type Params = { params: Promise<{ experimentId: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { experimentId } = await params;
  return LearnController.recordResult(req, experimentId);
}
