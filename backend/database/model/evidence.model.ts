import mongoose, { Document, Schema, Model } from "mongoose";
import { EVIDENCE_TYPES, VERIFICATION_STATUSES } from "@/shared/enum";

export interface IEvidenceDoc extends Document {
  _id: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  assumptionId?: mongoose.Types.ObjectId;
  type: string;
  claim: string;
  source?: string;
  reference?: string;
  confidence: number;
  verificationStatus: string;
  verifiedAt?: Date;
  verifiedBy?: string;
  createdAt: Date;
}

const schema = new Schema<IEvidenceDoc>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    assumptionId: { type: Schema.Types.ObjectId, ref: "Assumption" },
    type: { type: String, enum: EVIDENCE_TYPES, required: true },
    claim: { type: String, required: true },
    source: { type: String },
    reference: { type: String },
    confidence: { type: Number, default: 0, min: 0, max: 1 },
    verificationStatus: { type: String, enum: VERIFICATION_STATUSES, default: "UNVERIFIED" },
    verifiedAt: { type: Date },
    verifiedBy: { type: String },
  },
  { timestamps: true }
);

schema.index({ projectId: 1, assumptionId: 1 });

export const EvidenceModel: Model<IEvidenceDoc> =
  mongoose.models.Evidence ?? mongoose.model<IEvidenceDoc>("Evidence", schema);
