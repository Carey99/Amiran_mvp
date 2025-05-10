import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Students from "@/pages/students";
import StudentLessons from "@/pages/student-lessons";
import Instructors from "@/pages/instructors";
import Payments from "@/pages/payments";
import Courses from "@/pages/courses";
import Branches from "@/pages/branches";
import Settings from "@/pages/settings";
import Reports from "@/pages/reports";
import Login from "@/pages/auth/login";
import Signup from "@/pages/auth/signup";
import Home from "@/pages/Home";
import Apply from "@/pages/Apply";
import ViewCourses from "@/pages/ViewCourses";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

// Helper to create protected routes more concisely
const ProtectedRouteWrapper = ({ component: Component }: { component: React.ComponentType<any> }) => {
  return (
    <ProtectedRoute>
      <Component />
    </ProtectedRoute>
  );
};

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/apply" component={Apply} />
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/signup" component={Signup} />
      <Route path="/view-courses" component={ViewCourses} />
      
      {/* Protected Routes - Admin Dashboard */}
      <Route path="/admin">
        {() => <ProtectedRouteWrapper component={Dashboard} />}
      </Route>
      <Route path="/dashboard">
        {() => <ProtectedRouteWrapper component={Dashboard} />}
      </Route>
      <Route path="/admin/dashboard">
        {() => <ProtectedRouteWrapper component={Dashboard} />}
      </Route>
      
      {/* Student routes - both /admin/students and /students work */}
      <Route path="/admin/students">
        {() => <ProtectedRouteWrapper component={Students} />}
      </Route>
      <Route path="/students">
        {() => <ProtectedRouteWrapper component={Students} />}
      </Route>
      <Route path="/admin/students/:id">
        {() => <ProtectedRouteWrapper component={StudentLessons} />}
      </Route>
      <Route path="/students/:id">
        {() => <ProtectedRouteWrapper component={StudentLessons} />}
      </Route>
      <Route path="/admin/students/phone/:phone/lessons">
        {() => <ProtectedRouteWrapper component={StudentLessons} />}
      </Route>
      <Route path="/students/phone/:phone/lessons">
        {() => <ProtectedRouteWrapper component={StudentLessons} />}
      </Route>
      
      <Route path="/admin/instructors">
        {() => <ProtectedRouteWrapper component={Instructors} />}
      </Route>
      <Route path="/instructors">
        {() => <ProtectedRouteWrapper component={Instructors} />}
      </Route>
      
      <Route path="/admin/payments">
        {() => <ProtectedRouteWrapper component={Payments} />}
      </Route>
      <Route path="/payments">
        {() => <ProtectedRouteWrapper component={Payments} />}
      </Route>
      
      <Route path="/admin/courses">
        {() => <ProtectedRouteWrapper component={Courses} />}
      </Route>
      <Route path="/courses">
        {() => <ProtectedRouteWrapper component={Courses} />}
      </Route>
      
      <Route path="/admin/branches">
        {() => <ProtectedRouteWrapper component={Branches} />}
      </Route>
      <Route path="/branches">
        {() => <ProtectedRouteWrapper component={Branches} />}
      </Route>
      
      <Route path="/admin/settings">
        {() => <ProtectedRouteWrapper component={Settings} />}
      </Route>
      <Route path="/settings">
        {() => <ProtectedRouteWrapper component={Settings} />}
      </Route>
      
      <Route path="/admin/reports">
        {() => <ProtectedRouteWrapper component={Reports} />}
      </Route>
      <Route path="/reports">
        {() => <ProtectedRouteWrapper component={Reports} />}
      </Route>
      
      {/* 404 Route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function CookieConsent() {
  const [showConsent, setShowConsent] = useState(true);
  
  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookie-consent') === 'accepted';
    setShowConsent(!hasConsented);
  }, []);
  
  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowConsent(false);
  };
  
  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    // When declined, we still hide the banner but don't use cookies for non-essential features
    setShowConsent(false);
  };
  
  if (!showConsent) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-base font-medium text-gray-900">Cookie Policy</h3>
          <p className="text-sm text-gray-600 mt-1">
            We use cookies to improve your experience and for session management. 
            Your privacy matters to us. You can accept all cookies or decline non-essential cookies.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={declineCookies}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            Accept All
          </button>
        </div>
        <button 
          onClick={declineCookies} 
          className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-gray-500"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <CookieConsent />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
