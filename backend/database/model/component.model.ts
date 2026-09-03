import mongoose, { Document, Schema, Model } from "mongoose";

export interface IComponentDoc extends Document {
  _id: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  parentId?: mongoose.Types.ObjectId;
  name: string;
  description: string;
  dimension?: string;
  relationships: string[];
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IComponentDoc>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    parentId: { type: Schema.Types.ObjectId, ref: "Component" },
    name: { type: String, required: true },
    description: { type: String, required: true },
    dimension: { type: String },
    relationships: [{ type: String }],
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

schema.index({ projectId: 1, sortOrder: 1 });

export const ComponentModel: Model<IComponentDoc> =
  mongoose.models.Component ?? mongoose.model<IComponentDoc>("Component", schema);
