import mongoose, { Document, Schema, Model } from "mongoose";
import { STAGE_STATUSES } from "@/shared/enum";

export interface ISolutionDoc extends Document {
  _id: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  structure: string;
  buildingBlockIds: mongoose.Types.ObjectId[];
  rejectedConventions: string[];
  newAssumptions: string[];
  biggestFailurePoint: string;
  status: string;
  createdAt: Date;
}

const schema = new Schema<ISolutionDoc>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    structure: { type: String, required: true },
    buildingBlockIds: [{ type: Schema.Types.ObjectId, ref: "Component" }],
    rejectedConventions: [{ type: String }],
    newAssumptions: [{ type: String }],
    biggestFailurePoint: { type: String, required: true },
    status: { type: String, enum: STAGE_STATUSES, default: "COMPLETED" },
  },
  { timestamps: true }
);

schema.index({ projectId: 1 });

export const SolutionModel: Model<ISolutionDoc> =
  mongoose.models.Solution ?? mongoose.model<ISolutionDoc>("Solution", schema);
