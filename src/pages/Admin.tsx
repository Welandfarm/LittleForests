
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TreePine, Plus, Edit, Users, UserPlus, Settings, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Admin = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // For now, allow access to admin dashboard (you can add authentication later)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <TreePine className="h-8 w-8 text-green-600" />
                <div>
                  <h1 className="text-xl font-bold text-green-800">LittleForest</h1>
                  <p className="text-xs text-gray-600">Admin Dashboard</p>
                </div>
              </Link>
            </div>
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Website
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your LittleForest nursery website</p>
        </div>

        {/* Backend Notice */}
        <div className="mb-8">
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-orange-800">Backend Integration Required</h3>
                  <p className="text-sm text-orange-700 mt-1">
                    The actions below are visual placeholders. These will be connected to a backend system 
                    to enable full functionality for managing products, content, and users.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add New Product */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-green-600" />
                <span>Add New Product</span>
              </CardTitle>
              <CardDescription>
                Add new tree seedlings to your inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white" disabled>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Will open product creation form
              </p>
            </CardContent>
          </Card>

          {/* Edit About Page */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Edit className="h-5 w-5 text-blue-600" />
                <span>Edit About Page</span>
              </CardTitle>
              <CardDescription>
                Update your nursery's story and information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled>
                <Edit className="h-4 w-4 mr-2" />
                Edit Content
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Will open content editor
              </p>
            </CardContent>
          </Card>

          {/* Manage Users */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span>Manage Users</span>
              </CardTitle>
              <CardDescription>
                View and manage user accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled>
                  <Users className="h-4 w-4 mr-2" />
                  View Users
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Promote to Admin
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Will show user management interface
              </p>
            </CardContent>
          </Card>

          {/* Product Management Overview */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TreePine className="h-5 w-5 text-green-600" />
                <span>Product Overview</span>
              </CardTitle>
              <CardDescription>
                Current inventory status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Indigenous Trees:</span>
                  <span className="font-medium">4 varieties</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Fruit Trees:</span>
                  <span className="font-medium">4 varieties</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ornamental Trees:</span>
                  <span className="font-medium">4 varieties</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total Products:</span>
                    <span className="text-green-600">12</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Website Settings */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-gray-600" />
                <span>Website Settings</span>
              </CardTitle>
              <CardDescription>
                Configure site-wide settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                <Settings className="h-4 w-4 mr-2" />
                Site Settings
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Will open settings panel
              </p>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Quick Stats</CardTitle>
              <CardDescription>
                Overview of your nursery's performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">3</div>
                  <div className="text-sm text-gray-600">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">9</div>
                  <div className="text-sm text-gray-600">In Stock</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">3</div>
                  <div className="text-sm text-gray-600">Sold Out</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
