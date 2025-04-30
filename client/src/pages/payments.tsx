import { AppLayout } from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

export default function Payments() {
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
          <p className="text-gray-500 mb-4">Contact admin to process payments</p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}