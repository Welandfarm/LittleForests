
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Plus, Minus } from "lucide-react";
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

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
  [key: string]: any;
}

interface ProductCarouselProps {
  products: Product[];
  categoryName: string;
  quantities: {[key: string]: number};
  onUpdateQuantity: (productId: string, change: number) => void;
  onSetQuantity: (productId: string, quantity: number) => void;
  onAddToCart: (product: Product) => void;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ 
  products, 
  categoryName, 
  quantities, 
  onUpdateQuantity,
  onSetQuantity, 
  onAddToCart 
}) => {
  return (
    <div className="mb-8 scroll-animate-left">
      <h3 className="text-2xl font-bold text-green-800 mb-4">{categoryName}</h3>
      <Carousel 
        className="w-full scroll-animate-right"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
              <Card className="overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out h-full group">
                <div className="relative bg-white">
                  <div className="aspect-square w-full flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-50 p-2">
                    <img 
                      src={product.image_url || product.imageUrl || "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"} 
                      alt={product.name || product.plant_name}
                      className="w-full h-full object-cover rounded-lg shadow-sm transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge 
                      variant={product.status === 'Available' ? "outline" : "secondary"}
                      className={product.status === 'Available' ? 
                        "bg-white text-black border-gray-300" : 
                        "bg-red-100 text-red-800 border-red-300"
                      }
                    >
                      {product.status}
                      {product.stock_quantity !== undefined && (
                        <span className="ml-1 text-xs">({product.stock_quantity})</span>
                      )}
                    </Badge>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge variant="outline" className="bg-white">
                      {product.category}
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-semibold mb-2">{product.name || product.plant_name}</h4>
                  <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-green-600">
                      {typeof product.price === 'number' ? `KSH ${product.price}` : product.price}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(product.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
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
                        className="w-16 text-center text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(product.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button 
                      size="sm" 
                      disabled={product.status === 'Out of Stock' || product.stock_quantity === 0}
                      onClick={() => onAddToCart(product)}
                      className={product.status === 'Out of Stock' ? 
                        "bg-gray-400 cursor-not-allowed" : 
                        "bg-green-600 hover:bg-green-700 hover:scale-105 transition-all duration-200 active:scale-95"
                      }
                    >
                      {product.status === 'Out of Stock' ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
};

export default ProductCarousel;
