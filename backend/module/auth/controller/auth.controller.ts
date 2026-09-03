import { NextRequest } from "next/server";
import { created, fail } from "@/common/util/api-response";
import { connectDB } from "@/backend/database/mongoose";
import { UserModel } from "@/backend/database/model/user.model";
import { registerSchema } from "../validator/auth.validator";

export const AuthController = {
  async register(req: NextRequest) {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    try {
      await connectDB();
      const existing = await UserModel.findOne({ email: parsed.data.email });
      if (existing) return fail("Email already registered", 409);

      const user = await UserModel.create(parsed.data);
      return created({ id: user._id, email: user.email, name: user.name });
    } catch {
      return fail("Registration failed", 500);
    }
  },
};
