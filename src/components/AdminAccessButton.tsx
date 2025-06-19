
import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Settings } from 'lucide-react';

const AdminAccessButton = ({ variant = "default" }: { variant?: "default" | "outline" | "link" }) => {
  const { user } = useAuth();
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

  // Only show for admin users
  if (!user || profile?.role !== 'admin') {
    return null;
  }

  return (
    <Button 
      variant={variant}
      size="sm" 
      onClick={() => navigate('/admin')}
      className={variant === "default" ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
    >
      <Shield className="h-4 w-4 mr-2" />
      Admin Panel
    </Button>
  );
};

export default AdminAccessButton;
