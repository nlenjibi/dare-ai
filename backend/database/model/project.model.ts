import mongoose, { Document, Schema, Model } from "mongoose";
import { PROJECT_STAGES, STAGE_STATUSES, PROJECT_MODES } from "@/shared/enum";

export interface IProjectDoc extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  mode: string;
  currentStage: string;
  status: string;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IProjectDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    mode: { type: String, enum: PROJECT_MODES, default: "GENERAL" },
    currentStage: { type: String, enum: PROJECT_STAGES, default: "D" },
    status: { type: String, enum: STAGE_STATUSES, default: "NOT_STARTED" },
    archivedAt: { type: Date },
  },
  { timestamps: true }
);

schema.index({ userId: 1, createdAt: -1 });

export const ProjectModel: Model<IProjectDoc> =
  mongoose.models.Project ?? mongoose.model<IProjectDoc>("Project", schema);
