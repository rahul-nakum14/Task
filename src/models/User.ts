import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  UserID: string;
  UserName: string;
  Email: string;
}

const UserSchema: Schema = new Schema({
  UserID: { type: String, required: true, unique: true },
  UserName: { type: String, required: true },
  Email: { type: String, required: true }
});

export default mongoose.model<IUser>('User', UserSchema);
