import mongoose, { Document, Schema, Model } from "mongoose";

export interface IProblemDoc extends Document {
  _id: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  statement: string;
  objective?: string;
  deeperObjective?: string;
  selectedObjective?: "ORIGINAL" | "DEEPER";
  context?: string;
  constraints?: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IProblemDoc>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, unique: true },
    statement: { type: String, required: true },
    objective: { type: String },
    deeperObjective: { type: String },
    selectedObjective: { type: String, enum: ["ORIGINAL", "DEEPER"] },
    context: { type: String },
    constraints: { type: String },
  },
  { timestamps: true }
);

export const ProblemModel: Model<IProblemDoc> =
  mongoose.models.Problem ?? mongoose.model<IProblemDoc>("Problem", schema);
