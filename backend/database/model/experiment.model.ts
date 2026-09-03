import mongoose, { Document, Schema, Model } from "mongoose";
import { STAGE_STATUSES, EXPERIMENT_OUTCOMES } from "@/shared/enum";

export interface IExperimentResultDoc {
  outcome: string;
  observations: string;
  metrics?: Record<string, unknown>;
  conclusion: string;
  createdAt: Date;
}

export interface IExperimentDoc extends Document {
  _id: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  solutionId?: mongoose.Types.ObjectId;
  assumptionId?: mongoose.Types.ObjectId;
  hypothesis: string;
  procedure: string;
  metric: string;
  passThreshold: string;
  failThreshold: string;
  estimatedCost?: string;
  estimatedDuration?: string;
  risk?: string;
  expectedLearning?: string;
  status: string;
  result?: IExperimentResultDoc;
  createdAt: Date;
  updatedAt: Date;
}

const resultSchema = new Schema<IExperimentResultDoc>(
  {
    outcome: { type: String, enum: EXPERIMENT_OUTCOMES, required: true },
    observations: { type: String, required: true },
    metrics: { type: Schema.Types.Mixed },
    conclusion: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const schema = new Schema<IExperimentDoc>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    solutionId: { type: Schema.Types.ObjectId, ref: "Solution" },
    assumptionId: { type: Schema.Types.ObjectId, ref: "Assumption" },
    hypothesis: { type: String, required: true },
    procedure: { type: String, required: true },
    metric: { type: String, required: true },
    passThreshold: { type: String, required: true },
    failThreshold: { type: String, required: true },
    estimatedCost: { type: String },
    estimatedDuration: { type: String },
    risk: { type: String },
    expectedLearning: { type: String },
    status: { type: String, enum: STAGE_STATUSES, default: "NOT_STARTED" },
    result: { type: resultSchema },
  },
  { timestamps: true }
);

schema.index({ projectId: 1, status: 1 });

export const ExperimentModel: Model<IExperimentDoc> =
  mongoose.models.Experiment ?? mongoose.model<IExperimentDoc>("Experiment", schema);
