import { AppLayout } from '@/layouts/app-layout';
import { useStudents, useActiveStudents } from '@/hooks/use-students';
import { Link } from 'wouter';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Download, Filter, User, BookOpen, CheckCircle } from 'lucide-react';
import { Student } from '@/types';

export default function Students() {
  const { data: allStudents, isLoading: isLoadingAll, isError: isErrorAll } = useStudents();
  const { data: activeStudents, isLoading: isLoadingActive } = useActiveStudents();
  
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get finished students 
  const finishedStudents = allStudents?.filter(student => 
    student.status === 'completed' || 
    (student.lessons && student.courseId && 
     student.lessons.filter(lesson => lesson.completed).length === student.courseId.numberOfLessons)
  ) || [];
  
  // Get ongoing students (active with payment)
  const ongoingStudents = allStudents?.filter(student => 
    student.status === 'active' && student.totalPaid > 0
  ) || [];

  // Format currency
  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  // Get initials from name
  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return 'N/A';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  // Determine text color for balance
  const getBalanceColor = (balance: number) => {
    if (balance > 0) return "text-error";
    return "text-success";
  };

  // Format date to East African Time
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      timeZone: 'Africa/Nairobi' // East African Time
    };
    return new Date(dateString).toLocaleDateString('en-KE', options);
  };
  
  // Handle export to Excel
  const exportToExcel = (studentList: Student[], tabName: string) => {
    // Here we would implement export functionality
    console.log(`Exporting ${studentList.length} students from ${tabName} tab to Excel`);
    alert(`Exporting ${studentList.length} students from ${tabName} tab to Excel (to be implemented)`);
  };
  
  // Filter students based on search query
  const filterStudents = (students: Student[] | undefined) => {
    if (!students) return [];
    if (!searchQuery) return students;
    
    return students.filter(student => 
      student.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      student.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      student.email?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      student.phone?.includes(searchQuery)
    );
  };

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="mt-1 text-sm text-gray-600">Manage all registered students</p>
        </div>
        <Link href="/admin/students/new">
          <Button className="bg-primary hover:bg-primary-dark text-white">
            <span className="mr-1">+</span>
            <span>Add Student</span>
          </Button>
        </Link>
      </div>
      
      {/* Search and filters */}
      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            className="pl-9"
            placeholder="Search students by name, email or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabbed interface */}
      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>All Students</span>
            </TabsTrigger>
            <TabsTrigger value="ongoing" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>Ongoing</span>
            </TabsTrigger>
            <TabsTrigger value="finished" className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              <span>Finished</span>
            </TabsTrigger>
          </TabsList>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => exportToExcel(filterStudents(allStudents), 'active')}
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>

        {/* All Students Tab */}
        <TabsContent value="all" className="bg-white rounded-lg shadow overflow-hidden">
          {isLoadingAll ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : isErrorAll ? (
            <div className="p-8 flex justify-center">
              <div className="text-error flex items-center">
                <span className="mr-2">⚠️</span>
                <span>Error loading students</span>
              </div>
            </div>
          ) : !allStudents || allStudents.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-500">No students found</div>
              <Link href="/admin/students/new">
                <Button variant="link" className="text-primary hover:text-primary-dark p-0">
                  Add your first student
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filterStudents(allStudents).map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">
                                {getInitials(student.firstName, student.lastName)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {`${student.firstName || ''} ${student.lastName || ''}`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.email || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.phone || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.courseId?.type || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            student.status === 'active' ? 'bg-green-100 text-green-800' : 
                            student.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {student.status ? student.status.charAt(0).toUpperCase() + student.status.slice(1) : 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href={`/admin/students/${student.id}`}>
                            <Button variant="link" className="text-primary hover:text-primary-dark p-0 mr-3">
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">{filterStudents(allStudents).length}</span> of {allStudents.length} students
                </div>
              </div>
            </>
          )}
        </TabsContent>

        {/* Ongoing Students Tab */}
        <TabsContent value="ongoing" className="bg-white rounded-lg shadow overflow-hidden">
          {isLoadingAll ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : isErrorAll ? (
            <div className="p-8 flex justify-center">
              <div className="text-error flex items-center">
                <span className="mr-2">⚠️</span>
                <span>Error loading students</span>
              </div>
            </div>
          ) : !ongoingStudents || ongoingStudents.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-500">No ongoing students found</div>
              <p className="text-sm text-gray-500 mt-1">Students who have paid or deposited will appear here</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Balance
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filterStudents(ongoingStudents).map((student) => {
                      const completedLessons = student.lessons && student.lessons.filter(lesson => lesson.completed).length || 0;
                      const totalLessons = student.courseId && student.courseId.numberOfLessons || 0;
                      const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
                      
                      return (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600">
                                  {getInitials(student.firstName, student.lastName)}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {`${student.firstName || ''} ${student.lastName || ''}`}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.phone || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{student.courseId?.type || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <span className={getBalanceColor(student.balance)}>
                              {formatCurrency(student.balance)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-primary h-2.5 rounded-full" 
                                  style={{ width: `${progressPercentage}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-xs text-gray-600">
                                {completedLessons}/{totalLessons}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link href={`/admin/students/${student.id}/lessons`}>
                              <Button variant="link" className="text-primary hover:text-primary-dark p-0 mr-3">
                                Lessons
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">{filterStudents(ongoingStudents).length}</span> of {ongoingStudents.length} ongoing students
                </div>
              </div>
            </>
          )}
        </TabsContent>

        {/* Finished Students Tab */}
        <TabsContent value="finished" className="bg-white rounded-lg shadow overflow-hidden">
          {isLoadingAll ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : isErrorAll ? (
            <div className="p-8 flex justify-center">
              <div className="text-error flex items-center">
                <span className="mr-2">⚠️</span>
                <span>Error loading students</span>
              </div>
            </div>
          ) : !finishedStudents || finishedStudents.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-500">No finished students found</div>
              <p className="text-sm text-gray-500 mt-1">Students who have completed all lessons will appear here</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Completion Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filterStudents(finishedStudents).map((student) => {
                      // Get last completed lesson date
                      const completedLessons = student.lessons?.filter(lesson => lesson.completed) || [];
                      const lastLesson = completedLessons.length > 0 ? 
                        completedLessons[completedLessons.length - 1] : null;
                      const completionDate = lastLesson?.date ? formatDate(lastLesson.date) : 'N/A';
                      
                      return (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600">
                                  {getInitials(student.firstName, student.lastName)}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {`${student.firstName || ''} ${student.lastName || ''}`}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.email || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.phone || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{student.courseId?.type || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {completionDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link href={`/admin/students/${student.id}/certificate`}>
                              <Button variant="link" className="text-primary hover:text-primary-dark p-0 mr-3">
                                Certificate
                              </Button>
                            </Link>
                            <Link href={`/admin/students/${student.id}`}>
                              <Button variant="link" className="text-gray-600 hover:text-gray-900 p-0">
                                View
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">{filterStudents(finishedStudents).length}</span> of {finishedStudents.length} finished students
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}