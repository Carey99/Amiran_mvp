import mongoose, { Schema, Document } from "mongoose";

// Define the Settings interface
export interface ISettings extends Document {
  schoolName: string;
  contactEmail: string;
  contactPhone: string;
  schoolAddress: string;
}

// Define the Settings schema
const SettingsSchema: Schema = new Schema(
  {
    schoolName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    schoolAddress: { type: String, required: true },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Create the Settings model
export const Settings = mongoose.model<ISettings>("Settings", SettingsSchema);