import { useState, useEffect } from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Plus, Edit, Trash } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { Course } from '@/types';

// Define standard course fees
const COURSE_FEES: Record<string, number> = {
  'Class A': 7000,
  'Class B': 11000,
  'Class C': 11000,
  'Defensive Driving': 11000,
  'Automatic Transmission': 11000,
  'Manual Transmission': 11000,
  'manual': 11000,
  'automatic': 11000,
  'both': 11000,
  'Both Transmissions': 11000,
};

interface CourseFormData {
  name: string;
  type: string;
  description: string;
  duration: number;
  numberOfLessons: number;
  fee: number;
  active: boolean;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>({
    name: '',
    type: 'automatic',
    description: '',
    duration: 4,
    numberOfLessons: 15,
    fee: 5000,
    active: true
  });
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await apiRequest('GET', '/api/courses');
        // Map _id to id for frontend use
        setCourses((data as any[]).map((c: any) => ({ ...c, id: c._id })));
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'duration' || name === 'numberOfLessons' || name === 'fee' 
        ? Number(value) 
        : value 
    }));
  };

  const handleTypeChange = (value: string) => {
    // Set fee based on course type
    const fee = COURSE_FEES[value] ?? 7000; // fallback to 5000 if not found
    setFormData(prev => ({
      ...prev,
      type: value,
      fee: fee
    }));
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      type: course.type,
      description: course.description,
      duration: course.duration,
      numberOfLessons: course.numberOfLessons,
      fee: course.fee,
      active: course.active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    setIsDeleting(courseId);
    try {
      const response = await apiRequest('DELETE', `/api/courses/${courseId}`);
      if (response.ok) {
        setCourses(prev => prev.filter(c => c.id !== courseId));
        toast({ title: 'Deleted', description: 'Course deleted.' });
      } else {
        toast({ title: 'Error', description: 'Failed to delete course.', variant: 'destructive' });
      }
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response, newCourse;
      if (editingCourse) {
        response = await apiRequest('PUT', `/api/courses/${editingCourse.id}`, formData);
        if (response.ok) {
          newCourse = await response.json();
          setCourses(prev => prev.map(c => c.id === editingCourse.id ? newCourse : c));
          toast({ title: 'Updated', description: 'Course updated.' });
        }
      } else {
        response = await apiRequest('POST', '/api/courses', formData);
        if (response.ok) {
          newCourse = await response.json();
          setCourses(prev => [...prev, newCourse as Course]);
          toast({ title: 'Success', description: 'Course created successfully' });
        }
      }
      // Reset form and close dialog
      setFormData({
        name: '',
        type: 'automatic',
        description: '',
        duration: 4,
        numberOfLessons: 15,
        fee: 5000,
        active: true
      });
      setEditingCourse(null);
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="mt-1 text-sm text-gray-600">Manage driving courses and lesson plans</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Add Course</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
              <DialogDescription>
                Create a new driving course with lessons and pricing.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Course Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Class A Driver's License"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Course Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={handleTypeChange}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Class A">Class A</SelectItem>
                      <SelectItem value="Class B">Class B</SelectItem>
                      <SelectItem value="Class C">Class C</SelectItem>
                      <SelectItem value="Defensive Driving">Defensive Driving</SelectItem>
                      <SelectItem value="Automatic Transmission">Automatic Transmission</SelectItem>
                      <SelectItem value="Manual Transmission">Manual Transmission</SelectItem>
                      <SelectItem value="manual">manual</SelectItem>
                      <SelectItem value="automatic">automatic</SelectItem>
                      <SelectItem value="both">both</SelectItem>
                      <SelectItem value="Both Transmissions">Both Transmissions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Brief description of the course"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Duration (weeks)</Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      min="1"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="numberOfLessons">Number of Lessons</Label>
                    <Input
                      id="numberOfLessons"
                      name="numberOfLessons"
                      type="number"
                      min="1"
                      value={formData.numberOfLessons}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fee">Course Fee (KES)</Label>
                  <Input
                    id="fee"
                    name="fee"
                    type="number"
                    min="0"
                    value={formData.fee}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Course</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <BookOpen className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">No courses added yet</h2>
            <p className="text-gray-500 mb-4">Add your first driving course to get started</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Available Courses</CardTitle>
            <CardDescription>
              All driving courses offered by your school
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Lessons</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.name}</TableCell>
                    <TableCell>{course.type}</TableCell>
                    <TableCell>{course.duration} weeks</TableCell>
                    <TableCell>{course.numberOfLessons}</TableCell>
                    <TableCell>{formatCurrency(course.fee)}</TableCell>
                    <TableCell>
                      <Badge variant={course.active ? "default" : "secondary"}>
                        {course.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(course)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(course.id)} disabled={isDeleting === course.id}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </AppLayout>
  );
}
