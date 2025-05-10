import { useState, useEffect } from "react";
import { Link } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Menu, X } from "lucide-react";

// Form schema with validation rules
const applicationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  idNumber: z.string().min(6, "ID number must be at least 6 characters"),
  courseId: z.string().min(1, "Please select a course"),
});

type FormData = z.infer<typeof applicationSchema>;

interface Course {
  _id: string;
  name: string;
  type: string;
  fee: number;
  description: string;
}

export default function Apply() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for menu toggle

  // Initialize form
  const form = useForm<FormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      idNumber: "",
      courseId: "",
    },
  });

  // Fetch available courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoadingCourses(true);

        // Use apiRequest to fetch and parse JSON directly
        const data = await apiRequest<Course[]>("GET", "/api/courses");

        // Filter out unwanted courses
        setCourses(data.filter((course) => course.name !== "Class E"));
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "An unknown error occurred while loading courses.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [toast]);

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);

      // Use apiRequest to send the POST request and parse the response
      const response = await apiRequest<{ status?: string; message?: string }>(
        "POST",
        "/api/students/register",
        data
      );

      // Check for specific error conditions in the parsed response
      if (response.status === "duplicate") {
        toast({
          title: "Already Registered",
          description: "A student with this ID number is already registered in our system.",
          variant: "destructive",
        });
        return;
      }

      // Handle successful submission
      setSubmitted(true);
      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted. We'll contact you soon!",
      });

      // Reset the form
      form.reset();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Improved Header */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 shadow-lg sticky top-0 z-50 border-b-4 border-yellow-400">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo and Title */}
          <Link href="/">
            <span className="flex items-center gap-3 cursor-pointer">
              <img
                src="/images/amiran_logo.jpg"
                alt="Amiran Driving School Logo"
                className="h-16 w-auto object-contain bg-white rounded shadow-md p-1"
                style={{ imageRendering: "auto" }}
              />
              <span className="text-3xl font-extrabold bg-gradient-to-r from-yellow-400 via-white to-yellow-400 bg-clip-text text-transparent drop-shadow-lg tracking-wide">
                Amiran Driving College
              </span>
            </span>
          </Link>

          {/* Hamburger Menu for Small Screens */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-yellow-400 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav
            className={`${
              isMenuOpen ? "block" : "hidden"
            } absolute top-full left-0 w-full bg-blue-900 shadow-md md:static md:flex md:justify-end md:space-x-6 md:bg-transparent md:shadow-none`}
          >
            <ul className="flex flex-col md:flex-row md:space-x-6">
              <li>
                <Link href="/">
                  <span className="block text-yellow-400 font-bold border-b-2 border-yellow-400 pb-1 cursor-pointer hover:text-white transition-colors duration-300 md:border-none">
                    Home
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/apply">
                  <span className="block text-white hover:text-yellow-400 font-bold cursor-pointer transition-colors duration-300">
                    Apply Now
                  </span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Application Form
            </h2>
            
            {submitted ? (
              <div className="text-center py-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted Successfully!</h3>
                <p className="text-gray-600 mb-6">Thank you for applying to Amiran Driving School. One of our representatives will contact you shortly.</p>
                <Button 
                  onClick={() => setSubmitted(false)} 
                  variant="outline"
                  className="mr-2"
                >
                  Submit Another Application
                </Button>
                <Link href="/">
                  <Button>Return to Homepage</Button>
                </Link>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="idNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID Number / Passport</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your ID or passport number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="courseId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={isLoadingCourses}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a course" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {isLoadingCourses ? (
                                <div className="flex items-center justify-center py-2">
                                  <Loader2 className="h-4 w-4 animate-spin text-gray-500 mr-2" />
                                  <span>Loading courses...</span>
                                </div>
                              ) : (
                                courses.map((course) => (
                                  <SelectItem key={course._id} value={course._id}>
                                    {course.name} - KES {course.fee.toLocaleString()}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
          
          <div className="text-center text-gray-600">
            <p>
              For inquiries, call us at{" "}
              <a href="tel:+254708538416" className="text-blue-600 font-medium">
                +254 708 538 416
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}