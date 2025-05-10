import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDate, formatCurrency } from '@/lib/utils';

interface PaymentsTableProps {
  payments: any[]; // The payments prop should be an array of payment objects
  isLoading: boolean; // Add isLoading to the props
}

export function PaymentsTable({ payments, isLoading }: PaymentsTableProps) {
  const [startDate, setStartDate] = useState(''); // State for filtering by start date
  const [endDate, setEndDate] = useState(''); // State for filtering by end date

  // Ensure payments is always an array to prevent runtime errors
  const validPayments = Array.isArray(payments) ? payments : [];

  // Filter payments based on the selected date range
  const filteredPayments = validPayments.filter(payment => {
    if (!startDate && !endDate) return true; // If no dates are selected, show all payments
    const paymentDate = new Date(payment.paymentDate); // Convert payment date to Date object
    const start = startDate ? new Date(startDate) : new Date(0); // Default start date to epoch
    const end = endDate ? new Date(endDate) : new Date(); // Default end date to today
    return paymentDate >= start && paymentDate <= end; // Check if payment date is within range
  });

  // Export filtered payments to an Excel file
  const exportToExcel = () => {
    const data = filteredPayments.map(payment => ({
      'Student Name': `${payment.studentId?.firstName} ${payment.studentId?.lastName}`,
      'Amount': payment.amount,
      'Date': formatDate(payment.paymentDate),
      'Payment Method': payment.paymentMethod
    }));

    const ws = XLSX.utils.json_to_sheet(data); // Create a worksheet from the data
    const wb = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Payments'); // Append the worksheet to the workbook
    XLSX.writeFile(wb, `payments-${formatDate(new Date())}.xlsx`); // Save the workbook as a file
  };

  // Handle loading state
  if (isLoading) {
    return <p>Loading payments...</p>;
  }

  // Handle empty state
  if (filteredPayments.length === 0) {
    return <p>No payments found for the selected date range.</p>;
  }

  return (
    <div className="space-y-4">
      {/* Date filters and export button */}
      <div className="flex gap-4 items-end">
        <div>
          <label className="text-sm">Start Date</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)} // Update start date
          />
        </div>
        <div>
          <label className="text-sm">End Date</label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)} // Update end date
          />
        </div>
        <Button onClick={exportToExcel}>Export to Excel</Button> {/* Export button */}
      </div>

      {/* Payments table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Payment Method</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPayments.map((payment, index) => (
            <TableRow key={payment._id || index}>
              <TableCell>{payment.studentId?.firstName} {payment.studentId?.lastName}</TableCell>
              <TableCell>{formatCurrency(payment.amount)}</TableCell>
              <TableCell>{formatDate(payment.paymentDate)}</TableCell>
              <TableCell className="capitalize">{payment.paymentMethod}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
