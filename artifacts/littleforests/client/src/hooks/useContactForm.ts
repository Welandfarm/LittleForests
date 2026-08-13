
import { useState } from 'react';
import { apiClient } from '@/lib/api';
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
      
      // Validate required fields
      if (!data.name?.trim() || !data.email?.trim() || !data.message?.trim()) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields (Name, Email, and Message).",
          variant: "destructive",
        });
        return { success: false, error: 'Validation failed' };
      }

      await apiClient.createContactMessage({
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || null,
        message: data.message.trim(),
        status: 'new'
      });

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
