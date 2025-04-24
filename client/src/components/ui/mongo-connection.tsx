import { useQuery } from '@tanstack/react-query';
import { DatabaseStatus } from '@/types';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function MongoConnection() {
  const { data, isLoading, isError } = useQuery<DatabaseStatus>({
    queryKey: ['/api/db-status'],
    refetchInterval: 30000, // Check every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-500">Checking MongoDB connection status...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200 flex items-center space-x-2">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <p className="text-sm text-red-700">Error checking MongoDB connection status</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className={`mt-6 p-4 rounded-lg border flex items-center space-x-2 ${data.connected ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
      {data.connected ? (
        <>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <p className="text-sm text-green-700">
            MongoDB Atlas: <span className="font-medium">Connected</span>
          </p>
        </>
      ) : (
        <>
          <AlertCircle className="h-4 w-4 text-red-500" />
          <p className="text-sm text-red-700">
            MongoDB Atlas: <span className="font-medium">{data.statusText}</span>
          </p>
        </>
      )}
    </div>
  );
}