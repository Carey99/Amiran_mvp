import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const [location, setLocation] = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    console.log("ProtectedRoute - isAuthenticated:", isAuthenticated); // Debugging log
    console.log("ProtectedRoute - user:", user); // Debugging log
    console.log("ProtectedRoute - current location:", location); // Debugging log

    const timer = setTimeout(() => {
      setIsChecking(false);
      if (!isAuthenticated) {
        console.log("Redirecting to login..."); // Debugging log
        setLocation("/auth/login?redirect=" + encodeURIComponent(location));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, setLocation, location]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.warn("User is not authenticated. Redirecting to login."); // Debugging log
    return null; // Prevent rendering children
  }

  const validNonAdminRoutes = [
    '/dashboard', '/students', '/instructors', '/payments', 
    '/courses', '/branches', '/settings', '/reports'
  ];
  const isValidNonAdminRoute = validNonAdminRoutes.some(route => 
    location === route || location.startsWith(`${route}/`)
  );

  if (user && (user.role === 'admin' || user.role === 'super_admin') && 
      !location.startsWith('/admin') && 
      !isValidNonAdminRoute) {
    console.log("Redirecting admin user to /admin/dashboard"); // Debugging log
    setLocation('/admin/dashboard');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Redirecting to admin dashboard...</span>
      </div>
    );
  }

  return <>{children}</>;
}