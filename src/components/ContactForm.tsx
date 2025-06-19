
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContactForm } from '@/hooks/useContactForm';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const { submitContactForm, loading } = useContactForm();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    
    const result = await submitContactForm(formData);
    
    if (result.success) {
      // Clear form on successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      console.log('Form cleared after successful submission');
    }
  };

  // Check if required fields are filled
  const isFormValid = formData.name.trim() && formData.email.trim() && formData.message.trim();

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Get in Touch</h2>
        <p className="text-gray-600">Send us a message and we'll get back to you soon.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <Input 
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full"
            placeholder="Your full name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <Input 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full"
            placeholder="your.email@example.com"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone (WhatsApp)</label>
          <Input 
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full"
            placeholder="0108029407"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
          <Textarea 
            rows={4}
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full"
            placeholder="Tell us about your plant needs..."
            required
          />
        </div>
        
        <Button 
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          disabled={loading || !isFormValid}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Or reach us directly:</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">Phone/WhatsApp:</span>{' '}
              <a href="tel:0108029407" className="text-green-600 hover:text-green-700">
                0108029407
              </a>
            </p>
            <p className="text-sm">
              <span className="font-medium">WhatsApp:</span>{' '}
              <a 
                href="https://wa.me/254108029407" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700"
              >
                Chat with us
              </a>
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ContactForm;
