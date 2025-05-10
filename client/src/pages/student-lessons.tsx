import { useEffect, useState } from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { useStudentByPhone } from '@/hooks/use-students';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Printer, Check } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { Lesson } from '@/types';

const LESSON_TITLES: Record<number, string> = {
  1: "Introduction to theory Board Lane",
  2: "Starting the Car Drill",
  3: "Gear changing up & down",
  4: "Road Positioning",
  5: "Turning Right procedure",
  6: "Basic Mechanical",
  7: "Road Positioning",
  8: "Reversing",
  9: "Use of Hand Brake",
  10: "Steering Wheel Control",
  11: "Three point Turn",
  12: "Basic Mechanical",
  13: "Theory Board Assessment",
  14: "Clutch Control",
  15: "Turning left procedures",
  16: "Road Positioning",
  17: "Assessment",
  18: "Basic Mechanical",
  19: "Gear Changing Up And Down",
  20: "Hill Start",
  21: "Assessment",
  22: "Customer care",
  23: "Public relation",
  24: "Basic Mechanical"
};

export default function StudentLessons() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const phone = window.location.pathname.split('/')[4];
  const { data: student, isLoading, isError } = useStudentByPhone(phone);
  const [savingLesson, setSavingLesson] = useState<number | null>(null);

  // Track name and ID for receipt
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');

  // When student data loads, set the name and ID
  useEffect(() => {
    if (student) {
      setStudentName(`${student.firstName || ''} ${student.lastName || ''}`.trim());
      setStudentId(student.idNumber || '');
    }
  }, [student]);

  const formatCurrency = (amount: number | undefined) =>
    amount == null ? 'KES 0' : `KES ${amount.toLocaleString()}`;

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Africa/Nairobi'
    };
    return new Date(dateString).toLocaleDateString('en-KE', options);
  };

  // Only lessons 1-12 are visible if balance > 0
  const isLessonVisible = (lessonNumber: number, balance: number) => {
    if (balance <= 0) return true; // All lessons visible if fully paid
    return lessonNumber <= 12;     // Only lessons 1-12 visible if not fully paid
  };

  const toggleLessonCompletion = async (lessonNumber: number, isCompleted: boolean) => {
    if (!student) return;
    try {
      setSavingLesson(lessonNumber);
      const updatedLessons = student.lessons.map(lesson =>
        lesson.lessonNumber === lessonNumber
          ? { ...lesson, completed: isCompleted, date: isCompleted ? new Date().toISOString() : lesson.date }
          : lesson
      );
      // If your backend returns the updated student:
      const updatedStudent = await apiRequest('PUT', `/api/students/phone/${phone}/lessons`, { lessons: updatedLessons });
      queryClient.setQueryData([`/api/students/phone/${phone}`], updatedStudent);

      toast({
        title: isCompleted ? "Lesson marked as completed" : "Lesson marked as incomplete",
        description: `Lesson ${lessonNumber} has been updated.`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error updating lesson",
        description: "There was a problem saving the lesson status.",
        variant: "destructive"
      });
    } finally {
      setSavingLesson(null);
    }
  };

  const printLessonReceipt = (lesson: Lesson) => {
    if (!student) return;
    console.log("Student object at print:", student);
    const receiptWindow = window.open('', '_blank', 'width=400,height=600');
    if (!receiptWindow) {
      toast({
        title: "Popup Blocked",
        description: "Please allow popups to print receipts.",
        variant: "destructive"
      });
      return;
    }
    const completionDate = lesson.date ? formatDate(lesson.date) : 'N/A';
    const courseType = student.courseId?.type || 'N/A';
    const totalLessons = student.courseId?.numberOfLessons || 'N/A';
    const studentName = `${student.firstName || ''} ${student.lastName || ''}`.trim();
    const studentId = student.idNumber || '';
    const lessonTitle = LESSON_TITLES[lesson.lessonNumber] || "";

    const receiptContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Driving Lesson Receipt</title>
        <style>
          @page { margin: 0; }
          body { font-family: monospace; width: 80mm; margin: 0; padding: 10px; font-size: 12px; }
          .receipt { text-align: center; }
          .header { border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
          .logo { font-size: 16px; font-weight: bold; margin-bottom: 5px; }
          .info-row { display: flex; justify-content: space-between; margin: 5px 0; font-size: 12px; }
          .footer { margin-top: 15px; border-top: 1px dashed #000; padding-top: 10px; font-size: 10px; text-align: center; }
          @media print { .print-btn { display: none; } }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="logo">Amiran Driving School</div>
            <div>Official Lesson Receipt</div>
          </div>
          <div class="title">Driving Lesson Confirmation</div>
          <div class="info-row"><span class="label">Student Name:</span><span>${studentName}</span></div>
          <div class="info-row"><span class="label">ID Number:</span><span>${studentId}</span></div>
          <div class="info-row"><span class="label">Course Type:</span><span>${courseType}</span></div>
          <div class="info-row"><span class="label">Lesson Number:</span><span>${lesson.lessonNumber} of ${totalLessons}</span></div>
          <div class="info-row"><span class="label">Lesson Title:</span><span>${lessonTitle}</span></div>
          <div class="info-row"><span class="label">Completion Date:</span><span>${completionDate}</span></div>
          <div class="info-row"><span class="label">Instructor:</span><span>${lesson.instructor || ''}</span></div>
          <div class="footer">
            <p>This serves as an official confirmation of lesson completion.</p>
            <p>Thank you for choosing Amiran Driving School.</p>
          </div>
        </div>
        <button class="print-btn" onclick="window.print(); return false;">Print Receipt</button>
      </body>
      </html>
    `;
    receiptWindow.document.open();
    receiptWindow.document.write(receiptContent);
    receiptWindow.document.close();
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  if (isError || !student) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Student Not Found</h2>
          <p className="text-gray-600 mb-6">The student you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={() => setLocation('/students')}>
            Back to Students
          </Button>
        </div>
      </AppLayout>
    );
  }

  const completedLessons = student.lessons?.filter(lesson => lesson.completed)?.length || 0;
  const totalLessons = student?.courseId?.numberOfLessons || student?.lessons?.length || 0;
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

  return (
    <AppLayout>
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" onClick={() => setLocation('/students')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {student.firstName} {student.lastName}
          </h1>
          <div className="text-gray-500 flex items-center gap-4 mt-1">
            <span>{student.phone}</span>
            <span>{student.email}</span>
          </div>
        </div>
      </div>
      {/* Info Cards ... (omitted for brevity, keep as in your code) */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Driving Lessons</CardTitle>
          </div>
          <CardDescription>
            {student.balance > 0 ? 
              "Lessons beyond #12 will be available after full payment." : 
              "All lessons are available. Click on a lesson to mark it complete."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Timeline & legend ... (keep as in your code) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: totalLessons }).map((_, index) => {
              const lessonNumber = index + 1;
              const lesson = student.lessons?.find(l => l.lessonNumber === lessonNumber) || {
                lessonNumber,
                completed: false
              };
              const isVisible = isLessonVisible(lessonNumber, student.balance);

              return (
                <Card key={lessonNumber} className={`border ${
                  !isVisible ? 'opacity-60 bg-gray-100 border-red-100' : 
                  lesson.completed ? 'border-green-200 bg-green-50' : ''
                }`}>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">
                        Lesson {lessonNumber}: {LESSON_TITLES[lessonNumber] || ""}
                      </CardTitle>
                      {lesson.completed && isVisible && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => printLessonReceipt(lesson)}
                          title="Print Receipt"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center space-x-2">
                      {isVisible ? (
                        <>
                          <Checkbox
                            id={`lesson-${lessonNumber}`}
                            checked={lesson.completed}
                            disabled={savingLesson === lessonNumber}
                            onCheckedChange={(checked) => toggleLessonCompletion(lessonNumber, checked === true)}
                          />
                          <label
                            htmlFor={`lesson-${lessonNumber}`}
                            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                              savingLesson === lessonNumber ? 'text-gray-400' : ''
                            } flex items-center gap-1`}
                          >
                            {lesson.completed ? (
                              <>
                                <span>Completed</span>
                                <Check className="text-green-600 w-4 h-4" />
                              </>
                            ) : (
                              'Mark as completed'
                            )}
                          </label>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400">Locked</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}