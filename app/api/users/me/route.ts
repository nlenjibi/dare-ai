import { NextRequest } from "next/server";
import { UserController } from "@/backend/module/user/controller/user.controller";

export async function GET() {
  return UserController.getMe();
}

export async function PATCH(req: NextRequest) {
  return UserController.updateMe(req);
}
