import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { storage } from '../storage';
import { sendEmail } from '../services/emailService';
import { Activity } from '@shared/models/activity';

// Register a new student
export const registerStudent = async (req: Request, res: Response) => {
  try {
    console.log('registerStudent called');
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

    try {
      const activity = await Activity.create({
        type: 'student_registered',
        title: 'Student Registered',
        description: `${firstName} ${lastName} registered for ${course.name}`,
        timestamp: new Date(),
        icon: 'person_add', // <-- updated icon
        iconColor: '#2563eb',
        iconBgColor: '#e0e7ff',
      });
      console.log('Activity created (student_registered):', activity);
    } catch (err) {
      console.error('Failed to create activity (student_registered):', err);
    }

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
    console.log('updateStudentLesson called');
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
    const updatedStudent = await storage.updateStudent(student._id.toString(), { lessons: updatedLessons });

    if (completed) {
      try {
        // Log model and connection info
        console.log('Mongoose connection readyState:', require('mongoose').connection.readyState);
        console.log('Activity model keys:', Object.keys(require('mongoose').models));

        const activity = await Activity.create({
          type: 'lesson_completed',
          title: 'Lesson Completed',
          description: `${student.firstName} ${student.lastName} completed Lesson ${lessonNumber}`,
          timestamp: new Date(),
          icon: 'done', // <-- changed from 'check' or 'check-circle' to 'done'
          iconColor: '#22c55e',
          iconBgColor: '#e7f9ef',
        });
        console.log('Activity created (lesson_completed):', activity);
      } catch (err) {
        console.error('Failed to create activity (lesson_completed):', err);
        if (err instanceof Error) {
          console.error('Error message:', err.message);
          console.error('Error stack:', err.stack);
        }
        // Log the attempted activity data for debugging
        console.error('Attempted activity data:', {
          type: 'lesson_completed',
          title: 'Lesson Completed',
          description: `${student.firstName} ${student.lastName} completed Lesson ${lessonNumber}`,
          timestamp: new Date(),
          icon: 'check-circle',
          iconColor: '#22c55e',
          iconBgColor: '#e7f9ef',
        });
      }
    }
    
    res.status(200).json({
      message: 'Student lesson updated successfully',
      student: updatedStudent,
    });
  } catch (error) {
    console.error('Error updating student lesson:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const updateStudentLessonFlexible = async (req: Request, res: Response) => {
  try {
    console.log('updateStudentLessonFlexible called');
    const { id, phone } = req.params;
    const { lessonNumber, completed, instructor, notes } = req.body;

    if ((!id && !phone) || lessonNumber === undefined) {
      return res.status(400).json({ message: 'Student ID or phone and lesson number are required' });
    }

    // Fetch student by id or phone
    let student;
    if (id) {
      student = await storage.getStudent(id);
    } else if (phone) {
      student = await storage.getStudentByPhone(phone);
    }

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
    const updatedStudent = await storage.updateStudent(student._id.toString(), { lessons: updatedLessons });

    if (completed) {
      try {
        // Log model and connection info
        console.log('Mongoose connection readyState:', require('mongoose').connection.readyState);
        console.log('Activity model keys:', Object.keys(require('mongoose').models));

        const activity = await Activity.create({
          type: 'lesson_completed',
          title: 'Lesson Completed',
          description: `${student.firstName} ${student.lastName} completed Lesson ${lessonNumber}`,
          timestamp: new Date(),
          icon: 'done', // <-- changed from 'check-circle' to 'done'
          iconColor: '#22c55e',
          iconBgColor: '#e7f9ef',
        });
        console.log('Activity created (lesson_completed):', activity);
      } catch (err) {
        console.error('Failed to create activity (lesson_completed):', err);
        if (err instanceof Error) {
          console.error('Error message:', err.message);
          console.error('Error stack:', err.stack);
        }
        // Log the attempted activity data for debugging
        console.error('Attempted activity data:', {
          type: 'lesson_completed',
          title: 'Lesson Completed',
          description: `${student.firstName} ${student.lastName} completed Lesson ${lessonNumber}`,
          timestamp: new Date(),
          icon: 'check-circle',
          iconColor: '#22c55e',
          iconBgColor: '#e7f9ef',
        });
      }
    }
    
    res.status(200).json({
      message: 'Student lesson updated successfully',
      student: updatedStudent,
    });
  } catch (error) {
    console.error('Error updating student lesson:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const updateStudentLessons = async (req: Request, res: Response) => {
  try {
    console.log('updateStudentLessons called');
    const { phone } = req.params;
    const { lessons } = req.body;

    if (!phone || !lessons || !Array.isArray(lessons)) {
      return res.status(400).json({ message: 'Phone and lessons array are required' });
    }

    // Fetch student by phone
    const student = await storage.getStudentByPhone(phone);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Find lessons just marked as completed
    const justCompleted = lessons.filter(
      l => l.completed && !student.lessons.find(sl => sl.lessonNumber === l.lessonNumber && sl.completed)
    );

    // Update lessons
    const updatedStudent = await storage.updateStudent(student._id.toString(), { lessons });

    // Log activity for each newly completed lesson
    for (const lesson of justCompleted) {
      try {
        const activity = await Activity.create({
          type: 'lesson_completed',
          title: 'Lesson Completed',
          description: `${student.firstName} ${student.lastName} completed Lesson ${lesson.lessonNumber}`,
          timestamp: new Date(),
          icon: 'done', // <-- changed from 'check-circle' to 'done'
          iconColor: '#22c55e',
          iconBgColor: '#e7f9ef',
        });
        console.log('Activity created (lesson_completed):', activity);
      } catch (err) {
        console.error('Failed to create activity (lesson_completed):', err);
      }
    }

    res.status(200).json({
      message: 'Student lessons updated successfully',
      student: updatedStudent,
    });
  } catch (error) {
    console.error('Error updating student lessons:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};