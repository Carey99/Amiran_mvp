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
import { User, UserPlus, Phone, Mail, Star, X, CheckIcon, Trash2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { Instructor } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';

interface InstructorFormData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string[];
  branch: string; // <-- required
  active: boolean;
}

export default function Instructors() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<InstructorFormData>({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: ['automatic'],
    branch: '', // <-- force selection
    active: true
  });
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const { toast } = useToast();

  // Fetch instructors on mount
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const data = await apiRequest('GET', '/api/instructors');
        setInstructors(data as Instructor[]);
      } catch (error) {
        console.error('Error fetching instructors:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInstructors();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.branch) {
      toast({ title: 'Error', description: 'Please select a branch.', variant: 'destructive' });
      return;
    }
    try {
      if (editingInstructor) {
        const updated = await apiRequest('PUT', `/api/instructors/${editingInstructor._id}`, { ...formData });
        setInstructors(prev => prev.map(inst => (inst._id === editingInstructor._id ? updated as Instructor : inst)));
        toast({ title: 'Success', description: 'Instructor updated successfully' });
      } else {
        // Create instructor
        const newInstructor = await apiRequest('POST', '/api/instructors', {
          user: {
            username: formData.username,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            role: 'instructor'
          },
          specialization: formData.specialization,
          branch: formData.branch || undefined,
          active: formData.active
        });

        setInstructors(prev => [...prev, newInstructor as Instructor]);
        
        toast({
          title: 'Success',
          description: 'Instructor added successfully',
        });
      }
      // Reset form and close dialog
      setFormData({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialization: ['automatic'],
        branch: '',
        active: true
      });
      setEditingInstructor(null);
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleSpecializationChange = (value: string) => {
    const currentSpecializations = [...formData.specialization];
    
    if (currentSpecializations.includes(value)) {
      // Remove if already selected
      setFormData(prev => ({
        ...prev,
        specialization: prev.specialization.filter(s => s !== value)
      }));
    } else {
      // Add if not already selected
      setFormData(prev => ({
        ...prev,
        specialization: [...prev.specialization, value]
      }));
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      toast({ title: 'Error', description: 'Instructor ID is missing', variant: 'destructive' });
      return;
    }
    try {
      await apiRequest('DELETE', `/api/instructors/${id}`);
      setInstructors(prev => prev.filter(inst => inst._id !== id));
      toast({ title: 'Deleted', description: 'Instructor deleted.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Delete failed', variant: 'destructive' });
    }
  };

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Instructors</h1>
          <p className="mt-1 text-sm text-gray-600">Manage driving instructors</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingInstructor(null);
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <UserPlus className="h-4 w-4" />
              <span>Add Instructor</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>{editingInstructor ? 'Edit Instructor' : 'Add New Instructor'}</DialogTitle>
              <DialogDescription>
                {editingInstructor ? 'Edit the instructor details.' : 'Add a new instructor to your driving school.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="instructor@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="07XX XXX XXX"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      placeholder="Username for login"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Set a secure password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Specialization</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="automatic"
                        checked={formData.specialization.includes('automatic')}
                        onCheckedChange={() => handleSpecializationChange('automatic')}
                      />
                      <label
                        htmlFor="automatic"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Automatic
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="manual"
                        checked={formData.specialization.includes('manual')}
                        onCheckedChange={() => handleSpecializationChange('manual')}
                      />
                      <label
                        htmlFor="manual"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Manual
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="class-a"
                        checked={formData.specialization.includes('Class A')}
                        onCheckedChange={() => handleSpecializationChange('Class A')}
                      />
                      <label
                        htmlFor="class-a"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Class A
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="class-b"
                        checked={formData.specialization.includes('Class B')}
                        onCheckedChange={() => handleSpecializationChange('Class B')}
                      />
                      <label
                        htmlFor="class-b"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Class B
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="class-c"
                        checked={formData.specialization.includes('Class C')}
                        onCheckedChange={() => handleSpecializationChange('Class C')}
                      />
                      <label
                        htmlFor="class-c"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Class C
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="defensive"
                        checked={formData.specialization.includes('Defensive')}
                        onCheckedChange={() => handleSpecializationChange('Defensive')}
                      />
                      <label
                        htmlFor="defensive"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Defensive
                      </label>
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="branch">Branch <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.branch}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, branch: value }))}
                  >
                    <SelectTrigger id="branch">
                      <SelectValue placeholder="Select a branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mwihoko">Mwihoko</SelectItem>
                      <SelectItem value="Kahawa Sukari">Kahawa Sukari</SelectItem>
                      <SelectItem value="Kasarani">Kasarani</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.branch === '' && (
                    <span className="text-xs text-red-500">Please select a branch</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, active: checked === true }))
                    }
                  />
                  <label
                    htmlFor="active"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Active
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingInstructor ? 'Update Instructor' : 'Add Instructor'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : instructors.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <User className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">No instructors added yet</h2>
            <p className="text-gray-500 mb-4">Add your first instructor to get started</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Driving Instructors</CardTitle>
            <CardDescription>
              All instructors registered with your driving school
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instructors.map((instructor) => (
                  <TableRow key={instructor.id}>
                    <TableCell className="font-medium">
                      {instructor.userId?.firstName} {instructor.userId?.lastName}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />
                          {instructor.userId?.email}
                        </div>
                        <div className="flex items-center text-sm mt-1">
                          <Phone className="h-3 w-3 mr-1" />
                          {instructor.userId?.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {instructor.specialization.map((spec, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{instructor.branch || 'Main'}</TableCell>
                    <TableCell>
                      <Badge variant={instructor.active ? "default" : "secondary"}>
                        {instructor.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingInstructor(instructor);
                            setFormData({
                              username: instructor.userId?.username || '',
                              password: '',
                              firstName: instructor.userId?.firstName || '',
                              lastName: instructor.userId?.lastName || '',
                              email: instructor.userId?.email || '',
                              phone: instructor.userId?.phone || '',
                              specialization: instructor.specialization || [],
                              branch: instructor.branch || '',
                              active: instructor.active,
                            });
                            setIsDialogOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(instructor._id)} // Using _id, not id
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
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
