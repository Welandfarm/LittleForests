import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Settings, Shield } from 'lucide-react';

const AdminAccessButton = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Show admin button if user is logged in and is admin
  if (user && user.role === 'admin') {
    return (
      <Button 
        onClick={() => navigate('/admin')}
        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
      >
        <Settings className="h-4 w-4" />
        Admin Dashboard
      </Button>
    );
  }

  // Show login button for non-logged in users
  if (!user) {
    return (
      <Button 
        onClick={() => navigate('/auth')}
        variant="outline"
        className="border-blue-600 text-blue-600 hover:bg-blue-50 flex items-center gap-2"
      >
        <Shield className="h-4 w-4" />
        Admin Login
      </Button>
    );
  }

  // Don't show anything for regular users
  return null;
};

export default AdminAccessButton;