import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { ok, fail } from "@/common/util/api-response";
import { toApiError } from "@/common/exception/app-error";
import { getProfile, updateProfile } from "../service/user.service";
import { updateProfileSchema } from "../validator/user.validator";

export const UserController = {
  async getMe() {
    const session = await auth();
    if (!session?.user) return fail("Unauthorized", 401);
    try {
      const user = await getProfile((session.user as { id: string }).id);
      return ok(user);
    } catch (err) {
      const { message, statusCode } = toApiError(err);
      return fail(message, statusCode);
    }
  },

  async updateMe(req: NextRequest) {
    const session = await auth();
    if (!session?.user) return fail("Unauthorized", 401);
    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) return fail(parsed.error.issues[0].message);
    try {
      const user = await updateProfile((session.user as { id: string }).id, parsed.data);
      return ok(user);
    } catch (err) {
      const { message, statusCode } = toApiError(err);
      return fail(message, statusCode);
    }
  },
};
