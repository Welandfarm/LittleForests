import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { X, Upload, Image as ImageIcon, TreePine, Apple, Leaf } from 'lucide-react';
import ImageUpload from '../ImageUpload';

interface ProductFormProps {
  product?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || '',
    price: product?.price || '',
    scientific_name: product?.scientific_name || '',
    status: product?.status || 'Available',
    image_url: product?.image_url || ''
  });
  
  const { toast } = useToast();

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (product) {
        return await apiClient.updateProduct(product.id, data);
      } else {
        return await apiClient.createProduct(data);
      }
    },
    onSuccess: () => {
      toast({
        title: product ? "Product updated" : "Product created",
        description: `The product has been successfully ${product ? 'updated' : 'created'}.`,
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save product.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const categoryOptions = [
    { value: 'Indigenous Trees', label: 'Indigenous Trees', icon: <TreePine className="h-4 w-4" />, description: 'For reforestation and water conservation' },
    { value: 'Fruit Trees', label: 'Fruit Trees', icon: <Apple className="h-4 w-4" />, description: 'For food security and nutrition' },
    { value: 'Ornamental Plants', label: 'Ornamental Plants', icon: <Leaf className="h-4 w-4" />, description: 'For beautification and landscaping' },
    { value: 'Honey', label: 'Organic Honey', icon: <span>🍯</span>, description: 'Pure honey from forest beehives' },
  ];

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">
          {product ? 'Edit Product' : 'Add New Product'}
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Mukau Seedling"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        {option.icon}
                        <div>
                          <div>{option.label}</div>
                          <div className="text-xs text-gray-500">{option.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="e.g., KSh 250 or $5.00"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Include currency symbol (KSh, $, etc.)</p>
            </div>

            <div>
              <Label htmlFor="scientific_name">Scientific Name</Label>
              <Input
                id="scientific_name"
                value={formData.scientific_name}
                onChange={(e) => setFormData(prev => ({ ...prev, scientific_name: e.target.value }))}
                placeholder="e.g., Melia volkensii"
              />
              <p className="text-xs text-gray-500 mt-1">Optional - helps with plant identification</p>
            </div>

            <div>
              <Label htmlFor="status">Availability Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Limited">Limited Stock</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="image_url">Product Image</Label>
              <div className="space-y-4">
                <ImageUpload
                  onImageUploaded={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                  currentImageUrl={formData.image_url}
                  className="w-full"
                />
                <div className="text-sm text-gray-500">
                  Or enter image URL directly:
                </div>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            placeholder="Describe the product, its benefits, growing conditions, etc."
          />
          <p className="text-xs text-gray-500 mt-1">
            Include growing tips, benefits, and any special care instructions
          </p>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={saveMutation.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            {saveMutation.isPending ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProductForm;