import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  fullName?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token in localStorage
    const token = localStorage.getItem('auth-token');
    const userData = localStorage.getItem('auth-user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('auth-user');
      }
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    // Check if user is authorized admin
    const adminEmails = ['wesleykoech2022@gmail.com', 'chepkoechjoan55@gmail.com'];
    const isAdmin = adminEmails.includes(email.toLowerCase());
    
    const mockUser: User = {
      id: `user-${Date.now()}`,
      email,
      fullName,
      role: isAdmin ? 'admin' : 'user'
    };
    
    setUser(mockUser);
    localStorage.setItem('auth-token', 'demo-token');
    localStorage.setItem('auth-user', JSON.stringify(mockUser));
    
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    // Check if user is authorized admin
    const adminEmails = ['wesleykoech2022@gmail.com', 'chepkoechjoan55@gmail.com'];
    const isAdmin = adminEmails.includes(email.toLowerCase());
    
    const mockUser: User = {
      id: `user-${Date.now()}`,
      email,
      role: isAdmin ? 'admin' : 'user'
    };
    
    setUser(mockUser);
    localStorage.setItem('auth-token', 'demo-token');
    localStorage.setItem('auth-user', JSON.stringify(mockUser));
    
    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-user');
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};