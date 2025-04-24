import { Schema, model, Document, Types } from 'mongoose';
import mongoose from 'mongoose';

// Define interface for Payment document
export interface IPayment extends Document {
  studentId: Types.ObjectId;
  amount: number;
  paymentMethod: 'mpesa' | 'cash' | 'bank' | 'other';
  transactionId?: string;
  paymentDate: Date;
  lessonCovered?: number;
  notes?: string;
  receiptNumber: string;
  createdBy: Types.ObjectId;
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
      type: String 
    },
    paymentDate: { 
      type: Date, 
      default: Date.now 
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
      ref: 'User', 
      required: true 
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

// Add a pre-save hook to generate a receipt number if not provided
paymentSchema.pre('save', function (next) {
  if (!this.receiptNumber) {
    this.receiptNumber = `RCPT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

// Create and export Payment model
// Use existing model or create a new one
export const Payment = mongoose.models.Payment || model<IPayment>('Payment', paymentSchema);
