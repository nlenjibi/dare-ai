import { NextRequest } from "next/server";
import { ExperimentController } from "@/backend/module/dare/experiment/controller/experiment.controller";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  return ExperimentController.run(req, id);
}
