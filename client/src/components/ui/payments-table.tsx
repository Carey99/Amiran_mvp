
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDate, formatCurrency } from '@/lib/utils';

interface PaymentsTableProps {
  payments: any[];
}

export function PaymentsTable({ payments }: PaymentsTableProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredPayments = payments.filter(payment => {
    if (!startDate && !endDate) return true;
    const paymentDate = new Date(payment.paymentDate);
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();
    return paymentDate >= start && paymentDate <= end;
  });

  const exportToExcel = () => {
    const data = filteredPayments.map(payment => ({
      'Student Name': `${payment.student?.firstName} ${payment.student?.lastName}`,
      'Amount': payment.amount,
      'Date': formatDate(payment.paymentDate),
      'Payment Method': payment.paymentMethod
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payments');
    XLSX.writeFile(wb, `payments-${formatDate(new Date())}.xlsx`);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-end">
        <div>
          <label className="text-sm">Start Date</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm">End Date</label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <Button onClick={exportToExcel}>Export to Excel</Button>
      </div>

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
              <TableCell>{payment.student?.firstName} {payment.student?.lastName}</TableCell>
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
