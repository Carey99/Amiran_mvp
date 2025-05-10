import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentsTable } from '@/components/ui/payments-table';
import { apiRequest } from '@/lib/utils';

export default function Payments() {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 50; // Fixed limit for pagination

  // Constructs the query string manually
  const queryParams = new URLSearchParams({
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    page: page.toString(),
    limit: limit.toString(),
  }).toString();

  // Fetch payments using useQuery
  const { data: { payments = [], total = 0 } = {}, isLoading } = useQuery({
    queryKey: ['payments', { startDate, endDate, page }],
    queryFn: () =>
      apiRequest.get(`/api/payments?${queryParams}`), // Append query parameters to the URL
  });

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="mt-1 text-sm text-gray-600">View and export payment records</p>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentsTable payments={payments} isLoading={isLoading} />
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {Math.ceil(total / limit)}
        </span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page * limit >= total}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </AppLayout>
  );
}
