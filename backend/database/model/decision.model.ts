import mongoose, { Document, Schema, Model } from "mongoose";

export interface IDecisionDoc extends Document {
  _id: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  decision: string;
  selectedSolutionId?: mongoose.Types.ObjectId;
  confidence?: number;
  evidenceSummary?: string;
  rejectedAlternatives?: string[];
  reasoningSummary?: string;
  decisionMakerId: mongoose.Types.ObjectId;
  reviewDate?: Date;
  outcome?: string;
  createdAt: Date;
}

const schema = new Schema<IDecisionDoc>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    decision: { type: String, required: true },
    selectedSolutionId: { type: Schema.Types.ObjectId, ref: "Solution" },
    confidence: { type: Number, min: 0, max: 1 },
    evidenceSummary: { type: String },
    rejectedAlternatives: [{ type: String }],
    reasoningSummary: { type: String },
    decisionMakerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reviewDate: { type: Date },
    outcome: { type: String },
  },
  { timestamps: true }
);

export const DecisionModel: Model<IDecisionDoc> =
  mongoose.models.Decision ?? mongoose.model<IDecisionDoc>("Decision", schema);
