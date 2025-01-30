import mongoose from 'mongoose';

export interface IUrl extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  longUrl: string;
  shortUrl: string;
  alias: string;
  topic?: string;
  clicks: number;
  createdAt: Date;
}

const urlSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  longUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
  alias: {
    type: String,
    required: true,
    unique: true,
  },
  topic: {
    type: String,
    enum: ['acquisition', 'activation', 'retention', null],
    default: null,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Url = mongoose.model<IUrl>('Url', urlSchema);