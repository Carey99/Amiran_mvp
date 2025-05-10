import mongoose, { Schema, Document } from 'mongoose';

// Define the IActivity interface
export interface IActivity extends Document {
  type: string;
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
  iconColor: string;
  iconBgColor: string;
}

// Define the Activity schema
const ActivitySchema: Schema = new Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  icon: { type: String, required: true },
  iconColor: { type: String, required: true },
  iconBgColor: { type: String, required: true },
});

// Export the Activity model
export const Activity = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);

