import { Schema, model, Document, Types } from 'mongoose';
import mongoose from 'mongoose';

// Define interface for Instructor document
export interface IInstructor extends Document {
  userId: Types.ObjectId;
  specialization: string[];
  availability: {
    day: string;
    slots: {
      startTime: string;
      endTime: string;
    }[];
  }[];
  rating?: number;
  branch?: Types.ObjectId;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define Instructor schema
const instructorSchema = new Schema<IInstructor>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true
    },
    specialization: [{ 
      type: String 
    }],
    availability: [
      {
        day: { 
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        slots: [
          {
            startTime: { type: String },
            endTime: { type: String }
          }
        ]
      }
    ],
    rating: { 
      type: Number,
      min: 0,
      max: 5
    },
    branch: { 
      type: Schema.Types.ObjectId,
      ref: 'Branch'
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

// Create and export Instructor model
// Use existing model or create a new one
export const Instructor = mongoose.models.Instructor || model<IInstructor>('Instructor', instructorSchema);
