import mongoose from 'mongoose';

export interface IAnalytics extends mongoose.Document {
  urlId: mongoose.Types.ObjectId;
  timestamp: Date;
  userAgent: string;
  ipAddress: string;
  country?: string;
  city?: string;
  osType: string;
  deviceType: string;
  browser: string;
}

const analyticsSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  userAgent: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  country: String,
  city: String,
  osType: {
    type: String,
    required: true,
  },
  deviceType: {
    type: String,
    required: true,
  },
  browser: {
    type: String,
    required: true,
  },
});

export const Analytics = mongoose.model<IAnalytics>('Analytics', analyticsSchema);