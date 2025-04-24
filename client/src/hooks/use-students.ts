import { useQuery } from '@tanstack/react-query';
import { Student, Course, Lesson } from '@/types';
import { getQueryFn } from '@/lib/queryClient';

// Transform MongoDB _id to id for better TypeScript compatibility
const transformStudent = (data: any): Student => {
  if (!data) return null as unknown as Student;
  
  // Transform course data
  const courseData = data.courseId ? {
    id: data.courseId._id || '',
    name: data.courseId.name || '',
    description: data.courseId.description || '',
    type: data.courseId.type || 'manual',
    duration: data.courseId.duration || 0,
    numberOfLessons: data.courseId.numberOfLessons || 0,
    fee: data.courseId.fee || 0,
    active: data.courseId.active || false
  } as Course : null as unknown as Course;
  
  // Transform lessons
  const lessons = Array.isArray(data.lessons) ? data.lessons.map((lesson: any): Lesson => ({
    lessonNumber: lesson.lessonNumber,
    date: lesson.date,
    completed: lesson.completed || false,
    instructor: lesson.instructor,
    notes: lesson.notes
  })) : [];
  
  // Return transformed student
  return {
    id: data._id || '',
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    email: data.email || '',
    phone: data.phone || '',
    idNumber: data.idNumber || '',
    courseId: courseData,
    status: data.status || 'active',
    lessons: lessons,
    balance: data.balance || 0,
    totalPaid: data.totalPaid || 0,
    courseFee: data.courseFee || 0,
    branch: data.branch || undefined,
    createdAt: data.createdAt || ''
  };
};

// Transform array of students
const transformStudentArray = (data: any[]): Student[] => {
  if (!Array.isArray(data)) return [];
  return data.map(transformStudent);
};

export function useStudents() {
  return useQuery<Student[]>({
    queryKey: ['/api/students'],
    queryFn: getQueryFn({ on401: 'throw' }),
    select: transformStudentArray
  });
}

export function useActiveStudents() {
  return useQuery<Student[]>({
    queryKey: ['/api/students/active'],
    queryFn: getQueryFn({ on401: 'throw' }),
    select: transformStudentArray
  });
}

export function useStudent(id: string) {
  return useQuery<Student>({
    queryKey: ['/api/students', id],
    queryFn: getQueryFn({ on401: 'throw' }),
    enabled: !!id,
    select: transformStudent
  });
}
