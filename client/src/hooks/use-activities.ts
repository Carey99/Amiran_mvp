import { useQuery } from '@tanstack/react-query';
import { Activity } from '@/types';

// This is a mock implementation since we don't have a specific API endpoint for activities
// In a real implementation, we would fetch from an actual API endpoint
export function useRecentActivities() {
  // Temporary hardcoded data for demonstration purposes
  // In a real app, this would come from the API
  const mockActivities: Activity[] = [
    {
      id: '1',
      type: 'lesson_completed',
      title: 'Lesson Completed',
      description: 'James Mwangi completed Lesson 14',
      timestamp: new Date().toISOString(),
      icon: 'check_circle',
      iconColor: 'text-success',
      iconBgColor: 'bg-green-100',
    },
    {
      id: '2',
      type: 'student_registered',
      title: 'Student Registered',
      description: 'Alice Kamau registered for Manual Driving Course',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      icon: 'person_add',
      iconColor: 'text-primary',
      iconBgColor: 'bg-blue-100',
    },
    {
      id: '3',
      type: 'payment_made',
      title: 'Payment Made',
      description: 'Mary Njoroge made a payment of KES 5,000',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      icon: 'payments',
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
    },
    {
      id: '4',
      type: 'lesson_scheduled',
      title: 'Lesson Scheduled',
      description: 'John Wainaina scheduled Lesson 8',
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      icon: 'schedule',
      iconColor: 'text-warning',
      iconBgColor: 'bg-yellow-100',
    },
    {
      id: '5',
      type: 'lesson_cancelled',
      title: 'Lesson Cancelled',
      description: 'Sarah Odhiambo cancelled Lesson 5',
      timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      icon: 'cancel',
      iconColor: 'text-error',
      iconBgColor: 'bg-red-100',
    },
  ];

  return useQuery<Activity[]>({
    queryKey: ['/api/activities/recent'],
    queryFn: async () => {
      // In a real app, we would fetch from the API
      // For now, we'll return the mock data
      return mockActivities;
    },
  });
}
