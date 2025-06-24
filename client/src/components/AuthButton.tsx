
import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { LogOut, User, Settings } from 'lucide-react';

const AuthButton = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  // For demo, use user role directly
  const profile = user ? { role: user.role } : null;

  if (loading) {
    return null; // Don't show anything while loading
  }

  // Only show auth buttons if user is already logged in
  if (user) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 hidden sm:inline">
          <User className="h-4 w-4 inline mr-1" />
          {user.email}
        </span>
        {profile?.role === 'admin' && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/admin')}
            className="text-gray-700 hover:text-green-600"
          >
            <Settings className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Admin</span>
          </Button>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={signOut}
          className="text-gray-700 hover:text-green-600"
        >
          <LogOut className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    );
  }

  // Don't show sign-in button for visitors - they can only access via direct URL
  return null;
};

export default AuthButton;
