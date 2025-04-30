import { useState, useEffect } from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { useToast } from '@/hooks/use-toast';
import { useLocation, Link } from 'wouter';
import { useStudent } from '@/hooks/use-students';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { Lesson, Student } from '@/types';

export default function StudentLessons() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get student ID from URL
  const studentId = window.location.pathname.split('/')[2];
  
  const { data: student, isLoading, isError } = useStudent(studentId);
  const [savingLesson, setSavingLesson] = useState<number | null>(null);
  
  // Format currency
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) {
      return 'KES 0';
    }
    return `KES ${amount.toLocaleString()}`;
  };
  
  // Format date using East African Time
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      timeZone: 'Africa/Nairobi'
    };
    return new Date(dateString).toLocaleDateString('en-KE', options);
  };
  
  // Check if lesson is visible based on balance and payment status
  const isLessonVisible = (lessonNumber: number, balance: number, totalLessons: number) => {
    // If balance is 0 or negative (fully paid), show all lessons
    if (balance <= 0) return true;
    
    // If balance exists (partially paid), only show lessons up to lesson 12
    const visibilityThreshold = 12;
    return lessonNumber <= visibilityThreshold;
  };
  
  // Handle lesson completion toggle
  const toggleLessonCompletion = async (lessonNumber: number, isCompleted: boolean) => {
    if (!student) return;
    
    try {
      setSavingLesson(lessonNumber);
      
      // Find the lesson to update
      const updatedLessons = student.lessons.map(lesson => {
        if (lesson.lessonNumber === lessonNumber) {
          return {
            ...lesson,
            completed: isCompleted,
            date: isCompleted ? new Date().toISOString() : lesson.date
          };
        }
        return lesson;
      });
      
      // Update student data
      await apiRequest('PUT', `/api/students/${studentId}`, {
        lessons: updatedLessons
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: [`/api/students/${studentId}`] });
      
      toast({
        title: isCompleted ? "Lesson marked as completed" : "Lesson marked as incomplete",
        description: `Lesson ${lessonNumber} has been updated.`,
        variant: "default"
      });
    } catch (error) {
      console.error("Error updating lesson:", error);
      toast({
        title: "Error updating lesson",
        description: "There was a problem saving the lesson status.",
        variant: "destructive"
      });
    } finally {
      setSavingLesson(null);
    }
  };
  
  // Handle printing receipt for a lesson
  const printLessonReceipt = (lesson: Lesson) => {
    if (!student) return;
    
    // Create a receipt popup window
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
    
    // Build receipt HTML
    const receiptContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Driving Lesson Receipt</title>
        <style>
          @page { margin: 0; }
          body { 
            font-family: monospace;
            width: 80mm;
            margin: 0;
            padding: 10px;
            font-size: 12px;
          }
          .receipt { text-align: center; }
          .header { 
            border-bottom: 1px dashed #000;
            padding-bottom: 10px;
            margin-bottom: 10px;
          }
          .logo { 
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
            font-size: 12px;
          }
          .footer {
            margin-top: 15px;
            border-top: 1px dashed #000;
            padding-top: 10px;
            font-size: 10px;
            text-align: center;
          }
          @media print {
            .print-btn { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="logo">Amiran Driving School</div>
            <div>Official Lesson Receipt</div>
          </div>
          
          <div class="title">Driving Lesson Confirmation</div>
          
          <div class="info-row">
            <span class="label">Student Name:</span>
            <span>${student.firstName} ${student.lastName}</span>
          </div>
          
          <div class="info-row">
            <span class="label">ID Number:</span>
            <span>${student.idNumber}</span>
          </div>
          
          <div class="info-row">
            <span class="label">Course Type:</span>
            <span>${student.courseId.type}</span>
          </div>
          
          <div class="info-row">
            <span class="label">Lesson Number:</span>
            <span>${lesson.lessonNumber} of ${student.courseId.numberOfLessons}</span>
          </div>
          
          <div class="info-row">
            <span class="label">Completion Date:</span>
            <span>${completionDate}</span>
          </div>
          
          <div class="info-row">
            <span class="label">Instructor:</span>
            <span>${lesson.instructor || 'Not assigned'}</span>
          </div>
          
          <div class="footer">
            <p>This serves as an official confirmation of lesson completion.</p>
            <p>Thank you for choosing Amiran Driving School.</p>
          </div>
        </div>
        
        <button class="print-btn" onclick="window.print(); return false;">Print Receipt</button>
      </body>
      </html>
    `;
    
    // Write content to the popup window
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
  
  // Calculate progress
  const completedLessons = student.lessons?.filter(lesson => lesson.completed)?.length || 0;
  const totalLessons = student.courseId?.numberOfLessons || 0;
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
      
      {/* Student Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Course Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium">{student.courseId?.type || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration:</span>
                <span className="font-medium">{student.courseId?.duration || 0} weeks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Lessons:</span>
                <span className="font-medium">{student.courseId?.numberOfLessons || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Course Fee:</span>
                <span className="font-medium">{formatCurrency(student.courseFee)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Payment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Paid:</span>
                <span className="font-medium">{formatCurrency(student.totalPaid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Balance:</span>
                <span className={`font-medium ${student.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(student.balance)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-500">Status:</span>
                <Badge variant={student.status === 'active' ? 'default' : 
                        student.status === 'completed' ? 'outline' : 'destructive'}>
                  {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Completed Lessons:</span>
                <span className="font-medium">{completedLessons} of {totalLessons}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="text-center text-sm text-gray-500">
                {progressPercentage}% Complete
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Lessons Grid */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Driving Lessons</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => {
                // Export lesson data to CSV
                if (!student || !student.lessons) return;
                
                const lessonData = student.lessons.map(lesson => ({
                  'Lesson Number': lesson.lessonNumber,
                  'Date': lesson.date ? formatDate(lesson.date) : 'N/A',
                  'Completed': lesson.completed ? 'Yes' : 'No',
                  'Instructor': lesson.instructor || 'Not assigned',
                  'Notes': lesson.notes || ''
                }));
                
                // Create CSV content
                const headers = Object.keys(lessonData[0]);
                const csvContent = [
                  headers.join(','),
                  ...lessonData.map(row => 
                    headers.map(header => 
                      `"${row[header as keyof typeof row]}"`
                    ).join(',')
                  )
                ].join('\n');
                
                // Create download link
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', `${student.firstName}_${student.lastName}_lessons.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                toast({
                  title: "Export Successful",
                  description: `Exported ${student.lessons.length} lessons to CSV file.`,
                  variant: "default"
                });
              }}
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
          <CardDescription>
            {student.balance > 0 ? 
              "Lessons beyond #12 will be available after full payment." : 
              "All lessons are available. Click on a lesson to mark it complete."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Lesson Progress</span>
              <span className="text-sm text-gray-500">{completedLessons} of {totalLessons} completed</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
              <div 
                className="h-full bg-primary rounded-full" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            {/* Status Legend */}
            <div className="flex items-center justify-end gap-4 mb-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-500">Completed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <span className="text-xs text-gray-500">Available</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <span className="text-xs text-gray-500">Locked</span>
              </div>
            </div>
            
            <div className="relative w-full h-6 mt-2">
              {/* Timeline with lesson numbers */}
              <div className="absolute top-0 left-0 w-full h-px bg-gray-200"></div>
              
              {Array.from({ length: totalLessons }).map((_, index) => {
                const lessonNumber = index + 1;
                const lesson = student.lessons?.find(l => l.lessonNumber === lessonNumber);
                const isVisible = isLessonVisible(lessonNumber, student.balance, totalLessons);
                const position = `${(lessonNumber - 1) / (totalLessons - 1) * 100}%`;
                
                return (
                  <div 
                    key={`indicator-${lessonNumber}`} 
                    className="absolute -translate-x-1/2"
                    style={{ left: position, top: '-4px' }}
                  >
                    <div 
                      className={`w-2 h-2 rounded-full ${
                        lesson?.completed ? 'bg-green-500' : 
                        !isVisible ? 'bg-red-400' : 'bg-gray-300'
                      }`}
                    ></div>
                    {lessonNumber % 4 === 0 || lessonNumber === 1 || lessonNumber === totalLessons ? (
                      <div className="text-xs text-gray-500 mt-1 absolute -left-2">{lessonNumber}</div>
                    ) : null}
                  </div>
                );
              })}
              
              {/* Payment threshold indicator */}
              {student.balance > 0 && (
                <div 
                  className="absolute top-0" 
                  style={{ left: `calc(${(12 / totalLessons) * 100}%)`, height: '16px' }}
                >
                  <div className="absolute top-0 w-px h-4 bg-red-400"></div>
                  <div className="absolute -top-6 -left-14 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
                    Payment Required
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: totalLessons }).map((_, index) => {
              const lessonNumber = index + 1;
              const lesson = student.lessons?.find(l => l.lessonNumber === lessonNumber) || {
                lessonNumber,
                completed: false
              };
              
              const isVisible = isLessonVisible(lessonNumber, student.balance, totalLessons);
              const isDisabled = savingLesson === lessonNumber;
              
              return (
                <Card key={lessonNumber} className={`border ${
                  !isVisible ? 'opacity-60 bg-gray-100 border-red-100' : 
                  lesson.completed ? 'border-green-200 bg-green-50' : ''
                }`}>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Lesson {lessonNumber}</CardTitle>
                      <div className="flex items-center">
                        {lesson.completed && (
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => printLessonReceipt(lesson)}>
                            <Printer className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-3">
                      {lesson.date && (
                        <div className="text-sm">
                          <span className="text-gray-500">Date: </span>
                          <span>{formatDate(lesson.date)}</span>
                        </div>
                      )}
                      {lesson.instructor && (
                        <div className="text-sm">
                          <span className="text-gray-500">Instructor: </span>
                          <span>{lesson.instructor}</span>
                        </div>
                      )}
                      <div className="flex items-center pt-2">
                        {isVisible ? (
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={`lesson-${lessonNumber}`}
                              checked={lesson.completed}
                              disabled={isDisabled}
                              onCheckedChange={(checked) => {
                                toggleLessonCompletion(lessonNumber, checked === true);
                              }}
                            />
                            <label 
                              htmlFor={`lesson-${lessonNumber}`}
                              className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                                isDisabled ? 'text-gray-400' : ''
                              }`}
                            >
                              {lesson.completed ? 'Completed' : 'Mark as completed'}
                            </label>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <Badge variant="outline" className="text-red-500 border-red-200 mb-1">
                              Locked
                            </Badge>
                            <p className="text-xs text-gray-500">Payment required to unlock</p>
                          </div>
                        )}
                      </div>
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