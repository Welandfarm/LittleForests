
import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import ImageUpload from '../ImageUpload';

interface ContentFormProps {
  content?: any;
  contentType?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ContentForm: React.FC<ContentFormProps> = ({ content, contentType = 'page', onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: contentType,
    status: 'draft',
    image_url: ''
  });

  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title || '',
        content: content.content || '',
        type: content.type || contentType,
        status: content.status || 'draft',
        image_url: content.image_url || ''
      });
    } else {
      setFormData(prev => ({
        ...prev,
        type: contentType
      }));
    }
  }, [content, contentType]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const contentData = {
        ...data,
        created_by: user?.id,
        updated_at: new Date().toISOString()
      };

      if (content) {
        const { error } = await supabase
          .from('content')
          .update(contentData)
          .eq('id', content.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('content')
          .insert([contentData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: content ? "Content updated" : "Content created",
        description: `The content has been successfully ${content ? 'updated' : 'created'}.`,
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to ${content ? 'update' : 'create'} content. Please try again.`,
        variant: "destructive",
      });
      console.error("Content form error:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({
      ...prev,
      image_url: url
    }));
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">
          {content ? 'Edit Content' : formData.type === 'blog' ? 'Add New Blog Post' : 'Add New Page Content'}
        </h3>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="page">Page</option>
                <option value="blog">Blog Post</option>
                <option value="announcement">Announcement</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div>
            <ImageUpload
              onImageUploaded={handleImageUploaded}
              currentImageUrl={formData.image_url}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-green-600 hover:bg-green-700"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Saving...' : (content ? 'Update' : 'Create')}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ContentForm;
