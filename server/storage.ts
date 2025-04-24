import { Types } from 'mongoose';
import { User, IUser } from '../shared/models/user';
import { Student, IStudent } from '../shared/models/student';
import { Instructor, IInstructor } from '../shared/models/instructor';
import { Course, ICourse } from '../shared/models/course';
import { Payment, IPayment } from '../shared/models/payment';
import { Branch, IBranch } from '../shared/models/branch';
import { Settings, ISettings } from "../shared/models/settings"; // Import the Settings model
import { Activity, IActivity } from "../shared/models/activity"; // Import the Activity model

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  createUser(user: Partial<IUser>): Promise<IUser>;
  updateUser(id: string, data: Partial<IUser>): Promise<IUser | null>;
  
  // Student operations
  getStudent(id: string): Promise<IStudent | null>;
  getStudents(filter?: object): Promise<IStudent[]>;
  getActiveStudents(): Promise<IStudent[]>;
  createStudent(student: Partial<IStudent>): Promise<IStudent>;
  updateStudent(id: string, data: Partial<IStudent>): Promise<IStudent | null>;
  
  // Instructor operations
  getInstructor(id: string): Promise<IInstructor | null>;
  getInstructors(): Promise<IInstructor[]>;
  createInstructor(instructor: Partial<IInstructor>): Promise<IInstructor>;
  updateInstructor(id: string, data: Partial<IInstructor>): Promise<IInstructor | null>;
  
  // Course operations
  getCourse(id: string): Promise<ICourse | null>;
  getCourses(): Promise<ICourse[]>;
  createCourse(course: Partial<ICourse>): Promise<ICourse>;
  updateCourse(id: string, data: Partial<ICourse>): Promise<ICourse | null>;
  
  // Payment operations
  getPayment(id: string): Promise<IPayment | null>;
  getPaymentsByStudent(studentId: string): Promise<IPayment[]>;
  createPayment(payment: Partial<IPayment>): Promise<IPayment>;
  
  // Branch operations
  getBranch(id: string): Promise<IBranch | null>;
  getBranches(): Promise<IBranch[]>;
  createBranch(branch: Partial<IBranch>): Promise<IBranch>;
  updateBranch(id: string, data: Partial<IBranch>): Promise<IBranch | null>;
  
  // Stats operations
  getStats(): Promise<{
    totalStudents: number;
    activeStudents: number;
    instructors: number;
    revenue: number;
  }>;

  // Settings operations
  getSettings(): Promise<ISettings | null>;
  saveSettings(settings: Partial<ISettings>): Promise<ISettings>;

  // Activity operations
  getRecentActivities(): Promise<IActivity[]>;
}

// MongoDB Storage implementation
export class MongoStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<IUser | null> {
    try {
      return await User.findById(id);
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }
  
  async getUserByUsername(username: string): Promise<IUser | null> {
    try {
      return await User.findOne({ username });
    } catch (error) {
      console.error('Error getting user by username:', error);
      throw error;
    }
  }
  
