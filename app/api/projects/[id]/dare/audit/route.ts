import { AuditController } from "@/backend/module/dare/audit/controller/audit.controller";

type Params = { params: Promise<{ id: string }> };

export async function POST(_: Request, { params }: Params) {
  const { id } = await params;
  return AuditController.run(id);
}
