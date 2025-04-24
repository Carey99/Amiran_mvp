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
    // Small delay to prevent flash of loading state for cached auth
    const timer = setTimeout(() => {
      setIsChecking(false);
      if (!isAuthenticated) {
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
    return null; // Not rendering children if not authenticated
  }

  // Redirect based on user role - except for non-admin routes that have admin equivalents
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
    // Only redirect if not on a valid non-admin route
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