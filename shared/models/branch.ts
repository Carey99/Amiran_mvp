import { Schema, model, Document } from 'mongoose';
import mongoose from 'mongoose';

// Define interface for Branch document
export interface IBranch extends Document {
  name: string;
  location: string;
  address: string;
  contactPhone: string;
  contactEmail?: string;
  manager?: Schema.Types.ObjectId;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define Branch schema
const branchSchema = new Schema<IBranch>(
  {
    name: { 
      type: String, 
      required: true,
      unique: true
    },
    location: { 
      type: String, 
      required: true 
    },
    address: { 
      type: String, 
      required: true 
    },
    contactPhone: { 
      type: String, 
      required: true 
    },
    contactEmail: { 
      type: String 
    },
    manager: { 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
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

// Create and export Branch model
// Use existing model or create a new one
export const Branch = mongoose.models.Branch || model<IBranch>('Branch', branchSchema);
