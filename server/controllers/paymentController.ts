import { Request, Response } from 'express';
import '../types/express';
import { storage } from '../storage';

export const getPayments = async (req: Request, res: Response) => {
  try {
    const payments = await storage.getPaymentsByStudent(req.params.studentId);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error: (error as Error).message });
  }
};