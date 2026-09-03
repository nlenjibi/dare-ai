import { findUserById, updateUserProfile } from "../repository/user.repository";
import { UpdateProfileDto } from "../dto/update-profile.dto";

export async function getProfile(userId: string) {
  const user = await findUserById(userId);
  if (!user) throw new Error("USER_NOT_FOUND");
  return user;
}

export async function updateProfile(userId: string, data: UpdateProfileDto) {
  const user = await updateUserProfile(userId, data);
  if (!user) throw new Error("USER_NOT_FOUND");
  return user;
}
