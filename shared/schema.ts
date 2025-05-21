import { z } from 'zod';
import { Types } from 'mongoose';

// Re-export all Mongoose models
export * from './models/user';
export * from './models/student';
export * from './models/instructor';
export * from './models/course';
export * from './models/payment';
export * from './models/branch';
export * from './models/settings';
export * from './models/activity'; // Commented out because 'activity.ts' is not a module

// Helper to allow both string and ObjectId types
const objectIdSchema = z.union([z.string(), z.instanceof(Types.ObjectId)]);

// Define allowed branches as a constant
export const branchOptions = ['Mwihoko', 'Kahawa Sukari', 'Kasarani'] as const;

// Create Zod validation schemas for input data

// User validation schema
export const userSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  role: z.enum(['super_admin', 'admin', 'instructor']),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional()
});

// Student validation schema
export const studentSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  idNumber: z.string(),
  courseId: objectIdSchema, // Allow string or ObjectId
  status: z.enum(['active', 'completed', 'dropped']).default('active'),
  balance: z.number().default(0),
  totalPaid: z.number().default(0),
  courseFee: z.number(),
  branch: z.enum(branchOptions, { required_error: "Please select a branch" }), // <-- required and restricted
});

// Course validation schema
export const courseSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  type: z.enum([
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
  ]),
  duration: z.number(),
  numberOfLessons: z.number(),
  fee: z.number(),
  active: z.boolean().default(true)
});

// Payment validation schema
export const paymentSchema = z.object({
  studentId: objectIdSchema, // Validate that studentId is a string or ObjectId
  amount: z.number().positive(), // Ensure amount is a positive number
  paymentMethod: z.enum(['mpesa', 'cash', 'bank', 'other']), // Restrict to allowed payment methods
  paymentDate: z
    .union([z.string(), z.date()])
    .optional()
    .transform((value) => (typeof value === 'string' ? new Date(value) : value)), // Convert strings to Date objects
});

// Branch validation schema
export const branchSchema = z.object({
  name: z.string().min(2),
  location: z.string(),
  address: z.string(),
  contactPhone: z.string().min(10),
  contactEmail: z.string().email().optional(),
  manager: objectIdSchema.optional(), // Allows string or ObjectId
  active: z.boolean().default(true)
});

// Instructor validation schema
export const instructorSchema = z.object({
  userId: objectIdSchema, // Allow string or ObjectId
  specialization: z.array(z.string()),
  branch: z.enum(branchOptions, { required_error: "Please select a branch" }), // <-- required and restricted
  active: z.boolean().default(true)
});
