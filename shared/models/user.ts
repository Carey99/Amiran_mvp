import { Schema, model, Document } from 'mongoose';
import mongoose from 'mongoose';

// Define interface for User document
export interface IUser extends Document {
  username: string;
  password: string;
  role: 'super_admin' | 'admin' | 'instructor';
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define User schema
const userSchema = new Schema<IUser>(
  {
    username: { 
      type: String, 
      required: true, 
      unique: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    role: { 
      type: String, 
      enum: ['super_admin', 'admin', 'instructor'], 
      required: true 
    },
    email: { 
      type: String 
    },
    firstName: { 
      type: String 
    },
    lastName: { 
      type: String 
    },
    phone: { 
      type: String 
    }
  },
  { 
    timestamps: true 
  }
);

// Create and export User model
// Use existing model or create a new one
export const User = mongoose.models.User || model<IUser>('User', userSchema);
