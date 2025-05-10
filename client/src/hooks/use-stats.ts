import { useQuery } from '@tanstack/react-query';
import { Stats } from '@/types';

export function useStats() {
  return useQuery<Stats>({
    queryKey: ['/api/stats'],
  });
}
