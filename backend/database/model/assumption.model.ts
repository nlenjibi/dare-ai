import mongoose, { Document, Schema, Model } from "mongoose";
import { ASSUMPTION_TYPES, ASSUMPTION_LIFECYCLE, VERIFICATION_STATUSES } from "@/shared/enum";

export interface IAssumptionDoc extends Document {
  _id: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  componentId?: mongoose.Types.ObjectId;
  statement: string;
  type: string;
  lifecycle: string;
  status: string;
  confidence: number;
  loadBearingScore: number;
  impactIfFalse?: string;
  inversion?: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IAssumptionDoc>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    componentId: { type: Schema.Types.ObjectId, ref: "Component" },
    statement: { type: String, required: true },
    type: { type: String, enum: ASSUMPTION_TYPES, required: true },
    lifecycle: { type: String, enum: ASSUMPTION_LIFECYCLE, default: "UNVERIFIED" },
    status: { type: String, enum: VERIFICATION_STATUSES, default: "UNVERIFIED" },
    confidence: { type: Number, default: 0, min: 0, max: 1 },
    loadBearingScore: { type: Number, default: 0, min: 0, max: 5 },
    impactIfFalse: { type: String },
    inversion: { type: String },
  },
  { timestamps: true }
);

schema.index({ projectId: 1, loadBearingScore: -1 });
schema.index({ projectId: 1, status: 1 });

export const AssumptionModel: Model<IAssumptionDoc> =
  mongoose.models.Assumption ?? mongoose.model<IAssumptionDoc>("Assumption", schema);
