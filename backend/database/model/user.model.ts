import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUserDoc extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  name?: string;
  password?: string;
  image?: string;
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const schema = new Schema<IUserDoc>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, trim: true },
    password: { type: String, select: false },
    image: { type: String },
    emailVerified: { type: Date },
  },
  { timestamps: true }
);

schema.index({ email: 1 });

schema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

schema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password as string);
};

export const UserModel: Model<IUserDoc> =
  mongoose.models.User ?? mongoose.model<IUserDoc>("User", schema);
