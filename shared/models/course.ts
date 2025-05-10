import { Schema, model, Document } from 'mongoose';
import mongoose from 'mongoose';

// Define interface for Course document
export interface ICourse extends Document {
  name: string;
  description: string;
  type:
    | 'Class A'
    | 'Class B'
    | 'Class C'
    | 'Defensive Driving'
    | 'Automatic Transmission'
    | 'Manual Transmission'
    | 'manual'
    | 'automatic'
    | 'both'
    | 'Both Transmissions';
  duration: number; // in weeks
  numberOfLessons: number;
  fee: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define Course schema
const courseSchema = new Schema<ICourse>(
  {
    name: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    type: { 
      type: String, 
      enum: [
        'Class A',
        'Class B',
        'Class C',
        'Defensive Driving',
        'Automatic Transmission',
        'Manual Transmission',
        'manual',
        'automatic',
        'both',
        'Both Transmissions'
      ], 
      required: true 
    },
    duration: { 
      type: Number, 
      required: true 
    },
    numberOfLessons: { 
      type: Number, 
      required: true 
    },
    fee: { 
      type: Number, 
      required: true 
    },
    active: { 
      type: Boolean, 
      default: true 
    }
  },
  { 
    timestamps: true 
  }
);

// Create and export Course model
// Use existing model or create a new one
export const Course = mongoose.models.Course || model<ICourse>('Course', courseSchema);
