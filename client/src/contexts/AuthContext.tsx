import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (userData: Omit<User, "id">) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

interface LoginResponse {
  id: string;
  username: string;
  role: 'super_admin' | 'admin' | 'instructor';
  firstName?: string;
  lastName?: string;
  email?: string;
}

// Define the session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

// Define token validity check interval (every 5 minutes)
const TOKEN_CHECK_INTERVAL = 5 * 60 * 1000;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to set cookies with expiration
function setCookie(name: string, value: string, expirationMs: number) {
  const date = new Date();
  date.setTime(date.getTime() + expirationMs);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

// Helper function to get cookie value
function getCookie(name: string): string | null {
  const cookieName = `${name}=`;
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return null;
}

// Helper function to delete cookie
function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  const [_, setLocation] = useLocation();
  const [sessionTimeout, setSessionTimeout] = useState<NodeJS.Timeout | null>(null);

  // Function to reset the session timeout
  const resetSessionTimeout = useCallback(() => {
    // Clear any existing timeout
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
    }
    
    // Set a new timeout that will log the user out after the session period
    const timeoutId = setTimeout(() => {
      console.log("Session expired due to inactivity");
      // Use a direct function instead of calling logout to avoid the circular dependency
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      deleteCookie("auth_session");
      setLocation("/auth/login");
    }, SESSION_TIMEOUT);
    
    setSessionTimeout(timeoutId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Remove the dependency to prevent infinite loop

  // Check for authentication on mount
  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = () => {
      // First, try to get auth from cookie for faster loading
      const authCookie = getCookie("auth_session");
      
      if (authCookie && isMounted) {
        try {
          const parsedUser = JSON.parse(authCookie);
          setUser(parsedUser);
          setIsAuthenticated(true);
          resetSessionTimeout();
          setIsLoading(false);
          return;
        } catch (error) {
          console.error("Error parsing auth cookie:", error);
          deleteCookie("auth_session");
        }
      }
      
      // Fallback to localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser && isMounted) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          // Also set the cookie for faster future loads
          setCookie("auth_session", storedUser, SESSION_TIMEOUT);
          resetSessionTimeout();
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          localStorage.removeItem("user");
        }
      }
      
      if (isMounted) {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Cleanup function
    return () => {
      isMounted = false;
      if (sessionTimeout) {
        clearTimeout(sessionTimeout);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Set up activity listeners to reset session timeout
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Activity events that should reset the session timeout
    const activityEvents = [
      'mousedown', 'mousemove', 'keypress', 
      'scroll', 'touchstart', 'click'
    ];
    
    const handleActivity = () => {
      resetSessionTimeout();
    };
    
    // Add event listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity);
    });
    
    // Remove event listeners on cleanup
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]); // Only re-run when authentication status changes

  // Set up periodic token validity check
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const checkSessionValidity = async () => {
      try {
        const response = await fetch('/api/auth/check-session', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          // Session is invalid, log out user
          console.log("Session is no longer valid, logging out");
          if (sessionTimeout) {
            clearTimeout(sessionTimeout);
            setSessionTimeout(null);
          }
          
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("user");
          deleteCookie("auth_session");
          setLocation("/auth/login?session=expired");
        } else {
          // Session is valid, reset timeout
          resetSessionTimeout();
        }
      } catch (error) {
        // On error, we'll be conservative and invalidate the session
        console.error("Error checking session validity:", error);
        if (sessionTimeout) {
          clearTimeout(sessionTimeout);
          setSessionTimeout(null);
        }
        
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
        deleteCookie("auth_session");
        setLocation("/auth/login?session=error");
      }
    };
    
    // Run check immediately on mount if authenticated
    checkSessionValidity();
    
    // Set up interval for periodic checks
    const intervalId = setInterval(checkSessionValidity, TOKEN_CHECK_INTERVAL);
    
    // Clean up on unmount
    return () => {
      clearInterval(intervalId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]); // Only re-run when authentication status changes

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const userData: LoginResponse = await response.json();
      
      const user: User = {
        id: userData.id,
        username: userData.username,
        role: userData.role,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
      };
      
      setUser(user);
      setIsAuthenticated(true);
      
      // Store user data in both localStorage and cookies
      const userJSON = JSON.stringify(user);
      localStorage.setItem("user", userJSON);
      setCookie("auth_session", userJSON, SESSION_TIMEOUT);
      
      // Reset the session timeout
      resetSessionTimeout();
      
      // Show a success message
      console.log(`Login successful for ${user.firstName || user.username}`);
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred during login';
      setError(errorMessage);
      console.error("Login failed:", errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const signup = async (userData: Omit<User, "id">): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }
      
      // Show success message
      console.log("Registration successful");
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred during signup';
      setError(errorMessage);
      console.error("Registration failed:", errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Optional: Call logout API
    fetch('/api/auth/logout', { method: 'POST' })
      .catch(err => console.error("Logout API error:", err));
    
    // Clear the session timeout
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
      setSessionTimeout(null);
    }
    
    // Clear all authentication data
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    deleteCookie("auth_session");
    
    // Redirect to login page
    setLocation("/auth/login");
    
    // Show logout message
    console.log("User logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading,
      login, 
      signup,
      logout,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}