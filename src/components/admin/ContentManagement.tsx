
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Edit, Save, X } from 'lucide-react';

const ContentManagement = () => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<{ title: string; content: string }>({ title: '', content: '' });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: content = [], isLoading } = useQuery({
    queryKey: ['admin-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('section_key');
      
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ section_key, title, content }: { section_key: string, title: string, content: string }) => {
      const { error } = await supabase
        .from('content')
        .update({ title, content, updated_at: new Date().toISOString() })
        .eq('section_key', section_key);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-content'] });
      queryClient.invalidateQueries({ queryKey: ['content'] });
      setEditingSection(null);
      toast({
        title: "Content updated",
        description: "The content has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to update content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (section: any) => {
    setEditingSection(section.section_key);
    setEditingData({ title: section.title || '', content: section.content || '' });
  };

  const handleSave = () => {
    if (editingSection) {
      updateMutation.mutate({
        section_key: editingSection,
        title: editingData.title,
        content: editingData.content
      });
    }
  };

  const handleCancel = () => {
    setEditingSection(null);
    setEditingData({ title: '', content: '' });
  };

  const getSectionDisplayName = (sectionKey: string) => {
    const displayNames: { [key: string]: string } = {
      'hero_title': 'Hero Section Title',
      'hero_subtitle': 'Hero Section Badge Text',
      'shop_intro': 'Shop With Us Section',
      'contact_title': 'Get In Touch Section',
      'contact_subtitle': 'Contact Subtitle',
      'about_title': 'About Us Title',
      'about_content': 'About Us Content'
    };
    return displayNames[sectionKey] || sectionKey;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center">Loading content...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Content Management</h2>
        <p className="text-gray-600">Edit website content and text sections</p>
      </div>

      <div className="grid gap-6">
        {content.map((section) => (
          <Card key={section.section_key} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{getSectionDisplayName(section.section_key)}</h3>
              {editingSection === section.section_key ? (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(section)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>

            {editingSection === section.section_key ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor={`title-${section.section_key}`}>Title</Label>
                  <Input
                    id={`title-${section.section_key}`}
                    value={editingData.title}
                    onChange={(e) => setEditingData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter title"
                  />
                </div>
                <div>
                  <Label htmlFor={`content-${section.section_key}`}>Content</Label>
                  <Textarea
                    id={`content-${section.section_key}`}
                    value={editingData.content}
                    onChange={(e) => setEditingData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter content"
                    rows={4}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div>
                  <strong>Title:</strong> {section.title || 'No title'}
                </div>
                <div>
                  <strong>Content:</strong> {section.content || 'No content'}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContentManagement;
