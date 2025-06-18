
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const useContactForm = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submitContactForm = async (data: ContactFormData) => {
    setLoading(true);
    
    try {
      console.log('Submitting contact form data:', data);
      
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: data.name.trim(),
            email: data.email.trim(),
            phone: data.phone?.trim() || null,
            message: data.message.trim(),
            status: 'new'
          }
        ]);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Contact form submitted successfully');

      toast({
        title: "Message sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Contact form submission error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return { submitContactForm, loading };
};
