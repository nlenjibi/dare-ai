import mongoose, { Document, Schema, Model } from "mongoose";
import { PROJECT_STAGES } from "@/shared/enum";

export interface IStageRunDoc extends Document {
  _id: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  stage: string;
  promptVersion: string;
  aiModel: string;
  inputTokenCount: number;
  outputTokenCount: number;
  estimatedCost: number;
  durationMs: number;
  status: "COMPLETED" | "FAILED";
  error?: string;
  createdAt: Date;
}

const schema = new Schema<IStageRunDoc>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    stage: { type: String, enum: PROJECT_STAGES, required: true },
    promptVersion: { type: String, required: true },
    aiModel: { type: String, required: true },
    inputTokenCount: { type: Number, required: true },
    outputTokenCount: { type: Number, required: true },
    estimatedCost: { type: Number, required: true },
    durationMs: { type: Number, required: true },
    status: { type: String, enum: ["COMPLETED", "FAILED"], required: true },
    error: { type: String },
  },
  { timestamps: true }
);

schema.index({ projectId: 1, stage: 1, createdAt: -1 });

export const StageRunModel: Model<IStageRunDoc> =
  mongoose.models.StageRun ?? mongoose.model<IStageRunDoc>("StageRun", schema);
