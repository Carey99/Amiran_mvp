import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { storage } from '../storage';
import { sendEmail } from '../services/emailService';

// Register a new student
export const registerStudent = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, idNumber, courseId, branch } = req.body;

    // Validate the required fields
    if (!firstName || !lastName || !email || !phone || !idNumber || !courseId) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
    
    // Check if student with same ID number already exists
    const existingStudents = await storage.getStudents();
    const existingStudent = existingStudents.find(student => 
      student.idNumber === idNumber
    );
    
    if (existingStudent) {
      return res.status(400).json({ 
        message: 'A student with this ID number is already registered',
        status: 'duplicate'
      });
    }

    // Get course details to determine fee
    const course = await storage.getCourse(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Create default lessons based on course's number of lessons
    const lessons = Array.from({ length: course.numberOfLessons }, (_, i) => ({
      lessonNumber: i + 1,
      date: new Date(),
      completed: false,
      instructor: new Types.ObjectId(), // This will be set when an instructor is assigned
      notes: '',
    }));

    // Create a new student
    const newStudent = await storage.createStudent({
      firstName,
      lastName,
      email,
      phone,
      idNumber,
      courseId: new Types.ObjectId(courseId),
      status: 'active',
      lessons,
      balance: course.fee,
      totalPaid: 0,
      courseFee: course.fee,
      branch: branch ? new Types.ObjectId(branch) : undefined,
    });
    
    // Log successful student registration
    console.log(`Student registered successfully: ${firstName} ${lastName}, Course: ${course.name}, Fee: ${course.fee}`);

    // Send welcome email to the student
    await sendEmail({
      to: email,
      subject: 'Welcome to Amiran Driving School',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2 style="color: #333;">Welcome to Amiran Driving School!</h2>
          <p>Dear ${firstName} ${lastName},</p>
          <p>Thank you for registering with Amiran Driving School. We are excited to help you on your journey to becoming a skilled driver.</p>
          <p><strong>Course:</strong> ${course.name}</p>
          <p><strong>Course Fee:</strong> KES ${course.fee.toLocaleString()}</p>
          <p>Our team will contact you shortly to schedule your first lesson.</p>
          <p>If you have any questions, please contact us at info@amirandrivingschool.com or call us at +254700000000.</p>
          <p>Best regards,<br>Amiran Driving School Team</p>
        </div>
      `,
    });

    res.status(201).json({
      message: 'Student registered successfully',
      student: newStudent,
    });
  } catch (error) {
    console.error('Error registering student:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Get all students
export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await storage.getStudents();
    res.status(200).json(students);
  } catch (error) {
    console.error('Error getting students:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Get active students
export const getActiveStudents = async (req: Request, res: Response) => {
  try {
    const activeStudents = await storage.getActiveStudents();
    res.status(200).json(activeStudents);
  } catch (error) {
    console.error('Error getting active students:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Get finished students (completed or dropped)
export const getFinishedStudents = async (req: Request, res: Response) => {
  try {
    const allStudents = await storage.getStudents();
    const finishedStudents = allStudents.filter(student => 
      student.status === 'completed' || student.status === 'dropped'
    );
    res.status(200).json(finishedStudents);
  } catch (error) {
    console.error('Error getting finished students:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Search students
export const searchStudents = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const allStudents = await storage.getStudents();
    
    // Convert query to lowercase for case-insensitive search
    const searchQuery = String(query).toLowerCase();
    
    // Filter students based on search query
    const filteredStudents = allStudents.filter(student => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const email = student.email.toLowerCase();
      const phone = student.phone;
      const idNumber = student.idNumber;
      
      return (
        fullName.includes(searchQuery) ||
        email.includes(searchQuery) ||
        phone.includes(searchQuery) ||
        idNumber.includes(searchQuery)
      );
    });
    
    res.status(200).json(filteredStudents);
  } catch (error) {
    console.error('Error searching students:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Get student by ID
export const getStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'Student ID is required' });
    }
    
    const student = await storage.getStudent(id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.status(200).json(student);
  } catch (error) {
    console.error('Error getting student:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Update student lesson
export const updateStudentLesson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { lessonNumber, completed, instructor, notes } = req.body;
    
    if (!id || lessonNumber === undefined) {
      return res.status(400).json({ message: 'Student ID and lesson number are required' });
    }
    
    const student = await storage.getStudent(id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Find the lesson to update
    const lessonIndex = student.lessons.findIndex(lesson => lesson.lessonNumber === lessonNumber);
    
    if (lessonIndex === -1) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Check if student has payment restrictions
    if (lessonNumber >= 13 && student.balance > 0 && completed) {
      return res.status(403).json({ 
        message: 'Payment required before accessing lessons beyond lesson 13',
        balance: student.balance
      });
    }
    
    // Update the lesson
    const updatedLessons = [...student.lessons];
    updatedLessons[lessonIndex] = {
      ...updatedLessons[lessonIndex],
      completed: completed !== undefined ? completed : updatedLessons[lessonIndex].completed,
      date: completed ? new Date() : updatedLessons[lessonIndex].date,
      instructor: instructor ? new Types.ObjectId(instructor) : updatedLessons[lessonIndex].instructor,
      notes: notes || updatedLessons[lessonIndex].notes,
    };
    
    // Update the student
    const updatedStudent = await storage.updateStudent(id, { lessons: updatedLessons });
    
    res.status(200).json({
      message: 'Student lesson updated successfully',
      student: updatedStudent,
    });
  } catch (error) {
    console.error('Error updating student lesson:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};