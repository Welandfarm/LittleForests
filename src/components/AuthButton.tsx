
import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

const AuthButton = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Button variant="outline" size="sm" disabled>
        Loading...
      </Button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 hidden sm:inline">
          <User className="h-4 w-4 inline mr-1" />
          {user.email}
        </span>
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

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={() => navigate('/auth')}
      className="text-gray-700 hover:text-green-600"
    >
      <User className="h-4 w-4 sm:mr-1" />
      <span className="hidden sm:inline">Sign In</span>
    </Button>
  );
};

export default AuthButton;
