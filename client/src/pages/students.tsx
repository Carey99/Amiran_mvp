import { AppLayout } from '@/layouts/app-layout';
import { useStudents, useActiveStudents } from '@/hooks/use-students';
import { Link } from 'wouter';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Download, Filter, User, BookOpen, CheckCircle } from 'lucide-react';
import { Student } from '@/types';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export default function Students() {
  const { data: allStudents, isLoading: isLoadingAll, isError: isErrorAll } = useStudents();
  const { data: activeStudents, isLoading: isLoadingActive } = useActiveStudents();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Pagination state
  const [currentPageAll, setCurrentPageAll] = useState(1);
  const [currentPageOngoing, setCurrentPageOngoing] = useState(1);
  const [currentPageFinished, setCurrentPageFinished] = useState(1);
  const itemsPerPage = 10;

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
  //const exportToExcel = (studentList: Student[], tabName: string) => {
  // Here we would implement export functionality
  // console.log(`Exporting ${studentList.length} students from ${tabName} tab to Excel`);
  //  alert(`Exporting ${studentList.length} students from ${tabName} tab to Excel (to be implemented)`);
  //};
  
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

  // Pagination helper functions
  const getPaginatedData = (data: Student[], currentPage: number) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (totalItems: number) => {
    return Math.ceil(totalItems / itemsPerPage);
  };

  const handlePageChange = (page: number, tabType: 'all' | 'ongoing' | 'finished') => {
    switch (tabType) {
      case 'all':
        setCurrentPageAll(page);
        break;
      case 'ongoing':
        setCurrentPageOngoing(page);
        break;
      case 'finished':
        setCurrentPageFinished(page);
        break;
    }
  };

  // Handle photo upload
  const handlePhotoUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedStudent) return;
    const fileInput = e.currentTarget.elements.namedItem('photo') as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      setUploading(true);
      const formData = new FormData();
      formData.append('photo', fileInput.files[0]);
      try {
        const res = await fetch(`/api/students/${selectedStudent.id}/photo`, {
          method: 'POST',
          body: formData,
          credentials: 'include', // <-- Add this line
          // Add Authorization header if needed
        });
        if (!res.ok) throw new Error('Upload failed');
        const updatedStudent = await res.json();
        setSelectedStudent(updatedStudent);
        alert('Photo uploaded successfully!');
      } catch (err) {
        alert('Photo upload failed.');
      } finally {
        setUploading(false);
      }
    }
  };

  // Pagination component
  const renderPagination = (totalItems: number, currentPage: number, tabType: 'all' | 'ongoing' | 'finished') => {
    const totalPages = getTotalPages(totalItems);
    
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1, tabType)}
              className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handlePageChange(page, tabType)}
                isActive={currentPage === page}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1, tabType)}
              className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
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
                    {getPaginatedData(filterStudents(allStudents), currentPageAll).map((student) => (
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
                          <Button
                            variant="link"
                            className="text-primary hover:text-primary-dark p-0 mr-3"
                            onClick={() => {
                              setSelectedStudent(student);
                              setIsDialogOpen(true);
                            }}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">{getPaginatedData(filterStudents(allStudents), currentPageAll).length}</span> of {filterStudents(allStudents).length} students
                </div>
              </div>
              {renderPagination(filterStudents(allStudents).length, currentPageAll, 'all')}
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
                    {getPaginatedData(filterStudents(ongoingStudents), currentPageOngoing).map((student) => {
                      const completedLessons = student.lessons && student.lessons.filter(lesson => lesson.completed).length || 0;
                      const totalLessons = student.courseId && student.courseId.numberOfLessons || 0;
                      const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

                      console.log("Student object:", student); // Debugging log
                      console.log("Student phone:", student.phone); // Debugging log
                      
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
                            <Link href={`/admin/students/phone/${student.phone}/lessons`}>
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
                  Showing <span className="font-medium">{getPaginatedData(filterStudents(ongoingStudents), currentPageOngoing).length}</span> of {filterStudents(ongoingStudents).length} ongoing students
                </div>
              </div>
              {renderPagination(filterStudents(ongoingStudents).length, currentPageOngoing, 'ongoing')}
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
                      {/*<th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>*/}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getPaginatedData(filterStudents(finishedStudents), currentPageFinished).map((student) => {
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
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">{getPaginatedData(filterStudents(finishedStudents), currentPageFinished).length}</span> of {filterStudents(finishedStudents).length} finished students
                </div>
              </div>
              {renderPagination(filterStudents(finishedStudents).length, currentPageFinished, 'finished')}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Student Details Dialog */}
      {isDialogOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setIsDialogOpen(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">{selectedStudent.firstName} {selectedStudent.lastName}</h2>
            <div className="mb-4">
              <div className="flex items-center gap-4">
                <img
                  src={
                    selectedStudent.photoUrl
                      ? `${selectedStudent.photoUrl}?t=${Date.now()}`
                      : "/placeholder-profile.png"
                  }
                  alt="Student"
                  className="w-24 h-24 rounded-full object-cover border"
                />
                <form onSubmit={handlePhotoUpload}>
                  <input type="file" name="photo" accept="image/*" className="mb-2" required />
                  <Button type="submit" size="sm" disabled={uploading}>
                    {uploading ? "Uploading..." : "Upload Photo"}
                  </Button>
                </form>
              </div>
            </div>
            <div>
              <div><b>Email:</b> {selectedStudent.email || 'N/A'}</div>
              <div><b>Phone:</b> {selectedStudent.phone || 'N/A'}</div>
              <div><b>Course:</b> {selectedStudent.courseId?.name || 'N/A'}</div>
              <div><b>Status:</b> {selectedStudent.status || 'N/A'}</div>
              <div><b>ID:</b> {selectedStudent.idNumber || 'N/A'}</div>
              {/* Add more fields as needed */}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}