import { Schema, model, Document, Types } from 'mongoose';
import mongoose from 'mongoose';
import { IStudent } from './student';

// Define interface for Payment document
export interface IPayment extends Document {
  studentId: Types.ObjectId | IStudent;
  amount: number;
  paymentMethod: 'mpesa' | 'cash' | 'bank' | 'other';
  transactionId?: string;
  paymentDate: Date;
  lessonCovered?: number;
  notes?: string;
  receiptNumber: string;
  createdBy?: Types.ObjectId; // Made optional
  branch?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Define Payment schema
const paymentSchema = new Schema<IPayment>(
  {
    studentId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Student', 
      required: true 
    },
    amount: { 
      type: Number, 
      required: true 
    },
    paymentMethod: { 
      type: String, 
      enum: ['mpesa', 'cash', 'bank', 'other'], 
      required: true 
    },
    transactionId: { 
      type: String, 
      required: true, 
      unique: true, 
      length: 10 
    },
    paymentDate: { 
      type: Date, 
      default: () => {
        const now = new Date();
        return new Date(now.getTime() + 3 * 60 * 60 * 1000); // Add 3 hours to UTC
      }
    },
    lessonCovered: { 
      type: Number 
    },
    notes: { 
      type: String 
    },
    receiptNumber: { 
      type: String, 
      required: true, 
      unique: true 
    },
    createdBy: { 
      type: Schema.Types.ObjectId, 
      ref: 'User' // Removed `required: true` to make it optional
    },
    branch: { 
      type: Schema.Types.ObjectId, 
      ref: 'Branch' 
    }
  },
  { 
    timestamps: true 
  }
);

// Add indexes for performance
paymentSchema.index({ paymentDate: -1 }); // Index for sorting by paymentDate
paymentSchema.index({ studentId: 1 }); // Index for filtering by studentId

// Add a pre-save hook to generate a receipt number if not provided
paymentSchema.pre('save', function (next) {
  try {
    if (!this.receiptNumber) {
      const now = new Date();
      const eastAfricanTime = new Date(now.getTime() + 3 * 60 * 60 * 1000); // Add 3 hours to UTC
      this.receiptNumber = `RCPT-${eastAfricanTime.toISOString().replace(/[-:.TZ]/g, '')}-${Math.floor(Math.random() * 1000)}`;
    }
    next();
  } catch (error) {
    console.error('Error generating receipt number:', error);
    next(error);
  }
});

// Create and export Payment model
// Use existing model or create a new one
export const Payment = mongoose.models.Payment || model<IPayment>('Payment', paymentSchema);
