import { DecomposeController } from "@/backend/module/dare/decompose/controller/decompose.controller";

type Params = { params: Promise<{ id: string }> };

export async function POST(_: Request, { params }: Params) {
  const { id } = await params;
  return DecomposeController.run(id);
}
