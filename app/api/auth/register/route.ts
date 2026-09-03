import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/backend/database/mongoose";
import { UserModel } from "@/backend/database/model/user.model";
import { ok, created, fail } from "@/common/util/api-response";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    await connectDB();
    const existing = await UserModel.findOne({ email: parsed.data.email });
    if (existing) return fail("Email already registered", 409);

    const user = await UserModel.create(parsed.data);
    return created({ id: user._id, email: user.email, name: user.name });
  } catch {
    return fail("Registration failed", 500);
  }
}
