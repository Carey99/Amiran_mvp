import express from 'express';
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { connectToMongoDB, getConnectionStatus } from "../shared/db";
import { userSchema, studentSchema, instructorSchema, courseSchema, paymentSchema, branchSchema, IPayment, IStudent } from "../shared/schema";
import z from "zod";
import { ZodError } from "zod";
import { Types } from "mongoose";
import { seedInitialData } from "./seed";
import { hashPassword, comparePasswords } from "./utils/auth";
import * as studentController from "./controllers/studentController";
import { Payment } from '../shared/models/payment'; // Adjust the path as per your project structure
import { useState } from 'react';
import { User } from '../shared/models/user'; // Adjust the path if needed
import { authMiddleware } from './middlewares/auth';
//import { requireRole } from './middlewares/role';
import { checkRole } from './middlewares/auth';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' }); // or configure as needed

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files statically
  app.use('/uploads', express.static('uploads'));

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
  app.put("/api/students/:id/lesson", studentController.updateStudentLessonFlexible);
  //app.put("/api/students/phone/:phone", studentController.updateStudentLessonFlexible);
  app.put("/api/students/phone/:phone/lessons", studentController.updateStudentLessons);

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

  app.get("/api/students/:id/lessons", async (req, res) => {
    try {
      const { id } = req.params;

      // Fetch the student by ID
      const student = await storage.getStudent(id);

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Return the lessons associated with the student
      res.json(student.lessons || []);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      res.status(500).json({ message: "Error fetching lessons", error: (error as Error).message });
    }
  });

  app.get("/api/students/phone/:phone/lessons", async (req, res) => {
    try {
      const { phone } = req.params;
      console.log("Backend received phone:", phone); // Log to confirm request reaches here

      // Fetch the student by phone number
      const student = await storage.getStudentByPhone(phone);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Return the lessons associated with the student
      res.json(student);
    } catch (error) {
      console.error("Error fetching lessons by phone:", error);
      res.status(500).json({ message: "Error fetching lessons", error: (error as Error).message });
    }
  });

  app.put("/api/students/phone/:phone", async (req, res) => {
    try {
      const { phone } = req.params;
      const updatedData = req.body;

      console.log(`Update request received for student with phone: ${phone}`, updatedData); // Debugging log

      // Fetch the student by phone
      const student = await storage.getStudentByPhone(phone);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Use the existing updateStudent method to update the student by ID
      const updatedStudent = await storage.updateStudent(student.id, updatedData);
      if (!updatedStudent) {
        return res.status(500).json({ message: "Failed to update student" });
      }

      // Success response
      res.status(200).json(updatedStudent);
    } catch (error) {
      console.error("Error updating student by phone:", error);
      res.status(500).json({ message: "Error updating the student", error: (error as Error).message });
    }
  });

  app.put("/api/students/phone/:phone/lessons", studentController.updateStudentLessons);

  app.post('/api/students/:id/photo', upload.single('photo'), async (req, res) => {
    try {
      const studentId = req.params.id;
      // Save file path or URL to DB
      const photoUrl = `/uploads/${req.file.filename}`; // Adjust if you use cloud storage
      const updatedStudent = await storage.updateStudent(studentId, { photoUrl });
      res.json(updatedStudent);
    } catch (error) {
      res.status(500).json({ message: 'Photo upload failed', error: error.message });
    }
  });

  // Instructor routes
  app.get("/api/instructors", authMiddleware, checkRole(['admin', 'super_admin', 'instructor']), async (req, res) => {
    try {
      const instructors = await storage.getInstructors();
      res.json(instructors);
    } catch (error) {
      res.status(500).json({ message: "Error fetching instructors", error: (error as Error).message });
    }
  });

  app.get("/api/instructors/:id", authMiddleware, checkRole(['admin', 'super_admin', 'instructor']), async (req, res) => {
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

  app.post("/api/instructors", authMiddleware, checkRole(['admin', 'super_admin']), async (req, res) => {
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

  // Update instructor
  app.put("/api/instructors/:id", authMiddleware, checkRole(['admin', 'super_admin']), async (req, res) => {
    try {
      const instructorData = req.body;
      // Find the instructor first
      const instructor = await storage.getInstructor(req.params.id);
      if (!instructor) {
        return res.status(404).json({ message: "Instructor not found" });
      }

      // Update the linked user if user fields are present
      if (instructorData.username || instructorData.firstName || instructorData.lastName || instructorData.email || instructorData.phone || instructorData.password) {
        const userUpdate: any = {};
        if (instructorData.username) userUpdate.username = instructorData.username;
        if (instructorData.firstName) userUpdate.firstName = instructorData.firstName;
        if (instructorData.lastName) userUpdate.lastName = instructorData.lastName;
        if (instructorData.email) userUpdate.email = instructorData.email;
        if (instructorData.phone) userUpdate.phone = instructorData.phone;
        if (instructorData.password) userUpdate.password = instructorData.password;
        await User.findByIdAndUpdate(instructor.userId, userUpdate);
      }

      // Prepare instructor-specific fields
      const instructorUpdate: any = {};
      if (instructorData.specialization) instructorUpdate.specialization = instructorData.specialization;
      if (instructorData.branch) instructorUpdate.branch = instructorData.branch;
      if (typeof instructorData.active === "boolean") instructorUpdate.active = instructorData.active;

      const updatedInstructor = await storage.updateInstructor(req.params.id, instructorUpdate);
      res.json(updatedInstructor);
    } catch (error) {
      res.status(500).json({ message: "Error updating instructor", error: (error as Error).message });
    }
  });

  // Delete instructor
  app.delete("/api/instructors/:id", authMiddleware, checkRole(['admin', 'super_admin']), async (req, res) => {
    try {
      const deleted = await storage.deleteInstructor(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Instructor not found" });
      }
      res.json({ message: "Instructor deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting instructor", error: (error as Error).message });
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

  app.get("/api/courses/:id", authMiddleware, checkRole(['admin', 'super_admin', 'instructor']), async (req, res) => {
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

  app.post("/api/courses", authMiddleware, checkRole(['admin', 'super_admin']), async (req, res) => {
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

  app.put("/api/courses/:id", authMiddleware, checkRole(['admin', 'super_admin']), async (req, res) => {
    try {
      const courseData = courseSchema.parse(req.body); // Validate input
      const updatedCourse = await storage.updateCourse(req.params.id, courseData);
      if (!updatedCourse) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(updatedCourse);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid course data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating course", error: (error as Error).message });
    }
  });

  app.get('/api/payments', async (req, res) => {
    try {
      const { startDate, endDate, page = 1, limit = 50 } = req.query;
  
      // Build the query object for filtering by date
      const query: any = {};
      if (startDate && endDate) {
        query.paymentDate = {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string),
        };
      } else if (startDate) {
        query.paymentDate = { $gte: new Date(startDate as string) };
      }
  
      // Fetch payments with pagination
      const payments = await Payment.find(query)
        .populate('studentId', 'firstName lastName') // Populate student details
        .sort({ paymentDate: -1 }) // Sort by most recent payments
        .skip((+page - 1) * +limit) // Skip for pagination
        .limit(+limit); // Limit the number of results
  
      // Get the total count of payments matching the query
      const total = await Payment.countDocuments(query); // Use the model directly
  
      // Respond with payments and total count
      res.json({ payments, total });
    } catch (error) {
      console.error('Error fetching payments:', error);
      res.status(500).json({ message: 'Error fetching payments', error: (error as Error).message });
    }
  });
  
  app.post("/api/payments", async (req, res) => {
    try {
      // Parse and validate the incoming payment data
      const paymentData = paymentSchema.parse({
        studentId: req.body.studentId,
        amount: req.body.amount,
        paymentMethod: req.body.paymentMethod,
        paymentDate: req.body.paymentDate || new Date(), // Default to current date if not provided
      });

      // Convert string IDs to ObjectIds
      if (typeof paymentData.studentId === "string") {
        paymentData.studentId = new Types.ObjectId(paymentData.studentId);
      }

      // Create the payment in the database
      const payment = await storage.createPayment(paymentData as Partial<IPayment>);
      console.log('Created payment:', payment); // Log the payment object
      res.status(201).json({ id: payment._id, ...payment.toObject() }); // Explicitly include the `id`
    } catch (error) {
      console.error('Error creating payment:', error);
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid payment data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating payment", error: (error as Error).message });
    }
  });

  // Branch routes
  app.get("/api/branches", authMiddleware, checkRole(['admin', 'super_admin', 'instructor']), async (req, res) => {
    try {
      const branches = await storage.getBranches();
      res.json(branches);
    } catch (error) {
      res.status(500).json({ message: "Error fetching branches", error: (error as Error).message });
    }
  });

  app.post("/api/branches", authMiddleware, checkRole(['admin', 'super_admin']), async (req, res) => {
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

  app.put("/api/branches/:id", authMiddleware, checkRole(['admin', 'super_admin']), async (req, res) => {
    try {
      const branchData = branchSchema.parse(req.body);

      // Convert string IDs to ObjectIds
      if (branchData.manager && typeof branchData.manager === "string") {
        branchData.manager = new Types.ObjectId(branchData.manager); // Ensure it's an ObjectId
      }

      const updatedBranch = await storage.updateBranch(req.params.id, branchData);
      if (!updatedBranch) {
        return res.status(404).json({ message: "Branch not found" });
      }
      res.json(updatedBranch);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid branch data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating branch", error: (error as Error).message });
    }
  });

  app.delete("/api/branches/:id", authMiddleware, checkRole(['admin', 'super_admin']), async (req, res) => {
    try {
      const deleted = await storage.deleteBranch(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Branch not found" });
      }
      res.json({ message: "Branch deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting branch", error: (error as Error).message });
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
  

  app.get('/api/payments/:id/receipt', async (req, res) => {
    try {
      const { id } = req.params;

      // Fetch the payment details
      const payment = await storage.generateReceipt(id);

      if (!payment) {
        return res.status(404).send('Payment not found');
      }
      // Ensure studentId is populated
      if (!payment.studentId || typeof payment.studentId === 'string') {
        return res.status(500).send('Student details not found');
      }

      // Extract relevant details
      const { studentId, amount, paymentMethod, paymentDate, receiptNumber } = payment;
      const { firstName, lastName, email, phone, courseFee, balance } = payment.studentId as IStudent;

      // Generate HTML receipt
      const receiptHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Receipt</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              text-align: center;
              background-color: #fff;
            }
            .receipt {
              width: 58mm;
              margin: 0 auto;
              padding: 10px;
              font-size: 12px;
            }
            .receipt-header {
              text-align: center;
              margin-bottom: 10px;
            }
            .receipt-header img {
              max-width: 50px;
              margin-bottom: 5px;
            }
            .receipt-header h1 {
              font-size: 16px;
              margin: 0;
            }
            .receipt-details {
              text-align: left;
              margin-top: 10px;
            }
            .receipt-details p {
              margin: 3px 0;
              font-size: 12px;
            }
            .receipt-details .highlight {
              font-weight: bold;
            }
            .receipt-footer {
              margin-top: 10px;
              font-size: 10px;
              text-align: center;
            }
            .receipt-footer p {
              margin: 3px 0;
            }
            @media print {
              body {
                margin: 0;
                padding: 0;
                background-color: #fff;
              }
              .receipt {
                width: 58mm;
                font-size: 12px;
              }
              .receipt-header img {
                max-width: 50px;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="receipt-header">
              <img src="/images/amiran_logo.jpg" alt="Amiran Driving College Logo">
              <h1>Amiran Driving College</h1>
              <p>Payment Receipt</p>
            </div>
            <div class="receipt-details">
              <p><span class="highlight">Receipt Number:</span> ${receiptNumber}</p>
              <p><span class="highlight">Date:</span> ${new Date(paymentDate).toLocaleString()}</p>
              <hr>
              <p><span class="highlight">Student Name:</span> ${firstName} ${lastName}</p>
              <p><span class="highlight">Email:</span> ${email}</p>
              <p><span class="highlight">Phone:</span> ${phone}</p>
              <hr>
              <p><span class="highlight">Amount Paid:</span> KES ${amount}</p>
              <p><span class="highlight">Course Fee:</span> KES ${courseFee}</p>
              <p><span class="highlight">Balance:</span> KES ${balance}</p>
              <hr>
            </div>
            <div class="receipt-footer">
              <p>Thank you for your payment!</p>
              <p>Visit us again at Amiran Driving College.</p>
            </div>
          </div>
          <script>
            window.onload = () => window.print();
          </script>
        </body>
        </html>
      `;

      // Send the HTML as the response
      res.setHeader('Content-Type', 'text/html');
      res.send(receiptHtml);
    } catch (error) {
      console.error('Error generating receipt:', error);
      res.status(500).send('Error generating receipt');
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
