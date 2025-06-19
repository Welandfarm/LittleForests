
import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LogOut, User, Settings, Shield } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const AuthButton = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  // Check if user is admin
  const { data: profile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  if (loading) {
    return null; // Don't show anything while loading
  }

  // Only show auth buttons if user is already logged in
  if (user) {
    return (
      <div className="flex items-center space-x-2">
        <div className="text-sm text-gray-600 hidden sm:block">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>{user.email}</span>
            {profile?.role === 'admin' && (
              <Badge variant="default" className="bg-orange-500 hover:bg-orange-600">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            )}
          </div>
        </div>
        {profile?.role === 'admin' && (
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => navigate('/admin')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium"
          >
            <Settings className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Admin Dashboard</span>
            <span className="sm:hidden">Admin</span>
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
