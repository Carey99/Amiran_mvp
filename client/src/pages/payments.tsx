
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentsTable } from '@/components/ui/payments-table';
import { apiRequest } from '@/lib/utils';

export default function Payments() {
  const { data: payments = [] } = useQuery({
    queryKey: ['payments'],
    queryFn: () => apiRequest.get('/api/payments')
  });

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="mt-1 text-sm text-gray-600">View and export payment records</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentsTable payments={payments} />
        </CardContent>
      </Card>
    </AppLayout>
  );
}
