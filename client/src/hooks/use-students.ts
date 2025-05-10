import { useQuery } from '@tanstack/react-query';
import { Student, Course, Lesson } from '@/types';
import { getQueryFn } from '@/lib/queryClient';

// Transform MongoDB _id to id for better TypeScript compatibility
const transformStudent = (data: any): Student => {
  // If data is an array, wrap it in an object with a lessons property
  if (Array.isArray(data)) {
    data = { lessons: data };
  }

  if (!data) {
    console.error("No data received for student transformation.");
    return null as unknown as Student;
  }

  // Log the full API response for debugging
  console.log("Full API Response Data:", data);

  // Transform lessons
  const lessons = Array.isArray(data.lessons)
    ? data.lessons.map((lesson: any): Lesson => ({
        lessonNumber: lesson.lessonNumber || 0,
        date: lesson.date || null,
        completed: lesson.completed || false,
        instructor: lesson.instructor || '',
        notes: lesson.notes || ''
      }))
    : [];

  // Log lessons for debugging
  console.log("Transformed Lessons:", lessons);

  // Transform course data
  const courseData = data.courseId
    ? {
        id: data.courseId._id || '',
        name: data.courseId.name || '',
        description: data.courseId.description || '',
        type: data.courseId.type || 'manual',
        duration: data.courseId.duration || 0,
        numberOfLessons: data.courseId.numberOfLessons || lessons.length, // Fallback to lessons length
        fee: data.courseId.fee || 0,
        active: data.courseId.active || false
      }
    : {
        id: '',
        name: '',
        description: '',
        type: 'manual',
        duration: 0,
        numberOfLessons: lessons.length, // Fallback to lessons length
        fee: 0,
        active: false
      };

  // Log course data for debugging
  console.log("Transformed Course Data:", courseData);

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
    branch: data.branch || 'Mwihoko',
    createdAt: data.createdAt || '',
    photoUrl: data.photoUrl || ""
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

export function useStudentByPhone(phone: string) {
  console.log("API Endpoint:", `/api/students/phone/${phone}/lessons`); // Debugging log

  return useQuery<Student>({
    queryKey: [`/api/students/phone/${phone}/lessons`],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/students/phone/${phone}/lessons`, {
          credentials: "include"
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("API Response:", data); // Debugging log
        return data;
      } catch (error) {
        console.error("Error fetching student data:", error);
        throw error;
      }
    },
    enabled: !!phone,
    select: transformStudent // Ensure this transforms the data correctly
  });
}
