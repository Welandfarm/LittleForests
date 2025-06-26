import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  fullName?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  adminUser: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  adminSignIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  adminSignOut: () => Promise<void>;
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
  const [adminUser, setAdminUser] = useState<User | null>(null);
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

    // Check for existing admin token
    const adminToken = localStorage.getItem('admin-token');
    const adminUserData = localStorage.getItem('admin-user');
    
    if (adminToken && adminUserData) {
      try {
        const adminData = JSON.parse(adminUserData);
        setAdminUser(adminData);
        // Verify admin token with server
        verifyAdminToken(adminToken);
      } catch (error) {
        localStorage.removeItem('admin-token');
        localStorage.removeItem('admin-user');
      }
    }
    
    setLoading(false);
  }, []);

  const verifyAdminToken = async (token: string) => {
    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      
      if (!response.ok) {
        throw new Error('Invalid token');
      }
      
      const data = await response.json();
      if (data.success) {
        setAdminUser(data.user);
      } else {
        throw new Error('Token verification failed');
      }
    } catch (error) {
      localStorage.removeItem('admin-token');
      localStorage.removeItem('admin-user');
      setAdminUser(null);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    // Only wesleykoech2022@gmail.com is admin
    const isAdmin = email.toLowerCase() === 'wesleykoech2022@gmail.com';
    
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
    // Only wesleykoech2022@gmail.com is admin
    const isAdmin = email.toLowerCase() === 'wesleykoech2022@gmail.com';
    
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

  const adminSignIn = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.success) {
        setAdminUser(data.user);
        localStorage.setItem('admin-token', data.token);
        localStorage.setItem('admin-user', JSON.stringify(data.user));
        return data;
      } else {
        throw new Error('Login failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Network error');
    }
  };

  const adminSignOut = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (error) {
      // Continue with logout even if API call fails
    }
    
    setAdminUser(null);
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-user');
  };

  const value = {
    user,
    adminUser,
    loading,
    signUp,
    signIn,
    adminSignIn,
    signOut,
    adminSignOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};