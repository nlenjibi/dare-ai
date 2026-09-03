import { RecombineController } from "@/backend/module/dare/recombine/controller/recombine.controller";

type Params = { params: Promise<{ id: string }> };

export async function POST(_: Request, { params }: Params) {
  const { id } = await params;
  return RecombineController.run(id);
}
