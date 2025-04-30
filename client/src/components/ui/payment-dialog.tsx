
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { useState } from "react";
import { Student } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface PaymentDialogProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentDialog({ student, isOpen, onClose }: PaymentDialogProps) {
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payment = await apiRequest.post('/api/payments', {
        studentId: student.id,
        amount: parseFloat(amount),
        paymentMethod: 'cash'
      });

      // Print receipt
      window.open(`/api/payments/${payment.id}/receipt`, '_blank');
      
      queryClient.invalidateQueries(['students']);
      queryClient.invalidateQueries(['payments']);
      toast({
        title: 'Success',
        description: 'Payment recorded successfully',
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record payment',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Student</p>
            <p className="text-sm text-gray-500">{student?.firstName} {student?.lastName}</p>
          </div>
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
