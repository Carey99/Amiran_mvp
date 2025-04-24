import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { connectToMongoDB, getConnectionStatus } from "../shared/db";
import { userSchema, studentSchema, instructorSchema, courseSchema, paymentSchema, branchSchema } from "../shared/schema";
import z from "zod";
import { ZodError } from "zod";
import { Types } from "mongoose";
import { seedInitialData } from "./seed";
import { hashPassword, comparePasswords } from "./utils/auth";
import * as studentController from "./controllers/studentController";
import { initiateSTKPush } from './services/mpesaService';

export async function registerRoutes(app: Express): Promise<Server> {
  // Connect to MongoDB Atlas
  await connectToMongoDB();
  
  // Seed the database with initial data including admin user and courses
  await seedInitialData();
  
  // API routes
  app.get("/api/db-status", async (req, res) => {
    try {
      const status = getConnectionStatus();
      res.json({
        connected: status === 1,
        status: status,
        statusText: getConnectionStatusText(status)
      });
    } catch (error) {
      res.status(500).json({ message: "Error checking database status", error: (error as Error).message });
    }
  });
  
  // Public routes
  app.post("/api/students/register", studentController.registerStudent);
  
  // Student controller routes
  app.get("/api/students", studentController.getAllStudents);
  app.get("/api/students/active", studentController.getActiveStudents);
  app.get("/api/students/finished", studentController.getFinishedStudents);
  app.get("/api/students/search", studentController.searchStudents);
  app.get("/api/students/:id", studentController.getStudentById);
  app.put("/api/students/:id/lesson", studentController.updateStudentLesson);

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // For the admin user created with the seed, we need special handling
      // since it might have been created with direct password assignment
      let isPasswordValid = false;
      
      if (user.password.includes('.')) {
        // Password is in hashed format with salt
        isPasswordValid = await comparePasswords(password, user.password);
      } else {
        // Direct comparison for development only
        isPasswordValid = password === user.password;
      }
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Session setup would go here in a real application
      res.json({
        id: user.id,
        username: user.username,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      });
      
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Error during login", error: (error as Error).message });
    }
  });
  
  // Session validity check endpoint
  app.get("/api/auth/check-session", async (req, res) => {
    try {
      // This is a simple check - in a real application, you would validate
      // a session token or JWT. For now, we'll just return success.
      // For demonstration purposes only.
      
      // In a production environment, you would:
      // 1. Extract session token/JWT from headers
      // 2. Verify the token validity
      // 3. Check user permissions if needed
      
      res.status(200).json({ valid: true });
    } catch (error) {
      console.error("Session check error:", error);
      res.status(401).json({ 
        valid: false, 
        message: "Session invalid or expired" 
      });
    }
  });

  // Sign-up route
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = userSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Hash the password
      const hashedPassword = await hashPassword(userData.password);
      
      // Create the user with hashed password
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      // Return user without sensitive data
      res.status(201).json({
        id: user.id,
        username: user.username,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating user", error: (error as Error).message });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error: (error as Error).message });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = userSchema.parse(req.body);
      
      // Hash the password if provided
      if (userData.password) {
        userData.password = await hashPassword(userData.password);
      }
      
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating user", error: (error as Error).message });
    }
  });

  // Student routes
  app.get("/api/students", async (req, res) => {
    try {
      const students = await storage.getStudents();
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: "Error fetching students", error: (error as Error).message });
    }
  });

  app.get("/api/students/active", async (req, res) => {
    try {
      const students = await storage.getActiveStudents();
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: "Error fetching active students", error: (error as Error).message });
    }
  });

  app.get("/api/students/:id", async (req, res) => {
    try {
      const student = await storage.getStudent(req.params.id);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ message: "Error fetching student", error: (error as Error).message });
    }
  });

  app.post("/api/students", async (req, res) => {
    try {
      const studentData = studentSchema.parse(req.body);
      
      // Convert string IDs to ObjectIds
      if (studentData.courseId) {
        // Create a new object with the courseId as ObjectId
        const student = await storage.createStudent({
          ...studentData,
          courseId: new Types.ObjectId(studentData.courseId as string),
          branch: studentData.branch ? new Types.ObjectId(studentData.branch as string) : undefined
        });
        
        // Log success for debugging
        console.log(`Student created via API: ${studentData.firstName} ${studentData.lastName}`);
        
        res.status(201).json(student);
      } else {
        return res.status(400).json({ message: "Course ID is required" });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid student data", errors: error.errors });
      }
      console.error("Student creation error:", error);
      res.status(500).json({ message: "Error creating student", error: (error as Error).message });
    }
  });

  app.put("/api/students/:id", async (req, res) => {
    try {
      const studentData = req.body;
      
      // Convert string IDs to ObjectIds if present
      if (studentData.courseId) {
        studentData.courseId = new Types.ObjectId(studentData.courseId);
      }
      if (studentData.branch) {
        studentData.branch = new Types.ObjectId(studentData.branch);
      }
      
      const updatedStudent = await storage.updateStudent(req.params.id, studentData);
      if (!updatedStudent) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json(updatedStudent);
    } catch (error) {
      res.status(500).json({ message: "Error updating student", error: (error as Error).message });
    }
  });

  // Instructor routes
  app.get("/api/instructors", async (req, res) => {
    try {
      const instructors = await storage.getInstructors();
      res.json(instructors);
    } catch (error) {
      res.status(500).json({ message: "Error fetching instructors", error: (error as Error).message });
    }
  });

  app.get("/api/instructors/:id", async (req, res) => {
    try {
      const instructor = await storage.getInstructor(req.params.id);
      if (!instructor) {
        return res.status(404).json({ message: "Instructor not found" });
      }
      res.json(instructor);
    } catch (error) {
      res.status(500).json({ message: "Error fetching instructor", error: (error as Error).message });
    }
  });

  app.post("/api/instructors", async (req, res) => {
    try {
      // Extract user and instructor fields
      const { user, ...instructorFields } = req.body;
  
      let userId: Types.ObjectId;
  
      if (user) {
        // Create a new user
        const userData = userSchema.parse(user);
        const newUser = await storage.createUser(userData);
        userId = new Types.ObjectId(newUser.id); // Ensure ObjectId
      } else if (instructorFields.userId) {
        userId = new Types.ObjectId(instructorFields.userId); // Ensure ObjectId from string
      } else {
        return res.status(400).json({ message: "User information is required" });
      }
  
      // Prepare adjusted instructor data
      const instructorData = {
        ...instructorFields,
        userId,
        branch:
          instructorFields.branch && typeof instructorFields.branch === "string"
            ? new Types.ObjectId(instructorFields.branch) // Convert string to ObjectId
            : instructorFields.branch,
      };
  
      // Validate instructor data and pass the final ObjectId values
      // @ts-ignore
      const validatedData: Partial<IInstructor> = instructorSchema.parse(instructorData);
  
      // Ensure TypeScript compliance for `userId` and `branch`
      validatedData.userId = new Types.ObjectId(validatedData.userId as string);
      if (validatedData.branch)
        validatedData.branch = new Types.ObjectId(validatedData.branch as string);
  
      // Create the instructor in the database
      const instructor = await storage.createInstructor(validatedData);
  
      // Success response
      res.status(201).json(instructor);
    } catch (error) {
      // Process validation or server errors
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid instructor data", errors: error.errors });
      }
      console.error("Error creating instructor:", error);
      res.status(500).json({ message: "Error creating instructor", error: (error as Error).message });
    }
  });

  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Error fetching courses", error: (error as Error).message });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Error fetching course", error: (error as Error).message });
    }
  });

  app.post("/api/courses", async (req, res) => {
    try {
      const courseData = courseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid course data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating course", error: (error as Error).message });
    }
  });
  //stkpush route
  app.post('/api/payments/stkpush', async (req, res) => {
    try {
      // Log the raw request body for debugging
      console.log('Raw Request Body:', req.body);

      // Extract and validate the required fields
      const { phoneNumber, amount, accountReference, transactionDesc } = req.body;

      // Log the extracted fields for debugging
      console.log('Extracted Fields:', { phoneNumber, amount, accountReference, transactionDesc });

      // Check for missing fields
      if (!phoneNumber || !amount || !accountReference || !transactionDesc) {
        console.error('Missing required fields:', { phoneNumber, amount, accountReference, transactionDesc });
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Proceed with STK Push logic
      const result = await initiateSTKPush({ phoneNumber, amount, accountReference, transactionDesc });

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(500).json({ message: 'STK Push failed', error: result.error });
      }
    } catch (error) {
      console.error('Error in STK Push route:', error);
      res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
    }
  });

  // Payment routes
  app.get("/api/payments/student/:studentId", async (req, res) => {
    try {
      const payments = await storage.getPaymentsByStudent(req.params.studentId);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching payments", error: (error as Error).message });
    }
  });

  // M-Pesa callback route
