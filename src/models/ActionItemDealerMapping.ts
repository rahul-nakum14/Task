import mongoose, { Schema, Document } from 'mongoose';

export interface IActionItemDealerMapping extends Document {
  ActionID: string;
  DealerID: string;
  CreatedDate: Date;
  CreatedBy: string;
  UpdatedDate?: Date;
  UpdatedBy?: string;
}

const ActionItemDealerMappingSchema: Schema = new Schema({
  ActionID: { type: Schema.Types.ObjectId, ref: 'ActionItemMaster', required: true },
  DealerID: { type: String, required: true },
  CreatedDate: { type: Date, default: Date.now },
  CreatedBy: { type: String, required: true },
  UpdatedDate: { type: Date },
  UpdatedBy: { type: String }
});

export default mongoose.model<IActionItemDealerMapping>('ActionItemDealerMapping', ActionItemDealerMappingSchema);
