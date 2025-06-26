import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import ProductForm from './ProductForm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Plus, Trash2, TreePine, Apple, Leaf, Package } from 'lucide-react';

const ProductManagement = () => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const data = await apiClient.getProducts();
      return data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      return await apiClient.deleteProduct(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const getCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes('indigenous')) return <TreePine className="h-4 w-4 text-green-600" />;
    if (category.toLowerCase().includes('fruit')) return <Apple className="h-4 w-4 text-red-500" />;
    if (category.toLowerCase().includes('ornamental')) return <Leaf className="h-4 w-4 text-purple-500" />;
    if (category.toLowerCase().includes('honey')) return <span className="text-yellow-500">🍯</span>;
    return <Package className="h-4 w-4 text-gray-500" />;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center">Loading products...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-600">Manage your nursery products, prices, and inventory</p>
        </div>
        <Button 
          onClick={handleAdd} 
          className="bg-green-600 hover:bg-green-700 text-white font-medium flex items-center gap-2"
          size="lg"
        >
          <Plus className="h-5 w-5" />
          Add New Product
        </Button>
      </div>

      {/* Category Guide */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">Product Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <TreePine className="h-4 w-4 text-green-600" />
            <span>Indigenous Trees</span>
          </div>
          <div className="flex items-center space-x-2">
            <Apple className="h-4 w-4 text-red-500" />
            <span>Fruit Trees</span>
          </div>
          <div className="flex items-center space-x-2">
            <Leaf className="h-4 w-4 text-purple-500" />
            <span>Ornamental Plants</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-yellow-500">🍯</span>
            <span>Honey</span>
          </div>
        </div>
      </Card>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleFormClose}
          onSuccess={() => {
            handleFormClose();
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
          }}
        />
      )}

      <Card>
        <div className="p-6">
          {products && products.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          {getCategoryIcon(product.category)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>
                        <div>{product.name}</div>
                        {product.scientific_name && (
                          <div className="text-xs text-gray-500 italic">{product.scientific_name}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(product.category)}
                        <span>{product.category}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">{product.price}</TableCell>
                    <TableCell>
                      <Badge variant={product.status === 'Available' ? 'default' : 'secondary'}>
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Product</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{product.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(product.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <TreePine className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-500 mb-6">Get started by adding your first product to the shop</p>
              <Button 
                onClick={handleAdd} 
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Your First Product
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProductManagement;