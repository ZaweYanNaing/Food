import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { toast } from 'react-toastify';
import apiService from '../services/api';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  failedAttempts: number;
  isLocked: boolean;
  lockoutTime: number | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);

  // Check for existing user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Check lockout status
  useEffect(() => {
    const checkLockout = () => {
      const savedLockoutTime = localStorage.getItem('lockoutTime');
      if (savedLockoutTime) {
        const lockoutEnd = parseInt(savedLockoutTime);
        const now = Date.now();
        
        if (now < lockoutEnd) {
          setIsLocked(true);
          setLockoutTime(lockoutEnd);
        } else {
          // Lockout expired
          setIsLocked(false);
          setLockoutTime(null);
          setFailedAttempts(0);
          localStorage.removeItem('lockoutTime');
          localStorage.removeItem('failedAttempts');
        }
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (isLocked) {
      const remainingTime = Math.ceil((lockoutTime! - Date.now()) / 1000 / 60);
      toast.error(`Account is locked. Please try again in ${remainingTime} minutes.`);
      return false;
    }

    try {
      setIsLoading(true);
      
      const response = await apiService.login(email, password);

      if (response.success) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        
        // Reset failed attempts on successful login
        setFailedAttempts(0);
        localStorage.removeItem('failedAttempts');
        
        toast.success('Login successful!');
        return true;
      } else {
        // Handle failed login attempt
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);
        localStorage.setItem('failedAttempts', newFailedAttempts.toString());
        
        if (newFailedAttempts >= 3) {
          // Lock account for 3 minutes
          const lockoutEnd = Date.now() + (3 * 60 * 1000);
          setIsLocked(true);
          setLockoutTime(lockoutEnd);
          localStorage.setItem('lockoutTime', lockoutEnd.toString());
          
          toast.error('Account locked due to multiple failed attempts. Please try again in 3 minutes.');
        } else {
          toast.error((response.message ?? `Login failed. ${3 - newFailedAttempts} attempts remaining.`));
        }
        
        return false;
      }
    } catch (error) {
      // Handle failed login attempt on network error
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
      localStorage.setItem('failedAttempts', newFailedAttempts.toString());
      
      if (newFailedAttempts >= 3) {
        // Lock account for 3 minutes
        const lockoutEnd = Date.now() + (3 * 60 * 1000);
        setIsLocked(true);
        setLockoutTime(lockoutEnd);
        localStorage.setItem('lockoutTime', lockoutEnd.toString());
        
        toast.error('Account locked due to multiple failed attempts. Please try again in 3 minutes.');
      } else {
        toast.error(`Network error. ${3 - newFailedAttempts} attempts remaining.`);
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await apiService.register(firstName, lastName, email, password);

      if (response.success) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        
        toast.success('Registration successful! Welcome to FoodFusion!');
        return true;
      } else {
        toast.error(response.message ?? 'Registration failed. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // Show more specific error messages
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred during registration.');
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.info('Logged out successfully.');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
    failedAttempts,
    isLocked,
    lockoutTime,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
