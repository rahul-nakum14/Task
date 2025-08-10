import mongoose, { Schema, Document } from 'mongoose';

export interface IActionItemKPIMapping extends Document {
  ActionID: string;
  KPIID: string;
  CreatedDate: Date;
  CreatedBy: string;
  UpdatedDate?: Date;
  UpdatedBy?: string;
}

const ActionItemKPIMappingSchema: Schema = new Schema({
  ActionID: { type: Schema.Types.ObjectId, ref: 'ActionItemMaster', required: true },
  KPIID: { type: String, required: true },
  CreatedDate: { type: Date, default: Date.now },
  CreatedBy: { type: String, required: true },
  UpdatedDate: { type: Date },
  UpdatedBy: { type: String }
});

export default mongoose.model<IActionItemKPIMapping>('ActionItemKPIMapping', ActionItemKPIMappingSchema);
