import mongoose, { Schema, Document } from 'mongoose';

export interface IActionItemMaster extends Document {
  UserID?: string;
  State: string;
  TargetDate: Date;
  Description: string;
  Comment?: string;
  Tag?: string;
  CreatedDate: Date;
  CreatedBy: string;
  UpdatedDate?: Date;
  UpdatedBy?: string;
}

const ActionItemMasterSchema: Schema = new Schema({
  UserID: { type: String, default: null },
  State: { type: String, required: true },
  TargetDate: { type: Date, required: true },
  Description: { type: String, required: true },
  Comment: { type: String },
  Tag: { type: String },
  CreatedDate: { type: Date, required: true, default: Date.now },
  CreatedBy: { type: String, required: true },
  UpdatedDate: { type: Date },
  UpdatedBy: { type: String }
});

export default mongoose.model<IActionItemMaster>('ActionItemMaster', ActionItemMasterSchema);
