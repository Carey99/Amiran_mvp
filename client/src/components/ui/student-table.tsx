import { Student } from '@/types';
import { Loader2 } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface StudentTableProps {
  students: Student[];
  isLoading: boolean;
}

export function StudentTable({ students, isLoading }: StudentTableProps) {
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
      
      {students.length === 0 ? (
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
              {students.map((student, index) => {
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
    </div>
  );
}