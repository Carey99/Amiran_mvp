import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { useState } from "react";
import { Student } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface PaymentDialogProps {
  student: Student; // The student for whom the payment is being recorded
  isOpen: boolean; // Controls whether the dialog is visible
  onClose: () => void; // Callback to close the dialog
}

export function PaymentDialog({ student, isOpen, onClose }: PaymentDialogProps) {
  const [amount, setAmount] = useState(""); // State for the payment amount
  const [transactionId, setTransactionId] = useState(""); // State for the transaction ID
  const [isSubmitting, setIsSubmitting] = useState(false); // Tracks form submission state
  const { toast } = useToast(); // Hook for displaying toast notifications
  const queryClient = useQueryClient(); // React Query client for invalidating queries

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate payment amount doesn't exceed student balance
    const paymentAmount = parseFloat(amount);
    if (paymentAmount > student.balance) {
      toast({
        title: 'Payment Error',
        description: `Payment amount (KES ${paymentAmount.toLocaleString()}) exceeds student balance (KES ${student.balance.toLocaleString()})`,
        variant: 'destructive',
      });
      return; // Stop execution here
    }
    
    setIsSubmitting(true);

    try {
      // Send payment data to the backend
      const payment: { id: string } = await apiRequest('POST', '/api/payments', {
        studentId: student.id,
        amount: parseFloat(amount),
        paymentMethod: 'cash',
        transactionId, // Include transaction ID in the request
      });
      console.log('Payment response:', payment); // Log the response from the backend
      
      // Open the receipt in a new tab
      window.open(`/api/payments/${payment.id}/receipt`, '_blank');

      // Refresh the students and payments data
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });

      // Show success toast
      toast({
        title: 'Success',
        description: 'Payment recorded successfully',
      });

      // Close the dialog
      onClose();
    } catch (error) {
      // Show error toast
      toast({
        title: 'Error',
        description: 'Failed to record payment',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false); // Reset submission state
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student Information */}
          <div>
            <p className="text-sm font-medium mb-2">Student</p>
            <p className="text-sm text-gray-500">{student?.firstName} {student?.lastName}</p>
            <p className="text-sm text-red-600 font-medium mt-1">
              Current Balance: KES {student?.balance?.toLocaleString() || '0'}
            </p>
          </div>
          {/* Payment Amount Input */}
          <div>
            <label className="text-sm font-medium">Amount (KES)</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0"
            />
          </div>
          {/* Transaction ID Input */}
          <div>
            <label htmlFor="transactionId" className="text-sm font-medium">Transaction Code</label>
            <Input
              id="transactionId"
              name="transactionId"
              type="text"
              maxLength={10}
              required
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />
          </div>
          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Record Payment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
