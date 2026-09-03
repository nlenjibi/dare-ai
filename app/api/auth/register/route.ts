import { NextRequest } from "next/server";
import { AuthController } from "@/backend/module/auth/controller/auth.controller";

export async function POST(req: NextRequest) {
  return AuthController.register(req);
}
