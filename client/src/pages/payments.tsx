import { useState } from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Plus, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useStudents } from '@/hooks/use-students';
import { Student } from '@/types';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';

export default function Payments() {
  const [open, setOpen] = useState(false);
  const [openStudentSelect, setOpenStudentSelect] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: students } = useStudents();

  const handlePayment = async () => {
    console.log('Payment initiated with values:', {
      student: selectedStudent,
      phone,
      amount,
    });

    // Validate input
    if (!selectedStudent || !phone || !amount || parseInt(amount) < 1) {
      console.log('Payment validation failed:', {
        hasStudent: !!selectedStudent,
        hasPhone: !!phone,
        hasAmount: !!amount,
        isValidAmount: parseInt(amount) >= 1,
      });
      toast({
        title: "Invalid Input",
        description: "Please fill all fields correctly",
        variant: "destructive",
      });
      return;
    }

    try {
      // Construct the payload
      const payload = {
        phoneNumber: phone, // Use `phone` as `phoneNumber`
        amount: parseInt(amount), // Ensure `amount` is a number
        accountReference: selectedStudent.id, // Use `selectedStudent.id` as `accountReference`
        transactionDesc: `Payment for ${selectedStudent.firstName} ${selectedStudent.lastName}`, // Generate description
      };

      console.log('Sending STK push request with payload:', payload);

      // Send the request
      const response = await apiRequest('POST', '/api/payments/stkpush', payload);

      const data = await response.json();
      console.log('STK push response:', data);

      if (response.ok && data.success) {
        toast({
          title: "Payment Initiated",
          description: "STK Push sent successfully",
        });
        setOpen(false);
        queryClient.invalidateQueries(['/api/payments/student/' + selectedStudent.id]);
        queryClient.invalidateQueries(['/api/students/' + selectedStudent.id]);
      } else {
        toast({
          title: "Payment Failed",
          description: data.message || "Failed to initiate payment",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "Failed to initiate payment",
        variant: "destructive",
      });
    }
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setPhone(student.phone || '');
    setOpenStudentSelect(false);
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="mt-1 text-sm text-gray-600">Manage student payments and transactions</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <CreditCard className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Payment Management</h2>
          <p className="text-gray-500 mb-4">Record new payments or view payment history</p>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>Record Manual Payment</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Record Payment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium">Select Student</label>
                  <Command className="border rounded-lg">
                    <CommandInput 
                      placeholder="Type to search students..."
                      onValueChange={(value) => setSearchQuery(value)}
                    />
                    <CommandEmpty>No student found.</CommandEmpty>
                    <CommandGroup>
                      {searchQuery.length > 0 && students?.filter(student => {
                        // Ensure the student has at least one name
                        if (!student.firstName && !student.lastName) return false;

                        // Prepare the search term and student names for comparison
                        const searchTerm = searchQuery.toLowerCase().trim();
                        const firstName = (student.firstName || '').toLowerCase();
                        const lastName = (student.lastName || '').toLowerCase();
                        const fullName = `${firstName} ${lastName}`;

                        // Match if the search term is found in any part of the first name, last name, or full name
                        return firstName.includes(searchTerm) || 
                               lastName.includes(searchTerm) || 
                               fullName.includes(searchTerm);
                      }).map(student => (
                        <CommandItem
                          key={student.id}
                          value={student.id}
                          onSelect={() => handleStudentSelect(student)}
                          className="cursor-pointer"
                        >
                          <span>{student.firstName} {student.lastName} - {student.courseId?.type}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium">Amount</label>
                  <Input
                    type="number"
                    placeholder="Amount"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <Button onClick={handlePayment} className="w-full">
                  Initiate Payment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </AppLayout>
  );
}