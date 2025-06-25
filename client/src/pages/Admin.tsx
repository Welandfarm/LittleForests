import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductManagement from '@/components/admin/ProductManagement';
import ContentManagement from '@/components/admin/ContentManagement';
import ContactMessages from '@/components/admin/ContactMessages';
import UserManagement from '@/components/admin/UserManagement';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { TreePine, Package, FileText, MessageSquare, Users, Home, Settings } from 'lucide-react';

const Admin = () => {
  const { user, loading } = useAuth();

  // Get stats for dashboard overview
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [products, content, messages] = await Promise.all([
        apiClient.getProducts(),
        apiClient.getContent(),
        apiClient.getContactMessages()
      ]);
      
      return {
        totalProducts: products.length,
        availableProducts: products.filter((p: any) => p.status === 'Available').length,
        totalContent: content.length,
        publishedContent: content.filter((c: any) => c.status === 'published').length,
        totalMessages: messages.length,
        newMessages: messages.filter((m: any) => m.status === 'new').length,
      };
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Allow access to admin dashboard even without authentication for demo purposes
  // In production, you'd want proper authentication
  const isAdmin = !user || user.role === 'admin' || user.email === 'wesleykoech2022@gmail.com';

  if (user && !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <Button onClick={() => window.location.href = '/'}>
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <TreePine className="h-8 w-8 text-green-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    <span className="text-orange-500">Little</span>
                    <span className="text-green-600">Forest</span> Admin
                  </h1>
                  <p className="text-gray-600">Manage your nursery website</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button onClick={() => window.location.href = '/'} variant="outline" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                View Website
              </Button>
              {!user && (
                <Button onClick={() => window.location.href = '/auth'} className="bg-green-600 hover:bg-green-700">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-500 to-orange-500 rounded-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Welcome to Your Admin Dashboard!</h2>
            <p className="text-green-100">
              Manage your LittleForest products, content, and customer messages from here. 
              Start by adding products to your shop in the Products tab.
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.availableProducts}</p>
                  <p className="text-xs text-gray-500">of {stats.totalProducts} total</p>
                </div>
                <Package className="h-8 w-8 text-green-600" />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Content</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.publishedContent}</p>
                  <p className="text-xs text-gray-500">of {stats.totalContent} total</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Messages</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.newMessages}</p>
                  <p className="text-xs text-gray-500">new of {stats.totalMessages} total</p>
                </div>
                <MessageSquare className="h-8 w-8 text-orange-600" />
              </div>
            </Card>
          </div>
        )}

        {/* Quick Start Guide */}
        {(!stats || stats.totalProducts === 0) && (
          <Card className="p-6 mb-8 border-orange-200 bg-orange-50">
            <div className="flex items-start space-x-4">
              <Settings className="h-6 w-6 text-orange-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-orange-800 mb-2">Get Started</h3>
                <p className="text-orange-700 mb-4">
                  Your shop is empty! Add your first products to get started. You can add:
                </p>
                <ul className="text-orange-700 space-y-1 mb-4">
                  <li>• Indigenous Trees (for reforestation)</li>
                  <li>• Fruit Trees (for food security)</li>
                  <li>• Ornamental Plants (for beautification)</li>
                  <li>• Organic Honey (from your forests)</li>
                </ul>
                <p className="text-sm text-orange-600">
                  Click on the "Products" tab below to start adding items to your shop.
                </p>
              </div>
            </div>
          </Card>
        )}

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
              {stats && stats.newMessages > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-1">
                  {stats.newMessages}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <ContentManagement />
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <ContactMessages />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;