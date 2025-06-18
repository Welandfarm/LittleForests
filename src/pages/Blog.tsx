
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AuthButton from '@/components/AuthButton';

const Blog = () => {
  const navigate = useNavigate();

  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('type', 'blog')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/bd17ddd8-8af4-40c1-8b3b-4234a074ae9b.png" 
                alt="LittleForest Logo" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold">
                  <span className="text-orange-500">Little</span>
                  <span className="text-green-600">Forest</span>
                </h1>
                <p className="text-sm text-gray-600">Nurturing Nature</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button onClick={() => navigate('/')} className="text-gray-700 hover:text-green-600 transition-colors">Home</button>
              <button onClick={() => navigate('/blog')} className="text-green-600 font-medium">Blog</button>
            </nav>
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Blog Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-stone-800 mb-4">LittleForest Blog</h1>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Stay updated with the latest tips, insights, and stories from our nursery experts
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-stone-600">Loading blog posts...</div>
        ) : blogPosts?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-stone-500">No blog posts available yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {blogPosts?.map((post) => (
              <Card key={post.id} className="p-6 hover:shadow-lg transition-shadow bg-white border-stone-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-stone-800 mb-2">{post.title}</h2>
                    <div className="flex items-center space-x-2 text-sm text-stone-500">
                      <Badge variant="outline" className="text-stone-600 border-stone-300">Blog</Badge>
                      <span>•</span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="prose max-w-none">
                  <div className="text-stone-700 whitespace-pre-wrap leading-relaxed">{post.content}</div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="text-stone-600 border-stone-400 hover:bg-stone-100"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
