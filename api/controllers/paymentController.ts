import { Request, Response } from 'express';
import '../types/express'; // Ensure the extended type is imported
// This ensures req.user is recognized as part of the Request type
import { storage } from '../storage';
import { initiateSTKPush } from '../services/mpesaService';

export const initiatePayment = async (req: Request, res: Response) => {
  try {
    // Log the incoming request body for debugging
    console.log('Request Body:', req.body);
    
    const { studentId, phone, amount } = req.body;

    // Validate input
    if (!studentId || !phone || !amount || amount < 1) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    // Get student details with courseId populated
    const student = await storage.getStudent(studentId);
    if (student) {
      await student.populate<{ courseId: { type: string } }>('courseId');
    }
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get course fee based on type
    let courseFee = 0;
    switch (student.courseId?.type) {
      case 'A':
        courseFee = 7000;
        break;
      case 'B':
      case 'C':
        courseFee = 11000;
        break;
      default:
        return res.status(400).json({ message: 'Invalid course type' });
    }

    // Initiate STK Push
    const stkResponse = await initiateSTKPush(
      student.idNumber, // studentId as accountReference
      phone,            // phone number
      amount,           // payment amount
      res               // response object
    );

    if (stkResponse.success) {
      // Create payment record
      const payment = await storage.createPayment({
        studentId,
        amount,
        paymentMethod: 'mpesa',
        transactionId: stkResponse.transactionId,
        paymentDate: new Date(),
        createdBy: req.user?.id
      });

      // Update student balance
      student.totalPaid += amount;
      student.balance = courseFee - student.totalPaid;
      await student.save();

      res.status(200).json({ 
        success: true, 
        payment,
        student: {
          ...student.toObject(),
          balance: student.balance,
          totalPaid: student.totalPaid
        }
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Failed to initiate payment' 
      });
    }
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: (error as Error).message 
    });
  }
};
