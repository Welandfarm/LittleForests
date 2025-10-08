import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus, Minus, Info } from "lucide-react";

interface Product {
  id: string;
  name?: string;
  plant_name?: string;
  category: string;
  price: string | number;
  image_url?: string;
  imageUrl?: string;
  description?: string;
  status?: string;
  availability_status?: string;
  quantity?: number;
  stock_quantity?: number;
  [key: string]: any;
}

interface ProductGridProps {
  products: Product[];
  quantities: {[key: string]: number};
  onUpdateQuantity: (productId: string, change: number) => void;
  onSetQuantity: (productId: string, quantity: number) => void;
  onAddToCart: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  quantities, 
  onUpdateQuantity,
  onSetQuantity, 
  onAddToCart 
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (products.length === 0) {
    return (
      <div className="text-center py-12" data-testid="grid-no-products">
        <p className="text-gray-600 text-lg">No products available in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8" data-testid="product-grid">
      {products.map((product) => (
        <Card 
          key={product.id} 
          className="overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out h-full group"
          data-testid={`card-product-${product.id}`}
        >
          <div className="relative bg-white overflow-hidden">
            <div className="aspect-square w-full flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-50 p-2 relative">
              {/* Static Image - Always visible */}
              <img 
                src={product.image_url || product.imageUrl || "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"} 
                alt={product.name || product.plant_name}
                className="w-full h-full object-cover rounded-lg shadow-sm transition-all duration-500 group-hover:scale-125 group-hover:brightness-125"
                data-testid={`img-product-${product.id}`}
              />
              
              {/* Strong dramatic hover effects without green */}
              <div className="absolute inset-2 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-lg">
                {/* Dramatic flickering light overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-yellow/20 to-transparent animate-pulse"></div>
                
                {/* Floating light particles */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-float-1 opacity-80 shadow-lg"></div>
                <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-float-2 opacity-70 shadow-md"></div>
                <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white rounded-full animate-float-3 opacity-60"></div>
                <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-orange-200 rounded-full animate-float-1 opacity-75"></div>
                
                {/* Strong border glow effect */}
                <div className="absolute inset-0 border-2 border-white/60 rounded-lg animate-pulse shadow-xl"></div>
                
                {/* Additional sparkle effects */}
                <div className="absolute top-1/6 left-1/2 w-1 h-1 bg-white rounded-full animate-pulse opacity-80"></div>
                <div className="absolute bottom-1/4 right-1/2 w-1 h-1 bg-yellow-300 rounded-full animate-pulse opacity-70"></div>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex-1 mr-2">
                <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">
                  {product.name || product.plant_name}
                  {(product.jar_volume || product.quantity || product.volume) && (
                    <span className="text-gray-600 font-normal"> ({product.jar_volume || product.quantity || product.volume})</span>
                  )}
                </h3>
              </div>
              <span className="text-lg font-bold text-green-600 whitespace-nowrap" data-testid={`text-price-${product.id}`}>
                {typeof product.price === 'number' ? `KSH ${product.price}` : product.price}
              </span>
            </div>
            
            {/* Quantity Controls */}
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateQuantity(product.id, -1)}
                data-testid={`button-decrease-${product.id}`}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                min="1"
                max="999"
                value={quantities[product.id] || 1}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  onSetQuantity(product.id, Math.max(1, Math.min(999, value)));
                }}
                className="w-16 text-center"
                data-testid={`input-quantity-${product.id}`}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateQuantity(product.id, 1)}
                data-testid={`button-increase-${product.id}`}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-2">
              <Button 
                disabled={product.status === 'Out of Stock' || product.stock_quantity === 0}
                onClick={() => onAddToCart(product)}
                className={product.status === 'Out of Stock' ? 
                  "bg-gray-400 cursor-not-allowed w-full" : 
                  "bg-green-600 hover:bg-green-700 hover:scale-105 transition-all duration-200 active:scale-95 w-full"
                }
                data-testid={`button-add-to-cart-${product.id}`}
              >
                {product.status === 'Out of Stock' ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedProduct(product)}
                className="w-full"
                data-testid={`button-details-${product.id}`}
              >
                <Info className="h-4 w-4 mr-1" />
                See Details
              </Button>
            </div>
          </div>
        </Card>
      ))}

      {/* Product Details Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {selectedProduct.name || selectedProduct.plant_name}
                </DialogTitle>
                <DialogDescription>
                  {selectedProduct.category}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="aspect-square w-full max-w-md mx-auto">
                  <img 
                    src={selectedProduct.image_url || selectedProduct.imageUrl || "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"} 
                    alt={selectedProduct.name || selectedProduct.plant_name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">Price</p>
                  <p className="text-2xl font-bold text-green-600">
                    {typeof selectedProduct.price === 'number' ? `KSH ${selectedProduct.price}` : selectedProduct.price}
                  </p>
                </div>
                {selectedProduct.description && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
                    <p className="text-gray-600">{selectedProduct.description}</p>
                  </div>
                )}
                {selectedProduct.scientific_name && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Scientific Name</p>
                    <p className="text-gray-600 italic">{selectedProduct.scientific_name}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductGrid;
