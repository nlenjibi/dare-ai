import { NextRequest } from "next/server";
import { EvidenceController } from "@/backend/module/dare/evidence/controller/evidence.controller";

type Ctx = { params: Promise<{ assumptionId: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { assumptionId } = await params;
  return EvidenceController.list(assumptionId);
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const { assumptionId } = await params;
  return EvidenceController.add(req, assumptionId);
}
