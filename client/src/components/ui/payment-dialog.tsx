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
  const [isSubmitting, setIsSubmitting] = useState(false); // Tracks form submission state
  const { toast } = useToast(); // Hook for displaying toast notifications
  const queryClient = useQueryClient(); // React Query client for invalidating queries

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send payment data to the backend
      const payment: { id: string } = await apiRequest('POST', '/api/payments', {
        studentId: student.id,
        amount: parseFloat(amount),
        paymentMethod: 'cash',
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
