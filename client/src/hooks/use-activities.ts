import { useQuery } from '@tanstack/react-query';
import { Activity } from '@/types';

export function useRecentActivities() {
  return useQuery<Activity[]>({
    queryKey: ['/api/activities/recent'],
    queryFn: async () => {
      const res = await fetch('/api/activities/recent');
      if (!res.ok) throw new Error('Failed to fetch activities');
      return res.json();
    },
  });
}
