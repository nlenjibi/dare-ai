import { connectDB } from "@/backend/database/mongoose";
import { UserModel } from "@/backend/database/model/user.model";
import { UpdateProfileDto } from "../dto/update-profile.dto";

export async function findUserById(id: string) {
  await connectDB();
  return UserModel.findById(id).select("-password").lean();
}

export async function updateUserProfile(id: string, data: UpdateProfileDto) {
  await connectDB();
  return UserModel.findByIdAndUpdate(id, data, { new: true }).select("-password").lean();
}
