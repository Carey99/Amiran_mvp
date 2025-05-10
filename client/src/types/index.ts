// User related types
export interface User {
  id: string;
  username: string;
  role: 'super_admin' | 'admin' | 'instructor';
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

// Student related types
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idNumber: string;
  courseId: Course;
  status: 'active' | 'completed' | 'dropped';
  lessons: Lesson[];
  balance: number;
  totalPaid: number;
  courseFee: number;
  branch?: string;
  photoUrl?: string; // <-- Add this line
  createdAt: string;
}

export interface Lesson {
  lessonNumber: number;
  date?: string;
  completed: boolean;
  instructor?: string;
  notes?: string;
}

// Instructor related types
export interface Instructor {
  id: string;
  userId: User;
  specialization: string[];
  availability: {
    day: string;
    slots: {
      startTime: string;
      endTime: string;
    }[];
  }[];
  rating?: number;
  branch?: string;
  active: boolean;
}

// Course related types
export interface Course {
  id: string;
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
  duration: number;
  numberOfLessons: number;
  fee: number;
  active: boolean;
}

// Payment related types
export interface Payment {
  id: string;
  studentId: Student | string;
  amount: number;
  paymentMethod: 'mpesa' | 'cash' | 'bank' | 'other';
  transactionId?: string;
  paymentDate: string;
  lessonCovered?: number;
  notes?: string;
  receiptNumber: string;
  createdBy: string;
  branch?: string;
  createdAt: string;
}

// Branch related types
export interface Branch {
  id: string;
  name: string;
  location: string;
  address: string;
  contactPhone: string;
  contactEmail?: string;
  manager?: string;
  active: boolean;
}

// Stats related types
export interface Stats {
  totalStudents: number;
  activeStudents: number;
  instructors: number;
  revenue: number;
}

// Activity types for the activity feed
export interface Activity {
  id?: string;
  _id?: string;
  type: 'lesson_completed' | 'student_registered' | 'payment_made' | 'lesson_scheduled' | 'lesson_cancelled';
  title: string;
  description: string;
  timestamp: string;
  icon?: string;
  iconColor?: string;
  iconBgColor?: string;
}

// Database connection status
export interface DatabaseStatus {
  connected: boolean;
  status: number;
  statusText: string;
}