  async createUser(user: Partial<IUser>): Promise<IUser> {
    try {
      const newUser = new User(user);
      return await newUser.save();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  
  async updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
    try {
      return await User.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
  
  // Student operations
  async getStudent(id: string): Promise<IStudent | null> {
    try {
      return await Student.findById(id).populate('courseId');
    } catch (error) {
      console.error('Error getting student:', error);
      throw error;
    }
  }
  
  async getStudents(filter = {}): Promise<IStudent[]> {
    try {
      return await Student.find(filter).populate('courseId');
    } catch (error) {
      console.error('Error getting students:', error);
      throw error;
    }
  }
  
  async getActiveStudents(): Promise<IStudent[]> {
    try {
      return await Student.find({ status: 'active' }).populate('courseId');
    } catch (error) {
      console.error('Error getting active students:', error);
      throw error;
    }
  }
  
  async createStudent(student: Partial<IStudent>): Promise<IStudent> {
    try {
      const newStudent = new Student(student);
      return await newStudent.save();
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }
  
  async updateStudent(id: string, data: Partial<IStudent>): Promise<IStudent | null> {
    try {
      return await Student.findByIdAndUpdate(id, data, { new: true }).populate('courseId');
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }
  
  // Instructor operations
  async getInstructor(id: string): Promise<IInstructor | null> {
    try {
      return await Instructor.findById(id).populate('userId');
    } catch (error) {
      console.error('Error getting instructor:', error);
      throw error;
    }
  }
  
  async getInstructors(): Promise<IInstructor[]> {
    try {
      return await Instructor.find().populate('userId');
    } catch (error) {
      console.error('Error getting instructors:', error);
      throw error;
    }
  }
  
  async createInstructor(instructor: Partial<IInstructor>): Promise<IInstructor> {
    try {
      const newInstructor = new Instructor(instructor);
      return await newInstructor.save();
    } catch (error) {
      console.error('Error creating instructor:', error);
      throw error;
    }
  }
  
  async updateInstructor(id: string, data: Partial<IInstructor>): Promise<IInstructor | null> {
    try {
      return await Instructor.findByIdAndUpdate(id, data, { new: true }).populate('userId');
    } catch (error) {
      console.error('Error updating instructor:', error);
      throw error;
    }
  }
  
  // Course operations
  async getCourse(id: string): Promise<ICourse | null> {
    try {
      return await Course.findById(id);
    } catch (error) {
      console.error('Error getting course:', error);
      throw error;
    }
  }
  
  async getCourses(): Promise<ICourse[]> {
    try {
      return await Course.find();
    } catch (error) {
      console.error('Error getting courses:', error);
      throw error;
    }
  }
  
  async createCourse(course: Partial<ICourse>): Promise<ICourse> {
    try {
      const newCourse = new Course(course);
      return await newCourse.save();
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }
  
  async updateCourse(id: string, data: Partial<ICourse>): Promise<ICourse | null> {
    try {
      return await Course.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }
  
  // Payment operations
  async getPayment(id: string): Promise<IPayment | null> {
    try {
      return await Payment.findById(id).populate('studentId');
    } catch (error) {
      console.error('Error getting payment:', error);
      throw error;
    }
  }
  
  async getPaymentsByStudent(studentId: string): Promise<IPayment[]> {
    try {
      return await Payment.find({ studentId: new Types.ObjectId(studentId) });
    } catch (error) {
      console.error('Error getting payments by student:', error);
      throw error;
    }
  }
  
  async createPayment(payment: Partial<IPayment>): Promise<IPayment> {
    try {
      // Log the payment data being passed
      console.log('Creating payment with data:', payment);

      // Create a new payment object
      const newPayment = new Payment({
        ...payment,
        receiptNumber: `RCP-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Generate receipt number
      });

      // Save the payment to the database
      const savedPayment = await newPayment.save();
      console.log('Payment saved successfully:', savedPayment);

      // Update student balance
      if (payment.studentId && payment.amount) {
        try {
          const student = await Student.findById(payment.studentId);
          if (student) {
            console.log('Student found:', student);

            // Update the student's totalPaid and balance
            student.totalPaid += payment.amount;
            student.balance = student.courseFee - student.totalPaid;

            // Save the updated student
            await student.save();
            console.log('Student balance updated successfully:', student);
          } else {
            console.warn('Student not found for ID:', payment.studentId);
          }
        } catch (studentError) {
          console.error('Error updating student balance:', studentError);
        }
      }

      return savedPayment;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }
  
  // Branch operations
  async getBranch(id: string): Promise<IBranch | null> {
    try {
      return await Branch.findById(id).populate('manager');
    } catch (error) {
      console.error('Error getting branch:', error);
      throw error;
    }
  }
  
  async getBranches(): Promise<IBranch[]> {
    try {
      return await Branch.find().populate('manager');
    } catch (error) {
      console.error('Error getting branches:', error);
      throw error;
    }
  }
  
  async createBranch(branch: Partial<IBranch>): Promise<IBranch> {
    try {
      const newBranch = new Branch(branch);
      return await newBranch.save();
    } catch (error) {
      console.error('Error creating branch:', error);
      throw error;
    }
  }
  
  async updateBranch(id: string, data: Partial<IBranch>): Promise<IBranch | null> {
    try {
      return await Branch.findByIdAndUpdate(id, data, { new: true }).populate('manager');
    } catch (error) {
      console.error('Error updating branch:', error);
      throw error;
    }
  }
  
  // Stats operations
  async getStats(): Promise<{
    totalStudents: number;
    activeStudents: number;
    instructors: number;
    revenue: number;
  }> {
    try {
      const totalStudents = await Student.countDocuments();
      const activeStudents = await Student.countDocuments({ status: 'active' });
      const instructors = await Instructor.countDocuments({ active: true });
      
      // Calculate total revenue from payments
      const currentMonth = new Date();
      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59, 999);
      
      const payments = await Payment.find({
        paymentDate: {
          $gte: firstDay,
          $lte: lastDay
        }
      });
      
      const revenue = payments.reduce((total: number, payment: any) => total + payment.amount, 0);
      
      return {
        totalStudents,
        activeStudents,
        instructors,
        revenue
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      throw error;
    }
  }

  // Fetch settings from the database
  async getSettings(): Promise<ISettings | null> {
    try {
      return await Settings.findOne({}); // Fetch the singleton settings document
    } catch (error) {
      console.error("Error fetching settings:", error);
      throw error;
    }
  }

  // Save settings to the database
  async saveSettings(settings: Partial<ISettings>): Promise<ISettings> {
    try {
      const updatedSettings = await Settings.findOneAndUpdate(
        {}, // Match all (singleton document)
        { $set: settings }, // Update fields
        { new: true, upsert: true } // Return the updated document; create if not exists
      );
      return updatedSettings;
    } catch (error) {
      console.error("Error saving settings:", error);
      throw error;
    }
  }

  async getRecentActivities(): Promise<IActivity[]> {
    try {
      // Fetch the 10 most recent activities, sorted by timestamp
      return await Activity.find()
        .sort({ timestamp: -1 }) // Sort by most recent
        .limit(10); // Limit to the last 10 activities
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  }
}

// Export storage instance
export const storage = new MongoStorage();
