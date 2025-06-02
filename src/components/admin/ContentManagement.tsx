
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import ContentForm from './ContentForm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash2, FileText, Globe } from 'lucide-react';

const ContentManagement = () => {
  const [editingContent, setEditingContent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [contentType, setContentType] = useState('page'); // 'page' or 'blog'
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: content, isLoading } = useQuery({
    queryKey: ['admin-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (contentId: string) => {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', contentId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-content'] });
      toast({
        title: "Content deleted",
        description: "The content has been successfully deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to delete content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (content: any) => {
    setEditingContent(content);
    setContentType(content.type);
    setShowForm(true);
  };

  const handleAdd = (type: string) => {
    setEditingContent(null);
    setContentType(type);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingContent(null);
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content & Blog Management</h2>
          <p className="text-gray-600">Create and manage website content, pages, and blog posts</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            onClick={() => handleAdd('page')} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2"
            size="lg"
          >
            <Globe className="h-5 w-5" />
            Add Page Content
          </Button>
          <Button 
            onClick={() => handleAdd('blog')} 
            className="bg-green-600 hover:bg-green-700 text-white font-medium flex items-center gap-2"
            size="lg"
          >
            <FileText className="h-5 w-5" />
            Add Blog Post
          </Button>
        </div>
      </div>

      {showForm && (
        <ContentForm
          content={editingContent}
          contentType={contentType}
          onClose={handleFormClose}
          onSuccess={() => {
            handleFormClose();
            queryClient.invalidateQueries({ queryKey: ['admin-content'] });
          }}
        />
      )}

      <Card>
        <div className="p-6">
          {content && content.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {content.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {item.type === 'blog' ? (
                          <FileText className="h-4 w-4 mr-2 text-blue-500" />
                        ) : (
                          <Globe className="h-4 w-4 mr-2 text-green-500" />
                        )}
                        {item.type}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(item.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <div className="mb-6">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No content found</p>
              </div>
              <div className="flex justify-center space-x-3">
                <Button 
                  onClick={() => handleAdd('page')} 
                  className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  Create Page Content
                </Button>
                <Button 
                  onClick={() => handleAdd('blog')} 
                  className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Write Blog Post
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ContentManagement;
