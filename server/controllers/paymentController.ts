import { Request, Response } from 'express';
import '../types/express';
import { storage } from '../storage';

export const getPayments = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId;
    const payments = studentId 
      ? await storage.getPaymentsByStudent(studentId)
      : await storage.getAllPayments();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error: (error as Error).message });
  }
};
export const generateReceipt = async (req: Request, res: Response) => {
  try {
    const payment = await storage.getPaymentById(req.params.paymentId);
    const student = await storage.getStudentById(payment.studentId);
    
    // Generate receipt HTML
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: monospace; font-size: 12px; line-height: 1.4; }
            .center { text-align: center; }
            .divider { border-top: 1px dashed #000; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="center">
            <h2>AMIRAN DRIVING SCHOOL</h2>
            <p>Payment Receipt</p>
          </div>
          <div class="divider"></div>
          <p>Receipt No: ${payment.receiptNumber}</p>
          <p>Date: ${new Date(payment.createdAt).toLocaleDateString()}</p>
          <p>Student: ${student.firstName} ${student.lastName}</p>
          <p>Amount: KES ${payment.amount.toLocaleString()}</p>
          <div class="divider"></div>
          <p class="center">Thank you for your payment!</p>
        </body>
      </html>
    `;

    res.send(html);
  } catch (error) {
    res.status(500).json({ message: "Error generating receipt", error: (error as Error).message });
  }
};
