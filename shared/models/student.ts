import { Schema, model, Document, Types } from 'mongoose';
import mongoose from 'mongoose';

// Define interface for Student document
export interface IStudent extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idNumber: string;
  courseId: Types.ObjectId;
  status: 'active' | 'completed' | 'dropped';
  lessons: {
    lessonNumber: number;
    date: Date;
    completed: boolean;
    instructor: Types.ObjectId;
    notes?: string;
    printed?: boolean; // <-- Added this line
  }[];
  balance: number;
  totalPaid: number;
  courseFee: number;
  branch?: Types.ObjectId;
  photoUrl?: string; // <-- Added this line
  createdAt: Date;
  updatedAt: Date;
}

// Define Student schema
const studentSchema = new Schema<IStudent>(
  {
    firstName: { 
      type: String, 
      required: true 
    },
    lastName: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true 
    },
    phone: { 
      type: String, 
      required: true 
    },
    idNumber: { 
      type: String, 
      required: true
    },
    courseId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Course', 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['active', 'completed', 'dropped'], 
      default: 'active' 
    },
    lessons: [
      {
        lessonNumber: { 
          type: Number, 
          required: true 
        },
        date: { 
          type: Date 
        },
        completed: { 
          type: Boolean, 
          default: false 
        },
        instructor: { 
          type: Schema.Types.ObjectId, 
          ref: 'User' 
        },
        notes: { 
          type: String 
        },
        printed: { 
          type: Boolean, 
          default: false // <-- Add this line
        }
      }
    ],
    balance: { 
      type: Number, 
      default: 0 
    },
    totalPaid: { 
      type: Number, 
      default: 0 
    },
    courseFee: { 
      type: Number, 
      required: true 
    },
    branch: { 
      type: Schema.Types.ObjectId, 
      ref: 'Branch' 
    },
    photoUrl: { 
      type: String, 
      required: false // <-- Add this field, optional
    }
  },
  { 
    timestamps: true 
  }
);

// Create and export Student model
// Use existing model or create a new one
export const Student = mongoose.models.Student || model<IStudent>('Student', studentSchema);
