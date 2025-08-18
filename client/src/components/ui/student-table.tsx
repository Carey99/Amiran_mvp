import { Student } from '@/types';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface StudentTableProps {
  students: Student[];
  isLoading: boolean;
}

export function StudentTable({ students, isLoading }: StudentTableProps) {
  const [filter, setFilter] = useState<'all' | 'paid' | 'partial' | 'unpaid'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Updated to 20 items per page

  const filteredStudents = students.filter(student => {
    const completedLessons = student.lessons?.filter(lesson => lesson.completed)?.length || 0;
    const totalLessons = student.courseId?.numberOfLessons || 0;
    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    const paymentStatus = student.balance <= 0 
      ? "paid" 
      : student.balance < student.courseFee / 2 
        ? "partial" 
        : "unpaid";
    if (filter === 'all') return true;
    return paymentStatus === filter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  const handleFilterChange = (newFilter: 'all' | 'paid' | 'partial' | 'unpaid') => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-bold mb-4">Active Students</h2>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h2 className="text-lg font-bold mb-4">Active Students</h2>
      
      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          onClick={() => handleFilterChange('all')}
        >
          All
        </button>
        <button
          className={`px-3 py-1 rounded ${filter === 'paid' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
          onClick={() => handleFilterChange('paid')}
        >
          Paid
        </button>
        <button
          className={`px-3 py-1 rounded ${filter === 'partial' ? 'bg-amber-600 text-white' : 'bg-gray-100'}`}
          onClick={() => handleFilterChange('partial')}
        >
          Partial
        </button>
        <button
          className={`px-3 py-1 rounded ${filter === 'unpaid' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}
          onClick={() => handleFilterChange('unpaid')}
        >
          Unpaid
        </button>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p>No active students found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-right">Payment Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStudents.map((student, index) => {
                const completedLessons = student.lessons?.filter(lesson => lesson.completed)?.length || 0;
                const totalLessons = student.courseId?.numberOfLessons || 0;
                const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
                
                const paymentStatus = student.balance <= 0 
                  ? "paid" 
                  : student.balance < student.courseFee / 2 
                    ? "partial" 
                    : "unpaid";
                
                return (
                  <TableRow key={student.id || `student-${index}`}>
                    <TableCell className="font-medium">
                      {student.firstName} {student.lastName}
                    </TableCell>
                    <TableCell>{student.courseId?.name || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {paymentStatus === "paid" && (
                        <Badge key="paid-badge" variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Paid
                        </Badge>
                      )}
                      {paymentStatus === "partial" && (
                        <Badge key="partial-badge" variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Partial
                        </Badge>
                      )}
                      {paymentStatus === "unpaid" && (
                        <Badge key="unpaid-badge" variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          Unpaid
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination Info and Controls */}
      {filteredStudents.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
            <span className="font-medium">{Math.min(endIndex, filteredStudents.length)}</span> of{' '}
            <span className="font-medium">{filteredStudents.length}</span> students
          </div>
          
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
}