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

const SESSION_TIMEOUT = 30 * 60 * 1000;
const TOKEN_CHECK_INTERVAL = 5 * 60 * 1000;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [_, setLocation] = useLocation();
  const [sessionTimeout, setSessionTimeout] = useState<NodeJS.Timeout | null>(null);

  // Function to reset the session timeout
  const resetSessionTimeout = useCallback(() => {
    setSessionTimeout(prevTimeout => {
      if (prevTimeout) clearTimeout(prevTimeout);
      return setTimeout(() => {
        setUser(null);
        setIsAuthenticated(false);
        setLocation("/auth/login");
      }, SESSION_TIMEOUT);
    });
  }, [setLocation]);

  // Check for authentication on mount
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check-session', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
          const userData: LoginResponse = await response.json();
          if (isMounted) {
            setUser({
              id: userData.id,
              username: userData.username,
              role: userData.role,
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              email: userData.email || '',
            });
            setIsAuthenticated(true);
            resetSessionTimeout();
          }
        } else {
          if (isMounted) {
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch {
        if (isMounted) {
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
      if (sessionTimeout) {
        clearTimeout(sessionTimeout);
      }
    };
  }, []); // <--- Only on mount

  // Set up activity listeners to reset session timeout
  useEffect(() => {
    if (!isAuthenticated) return;

    const activityEvents = [
      'mousedown', 'mousemove', 'keypress',
      'scroll', 'touchstart', 'click'
    ];

    const handleActivity = () => {
      resetSessionTimeout();
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [isAuthenticated, resetSessionTimeout]);

  // Set up periodic token validity check
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkSessionValidity = async () => {
      try {
        const response = await fetch('/api/auth/check-session', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
          if (sessionTimeout) {
            clearTimeout(sessionTimeout);
            setSessionTimeout(null);
          }
          setUser(null);
          setIsAuthenticated(false);
          setLocation("/auth/login?session=expired");
        } else {
          resetSessionTimeout();
        }
      } catch {
        if (sessionTimeout) {
          clearTimeout(sessionTimeout);
          setSessionTimeout(null);
        }
        setUser(null);
        setIsAuthenticated(false);
        setLocation("/auth/login?session=error");
      }
    };

    checkSessionValidity();
    const intervalId = setInterval(checkSessionValidity, TOKEN_CHECK_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, [isAuthenticated, setLocation]);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
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
      resetSessionTimeout();

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
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }

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
    fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
      .catch(err => console.error("Logout API error:", err));

    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
      setSessionTimeout(null);
    }

    setUser(null);
    setIsAuthenticated(false);
    setLocation("/auth/login");
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