import mongoose, { ObjectId } from 'mongoose';
export interface IUserInterface {
  googleId?: string;
  email?: string;
  name?: string;
  id?: ObjectId;
  _id?: ObjectId;
  createdAt?: Date;
}

export interface IUser extends mongoose.Document {
  googleId?: string;
  email?: string;
  name?: string;
  id?: ObjectId;
  _id?: ObjectId;
  createdAt?: Date;
}

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
declare global {
  namespace Express {
    interface User extends IUserInterface {}
  }
}
export const User = mongoose.model<IUser>('User', userSchema);