app.post("/api/payments/callback", async (req, res) => {
  try {
    const { Body: { stkCallback: { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } } } = req.body;
    
    // Handle the callback - you can update the payment status here
    console.log("M-Pesa callback received:", { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc });
    
    res.json({ success: true });
  } catch (error) {
    console.error("M-Pesa callback error:", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.post("/api/payments", async (req, res) => {
    try {
      const paymentData = paymentSchema.parse(req.body);
      
      // Convert string IDs to ObjectIds
      if (paymentData.studentId) {
        paymentData.studentId = new Types.ObjectId(paymentData.studentId);
      }
      if (paymentData.createdBy) {
        paymentData.createdBy = new Types.ObjectId(paymentData.createdBy);
      }
      if (paymentData.branch) {
        paymentData.branch = new Types.ObjectId(paymentData.branch);
      }
      // @ts-ignore
      const payment = await storage.createPayment(paymentData);
      res.status(201).json(payment);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid payment data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating payment", error: (error as Error).message });
    }
  });

  // Branch routes
  app.get("/api/branches", async (req, res) => {
    try {
      const branches = await storage.getBranches();
      res.json(branches);
    } catch (error) {
      res.status(500).json({ message: "Error fetching branches", error: (error as Error).message });
    }
  });

  app.post("/api/branches", async (req, res) => {
    try {
      const branchData = branchSchema.parse(req.body);

      // Convert string IDs to ObjectIds
      if (branchData.manager && typeof branchData.manager === "string") {
        branchData.manager = new Types.ObjectId(branchData.manager); // Ensure it's an ObjectId
      }
      // @ts-ignore
      const branch = await storage.createBranch(branchData); // Pass the validated and converted data
      res.status(201).json(branch);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid branch data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating branch", error: (error as Error).message });
    }
  });

  // Stats route
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error fetching stats", error: (error as Error).message });
    }
  });

  // Recent activities route
  app.get("/api/activities/recent", async (req, res) => {
    try {
      const activities = await storage.getRecentActivities(); // Fetch from the database
      res.json(activities);
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      res.status(500).json({ message: "Error fetching recent activities", error: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to get connection status text
function getConnectionStatusText(status: number): string {
  switch (status) {
    case 0:
      return "Disconnected";
    case 1:
      return "Connected";
    case 2:
      return "Connecting";
    case 3:
      return "Disconnecting";
    default:
      return "Unknown";
  }
}
