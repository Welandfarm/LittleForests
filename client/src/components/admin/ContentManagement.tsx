
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Edit, Save, X } from 'lucide-react';

const ContentManagement = () => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<{ title: string; content: string; type: string }>({ title: '', content: '', type: 'page' });
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: content = [], isLoading } = useQuery({
    queryKey: ['admin-content'],
    queryFn: async () => {
      const data = await apiClient.getContent();
      return data.sort((a: any, b: any) => a.title.localeCompare(b.title));
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, title, content, type }: { id: string, title: string, content: string, type?: string }) => {
      const updateData: any = { title, content };
      if (type) updateData.type = type;
      return await apiClient.updateContent(id, updateData);
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

  const createMutation = useMutation({
    mutationFn: async ({ title, content, type }: { title: string, content: string, type: string }) => {
      return await apiClient.createContent({ title, content, type, status: 'published' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-content'] });
      queryClient.invalidateQueries({ queryKey: ['content'] });
      setShowCreateForm(false);
      setEditingData({ title: '', content: '', type: 'page' });
      toast({
        title: "Content created",
        description: "The content has been successfully created.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to create content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (section: any) => {
    setEditingSection(section.id);
    setEditingData({ title: section.title || '', content: section.content || '', type: section.type || 'page' });
  };

  const handleSave = () => {
    if (editingSection) {
      updateMutation.mutate({
        id: editingSection,
        title: editingData.title,
        content: editingData.content,
        type: editingData.type
      });
    }
  };

  const handleCreate = () => {
    createMutation.mutate({
      title: editingData.title,
      content: editingData.content,
      type: editingData.type
    });
  };

  const handleCancel = () => {
    setEditingSection(null);
    setShowCreateForm(false);
    setEditingData({ title: '', content: '', type: 'page' });
  };

  const getSectionDisplayName = (title: string) => {
    const displayNames: { [key: string]: string } = {
      'Shop With Us': 'Shop With Us Section',
      'Get in Touch': 'Get In Touch Section',
      'About Little Forest': 'About Us Section',
      'About Content': 'About Us Content Section',
      'Mumetet Spring Story': 'Mumetet Spring Story',
      'Masese Spring Story': 'Masese Spring Story',
      'Choronok Spring Story': 'Choronok Spring Story',
      'Chebululu Spring Story': 'Chebululu Spring Story',
      'Korabi Spring Story': 'Korabi Spring Story',
      'Tabet Spring Story': 'Tabet Spring Story',
      'Milimani Spring Story': 'Milimani Spring Story',
      'Bondet Spring Story': 'Bondet Spring Story',
      'Anabomoi Spring Story': 'Anabomoi Spring Story',
      'Chemeres Spring Story': 'Chemeres Spring Story',
      'Kibochi Spring Story': 'Kibochi Spring Story'
    };
    return displayNames[title] || title;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center">Loading content...</div>
      </Card>
    );
  }

  const filteredContent = selectedType === 'all' ? content : content.filter((item: any) => item.type === selectedType);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Content Management</h2>
        <p className="text-gray-600">Edit website content and text sections</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <Label htmlFor="type-filter">Filter by type:</Label>
          <select
            id="type-filter"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md"
          >
            <option value="all">All Types</option>
            <option value="page">Pages</option>
            <option value="story">Stories</option>
            <option value="blog">Blog Posts</option>
          </select>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          Add New Content
        </Button>
      </div>

      {showCreateForm && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Create New Content</h3>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-type">Type</Label>
              <select
                id="new-type"
                value={editingData.type}
                onChange={(e) => setEditingData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="page">Page</option>
                <option value="story">Story</option>
                <option value="blog">Blog Post</option>
              </select>
            </div>
            <div>
              <Label htmlFor="new-title">Title</Label>
              <Input
                id="new-title"
                value={editingData.title}
                onChange={(e) => setEditingData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter title"
              />
            </div>
            <div>
              <Label htmlFor="new-content">Content</Label>
              <Textarea
                id="new-content"
                value={editingData.content}
                onChange={(e) => setEditingData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter content"
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {createMutation.isPending ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-6">
        {filteredContent.map((section) => (
          <Card key={section.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{getSectionDisplayName(section.title)}</h3>
              {editingSection === section.id ? (
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

            {editingSection === section.id ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor={`type-${section.id}`}>Type</Label>
                  <select
                    id={`type-${section.id}`}
                    value={editingData.type}
                    onChange={(e) => setEditingData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="page">Page</option>
                    <option value="story">Story</option>
                    <option value="blog">Blog Post</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor={`title-${section.id}`}>Title</Label>
                  <Input
                    id={`title-${section.id}`}
                    value={editingData.title}
                    onChange={(e) => setEditingData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter title"
                  />
                </div>
                <div>
                  <Label htmlFor={`content-${section.id}`}>Content</Label>
                  <Textarea
                    id={`content-${section.id}`}
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
                  <strong>Type:</strong> {section.type || 'page'}
                </div>
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
